import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await api.post('/register', {
        username,
        first_name: firstName,
        last_name: lastName,
        user_email: email,
        user_password: password,
        user_phone: phone,
      });
      Alert.alert('Registro exitoso');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar');
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl font-bold mb-6">Registro</Text>
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="border border-gray-300 rounded p-3 mb-6"
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Pressable
        className="bg-green-600 py-3 rounded"
        onPress={handleRegister}
      >
        <Text className="text-white text-center text-lg">Registrar</Text>
      </Pressable>
    </View>
  );
}
