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
import StatusOverlay from '../components/StatusOverlay';
import { useLocalSearchParams } from 'expo-router';
import { useStatusOverlay } from '../context/StatusOverlayContext';
import Heart from '../components/health_score/Heart';
import { usePasswords } from '../context/PasswordsContext';
import PasswordCardSkeleton from '../components/PasswordCardSkeleton';
import TextSkeleton from '../components/TextSkeleton ';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [modalAuth, setModalAuth] = useState({ visible: false, action: null, passId: null });
  const [pwdInput, setPwdInput] = useState('');
  const [showPwdInput, setShowPwdInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const params = useLocalSearchParams()
  const [statusText, setStatusText] = useState('')
  const { showStatus } = useStatusOverlay();
  const allowedStatus = ['Edited', 'Deleted', 'Added', 'Copied'];
  

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    passwordsCache,
    setPasswordsCache,
    healthScore,
    setHealthScore,
    fetchPasswords,
    fetchHealthScore,
    username,
    fetchUsername
  } = usePasswords();


  const passwords = passwordsCache[activeFilter] || [];

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
    showStatus('Copied');
  };

  const triggerDeletedOverlay = () => {
    showStatus('Deleted')
  }

  useEffect(() => {
  if (params.status && allowedStatus.includes(params.status)) {
    showStatus(params.status.charAt(0).toUpperCase() + params.status.slice(1));
    router.replace('/home')
  }
}, [params.status]);

  const handleHideCopied = () => {
    setShowCopied(false)
  }
  const router = useRouter();    

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchPasswords(activeFilter);
        setError(null);
      } catch (err) {
        setError('Error loading passwords');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeFilter]);


  useEffect(() => {
    fetchHealthScore();
  }, []);


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
      Alert.alert('Error', 'Could not change favorite');
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
        triggerDeletedOverlay()
      }

      setModalAuth({ visible: false, action: null, passId: null });
      setPwdInput('');
      setShowPwdInput(false);
    } catch {
      Alert.alert('Error', 'Invalid Password');
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
    if (!username) {
      fetchUsername();
    }
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
      triggerDeletedOverlay()
    }

    setModalAuth({ visible: false, action: null, passId: null });
    setPwdInput('');
    setShowPwdInput(false);
  } catch {
    Alert.alert('Error', 'Invalid Password');
  }
};

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour <12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening'
  }


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
                    top: '50%',
                    left: 0,
                    right: 0,
                    transform: [{ translateY: 0 }],
                  }}
                >
                  <HealthScore score={healthScore} />
                </View>
                
              </View>

              <View
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 87,
                    zIndex: 35,
                    width: 28,
                    height: 28,
                    alignItems: 'center', // Add alignItems and justifyContent for internal centering
                    justifyContent: 'center',
                  }}
                >
                  <Heart />
                </View>

                {/* Difuminado gris */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    left: 0,
                    right: 0,
                    height: 300,
                    zIndex: 10,
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

                <View style={{ position: 'absolute', top: 60, right: 20, zIndex: 10000 }}>
                <SettingsButton
                  isOpen={isSettingsOpen}
                  setIsOpen={setIsSettingsOpen}
                />
              </View>



                <View style={{ position: 'absolute', top: 60, left: 20, zIndex: 30 }}>
                  <Text className='text-white'>{getGreeting()}</Text>
                  <Text className='text-white font-bold text-lg'>
                    {username ? (
                      <Text className='text-white font-bold text-lg'>{username}</Text>
                    ) : (
                      // Skeleton placeholder para username mientras carga
                      <TextSkeleton width={120} height={20} borderRadius={8} />
                      )}
                  </Text>
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
                zIndex: 5,
              }}
            >
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <FilterButtons activeFilter={activeFilter} onChange={setActiveFilter} />
              <Text className="text-3xl font-bold mb-1 mt-2 z-0">
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
            <View>
              {[...Array(5)].map((_, i) => (
                <PasswordCardSkeleton key={i} />
              ))}
            </View>
          ) : error ? (
            <Text className="text-red-600 text-center mt-4 z-0">{error}</Text>
          ) : (
            <Text className="text-center mt-4 text-gray-500 z-0">There are no saved passwords</Text>
          )
        }
      />

      <View style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 50 }}>
        <AddButton round />
      </View>

      <AuthModal
        visible={modalAuth.visible}
        action={modalAuth.action}
        onClose={() => setModalAuth({ visible: false })}
        onConfirm={(password) => handleAuthConfirm(password, modalAuth.action, modalAuth.passId)}
      />

    </View>
  );
}
