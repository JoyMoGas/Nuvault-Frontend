import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Switch } from 'react-native';
import api from '../services/api';
import { useRouter } from 'expo-router';

export default function AddPassword() {
  const router = useRouter();

  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const addPassword = async () => {
  if (!service || !username || !password) {
    Alert.alert('Error', 'Llena todos los campos');
    return;
  }
  try {
    const res = await api.post('/add-password', {
      service,
      username,
      password,
      is_favorite: isFavorite,
    });
    Alert.alert('Éxito', res.data.message);
    router.back();
  } catch (e) {
    // Aquí capturamos el error específico de conflicto
    if (e.response && e.response.status === 409) {
      Alert.alert('Error', e.response.data.message || 'Ya existe una contraseña para este servicio');
    } else if (e.response && e.response.data && e.response.data.message) {
      Alert.alert('Error', e.response.data.message);
    } else {
      Alert.alert('Error', 'No se pudo agregar la contraseña');
    }
  }
};


  return (
    <View className="flex-1 px-6 pt-4">
      <Text className="text-2xl font-bold mb-4">Añadir Contraseña</Text>

      <Text>Servicio:</Text>
      <TextInput
        value={service}
        onChangeText={setService}
        className="border p-2 mb-4 rounded"
      />

      <Text>Usuario:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        className="border p-2 mb-4 rounded"
      />

      <Text>Contraseña:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        className="border p-2 mb-4 rounded"
      />

      <View className="flex-row items-center mb-4">
        <Text className="mr-2">Favorito:</Text>
        <Switch
          value={isFavorite}
          onValueChange={setIsFavorite}
        />
      </View>

      <Pressable
        onPress={addPassword}
        className="bg-blue-600 py-3 rounded mb-4"
      >
        <Text className="text-white text-center">Guardar</Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        className="bg-gray-600 py-3 rounded"
      >
        <Text className="text-white text-center">Regresar</Text>
      </Pressable>
    </View>
  );
}
