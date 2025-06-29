import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable
} from 'react-native';
import { ErrorIcon, WorkingIcon } from '../Icons';

export default function NotAvailableButton({ children }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text className="text-black font-bold text-base text-center">{children}</Text>
      </Pressable>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl items-center space-y-4 w-4/5">
            <ErrorIcon />
            <Text className="text-3xl font-bold mb-5">UUUPPPS...</Text>
            <View className="flex-row items-center space-x-2 mb-5">
              <WorkingIcon />
              <Text className="text-base text-center text-gray-700">
                Not Available Yet
              </Text>
            </View>
            <Pressable
              style={{ backgroundColor: '#FFD400' }}
              className="px-10 py-3 rounded-lg"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-black font-semibold">Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
