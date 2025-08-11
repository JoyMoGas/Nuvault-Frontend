import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Pressable,
  Switch,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import api from '../services/api'; // Asegúrate de tener esto configurado
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../components/buttons/LogoutButton';
import { LayoutContext } from '../context/LayoutContext';
import { usePasswords } from '../context/PasswordsContext';
import { ErrorIcon } from '../components/Icons';

export default function Settings() {
  const router = useRouter();
  const [appNotificationsEnabled, setAppNotificationsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { setAuthKey } = useContext(LayoutContext);

  const { clearPasswordsData } = usePasswords();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.get('/profile');
        const userIdFromResponse = response.data.user_id || response.data.id || null;
        if (userIdFromResponse) {
          setUserId(userIdFromResponse);
        } else {
          Alert.alert("Error", "User ID not found in response.");
        }
      } catch (err) {
        Alert.alert("Error", "Could not get user information.");
      }
    };
    fetchUserId();
  }, []);

  const handleDeleteAccount = async () => {
    if (!userId) return Alert.alert("Error", "User ID not available");

    try {
      setDeleting(true);
      await api.delete(`/user/${userId}`);

      await AsyncStorage.removeItem('token');
      clearPasswordsData();
      setAuthKey(prev => prev + 1);

      setModalVisible(false);
      setShowDeletedModal(true);

      router.replace('/');

      setTimeout(() => {
        setShowDeletedModal(false);
      }, 2000);
    } catch (err) {
      Alert.alert("Error", "The account could not be deleted. Please try again later.");
    } finally {
      setDeleting(false);
    }
  };

  const SettingsItem = ({ icon, label, onPress, showArrow = true, labelColor = 'text-gray-800' }) => (
    <Pressable onPress={onPress} className="flex-row items-center justify-between py-4 border-b border-gray-200">
      <View className="flex-row items-center">
        {icon}
        <Text className={`ml-4 text-lg ${labelColor}`}>{label}</Text>
      </View>
      {showArrow && <AntDesign name="right" size={18} color="#9CA3AF" />}
    </Pressable>
  );

  const SettingsSwitchItem = ({ icon, label, value, onValueChange }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
      <View className="flex-row items-center">
        {icon}
        <Text className="ml-4 text-lg text-gray-800">{label}</Text>
      </View>
      <Switch
        trackColor={{ false: "#E5E7EB", true: "#FACC15" }}
        thumbColor={value ? "#FACC15" : "#F3F4F6"}
        ios_backgroundColor="#E5E7EB"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <>
      <ScrollView className="flex-1 bg-white px-6 pt-4">
        <StatusBar style="dark" />

        <Pressable onPress={() => router.back()} className="absolute left-4 top-14 z-10 bg-yellow-400 rounded-full p-2 shadow">
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>

        <Text className="text-3xl font-bold text-center mt-14 mb-8 text-gray-900">Settings</Text>

        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-700 mb-4">Account</Text>
          <SettingsItem
            icon={<MaterialIcons name="person-outline" size={24} color="#6B7280" />}
            label="Edit profile"
            onPress={() => router.push('/edit-profile')}
          />
          <SettingsItem
            icon={<MaterialIcons name="lock-outline" size={24} color="#6B7280" />}
            label="Change password"
            onPress={() => router.push('/change-password')}
          />
          <SettingsItem
            icon={<MaterialIcons name="delete-outline" size={24} color="#EF4444" />}
            label="Delete account"
            labelColor="text-red-500"
            onPress={() => setModalVisible(true)}
          />
        </View>

        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-700 mb-1">Notifications</Text>
          <Text className="text-xs text-gray-500 italic mb-4">
            (This function is not available yet, so it does not affect anything if enabled or disabled)
          </Text>
          <SettingsSwitchItem
            icon={<Ionicons name="notifications-outline" size={24} color="#6B7280" />}
            label="App notification"
            value={appNotificationsEnabled}
            onValueChange={setAppNotificationsEnabled}
          />
        </View>


        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-700 mb-4">More</Text>
          <SettingsItem
            icon={<MaterialIcons name="language" size={24} color="#6B7280" />}
            label="Language"
          />
          <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <MaterialIcons name="logout" size={24} color="#6B7280" />
              <LogoutButton
                label="Sign Out"
                labelClassName="ml-4 text-lg text-gray-800 font-normal"
                onLoggedOut={() => router.replace('/index')}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal confirmación eliminar cuenta */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: 300,
            alignItems: 'center'
          }}>
            <View>
              <ErrorIcon color="#EF4444" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 12 }}>Delete Account</Text>
            <Text style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable
                style={{
                  backgroundColor: '#ef4444',
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  marginRight: 8
                }}
                onPress={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Delete</Text>
                )}
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: '#e5e7eb',
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal "Cuenta eliminada" temporal */}
      <Modal visible={showDeletedModal} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: 280,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#10B981' }}>
              Cuenta eliminada
            </Text>
            <Text>Tu cuenta ha sido eliminada correctamente.</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
