import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { GenerateIcon, KeyIcon } from '../Icons';


export default function GenerateButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/generate-password')}
      className="py-2 px-4 rounded-xl w-30 mr-2 items-center"
      style={{
        backgroundColor: '#FFD400'
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-black font-bold text-center mr-2">Generate</Text>
        <GenerateIcon />
      </View>
    </Pressable>
  );
}
