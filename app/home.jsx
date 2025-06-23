import { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { LayoutContext } from '../context/LayoutContext';

export default function HomeScreen() {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setAuthKey } = useContext(LayoutContext);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const res = await api.post('/my-passwords', { show_plaintext: false });
        if (Array.isArray(res.data)) {
          setPasswords(res.data);
        } else if (res.data.message) {
          setPasswords([]);
        }
      } catch (e) {
        setError('Error al cargar contraseñas');
      } finally {
        setLoading(false);
      }
    };

    fetchPasswords();
  }, []);

  const handleLogOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            // No hacer nada, solo cerrar el alert
          }
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              setAuthKey((prev) => prev + 1);
              Alert.alert('Sesión cerrada');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-red-600">{error}</Text>
      </View>
    );
  }

  if (passwords.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-lg text-gray-600 mb-6">No hay registros guardados</Text>
        <Pressable
          className="bg-blue-600 py-3 rounded w-full"
          onPress={handleLogOut}
        >
          <Text className="text-white text-center text-lg">Cerrar Sesión</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 px-6 pt-4">
      <Text className="text-3xl font-bold mb-4">Tus Contraseñas Guardadas</Text>
      <FlatList
        data={passwords}
        keyExtractor={(item) => item.pass_id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 p-4 border border-gray-300 rounded">
            <Text className="text-xl font-semibold">{item.service}</Text>
            <Text className="text-gray-700">Usuario: {item.username}</Text>
            <Text className="text-gray-700">Contraseña: {item.password}</Text>
          </View>
        )}
      />
      <Pressable
        className="bg-blue-600 py-3 rounded w-full"
        onPress={handleLogOut}
      >
        <Text className="text-white text-center text-lg">Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}
