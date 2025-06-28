import { Pressable, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { LayoutContext } from '../../context/LayoutContext';

export default function LogoutButton() {
  const { setAuthKey } = useContext(LayoutContext);

  const handleLogOut = () => {
    Alert.alert('Cerrar Sesión', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          setAuthKey((prev) => prev + 1);
          Alert.alert('Sesión cerrada');
        },
      },
    ]);
  };

  return (
    <Pressable onPress={handleLogOut}>
      <Text className="text-black font-bold text-base text-center">Log Out</Text>
    </Pressable>
  );
}
