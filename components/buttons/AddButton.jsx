import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/add-password')}
      style={{
        backgroundColor: '#FFD400',
        width: 60,       // igual ancho y alto para círculo
        height: 60,
        borderRadius: 40, // mitad del tamaño para redondo perfecto
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: 'black', textAlign: 'center', fontWeight: '600' }}>
        Add
      </Text>
    </Pressable>
  );
}
