import { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LayoutContext } from '../context/LayoutContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import NotAvailableButton from './buttons/NotAvailable';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

export default function LoginForm({ onTabChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuthKey } = useContext(LayoutContext);
  const [errors, setErrors] = useState({});

  // Email/password login
  const handleLogin = async () => {
    setErrors({})
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/login', {
        user_email: email,
        user_password: password,
      });
      const token = res.data.token;
      await AsyncStorage.setItem('token', token);
      setAuthKey((prev) => prev + 1);
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.error === 'user_email') {
        setErrors((prev) => ({ ...prev, user_email: err.response.data.message }));
      } else if (err.response?.status === 401 && err.response.data.error === 'user_password') {
        setErrors((prev) => ({ ...prev, user_password: err.response.data.message }));
      } else {
        setErrors({ user_email: 'Invalid credentials' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Email */}
      <Text className="text-gray-500 mb-1">Email Address</Text>
      <TextInput
        className="bg-white rounded-xl px-4 py-3 mb-4 shadow-md"
        placeholder="e.g. john@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField('')}
        style={{
          borderWidth: 1.5,
          borderColor: errors.user_email ? '#dc2626' : focusedField === 'email' ? '#facc15' : '#d1d5db'
        }}
      />
      {errors.user_email && (
        <Text style={{ color: '#dc2626', marginBottom: 2 }}>{errors.user_email}</Text>
      )}

      {/* Password */}
      <Text className="text-gray-500 mb-1">Password</Text>
      <View
        className="flex-row items-center justify-between bg-white rounded-xl px-4 py-1 mb-2 shadow-md"
        style={{
          borderWidth: 1.5,
          borderColor: focusedField === 'password' ? '#facc15' : '#d1d5db',
        }}
      >
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          className="flex-1"
          placeholder="Enter your password"
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text className="text-yellow-500 font-bold">
            {showPassword ? 'Hide' : 'View'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <NotAvailableButton>
        <Text className="text-right text-sm text-yellow-400">
          Forgot Password?
        </Text>
      </NotAvailableButton>

      {/* Login Button */}
      <Pressable
        className="bg-yellow-400 py-3 rounded-xl mt-8 mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-center font-bold text-black text-lg">Login</Text>
        )}
      </Pressable>

      {/* Switch to Register */}
      <Text className="text-center text-sm text-gray-500 mt-2">
        Don’t have an account?{' '}
        <Text className="text-yellow-500 font-semibold" onPress={() => onTabChange('register')}>
          Register
        </Text>
      </Text>
    </>
  );
}
