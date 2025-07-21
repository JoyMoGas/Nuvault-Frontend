import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { LayoutContext } from '../context/LayoutContext';
import { StatusOverlayProvider, useStatusOverlay } from '../context/StatusOverlayContext';
import StatusOverlay from '../components/StatusOverlay';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import api from '../services/api';
import Logo from '../assets/logo-text.svg';

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

  const checkAuth = async () => {
      try {
        await api.get('/validate-token');
        setIsLoggedIn(true);
      } catch (err) {
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
      if (loading) return;

      const path = '/' + segments.join('/');

      if (isLoggedIn && (path === '/' || path === '/login' || path === '/register')) {
        router.replace('/home');
      }

      if (!isLoggedIn && path === '/home') {
        router.replace('/');
      }
  }, [loading, isLoggedIn, segments]);

  return (
      <StatusOverlayProvider>
        <LayoutContext.Provider value={{ setAuthKey }}>
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