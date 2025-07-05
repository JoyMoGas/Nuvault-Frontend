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
import * as Google from 'expo-auth-session/providers/google';
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

  // Client IDs from app.json
  const webClientId = Constants.expoConfig.extra.GOOGLE_CLIENT_ID_WEB;
  const androidClientId = Constants.expoConfig.extra.GOOGLE_CLIENT_ID_ANDROID;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    webClientId,
    scopes: ['profile', 'email'],
    redirectUri: `https://auth.expo.io/@mogasjose/nuvualt-frontend`,
  });

  // Email/password login
  const handleLogin = async () => {
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
    } catch {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Google login response
  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken ?? response.params?.id_token;
      if (idToken) {
        loginWithGoogle(idToken);
      } else {
        alert('No id_token received from Google');
      }
    }
  }, [response]);

  const loginWithGoogle = async (idToken) => {
    setLoading(true);
    try {
      const res = await api.post('/google-login', { id_token: idToken });
      const token = res.data.token;
      await AsyncStorage.setItem('token', token);
      setAuthKey((prev) => prev + 1);
    } catch (err) {
      console.error('Google login failed', err);
      alert('Google login failed');
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
          borderColor: focusedField === 'email' ? '#facc15' : '#d1d5db',
        }}
      />

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
