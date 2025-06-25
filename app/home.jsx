import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  ToastAndroid,
  Platform,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import api from '../services/api';
import { LayoutContext } from '../context/LayoutContext';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';

const FILTERS = ['All', 'Favorites', 'Recent', 'Oldest'];

export default function HomeScreen() {
  const router = useRouter();
  const { setAuthKey } = useContext(LayoutContext);

  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [modalAuth, setModalAuth] = useState({ visible: false, action: null, passId: null });
  const [pwdInput, setPwdInput] = useState('');
  const [showPwdInput, setShowPwdInput] = useState(false);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    fetchPasswords(activeFilter);
    fetchHealthScore();
  }, [activeFilter]);

  const fetchPasswords = async (filter) => {
  setLoading(true);
  setError(null);
  try {
    let res;
    const config = { show_plaintext: true };
    if (filter === 'All') {
      res = await api.post('/my-passwords', config);
    } else if (filter === 'Favorites') {
      res = await api.post('/favorites', config);
    } else {
      const order = filter === 'Recent' ? 'recent' : 'oldest';
      res = await api.get(`/passwords-sorted?order=${order}&show_plaintext=true`);
    }
    setPasswords(Array.isArray(res.data) ? res.data : []);
    setVisiblePasswords({});
  } catch {
    setError('Error al cargar contraseñas');
  } finally {
    setLoading(false);
  }
};

  const fetchHealthScore = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/health-score', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const score = Math.max(0, res.data.health_score); // Nunca negativo
      setHealthScore(score);
    } catch {
      setHealthScore(0); // En error, asumimos 0%
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const res = await api.patch(`/toggle-favorite/${id}`);
      if (res.data.is_favorite !== undefined) {
        setPasswords((prev) =>
          prev.map((p) =>
            p.pass_id === id ? { ...p, is_favorite: res.data.is_favorite } : p
          )
        );
      }
    } catch {
      Alert.alert('Error', 'No se pudo cambiar favorito');
    }
  };

  const toggleVisibility = (id) =>
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  const copyToClipboard = async (password) => {
    if (!password || password === '********') {
      Alert.alert('Error', 'No hay contraseña para copiar');
      return;
    }
    await Clipboard.setStringAsync(password);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Contraseña copiada', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copiado', 'Contraseña copiada');
    }
  };

  const handleLogOut = () => {
    Alert.alert('Cerrar Sesión', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          setAuthKey((prev) => prev + 1);
          Alert.alert('Sesión cerrada');
        },
      },
    ]);
  };

  const openAuthModal = (action, passId) => {
    setModalAuth({ visible: true, action, passId });
    setPwdInput('');
    setShowPwdInput(false);
  };

  const confirmAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.post(
        '/verify-passwords-access',
        { user_password: pwdInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalAuth({ visible: false, action: null, passId: null });
      setPwdInput('');
      setShowPwdInput(false);

      if (modalAuth.action === 'edit') {
        router.push({
          pathname: '/edit-password',
          params: { pass_id: modalAuth.passId }
        });
      } else if (modalAuth.action === 'delete') {
        await api.delete(`/delete-password/${modalAuth.passId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPasswords((prev) => prev.filter((p) => p.pass_id !== modalAuth.passId));
        Alert.alert('Eliminado', 'Registro eliminado correctamente');
      }
    } catch {
      Alert.alert('Error', 'Contraseña inválida');
    }
  };

  const renderFilterButtons = () => (
    <View className="flex-row justify-between mb-4">
      {FILTERS.map((filter) => (
        <Pressable
          key={filter}
          onPress={() => setActiveFilter(filter)}
          className={`px-4 py-2 rounded-full mx-1 ${
            activeFilter === filter ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <Text className={activeFilter === filter ? 'text-white' : 'text-gray-800'}>
            {filter}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  const renderRightActions = (item) => (
    <View className="flex-row h-full items-center">
      <Pressable
        onPress={() => openAuthModal('edit', item.pass_id)}
        className="bg-yellow-500 justify-center items-center px-4"
      >
        <Text>Editar</Text>
      </Pressable>
      <Pressable
        onPress={() => openAuthModal('delete', item.pass_id)}
        className="bg-red-600 justify-center items-center px-4"
      >
        <Text className="text-white">Eliminar</Text>
      </Pressable>
    </View>
  );

  const renderItem = ({ item }) => {
    const show = visiblePasswords[item.pass_id];
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View className="mb-4 p-4 border border-gray-300 rounded bg-white">
          <Text className="text-xl font-semibold">{item.service}</Text>
          <Text className="text-gray-700">Usuario: {item.username}</Text>
          <Text className="text-gray-700">
            Contraseña: {show ? item.password : '********'}
          </Text>
          <View className="flex-row mt-3 space-x-3 flex-wrap">
            <Pressable
              onPress={() => toggleVisibility(item.pass_id)}
              className="bg-yellow-500 py-2 px-4 rounded"
            >
              <Text className="text-white font-semibold">{show ? 'Ocultar' : 'Ver'}</Text>
            </Pressable>
            <Pressable
              onPress={() => toggleFavorite(item.pass_id)}
              className={`py-2 px-4 rounded ${
                item.is_favorite ? 'bg-red-600' : 'bg-gray-400'
              }`}
            >
              <Text className="text-white">{item.is_favorite ? '❤️' : '♡'} Favorito</Text>
            </Pressable>
            <Pressable
              onPress={() => copyToClipboard(item.password)}
              className="bg-blue-600 py-2 px-4 rounded"
            >
              <Text className="text-white font-semibold">Copiar</Text>
            </Pressable>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View className="flex-1 px-6 pt-4 bg-white">
      <View className="flex-row justify-between mb-6">
        <Pressable
          onPress={() => router.push('/generate-password')}
          className="bg-green-600 py-3 px-4 rounded w-1/2 mr-2"
        >
          <Text className="text-white text-center">Generar</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/add-password')}
          className="bg-blue-600 py-3 px-4 rounded w-1/2 ml-2"
        >
          <Text className="text-white text-center">Añadir</Text>
        </Pressable>
      </View>

      <FlatList
        data={passwords}
        keyExtractor={(item) => item.pass_id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View className="mb-4">
            <View className="mb-4 p-4 bg-green-100 rounded">
              <Text className="text-xl font-bold text-center text-green-700">
                Seguridad General: {healthScore}%
              </Text>
            </View>
            <Text className="text-3xl font-bold mb-2">Tus Contraseñas</Text>
            {renderFilterButtons()}
          </View>
        }
        ListFooterComponent={<View style={{ height: 20 }} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : error ? (
            <Text className="text-red-600 text-center mt-4">{error}</Text>
          ) : (
            <Text className="text-center mt-4 text-gray-500">No hay contraseñas guardadas</Text>
          )
        }
      />

      <Pressable className="bg-blue-600 py-3 rounded mt-4" onPress={handleLogOut}>
        <Text className="text-white text-lg text-center">Cerrar Sesión</Text>
      </Pressable>

      <Modal visible={modalAuth.visible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
          <View className="bg-white w-full p-4 rounded">
            <Text className="text-lg mb-2 font-semibold">Introduce tu contraseña</Text>
            <View className="relative mb-4">
              <TextInput
                value={pwdInput}
                onChangeText={setPwdInput}
                secureTextEntry={!showPwdInput}
                placeholder="••••••••"
                className="border p-3 pr-16 rounded"
              />
              <TouchableOpacity
                onPress={() => setShowPwdInput(!showPwdInput)}
                className="absolute right-3 top-3"
              >
                <Text className="text-blue-600 font-semibold">
                  {showPwdInput ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-end">
              <Pressable
                onPress={() => {
                  setModalAuth({ visible: false });
                  setPwdInput('');
                  setShowPwdInput(false);
                }}
              >
                <Text className="text-gray-600 px-4">Cancelar</Text>
              </Pressable>
              <Pressable onPress={confirmAuth}>
                <Text className="text-blue-600 px-4 font-semibold">Aceptar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
