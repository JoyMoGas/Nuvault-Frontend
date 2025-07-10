import { Pressable, Text, Alert, Modal, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import { LayoutContext } from '../../context/LayoutContext';
import { ErrorIcon } from '../Icons';

export default function LogoutButton() {
  const { setAuthKey } = useContext(LayoutContext);
  const [modalVisible, setModalVisible] = useState(false)

  const handleLogOut = async () => {
    await AsyncStorage.removeItem('token');
    setAuthKey((prev) => prev + 1);
    setModalVisible(false)
  }

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text className="text-black font-bold text-base text-center">Log Out</Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
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
              <ErrorIcon />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 12 }}>Log Out</Text>
            <Text style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>Are you sure you want to Log Out?</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable
                style={{
                  backgroundColor: '#facc15',
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  marginRight: 8
                }}
                onPress={handleLogOut}
              >
                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>Agree</Text>
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
    </>
  );
}
