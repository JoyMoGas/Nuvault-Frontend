import { Animated, Dimensions, View, Text, Pressable, ScrollView } from 'react-native';
import { useEffect, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AuthTabs({ activeTab, onTabChange }) {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(activeTab === 'register' ? SCREEN_WIDTH / 2 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeTab === 'register' ? SCREEN_WIDTH / 2 : 0,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const isLogin = activeTab === 'login';

  return (
    <View className="flex-1 bg-[#2E2E2E]">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <Pressable
          onPress={() => router.back()}
          className="absolute left-6 top-10 z-10 bg-yellow-400 rounded-full p-2"
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>

        <View className="px-6 pt-24 pb-4">
          <Text className="text-white text-3xl font-bold mb-1">
            {isLogin ? 'Welcome Back!' : 'Create Your Vault'}
          </Text>
          <Text className="text-gray-300 text-base">
            {isLogin
              ? 'Access your secure vault and manage your saved passwords easily.'
              : 'Sign up to protect, store and organize your passwords in one secure place.'}
          </Text>
        </View>

        {/* Card */}
        <View className="bg-white mx-6 mt-2 rounded-3xl p-6 shadow-md">
          {/* Tabs */}
          <View className="relative flex-row w-full h-12 mb-6">
            <Animated.View
              style={{
                position: 'absolute',
                width: '50%',
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
              <Text className={`font-semibold ${isLogin ? 'text-black' : 'text-gray-500'}`}>Login</Text>
            </Pressable>
            <Pressable
              className="flex-1 justify-center items-center z-10"
              onPress={() => onTabChange('register')}
            >
              <Text className={`font-semibold ${!isLogin ? 'text-black' : 'text-gray-500'}`}>Register</Text>
            </Pressable>
          </View>

          {/* Formulario */}
          {isLogin ? <LoginForm onTabChange={onTabChange} /> : <RegisterForm onTabChange={onTabChange} />}
        </View>
      </ScrollView>
    </View>
  );
}
