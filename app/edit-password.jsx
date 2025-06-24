import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import api from '../services/api';
import { useRouter } from 'expo-router';

export default function GeneratePassword() {
  const router = useRouter();

  

  return (
    <View className="flex-1 px-6 pt-4">
      <Text className="text-2xl font-bold mb-4">Editar Contraseña</Text>
      <Pressable
        onPress={() => router.back()}
        className="bg-gray-600 py-3 rounded mt-6"
      >
        <Text className="text-white text-center">Regresar</Text>
      </Pressable>
    </View>
  );
}
