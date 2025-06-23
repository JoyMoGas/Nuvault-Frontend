import { useState, useContext } from 'react';
import { View, Text, TextInput, Pressable, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { LayoutContext } from '../context/LayoutContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthKey } = useContext(LayoutContext);

  const handleLogin = async () => {
    try {
      const res = await api.post('/login', { user_email: email, user_password: password });
      const token = res.data.token;
      await AsyncStorage.setItem('token', token);
      setAuthKey((prev) => prev + 1);
      Alert.alert('Login exitoso');
    } catch (error) {
      Alert.alert('Error', 'Credenciales inválidas');
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl font-bold mb-6">Login</Text>
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <View className="relative mb-6">
        <TextInput
          className="border border-gray-300 rounded p-3 pr-16"
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3"
        >
          <Text className="text-blue-600 font-semibold">
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      </View>
      <Pressable
        className="bg-blue-600 py-3 rounded"
        onPress={handleLogin}
      >
        <Text className="text-white text-center text-lg">Ingresar</Text>
      </Pressable>
    </View>
  );
}
