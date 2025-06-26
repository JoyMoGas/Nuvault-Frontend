import { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  Alert, ToastAndroid, Platform, Modal, TextInput, TouchableOpacity, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import api from '../services/api';
import { LayoutContext } from '../context/LayoutContext';

import PasswordCard from '../components/PasswordCard';
import FilterButtons from '../components/FilterButtons';
import GenerateButton from '../components/buttons/GenerateButton';
import AddButton from '../components/buttons/AddButton';
import LogoutButton from '../components/buttons/LogoutButton';
import HealthScore from '../components/health_score/HealthScore';
import ScoreBar from '../components/health_score/ScoreBar';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [modalAuth, setModalAuth] = useState({ visible: false, action: null, passId: null });
  const [pwdInput, setPwdInput] = useState('');
  const [showPwdInput, setShowPwdInput] = useState(false);
  const [healthScore, setHealthScore] = useState(0);

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
      setHealthScore(Math.max(0, res.data.health_score));
    } catch {
      setHealthScore(0);
    }
  };

  useEffect(() => {
    fetchPasswords(activeFilter);
    fetchHealthScore();
  }, [activeFilter]);

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
    Platform.OS === 'android'
      ? ToastAndroid.show('Contraseña copiada', ToastAndroid.SHORT)
      : Alert.alert('Copiado', 'Contraseña copiada');
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

      if (modalAuth.action === 'edit') {
        router.push({ pathname: '/edit-password', params: { pass_id: modalAuth.passId } });
      } else if (modalAuth.action === 'delete') {
        await api.delete(`/delete-password/${modalAuth.passId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPasswords((prev) => prev.filter((p) => p.pass_id !== modalAuth.passId));
        Alert.alert('Eliminado', 'Registro eliminado correctamente');
      }

      setModalAuth({ visible: false, action: null, passId: null });
      setPwdInput('');
      setShowPwdInput(false);
    } catch {
      Alert.alert('Error', 'Contraseña inválida');
    }
  };

  return (
  <View className="flex-1 bg-white relative">
    <FlatList
      data={passwords}
      keyExtractor={(item) => item.pass_id}
      ListHeaderComponent={
        <>
          {/* Fondo con imagen + Score + botón */}
          <View style={{ zIndex: 5 }}>
            <ImageBackground
              source={require('../assets/fondo.png')}
              resizeMode="cover"
              style={{
                paddingTop: 80,
                paddingBottom: 60,
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              {/* ScoreBar con HealthScore centrado */}
              <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 40, marginBottom: 30 }}>
                <View style={{ zIndex: 10 }}>
                  <ScoreBar score={healthScore} />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 999, // Muy por encima del difuminado y de ScoreBar
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HealthScore score={healthScore} />
                </View>
              </View>


              {/* Difuminado gris encima de HealthBar pero debajo de HealthScore */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: 0,
                  right: 0,
                  height: 200,
                  zIndex: 15,
                }}
                pointerEvents="none"
              >
                <LinearGradient
                  colors={[
                    'rgba(46,46,46,0.95)',
                    'rgba(46,46,46,0.8)',
                    'rgba(46,46,46,0.6)',
                    'transparent',
                  ]}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                  style={{ flex: 1 }}
                />
              </View>

              {/* Botón Generar dentro de la imagen, más arriba */}
              <View style={{ position: 'absolute', bottom: 60, right: 20, zIndex: 30 }}>
                <GenerateButton />
              </View>
            </ImageBackground>
          </View>

          {/* Card blanca con border radius */}
          <View
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 16,
              paddingTop: 24,
              marginTop: -40,
              marginBottom: 20,
              zIndex: 50,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            <FilterButtons activeFilter={activeFilter} onChange={setActiveFilter} />
            <Text className="text-3xl font-bold mb-8">Your Vaults</Text>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <PasswordCard
          item={item}
          visible={visiblePasswords[item.pass_id]}
          onToggleVisibility={toggleVisibility}
          onToggleFavorite={toggleFavorite}
          onCopy={copyToClipboard}
          onEdit={(id) => openAuthModal('edit', id)}
          onDelete={(id) => openAuthModal('delete', id)}
        />
      )}
      ListFooterComponent={<View style={{ height: 100 }} />}
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

    {/* Botón flotante redondo para Añadir */}
    <View
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 50,
      }}
    >
      <AddButton round />
    </View>

    <LogoutButton />

    {/* Modal para autenticación */}
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
            <Text
              className="text-gray-600 px-4"
              onPress={() => setModalAuth({ visible: false })}
            >
              Cancelar
            </Text>
            <Text className="text-blue-600 px-4 font-semibold" onPress={confirmAuth}>
              Aceptar
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);



}
