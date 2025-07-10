import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AddIcon } from '../Icons';

export default function AddButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/add-password')}
      style={{
        backgroundColor: '#FFD400',
        width: 60,
        height: 60,
        borderRadius: 34, // círculo perfecto
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,

        // Sombra omnidireccional para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 }, // sombra centrada alrededor
        shadowOpacity: 0.3,
        shadowRadius: 8,

        // Sombra omnidireccional para Android (elevation solo da sombra abajo, así que usamos también border)
        elevation: 3,
      }}
    >
      <AddIcon />
    </Pressable>
  );
}
