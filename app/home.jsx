import { useEffect, useState, useContext, useRef } from 'react';
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
import SearchBar from '../components/SearchBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Animated } from 'react-native';
import { CheckIcon, CopyIcon } from '../components/Icons';
import { StyleSheet } from 'react-native';
import SettingsButton from '../components/buttons/SettingsButton';
import {
  BrowserIcon,
  MobileIcon,
  SocialMediaIcon,
  EmailIcon,
  BankIcon,
  WorkIcon,
  ShoppingIcon,
  GamingIcon,
  MediaIcon,
  BillIcon,
  EducationIcon,
  OtherIcon,
} from '../components/Icons';
import AuthModal from '../components/AuthModal';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const copiedAnim = useRef(new Animated.Value(0)).current;
  const [username, setUsername] = useState('');

  const getCategoryIcon = (categoryName) => {
  switch (categoryName?.toUpperCase()) {
    case 'BROWSER':
      return BrowserIcon;
    case 'MOBILE APP':
      return MobileIcon;
    case 'SOCIAL MEDIA':
      return SocialMediaIcon;
    case 'EMAIL':
      return EmailIcon;
    case 'BANKING & FINANCE':
      return BankIcon;
    case 'WORK / BUSINESS':
      return WorkIcon;
    case 'SHOPPING':
      return ShoppingIcon;
    case 'GAMING':
      return GamingIcon;
    case 'ENTERTAINMENT / MEDIA':
      return MediaIcon;
    case 'UTILITIES / BILLS':
      return BillIcon;
    case 'EDUCATION':
      return EducationIcon;
    case 'OTHER':
      return OtherIcon;
    default:
      return OtherIcon;
  }
};

  const triggerCopiedOverlay = () => {
    setShowCopied(true);
    copiedAnim.setValue(0);

    Animated.timing(copiedAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(copiedAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowCopied(false);
        });
      }, 1000);
    });
  };

  const router = useRouter();    


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
      Alert.alert('Error', 'There is no password to copy');
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
        { user_password: pwdInput.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      if (modalAuth.action === 'edit') {
        router.push(`/edit-password?pass_id=${modalAuth.passId}`);
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
  const query = searchQuery.trim().toLowerCase();
    const filteredPasswords = passwords.filter(p =>
    p.service?.toLowerCase().includes(query) ||
    p.username?.toLowerCase().includes(query)
  );

  const FILTER_TITLES = {
  All: 'All Vaults',
  Favorites: 'Favorite Vaults',
  Recent: 'Recently Accessed',
  Oldest: 'Oldest Records',
};

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await api.get('/user-info', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.username) {
          setUsername(res.data.username);
        }
      } catch (err) {
        console.log('Error al obtener usuario:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAuthConfirm = async (inputPassword, action, passId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    await api.post(
      '/verify-passwords-access',
      { user_password: inputPassword.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (action === 'edit') {
      router.push(`/edit-password?pass_id=${passId}`);
    } else if (action === 'delete') {
      await api.delete(`/delete-password/${passId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswords((prev) => prev.filter((p) => p.pass_id !== passId));
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
        data={filteredPasswords}
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
                      zIndex: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HealthScore score={healthScore} />
                  </View>
                </View>

                {/* Difuminado gris */}
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

                <View style={{ position: 'absolute', bottom: 60, right: 20, zIndex: 30 }}>
                  <GenerateButton />
                </View>

                <View style={{ position: 'absolute', top: 60, right: 20, zIndex: 30 }}>
                  <SettingsButton />
                </View>

                <View style={{ position: 'absolute', top: 60, left: 20, zIndex: 30 }}>
                  <Text className='text-white font-bold text-lg'>
                    {username || 'Usuario'}
                  </Text>
                  <Text className='text-white'>Welcome back again!</Text>
                </View>

              </ImageBackground>
            </View>

            {/* Card blanca */}
            <View
              style={{
                backgroundColor: '#ffffff',
                borderTopLeftRadius: 48,
                borderTopRightRadius: 48,
                paddingHorizontal: 16,
                paddingTop: 24,
                marginTop: -40,
                marginBottom: 20,
                zIndex: 50,
              }}
            >
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <FilterButtons activeFilter={activeFilter} onChange={setActiveFilter} />
              <Text className="text-3xl font-bold mb-1 mt-2">
                {FILTER_TITLES[activeFilter] || 'Your Vaults'}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PasswordCard
            item={item}
            visible={visiblePasswords[item.pass_id]}
            onToggleVisibility={toggleVisibility}
            onToggleFavorite={toggleFavorite}
            onCopy={async (password) => {
              await copyToClipboard(password);
              triggerCopiedOverlay();
            }}
            onEdit={(id) => openAuthModal('edit', id)}     // ← Abre modal de edición
            onDelete={(id) => openAuthModal('delete', id)} // ← Abre modal de eliminación
            IconComponent={getCategoryIcon(item.category_name)}
          />
        )}


        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : error ? (
            <Text className="text-red-600 text-center mt-4">{error}</Text>
          ) : (
            <Text className="text-center mt-4 text-gray-500">There are no saved passwords</Text>
          )
        }
      />

      <View style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 50 }}>
        <AddButton round />
      </View>

      {showCopied && (
        <Animated.View 
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(255,255,255,0.85)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: copiedAnim,
            zIndex: 999,
          }}
          pointerEvents="none"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <Text className="font-bold" style={{ color: '#10B981', fontSize: 40 }}>Copied</Text>
          <CheckIcon />
        </View>

        </Animated.View>
      )}
      <AuthModal
        visible={modalAuth.visible}
        action={modalAuth.action}
        onClose={() => setModalAuth({ visible: false })}
        onConfirm={(password) => handleAuthConfirm(password, modalAuth.action, modalAuth.passId)}
      />

    </View>
  );
}
