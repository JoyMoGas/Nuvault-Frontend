import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, Alert, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import api from '../services/api';

export default function RegisterForm({ onTabChange }) {
  // Tus estados previos
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Modal y código
  const [codeSent, setCodeSent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Código dividido en 5 inputs
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '']);

  const inputRefs = useRef([]);

  const [focused, setFocused] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Enviar código al correo
  const sendVerificationCode = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    try {
      await api.post('/register/start', { user_email: email });
      Alert.alert('Success', 'Verification code sent to your email');
      setCodeSent(true);
      setModalVisible(true); // Mostrar modal para ingresar código
    } catch (err) {
      Alert.alert('Error', 'Failed to send verification code');
    }
  };

  // Manejar cambio en inputs del código
  const onChangeDigit = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newCodeDigits = [...codeDigits];
      newCodeDigits[index] = text;
      setCodeDigits(newCodeDigits);
      if (text && index < 4) {
        inputRefs.current[index + 1].focus();
      }
      if (!text && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Confirmar registro con código
  const confirmRegistration = async () => {
    const code = codeDigits.join('');
    if (code.length !== 5) {
      Alert.alert('Invalid Code', 'Please enter the 5-digit verification code.');
      return;
    }
    try {
      setErrors({});
      await api.post('/register/confirm', {
        username,
        first_name: firstName,
        last_name: lastName,
        user_email: email,
        user_password: password,
        code,
      });
      setModalVisible(false);
      Alert.alert('Success', 'Account created successfully');
      onTabChange('login');
    } catch (err) {
      Alert.alert('Error', 'Verification failed or registration error');
    }
  };

  const handleRegister = async () => {
    if (!codeSent) {
      await sendVerificationCode();
    } else {
      setModalVisible(true);
    }
  };

  // Estilo input código
  const codeInputStyle = {
    borderBottomWidth: 2,
    borderColor: '#facc15',
    fontSize: 24,
    textAlign: 'center',
    width: 40,
    marginHorizontal: 5,
  };

  return (
    <>
      {/* Formulario normal */}
      <Text className="text-gray-500 mb-1">Username</Text>
      <TextInput
        className='rounded-xl'
        placeholder="e.g. johndoe123"
        value={username}
        onChangeText={setUsername}
        onFocus={() => setFocused('username')}
        onBlur={() => setFocused('')}
        style={inputStyle('username')}
        autoCapitalize="none"
      />
      {/* ...otros campos igual que antes... */}

      <Text className="text-gray-500 mb-1">Email Address</Text>
      <TextInput
        className='rounded-xl'
        placeholder="e.g. john@example.com"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocused('email')}
        onBlur={() => setFocused('')}
        keyboardType="email-address"
        autoCapitalize="none"
        style={inputStyle('user_email')}
      />

      <Text className="text-gray-500 mb-1">Password</Text>
      <View
        style={[
          inputStyle('password'),
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        ]}
        className='rounded-xl'
      >
        <TextInput
          
          value={password}
          onChangeText={setPassword}
          placeholder="Create a secure password"
          secureTextEntry={!showPassword}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused('')}
          style={{ flex: 1, paddingVertical: 0 }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text className="text-yellow-500 font-bold">{showPassword ? 'Hide' : 'View'}</Text>
        </TouchableOpacity>
      </View>

      <Pressable
        className="bg-yellow-400 py-3 rounded-xl mt-2 mb-2"
        onPress={handleRegister}
      >
        <Text className="text-center font-bold text-black text-lg">
          {codeSent ? 'Verify Code' : 'Create Account'}
        </Text>
      </Pressable>

      {/* Modal para código */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
              Enter Verification Code
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
              {codeDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChangeText={(text) => onChangeDigit(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  style={codeInputStyle}
                  autoFocus={index === 0}
                />
              ))}
            </View>
            <Pressable
              style={[styles.modalButton]}
              onPress={confirmRegistration}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm</Text>
            </Pressable>
            <Pressable
              style={[styles.modalCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#facc15', fontWeight: 'bold' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );

  // Estilos input normales (de tu código, repite o ajusta)
  function inputStyle(field) {
    return {
      borderWidth: 1.5,
      borderColor: errors[field]
        ? '#dc2626'
        : focused === field
        ? '#facc15'
        : '#d1d5db',
      backgroundColor: 'white',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: errors[field] ? 4 : 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    };
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalButton: {
    backgroundColor: '#facc15',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
  },
  modalCancel: {
    paddingVertical: 10,
  },
});
