import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import api from '../services/api';
import { useRouter } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useStatusOverlay } from '../context/StatusOverlayContext';
import { usePasswords } from '../context/PasswordsContext';

export default function AddPassword() {
  const router = useRouter();

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

  const { addPassword: addPasswordFromContext } = usePasswords();

  const { showStatus } = useStatusOverlay();

  // Fetch categories and types (tags)
  useEffect(() => {
  const fetchData = async () => {
    try {
      const catRes = await api.get('/tags/categories');
      setCategoriesList(catRes.data);

      const tagsRes = await api.get('/tags/types');
      setTagsList(tagsRes.data);
    } catch (error) {
    }
  };
  fetchData();
}, []);


  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const addPassword = async () => {
    if (!service || !username || !password || !categoryId) {
      Alert.alert('Error', 'Fill in all required fields');
      return;
    }

    try {
      const res = await api.post('/add-password', {
        service,
        username,
        password,
        category_id: categoryId,
        type_id: selectedTags,
        is_favorite: isFavorite
      });
      router.replace({ 'pathname': '/home', params: { status: 'Added' } });
    } catch (e) {
      if (e.response?.status === 409) {
        setErrorMsg(e.response.data.message);
      } else {
        Alert.alert('Error', 'Could not add password');
      }
    }
  };

  const handleAddPassword = async () => {
    if (!service || !username || !password || !categoryId) {
      Alert.alert('Error', 'Fill in all required fields');
      return;
    }

    try {
      // CAMBIO: En lugar de llamar a la API directamente, llamamos a la función del contexto.
      await addPasswordFromContext({
        service,
        username,
        password,
        category_id: categoryId,
        type_id: selectedTags,
        is_favorite: isFavorite
      });
      // Si la función del contexto se ejecuta sin errores, navegamos de vuelta.
      router.replace({ 'pathname': '/home', params: { status: 'Added' } });

    } catch (e) {
      // Si la función del contexto lanzó un error, lo atrapamos aquí.
      if (e.response?.status === 409) {
        setErrorMsg(e.response.data.message);
      } else {
        Alert.alert('Error', 'Could not add password');
      }
    }
  };

  return (
    <ScrollView className="flex-1 px-6 pt-4 bg-white">
      <StatusBar style="dark" />
      {/* Botón de regreso */}
      <Pressable
        onPress={() => router.back()}
        className="absolute left-4 top-10 z-10 bg-yellow-400 rounded-full p-2"
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>

      <Text className="text-3xl font-bold text-center mt-14 mb-6">Create New</Text>

      {/* Sección: Credentials */}
      <Text className="text-xl font-bold mb-2">Credentials</Text>

      {/* Select Category */}
      <Text className="text-gray-500 mb-1">Select Categories</Text>
      <Pressable
        onPress={() => setModalVisible('category')}
        className="bg-white border rounded-xl px-4 py-3 mb-4 shadow-md"
        style={{
          borderColor: focusedField === 'category' ? '#facc15' : '#d1d5db',
          borderWidth: 1.5
        }}
      >
        <Text>
          {categoryId
            ? categoriesList.find((c) => c.category_id === categoryId)?.category_name
            : 'Select'}
        </Text>
      </Pressable>

      {/* Modal Categorías */}
      <Modal visible={modalVisible === 'category'} animationType="slide">
        <View className="flex-1 px-6 pt-10 bg-white">
          <Text className="text-lg font-bold mb-4">Select Category</Text>

          <FlatList
            data={categoriesList}
            keyExtractor={(item) => item.category_id?.toString()}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-10">No categories found</Text>
            }
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

          {/* Botón Done */}
          <Pressable
            onPress={() => setModalVisible(false)}
            className="mt-6 mb-20 bg-yellow-400 py-3 rounded-xl"
          >
            <Text className="text-center font-bold text-black">Done</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Service Name */}
      <Text className="text-gray-500 mb-1">Service Name</Text>
      <TextInput
        value={service}
        onChangeText={(text) => {
          setService(text);
          setErrorMsg('');
        }}
        onFocus={() => setFocusedField('service')}
        onBlur={() => setFocusedField('')}
        className="bg-white rounded-xl px-4 py-3 mb-1 shadow-md"
        placeholder="e.g. Gmail..."
        placeholderTextColor="#6b7280"
        style={{
          borderWidth: 1.5,
          borderColor: focusedField === 'service' ? '#facc15' : '#d1d5db'
        }}
      />
      {errorMsg ? <Text className="text-red-500 mb-2">{errorMsg}</Text> : <View className="mb-4" />}

      {/* Email Address */}
      <Text className="text-gray-500 mb-1">Email Address</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField('')}
        className="bg-white rounded-xl px-4 py-3 mb-4 shadow-md"
        placeholder="user@gmail.com"
        placeholderTextColor="#6b7280"
        style={{
          borderWidth: 1.5,
          borderColor: focusedField === 'email' ? '#facc15' : '#d1d5db'
        }}
      />

      {/* Password */}
      <Text className="text-gray-500 mb-1">Password</Text>
      <View
        className="flex-row items-center justify-between bg-white rounded-xl px-4 py-1 mb-6 shadow-md"
        style={{
          borderWidth: 1.5,
          borderColor: focusedField === 'password' ? '#facc15' : '#d1d5db'
        }}
      >
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
          className="flex-1 text-black"
          placeholder="***********"
          placeholderTextColor="#6b7280"
        />
        <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Text className="text-yellow-500 font-bold">
            {isPasswordVisible ? 'Hide' : 'View'}
          </Text>
        </Pressable>
      </View>

      {/* Favorite toggle */}
      <Pressable
        onPress={() => setIsFavorite(!isFavorite)}
        className="flex-row items-center mb-6"
      >
        <View
          className={`w-6 h-6 border rounded-md items-center justify-center mr-3 ${
            isFavorite ? 'border-yellow-400' : 'border-gray-400'
          }`}
        >
          {isFavorite ? (
            <AntDesign name="star" size={18} color="#facc15" />
          ) : null}
        </View>
        <Text className="text-base text-gray-700">Add to favorites</Text>
      </Pressable>

      {/* Tags */}
      <Text className="text-xl font-bold mb-2">Tags</Text>
      <View className="bg-white border border-gray-200 rounded-xl p-3 mb-6 shadow-md">
        <View className="flex-row flex-wrap gap-2">
          {selectedTags.map((id) => {
            const tag = tagsList.find((t) => t.type_id === id);
            return (
              <View
                key={id}
                className="bg-yellow-400 px-3 py-1 rounded-full"
              >
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

      {/* Modal Tags */}
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

      {/* Guardar */}
      <Pressable
        onPress={handleAddPassword}
        className="bg-yellow-400 py-3 rounded-xl mb-10"
      >
        <Text className="text-center font-bold text-black">Add New Password</Text>
      </Pressable>
    </ScrollView>
  );
}
