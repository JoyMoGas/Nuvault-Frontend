import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, ActivityIndicator
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// 🔐 Componente optimizado fuera del render principal
function PasswordInput({ placeholder, value, onChangeText, isVisible, toggleVisibility }) {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl p-4 w-full mb-4">
      <MaterialIcons name="lock-outline" size={24} color="#6B7280" />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-3 text-base text-gray-800"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!isVisible}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable onPress={toggleVisibility}>
        <MaterialIcons
          name={isVisible ? 'visibility' : 'visibility-off'}
          size={24}
          color="#6B7280"
        />
      </Pressable>
    </View>
  );
}

export default function ChangePassword() {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [visible, setVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (field) => {
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async () => {
    setErrorMsg('');

    const { current_password, new_password, confirm_password } = passwords;

    if (!current_password || !new_password || !confirm_password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (new_password !== confirm_password) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');

      const res = await api.put('/profile/password', {
        current_password,
        new_password,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.message === 'Password changed successfully') {
        router.replace({ pathname: '/home', params: { status: 'PasswordChanged' } });
      }
    } catch (error) {
      const err = error?.response?.data;
      if (err?.error === 'password') {
        setErrorMsg(err.message);  // ejemplo: 'Invalid current password'
      } else {
        setErrorMsg(err?.message || 'Unexpected error occurred.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-4" keyboardShouldPersistTaps="handled">
      <StatusBar style="dark" />
      <Pressable onPress={() => router.back()} className="absolute left-4 top-14 z-10 bg-yellow-400 rounded-full p-2 shadow">
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>
      <Text className="text-3xl font-bold text-center mt-14 mb-8 text-gray-900">Change{'\n'}Password</Text>

      <View className="items-center">
        <PasswordInput
          placeholder="Current Password"
          value={passwords.current_password}
          onChangeText={(text) => handleInputChange('current_password', text)}
          isVisible={visible.current}
          toggleVisibility={() => toggleVisibility('current')}
        />
        <PasswordInput
          placeholder="New Password"
          value={passwords.new_password}
          onChangeText={(text) => handleInputChange('new_password', text)}
          isVisible={visible.new}
          toggleVisibility={() => toggleVisibility('new')}
        />
        <PasswordInput
          placeholder="Confirm New Password"
          value={passwords.confirm_password}
          onChangeText={(text) => handleInputChange('confirm_password', text)}
          isVisible={visible.confirm}
          toggleVisibility={() => toggleVisibility('confirm')}
        />

        {errorMsg !== '' && (
          <Text className="text-red-600 mb-4 text-center">{errorMsg}</Text>
        )}

        <Pressable
          onPress={handleChangePassword}
          disabled={saving}
          className="bg-yellow-400 rounded-xl p-4 w-full mt-2 flex-row justify-center items-center shadow-md"
        >
          {saving ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="text-black text-lg font-bold">Update Password</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
