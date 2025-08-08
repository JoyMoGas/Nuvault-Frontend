import { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';
import { LayoutContext } from '../context/LayoutContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { CheckEmailIcon, ResetIcon } from './Icons';
import { useRouter } from 'expo-router';

// Note: Removed unused imports like Image, NotAvailableButton, WebBrowser, Constants
// as they were not used in the provided snippet. Add them back if needed elsewhere.

export default function LoginForm({ onTabChange }) {
  // --- STATE FOR LOGIN ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuthKey } = useContext(LayoutContext);
  const [errors, setErrors] = useState({});

  // --- STATE FOR PASSWORD RESET MODALS ---
  const [resetEmail, setResetEmail] = useState('');
  const [resetCodeDigits, setResetCodeDigits] = useState(['', '', '', '', '']);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  
  const resetInputRefs = useRef([]);

  const router = useRouter();

  // --- PASSWORD RESET UTILITY FUNCTIONS ---

  /**
   * Resets all state related to the password reset flow and closes modals.
   */
  const resetPasswordFlow = () => {
    setShowEmailModal(false);
    setShowCodeModal(false);
    setShowNewPasswordModal(false);
    setResetEmail('');
    setResetCodeDigits(['', '', '', '', '']);
    setResetNewPassword('');
    setResetConfirmPassword('');
    setResetMsg('');
    setResetLoading(false);
  };

  /**
   * Handles moving focus between code input fields.
   */
  const onChangeResetDigit = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newDigits = [...resetCodeDigits];
      newDigits[index] = text;
      setResetCodeDigits(newDigits);
      // Move to next input if a digit is entered
      if (text && index < 4) {
        resetInputRefs.current[index + 1]?.focus();
      }
      // Move to previous input if a digit is deleted
      if (!text && index > 0) {
        resetInputRefs.current[index - 1]?.focus();
      }
    }
  };

  // --- PASSWORD RESET API HANDLERS ---

  /**
   * Step 1: Request a password reset code to be sent to the user's email.
   */
  const handleResetRequest = async () => {
    setResetMsg('');
    if (!resetEmail) {
      setResetMsg('Please enter your email address.');
      return;
    }
    setResetLoading(true);
    try {
      await api.post('/reset/request', { user_email: resetEmail });
      setShowEmailModal(false);
      setShowCodeModal(true);
    } catch (err) {
      setResetMsg(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  /**
   * Handles the "Resend Code" action in the code verification modal.
   */
  const handleResendCode = async () => {
    setResetMsg('');
    setResetLoading(true);
    try {
        await api.post('/reset/request', { user_email: resetEmail });
        setResetMsg('A new code has been sent.');
        setResetCodeDigits(['', '', '', '', '']); // Clear old digits
        resetInputRefs.current[0]?.focus(); // Focus the first input
    } catch (err) {
        setResetMsg(err.response?.data?.message || 'Error resending code. Please try again.');
    } finally {
        setResetLoading(false);
    }
  };


  /**
   * Step 2: Verify the 5-digit code. For now, it just moves to the next step.
   * You can add backend verification here if needed.
   */
  const handleVerifyCode = async () => {
    setResetMsg('');
    const code = resetCodeDigits.join('');
    if (code.length !== 5) {
      setResetMsg('Please enter the complete 5-digit code.');
      return;
    }
    // TODO: Optionally add a backend call here to verify the code before proceeding.
    // For now, we just open the next modal.
    setShowCodeModal(false);
    setShowNewPasswordModal(true);
  };

  /**
   * Step 3: Confirm the new password and send it to the backend.
   */
  const handleResetConfirm = async () => {
    setResetMsg('');
    if (!resetNewPassword || !resetConfirmPassword) {
      setResetMsg('Please fill in both password fields.');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetMsg('The new passwords do not match.');
      return;
    }
    if (resetNewPassword.length < 6) { // Example validation
        setResetMsg('Password must be at least 6 characters long.');
        return;
    }

    setResetLoading(true);
    const code = resetCodeDigits.join('');
    try {
      await api.put('/reset/confirm', {
        user_email: resetEmail,
        code,
        new_password: resetNewPassword,
      });
      // You could show a success message here before closing
      // For example: alert('Password has been reset successfully!');
      resetPasswordFlow(); // Close modals and clear state on success
    } catch (err) {
      setResetMsg(err.response?.data?.message || 'Error resetting password.');
    } finally {
      setResetLoading(false);
    }
  };

  // --- EMAIL/PASSWORD LOGIN HANDLER ---
  const handleLogin = async () => {
  setErrors({});
  if (!email || !password) {
    setErrors({ form: 'Please enter both email and password.' });
    return;
  }

  setLoading(true);
  try {
    const res = await api.post('/login', {
      user_email: email,
      user_password: password,
    });

    const token = res.data?.token;

    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token format');
    }

    await AsyncStorage.setItem('token', token);

    // Verifica manualmente antes de hacer el setAuthKey
    setTimeout(async () => {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        setAuthKey((prev) => prev + 1);
      } else {
      }
    }, 200); // Puedes probar con 200ms, 300ms o hasta 500ms si hace falta


  } catch (err) {
    if (err.response?.status === 400 && err.response.data.error === 'user_email') {
      setErrors((prev) => ({ ...prev, user_email: err.response.data.message }));
    } else if (err.response?.status === 401 && err.response.data.error === 'user_password') {
      setErrors((prev) => ({ ...prev, user_password: err.response.data.message }));
    } else {
      setErrors({ form: 'Invalid credentials.' });
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* --- LOGIN FORM --- */}
      <Text className="text-gray-500 mb-1">Email Address</Text>
      <TextInput
        className="bg-white rounded-xl px-4 py-3 mb-4 shadow-md"
        placeholder="your.email@example.com"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField('')}
        style={{
          borderWidth: 1.5,
          borderColor: errors.user_email ? '#dc2626' : focusedField === 'email' ? '#facc15' : '#d1d5db',
        }}
      />
      {errors.user_email && <Text style={{ color: '#dc2626', marginTop: -10, marginBottom: 8 }}>{errors.user_email}</Text>}

      <Text className="text-gray-500 mb-1">Password</Text>
      <View
        className="flex-row items-center justify-between bg-white rounded-xl px-4 py-1 mb-2 shadow-md"
        style={{
          borderWidth: 1.5,
          borderColor: errors.user_password ? '#dc2626' : focusedField === 'password' ? '#facc15' : '#d1d5db',
        }}
      >
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          className="flex-1 py-2 text-black" // Added py-2 for consistent height
          placeholder="Enter your password"
          placeholderTextColor="#6b7280"
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text className="text-yellow-500 font-bold">{showPassword ? 'Hide' : 'View'}</Text>
        </TouchableOpacity>
      </View>
      {errors.user_password && <Text style={{ color: '#dc2626', marginTop: -2, marginBottom: 8 }}>{errors.user_password}</Text>}


      <TouchableOpacity onPress={() => setShowEmailModal(true)}>
        <Text className="text-right text-sm text-yellow-400">Forgot Password?</Text>
      </TouchableOpacity>
      
      {errors.form && <Text style={{ color: '#dc2626', textAlign: 'center', marginTop: 10 }}>{errors.form}</Text>}

      <Pressable
        className="bg-yellow-400 py-3 rounded-xl mt-8 mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-center font-bold text-black text-lg">Login</Text>
        )}
      </Pressable>

      <Text className="text-center text-sm text-gray-500 mt-2">
        Don’t have an account?{' '}
        <Text className="text-yellow-500 font-semibold" onPress={() => onTabChange('register')}>
          Register
        </Text>
      </Text>

      {/* --- MODAL 1: ENTER EMAIL --- */}
      <Modal
        visible={showEmailModal}
        transparent
        animationType="slide"
        onRequestClose={resetPasswordFlow}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ResetIcon marginVertical={25} />
                <Text style={styles.modalTitle}>Reset Password</Text>
                <Text style={styles.modalSubtitle}>Enter your email address to receive a reset code.</Text>
                <TextInput
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#6b7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.modalInput}
                />
                {resetMsg ? <Text style={styles.errorMessage}>{resetMsg}</Text> : null}
                <Pressable style={styles.modalButton} onPress={handleResetRequest} disabled={resetLoading}>
                    {resetLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.modalButtonText}>Send Code</Text>}
                </Pressable>
                <Pressable style={styles.modalCancel} onPress={resetPasswordFlow} disabled={resetLoading}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
            </View>
        </View>
      </Modal>


      {/* --- MODAL 2: CODE VERIFICATION --- */}
      <Modal
        visible={showCodeModal}
        transparent
        animationType="slide"
        onRequestClose={resetPasswordFlow}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View>
              <CheckEmailIcon marginVertical={25} />
            </View>
            <Text style={styles.modalTitle}>Enter Reset Code</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#808080', marginBottom: 2  }}>
              Enter 5 digits verification code we have sent to
            </Text>
            <Text style={{ fontSize: 14, textDecorationLine: 'underline' }}>
              {resetEmail}
            </Text>
            <View style={styles.codeInputContainer}>
              {resetCodeDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (resetInputRefs.current[index] = el)}
                  value={digit}
                  onChangeText={(text) => onChangeResetDigit(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  style={styles.codeInput}
                  autoFocus={index === 0}
                />
              ))}
            </View>
            
            {resetMsg ? <Text style={styles.errorMessage}>{resetMsg}</Text> : null}

            <Pressable style={styles.modalButton} onPress={handleVerifyCode} disabled={resetLoading}>
                {resetLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.modalButtonText}>Verify Code</Text>}
            </Pressable>
            
            <Pressable style={styles.modalResendButton} onPress={handleResendCode} disabled={resetLoading}>
                <Text style={styles.modalResendText}>Resend Code</Text>
            </Pressable>

            <Pressable style={styles.modalCancel} onPress={resetPasswordFlow} disabled={resetLoading}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 3: NEW PASSWORD --- */}
      <Modal
        visible={showNewPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={resetPasswordFlow}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View>
              <ResetIcon marginVertical={25} />
            </View>
            <Text style={styles.modalTitle}>Set New Password</Text>
            <Text style={styles.modalSubtitle}>Enter and confirm your new password below.</Text>
            <TextInput
              value={resetNewPassword}
              onChangeText={setResetNewPassword}
              placeholder="New Password"
              placeholderTextColor="#6b7280"
              secureTextEntry
              style={styles.modalInput}
            />
            <TextInput
              value={resetConfirmPassword}
              onChangeText={setResetConfirmPassword}
              placeholder="Confirm New Password"
              placeholderTextColor="#6b7280"
              secureTextEntry
              style={styles.modalInput}
            />
            
            {resetMsg ? <Text style={styles.errorMessage}>{resetMsg}</Text> : null}

            <Pressable style={styles.modalButton} onPress={handleResetConfirm} disabled={resetLoading}>
              {resetLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.modalButtonText}>Change Password</Text>}
            </Pressable>

            <Pressable style={styles.modalCancel} onPress={resetPasswordFlow} disabled={resetLoading}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#f8fafc', // A slightly off-white background
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#808080', // gray-600
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 12,
    padding: 12,
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 16,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#facc15', // yellow-400
    paddingVertical: 12,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalResendButton: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  modalResendText: {
    color: '#4b5563', // gray-600
    fontWeight: '600',
    fontSize: 15,
  },
  modalCancel: {
    paddingVertical: 8,
  },
  modalCancelText: {
    color: '#facc15', // yellow-400
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorMessage: {
    color: '#dc2626', // red-600
    marginBottom: 12,
    textAlign: 'center',
  },
  // --- Code Input Specific Styles ---
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#facc15', // yellow-400
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 25,
    width: 50,
    height: 60,
    backgroundColor: 'white',
  },
});
