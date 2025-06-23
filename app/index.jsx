import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <Text className="text-3xl font-bold text-blue-600 mb-8">Bienvenido a Nuvault</Text>
      <Pressable
        className="bg-blue-600 px-6 py-3 rounded mb-4"
        onPress={() => router.push('/register')}
      >
        <Text className="text-white text-center text-lg">Get Started</Text>
      </Pressable>
      <Pressable
        className="bg-gray-600 px-6 py-3 rounded"
        onPress={() => router.push('/login')}
      >
        <Text className="text-white text-center text-lg">Login</Text>
      </Pressable>
    </View>
  );
}
