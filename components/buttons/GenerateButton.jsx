import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function GenerateButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/generate-password')}
      className= "py-3 px-4 rounded-xl w-40 mr-2"
      style={{
        backgroundColor: '#FFD400'
      }}
    >
      <Text className="text-black text-center">Generate</Text>
    </Pressable>
  );
}
