  import { Slot, useRouter, useSegments } from 'expo-router';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useEffect, useState, createContext } from 'react';
  import { View, ActivityIndicator, Text } from 'react-native';
  import { LayoutContext as OriginalLayoutContext } from '../context/LayoutContext';
  import { StatusOverlayProvider, useStatusOverlay } from '../context/StatusOverlayContext';
  import StatusOverlay from '../components/StatusOverlay';
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import { StatusBar } from 'expo-status-bar';
  import api from '../services/api';
  import Logo from '../assets/logo-text.svg';
  import React from 'react'; // Ensure React is imported
  import { LayoutContext } from '../context/LayoutContext';

  import { LogBox } from 'react-native';

  LogBox.ignoreLogs([
    'Warning: useInsertionEffect must not schedule updates'
  ]);

  function OverlayGlobal() {
    const { visible, text, hideStatus } = useStatusOverlay();
    return <StatusOverlay visible={visible} text={text} onHide={hideStatus} />;
  }

  export default function Layout() {
    const router = useRouter();
    const segments = useSegments();

    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authKey, setAuthKey] = useState(0);
    const [cachedPasswords, setCachedPasswords] = useState({});
    const [cachedHealthScore, setCachedHealtScore] = useState(null)

    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('🔍 Token desde checkAuth:', token);
        const res = await api.get('/validate-token');
        console.log('✅ Token válido:', res.data);
        setIsLoggedIn(true);
      } catch (err) {
        console.warn('❌ Token inválido o error en validación:', err.response?.data || err.message);
        await AsyncStorage.removeItem('token');
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      checkAuth();
    }, [authKey]);

    useEffect(() => {
      if (loading) return; // Espera la validación

      const path = '/' + segments.join('/');
      
      // Redirige a /home solo si está en ruta pública y está logueado
      if (isLoggedIn && (path === '/' || path === '/login' || path === '/register')) {
        console.log('User logged in, redirecting to /home');
        if (path !== '/home') router.replace('/home');
      }

      // Redirige a / solo si está en ruta privada y no está logueado
      if (!isLoggedIn && path !== '/' && path !== '/login' && path !== '/register') {
        console.log('User NOT logged in, redirecting to /');
        if (path !== '/') router.replace('/');
      }
      console.log('No redirection necessary');
    }, [loading, isLoggedIn, segments, router]);



    return (
        <StatusOverlayProvider>
          <LayoutContext.Provider value={{ setAuthKey, cachedPasswords, setCachedPasswords, cachedHealthScore, setCachedHealtScore }}>
              <StatusBar style="light" />
              {loading ? (
                <View className="flex-1 justify-center items-center bg-[#2E2E2E]">

                    <Logo width={200} height={60} />
                    <ActivityIndicator size="large" color="white" />
                </View>
              ) : (
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Slot />
                    <OverlayGlobal />
                </GestureHandlerRootView>
              )}
          </LayoutContext.Provider>
        </StatusOverlayProvider>
    );
  }