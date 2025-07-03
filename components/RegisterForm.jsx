import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { useRouter } from 'expo-router';

export default function RegisterForm({ onTabChange }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      await api.post('/register', {
        username,
        first_name: firstName,
        last_name: lastName,
        user_email: email,
        user_password: password,
      });

      Alert.alert('Success', 'Account created successfully');
      onTabChange('login');
    } catch (err) {
      Alert.alert('Error', 'Registration failed');
    }
  };

  const inputStyle = (field) => ({
    borderWidth: 1.5,
    borderColor: focused === field ? '#facc15' : '#d1d5db',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  });

  return (
    <>
      <Text className="text-gray-500 mb-1">Username</Text>
      <TextInput
        placeholder="joymgs23"
        value={username}
        onChangeText={setUsername}
        onFocus={() => setFocused('username')}
        onBlur={() => setFocused('')}
        style={inputStyle('username')}
        autoCapitalize="none"
      />

      <Text className="text-gray-500 mb-1">First Name</Text>
      <TextInput
        placeholder="Jose"
        value={firstName}
        onChangeText={setFirstName}
        onFocus={() => setFocused('firstName')}
        onBlur={() => setFocused('')}
        style={inputStyle('firstName')}
      />

      <Text className="text-gray-500 mb-1">Last Name</Text>
      <TextInput
        placeholder="Montano"
        value={lastName}
        onChangeText={setLastName}
        onFocus={() => setFocused('lastName')}
        onBlur={() => setFocused('')}
        style={inputStyle('lastName')}
      />

      <Text className="text-gray-500 mb-1">Email Address</Text>
      <TextInput
        placeholder="example@company.com"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocused('email')}
        onBlur={() => setFocused('')}
        keyboardType="email-address"
        autoCapitalize="none"
        style={inputStyle('email')}
      />

      <Text className="text-gray-500 mb-1">Password</Text>
      <View
        style={[
          inputStyle('password'),
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        ]}
      >
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Create a secure password"
          secureTextEntry={!showPassword}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused('')}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text className="text-yellow-500 font-bold">{showPassword ? 'Hide' : 'View'}</Text>
        </TouchableOpacity>
      </View>

      <Pressable className="bg-yellow-400 py-3 rounded-xl mt-4 mb-4" onPress={handleRegister}>
        <Text className="text-center font-bold text-black text-lg">Register</Text>
      </Pressable>

      <Text className="text-center text-sm text-gray-500 mt-2">
        Already have an account?{' '}
        <Text className="text-yellow-500 font-semibold" onPress={() => onTabChange('login')}>
          Log In
        </Text>
      </Text>
    </>
  );
}
