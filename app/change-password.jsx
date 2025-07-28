import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import api from '../services/api';

export default function ChangePassword() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [saving, setSaving] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);

  // Obtener el ID del usuario al cargar el componente
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user-info');
        if (response.data?.user_id) {
          setUserId(response.data.user_id);
        } else {
          throw new Error("User ID not found in response");
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        Alert.alert('Error', 'No se pudo verificar la identidad del usuario.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  const handleInputChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el ID de usuario. Intenta de nuevo.');
      return;
    }
    if (!passwords.current_password || !passwords.new_password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/user/${userId}/password`, {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      
      Alert.alert('Éxito', '¡Contraseña cambiada correctamente!');
      router.back();
    } catch (error) {
      console.error('Change password error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado.';
      Alert.alert('Fallo el cambio', errorMessage);
    } finally {
      setSaving(false);
    }
  };
  
  const PasswordInput = ({ placeholder, value, onChangeText, isVisible, toggleVisibility }) => (
    <View className="flex-row items-center bg-gray-100 rounded-xl p-4 w-full mb-4">
      <MaterialIcons name="lock-outline" size={24} color="#6B7280" />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-3 text-base text-gray-800"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!isVisible}
      />
      <Pressable onPress={toggleVisibility}>
        <MaterialIcons name={isVisible ? 'visibility' : 'visibility-off'} size={24} color="#6B7280" />
      </Pressable>
    </View>
  );
  
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FACC15" />
      </View>
    );
  }

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
          isVisible={isCurrentPasswordVisible}
          toggleVisibility={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
        />
        <PasswordInput
          placeholder="New Password"
          value={passwords.new_password}
          onChangeText={(text) => handleInputChange('new_password', text)}
          isVisible={isNewPasswordVisible}
          toggleVisibility={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
        />
        <PasswordInput
          placeholder="Confirm New Password"
          value={passwords.confirm_password}
          onChangeText={(text) => handleInputChange('confirm_password', text)}
          isVisible={isNewPasswordVisible}
          toggleVisibility={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
        />
        <Pressable onPress={handleChangePassword} disabled={saving} className="bg-yellow-400 rounded-xl p-4 w-full mt-6 flex-row justify-center items-center shadow-md">
          {saving ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-bold">Change Password</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
}