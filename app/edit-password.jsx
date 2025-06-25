// app/modificar-password.jsx
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Switch, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ModificarPassword() {
  const router = useRouter();
  const { pass_id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. Obtener datos al cargar el componente
  useEffect(() => {
  if (!pass_id) {
    Alert.alert('Error', 'ID de contraseña no proporcionado');
    router.back();
    return;
  }

  const fetchPassword = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const res = await api.get(`/get-password/${pass_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    setService(data.service || '');
    setUsername(data.username || '');
    setPassword(data.password || '');
    setIsFavorite(data.is_favorite || false);
  } catch (error) {
    console.log('Error al cargar la contraseña:', error.response?.data || error.message || error);
    Alert.alert('Error', 'No se pudo cargar la contraseña');
    router.back();
  } finally {
    setLoading(false);
  }
};

  fetchPassword();
}, [pass_id]);


  // 2. Función para actualizar la contraseña
  const updatePassword = async () => {
    if (!service || !username || !password) {
      Alert.alert('Error', 'Llena todos los campos');
      return;
    }

    try {
      const res = await api.put(`/update-password/${pass_id}`, {
        service,
        username,
        password,
        is_favorite: isFavorite,
      });
      Alert.alert('Éxito', res.data.message);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 px-6 pt-4">
      <Text className="text-2xl font-bold mb-4">Modificar Contraseña</Text>

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
        secureTextEntry
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
        onPress={updatePassword}
        className="bg-blue-600 py-3 rounded mb-4"
      >
        <Text className="text-white text-center">Actualizar</Text>
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
