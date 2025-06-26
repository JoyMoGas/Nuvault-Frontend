// app/_layout.js
import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LayoutContext } from '../context/LayoutContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authKey, setAuthKey] = useState(0);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLoggedIn(!!token);
    setLoading(false);
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
    <LayoutContext.Provider value={{ setAuthKey }}>
      <StatusBar style="light" />
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Slot />
        </GestureHandlerRootView>
      )}
    </LayoutContext.Provider>
  );
}
