import { Animated, View, Text, Pressable } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Logo from '../assets/logo.svg';

export default function AuthTabs({ activeTab, onTabChange }) {
  const router = useRouter();
  const [tabWidth, setTabWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const isLogin = activeTab === 'login';

  // Inicializar translateX con el valor correcto al montar o cambiar activeTab
  useEffect(() => {
    if (tabWidth === 0) return; // Esperar a que tabWidth esté definido

    // Ajustamos el valor inicial sin animar (para evitar salto)
    translateX.setValue(isLogin ? 0 : tabWidth / 2);

    // Ahora animamos suavemente al destino para ambas direcciones
    Animated.spring(translateX, {
      toValue: isLogin ? 0 : tabWidth / 2,
      friction: 14,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [activeTab, tabWidth]);

  return (
    <View className="flex-1 bg-[#2E2E2E]">
      {/* Botón de regreso */}
      <Pressable
        onPress={() => router.back()}
        className="absolute left-6 top-20 z-10 bg-yellow-400 rounded-full p-2"
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>

      {/* Logo */}
      <View style={{ alignItems: 'center', marginTop: 65, zIndex: 2 }}>
        <Logo width={200} height={75} />
      </View>

      {/* Títulos */}
      <View className="px-6 pt-5 pb-4">
        <Text className="text-white font-bold mb-1" style={{ fontSize: 36 }}>
          {isLogin ? 'Welcome Back!' : 'Create Your Vault'}
        </Text>
        <Text className="text-gray-300" style={{ fontSize: 18 }}>
          {isLogin
            ? 'Access your secure vault and manage your saved passwords easily.'
            : 'Sign up to protect, store and organize your passwords in one secure place.'}
        </Text>
      </View>

      {/* Card con tabs */}
      <View
        className="h-full w-full"
        style={{
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 48,
          borderTopRightRadius: 48,
          paddingHorizontal: 16,
          paddingTop: 24,
          marginTop: 10,
          marginBottom: 20,
          zIndex: 50,
        }}
      >
        {/* Tabs */}
        <View
          className="relative flex-row items-center h-12 mb-6 bg-gray-100 rounded-full overflow-hidden"
          style={{ alignSelf: 'center', width: 260 }}
          onLayout={(e) => setTabWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={{
              position: 'absolute',
              width: tabWidth / 2,
              height: '100%',
              backgroundColor: '#facc15',
              borderRadius: 999,
              transform: [{ translateX }],
              zIndex: 0,
            }}
          />
          <Pressable
            className="flex-1 justify-center items-center z-10"
            onPress={() => onTabChange('login')}
          >
            <Text className={`font-semibold ${isLogin ? 'text-black' : 'text-gray-500'}`}>
              Login
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 justify-center items-center z-10"
            onPress={() => onTabChange('register')}
          >
            <Text className={`font-semibold ${!isLogin ? 'text-black' : 'text-gray-500'}`}>
              Register
            </Text>
          </Pressable>
        </View>

        {/* Formulario */}
        {isLogin ? (
          <LoginForm onTabChange={onTabChange} />
        ) : (
          <RegisterForm onTabChange={onTabChange} />
        )}
      </View>
    </View>
  );
}
