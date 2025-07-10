// app/modificar-password.jsx
import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert, Modal,
  FlatList, TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function EditPassword() {
  const router = useRouter();
  const { pass_id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const [catRes, tagsRes, passRes] = await Promise.all([
          api.get('/tags/categories'),
          api.get('/tags/types'),
          api.get(`/get-password/${pass_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setCategoriesList(catRes.data);
        setTagsList(tagsRes.data);

        const data = passRes.data;
        setService(data.service || '');
        setUsername(data.username || '');
        setPassword(data.password || '');
        setIsFavorite(data.is_favorite || false);
        setCategoryId(data.category_id || null);
        setSelectedTags(data.types?.map(t => t.type_id) || []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pass_id]);

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const updatePassword = async () => {
    if (!service || !username || !password || !categoryId) {
      Alert.alert('Error', 'Llena todos los campos requeridos');
      return;
    }

    try {
      const res = await api.put(`/update-password/${pass_id}`, {
        service,
        username,
        password,
        is_favorite: isFavorite,
        category_id: categoryId,     // ← IMPORTANTE
        type_id: selectedTags 
      });
      Alert.alert('Actualizado', res.data.message);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    
    <ScrollView className="flex-1 px-6 pt-4 bg-white">
      <StatusBar style="dark" />
      <Pressable
        onPress={() => router.back()}
        className="absolute left-4 top-10 z-10 bg-yellow-400 rounded-full p-2"
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>

      <Text className="text-3xl font-bold text-center mt-14 mb-6">Edit Password</Text>

      <Text className="text-xl font-bold mb-2">Credentials</Text>

      <Text className="text-gray-500 mb-1">Select Categories</Text>
      <Pressable
        onPress={() => setModalVisible('category')}
        className="bg-white border rounded-xl px-4 py-3 mb-4 shadow-md"
        style={{ borderColor: focusedField === 'category' ? '#facc15' : '#d1d5db', borderWidth: 1.5 }}
      >
        <Text>
          {categoryId
            ? categoriesList.find((c) => c.category_id === categoryId)?.category_name
            : 'Select'}
        </Text>
      </Pressable>

      <Modal visible={modalVisible === 'category'} animationType="slide">
        <View className="flex-1 px-6 pt-10 bg-white">
          <Text className="text-lg font-bold mb-4">Select Category</Text>

          <FlatList
            data={categoriesList}
            keyExtractor={(item) => item.category_id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setCategoryId(item.category_id)}
                className="py-3 border-b flex-row justify-between"
              >
                <Text>{item.category_name}</Text>
                {categoryId === item.category_id && (
                  <AntDesign name="checkcircle" size={20} color="green" />
                )}
              </TouchableOpacity>
            )}
          />

          <Pressable
            onPress={() => setModalVisible(false)}
            className="mt-6 mb-20 bg-yellow-400 py-3 rounded-xl"
          >
            <Text className="text-center font-bold text-black">Done</Text>
          </Pressable>
        </View>
      </Modal>

      <Text className="text-gray-500 mb-1">Service Name</Text>
      <TextInput
        value={service}
        onChangeText={setService}
        onFocus={() => setFocusedField('service')}
        onBlur={() => setFocusedField('')}
        className="bg-white rounded-xl px-4 py-3 mb-4 shadow-md"
        style={{ borderWidth: 1.5, borderColor: focusedField === 'service' ? '#facc15' : '#d1d5db' }}
      />

      <Text className="text-gray-500 mb-1">Email Address</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField('')}
        className="bg-white rounded-xl px-4 py-3 mb-4 shadow-md"
        style={{ borderWidth: 1.5, borderColor: focusedField === 'email' ? '#facc15' : '#d1d5db' }}
      />

      <Text className="text-gray-500 mb-1">Password</Text>
      <View
        className="flex-row items-center justify-between bg-white rounded-xl px-4 py-1 mb-6 shadow-md"
        style={{ borderWidth: 1.5, borderColor: focusedField === 'password' ? '#facc15' : '#d1d5db' }}
      >
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
          className="flex-1"
        />
        <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Text className="text-yellow-500 font-bold">
            {isPasswordVisible ? 'Hide' : 'View'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => setIsFavorite(!isFavorite)}
        className="flex-row items-center mb-6"
      >
        <View className={`w-6 h-6 border rounded-md items-center justify-center mr-3 ${
          isFavorite ? 'border-yellow-400' : 'border-gray-400'
        }`}>
          {isFavorite && <AntDesign name="star" size={18} color="#facc15" />}
        </View>
        <Text className="text-base text-gray-700">Add to favorites</Text>
      </Pressable>

      <Text className="text-xl font-bold mb-2">Tags</Text>
      <View className="bg-white border border-gray-200 rounded-xl p-3 mb-6 shadow-md">
        <View className="flex-row flex-wrap gap-2">
          {selectedTags.map((id) => {
            const tag = tagsList.find((t) => t.type_id === id);
            return (
              <View key={id} className="bg-yellow-400 px-3 py-1 rounded-full">
                <Text className="text-sm">{tag?.type_name}</Text>
              </View>
            );
          })}
          <Pressable
            onPress={() => setModalVisible('tags')}
            className="bg-gray-400 px-3 py-1 rounded-full"
          >
            <Text className="text-sm text-white">Add +</Text>
          </Pressable>
        </View>
      </View>

      <Modal visible={modalVisible === 'tags'} animationType="slide">
        <View className="flex-1 px-6 pt-10 bg-white">
          <Text className="text-lg font-bold mb-4">Select Tags</Text>
          <FlatList
            data={tagsList}
            keyExtractor={(item) => item.type_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleTag(item.type_id)}
                className="py-3 border-b flex-row justify-between"
              >
                <Text>{item.type_name}</Text>
                {selectedTags.includes(item.type_id) && (
                  <AntDesign name="checkcircle" size={20} color="green" />
                )}
              </TouchableOpacity>
            )}
          />
          <Pressable
            onPress={() => setModalVisible(false)}
            className="mt-6 mb-20 bg-yellow-400 py-3 rounded-xl"
          >
            <Text className="text-center font-bold text-black">Done</Text>
          </Pressable>
        </View>
      </Modal>

      <Pressable
        onPress={updatePassword}
        className="bg-yellow-400 py-3 rounded-xl mb-10"
      >
        <Text className="text-center font-bold text-black">Update Password</Text>
      </Pressable>
    </ScrollView>
  );
}
