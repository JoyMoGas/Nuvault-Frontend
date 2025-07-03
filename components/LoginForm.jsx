import { useState, useContext } from 'react';
import { View, Text, TextInput, Pressable, TouchableOpacity } from 'react-native';
import { LayoutContext } from '../context/LayoutContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function LoginForm({ onTabChange }) {
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
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <>
      <Text className="text-gray-500 mb-1">Email Address</Text>
      <TextInput
        className="bg-white rounded-xl px-4 py-3 mb-4 shadow-md"
        style={{ borderWidth: 1.5, borderColor: '#facc15' }}
        placeholder="example@company.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="text-gray-500 mb-1">Password</Text>
      <View
        className="flex-row items-center justify-between bg-white rounded-xl px-4 py-3 mb-2 shadow-md"
        style={{ borderWidth: 1.5, borderColor: '#facc15' }}
      >
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          className="flex-1"
          placeholder="Enter your password"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text className="text-yellow-500 font-bold">{showPassword ? 'Hide' : 'View'}</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-right text-sm text-yellow-600 mb-4">Forgot Password?</Text>

      <Pressable className="bg-yellow-400 py-3 rounded-xl mb-4" onPress={handleLogin}>
        <Text className="text-center font-bold text-black text-lg">Login</Text>
      </Pressable>

      <Text className="text-center text-sm text-gray-500 mt-2">
        Don’t have an account?{' '}
        <Text className="text-yellow-500 font-semibold" onPress={() => onTabChange('register')}>
          Register
        </Text>
      </Text>
    </>
  );
}
