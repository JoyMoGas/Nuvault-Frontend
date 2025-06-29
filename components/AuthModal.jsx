import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function AuthModal({ visible, onClose, onConfirm, action }) {
  const [password, setPassword] = useState('');
  const [showInput, setShowInput] = useState(false);

  const close = () => {
    setPassword('');
    setShowInput(false);
    onClose();
  };
  

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)', // fondo negro semi-transparente
            padding: 16,
          }}
        >
          <View className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center space-x-2 mb-4">
              <MaterialIcons name="lock" size={24} color="#4B5563" />
              <Text className="text-lg font-semibold text-gray-800">
                Confirm {action === 'edit' ? 'Edit' : 'Delete'}
              </Text>
            </View>

            <Text className="text-gray-600 mb-3">
              Please enter your password to {action === 'edit' ? 'edit this entry' : 'delete this password'}.
            </Text>

            <TextInput
              placeholder="Your password"
              secureTextEntry={!showInput}
              value={password}
              onChangeText={setPassword}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4 text-gray-800"
            />

            <Pressable
              onPress={() => setShowInput(!showInput)}
              className="flex-row items-center mb-4"
            >
              <Ionicons
                name={showInput ? 'eye-off' : 'eye'}
                size={20}
                color="#4B5563"
              />
              <Text className="ml-2 text-gray-600">
                {showInput ? 'Hide' : 'Show'} password
              </Text>
            </Pressable>

            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={close}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => onConfirm(password)}
                style={{ backgroundColor: '#FFD400' }}
                className="px-4 py-2 rounded-lg "
              >
                <Text className="text-black font-medium">Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
