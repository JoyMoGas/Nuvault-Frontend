import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, Alert, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { CheckEmailIcon, CheckIcon, EmailIcon } from './Icons';

export default function RegisterForm({ onTabChange }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [codeSent, setCodeSent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModal, setCreateModal] = useState(false)

  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '']);
  const inputRefs = useRef([]);

  const [focused, setFocused] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendVerificationCode = async () => {
    setErrors({});
    setErrorMsg('');

    if (!username.trim() && !email.trim() && !password.trim()) {
      Alert.alert('Empty fields', 'Please fill in all required fields')
      return;
    }

    let hasError = false
    if (!isValidEmail(email)) {
      setErrors((prev) => ({ ...prev, user_email: 'Please enter a valid email address.' }));
      return;
    }
    if (!username.trim()) {
      setErrors((prev) => ({ ...prev, username: 'Username is required' }));
      return;
    }
    if (!password.trim()){
      setErrors((prev) => ({ ...prev, password: 'Password is required'}));
      return;
    }
    
    if (hasError) return;
    setLoading(true)

    try {
      await api.post('/register/start', { user_email: email, username: username });
      setCodeSent(true);
      setModalVisible(true);
      setCodeDigits(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.error === 'user_email') {
        setErrors((prev) => ({ ...prev, user_email: err.response.data.message }));
      } else if (err.response?.status === 409 && err.response.data.error === 'username') {
        setErrors((prev) => ({ ...prev, username: err.response.data.message }));
      } else {
        setErrorMsg('Failed to send verification code');
      }
    } finally {
      setLoading(false)
    }
  };

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
      setCreateModal(true)
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

  const codeInputStyle = {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#facc15',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 60,
    marginHorizontal: 5,
  };

  const codeInputStyleFocus = {
    borderColor: 'gray'
  }

  function inputStyle(field) {
    return {
      borderWidth: 1.5,
      borderColor: errors[field]
        ? '#dc2626'
        : focused === field
        ? '#facc15'
        : '#d1d5db',
      backgroundColor: 'white',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: errors[field] ? 4 : 12,
    };
  }

  return (
    <>
      {/* Formulario normal */}
      <Text className="text-gray-500 mb-1">Username</Text>
      <TextInput
        placeholder="e.g. johndoe123"
        value={username}
        onChangeText={text => {
          setUsername(text);
          if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
        }}
        onFocus={() => setFocused('username')}
        onBlur={() => setFocused('')}
        style={inputStyle('username')}
        autoCapitalize="none"
      />
      {errors.username && <Text style={{ color: '#dc2626', marginBottom: 8 }}>{errors.username}</Text>}
      
      {/* ...otros campos iguales a los anteriores... */}

      <Text className="text-gray-500 mb-1">Email Address</Text>
      <TextInput
        placeholder="e.g. john@example.com"
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (errors.user_email) setErrors(prev => ({ ...prev, user_email: undefined }));
        }}
        onFocus={() => setFocused('email')}
        onBlur={() => setFocused('')}
        keyboardType="email-address"
        autoCapitalize="none"
        style={inputStyle('user_email')}
      />
      {errors.user_email && <Text style={{ color: '#dc2626', marginBottom: 8 }}>{errors.user_email}</Text>}

      <Text className="text-gray-500 mb-1">Password</Text>
      <View
        style={[
          inputStyle('password'),
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        ]}
      >
        <TextInput
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
          }}
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
      {errors.password && <Text style={{ color: '#dc2626', marginBottom: 8 }}>{errors.password}</Text>}

      <Pressable
        className="bg-yellow-400 py-3 rounded-xl mt-8 mb-4"
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-center font-bold text-black text-lg">
            {codeSent ? 'Verify Code' : 'Create Account'}
          </Text>
        )}
        
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View>
              <CheckEmailIcon marginVertical={25} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
              Verify Your Account
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#808080', marginBottom: 2  }}>
              Enter 5 digits verification code we have sent to
            </Text>
            <Text style={{ fontSize: 14, textDecorationLine: 'underline' }}>
              {email}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 25, marginTop: 25 }}>
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
              <Text style={{ color: 'black', fontWeight: 'semibold', fontSize: 18 }}>Verify</Text>
            </Pressable>

            {/* Botón Reenviar */}
            <Pressable
              style={[styles.modalResendButton]}
              onPress={sendVerificationCode}
            >
              <Text style={{ color: '#000', fontWeight: 'semibold' , fontSize: 18 }}>Resend Code</Text>
            </Pressable>

            <Pressable
              style={[styles.modalCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#facc15', fontWeight: 'bold', fontSize: 18 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={createModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View>
              <CheckIcon size={66} marginVertical={25} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
              You have been registrated as
            </Text>
            <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#808080', marginBottom: 12  }}>
              {username}
            </Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981', marginBottom: 32 }}>
              Successfully
            </Text>
            
            <Pressable
              style={[styles.modalButton]}
              onPress={() => {
                setCreateModal(false)
                onTabChange('login')
              }}
            >
              <Text style={{ color: 'black', fontWeight: 'semibold', fontSize: 18 }}>Login</Text>
            </Pressable>

            <Pressable
              style={[styles.modalCancel]}
              onPress={() => {
                setCreateModal(false)
                onTabChange('login')
              }}
            >
              <Text style={{ color: '#facc15', fontWeight: 'bold', fontSize: 20 }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
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
    width: '90%',
  },
  modalButton: {
    backgroundColor: '#facc15',
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 130,
    marginHorizontal: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  modalResendButton: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  modalCancel: {
    paddingVertical: 10,
  },
});
