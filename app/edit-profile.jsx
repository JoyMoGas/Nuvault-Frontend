import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhoneIcon } from '../components/Icons';

// Sacamos el componente afuera para que no se redefina en cada render
function ProfileInput({ icon, placeholder, value, onChangeText, keyboardType = 'default' }) {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl p-4 w-full mb-4">
      {icon}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-3 text-base text-gray-800"
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        autoCorrect={false}          // opcional
        autoCapitalize="none"        // opcional, ajusta según lo que necesites
      />
    </View>
  );
}

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    username: '',
    first_name: '',
    last_name: '',
    user_phone: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/login');
          return;
        }

        const response = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setFormState({
            username: response.data.username || '',
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            user_phone: response.data.user_phone || '',
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        Alert.alert('Error', 'Could not load your profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');
      await api.put('/profile', formState, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      Alert.alert('Update Failed', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className="mt-4 text-lg text-gray-600">Loading Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-6 pt-4 bg-white" keyboardShouldPersistTaps="handled">
      <StatusBar style="dark" />
      <Pressable onPress={() => router.back()} className="absolute left-4 top-10 z-10 bg-yellow-400 rounded-full p-2">
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>

      <Text className="text-3xl font-bold text-center mt-14 mb-8">Edit Profile</Text>

      <Text className='text-gray-500 mb-1'>Username</Text>
      <ProfileInput
        icon={<MaterialIcons name="person-outline" size={24} color="#6B7280" />}
        placeholder="Username"
        value={formState.username}
        onChangeText={(text) => handleInputChange('username', text)}
      />

      <Text className='text-gray-500 mb-1'>First Name</Text>
      <ProfileInput
        icon={<MaterialIcons name="badge" size={24} color="#6B7280" />}
        placeholder="First Name"
        value={formState.first_name}
        onChangeText={(text) => handleInputChange('first_name', text)}
      />

      <Text className='text-gray-500 mb-1'>Last Name</Text>
      <ProfileInput
        icon={<MaterialIcons name="badge" size={24} color="#6B7280" />}
        placeholder="Last Name"
        value={formState.last_name}
        onChangeText={(text) => handleInputChange('last_name', text)}
      />

      <Text className='text-gray-500 mb-1'>Phone Number</Text>
      <ProfileInput
        icon={<PhoneIcon />}
        placeholder="Phone Number"
        value={formState.user_phone}
        onChangeText={(text) => handleInputChange('user_phone', text)}
        keyboardType="phone-pad"
      />

      <Pressable
        onPress={handleSaveChanges}
        disabled={saving}
        className="bg-yellow-400 rounded-xl p-4 w-full mt-6 flex-row justify-center items-center shadow-md"
      >
        {saving ? <ActivityIndicator color="black" /> : <Text className="text-black text-lg font-bold">Save Changes</Text>}
      </Pressable>
    </ScrollView>
  );
}
