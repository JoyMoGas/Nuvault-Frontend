import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  ToastAndroid,
  ScrollView
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import api from '../services/api';
import { useRouter } from 'expo-router';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { RegenerateIcon, CheckIcon } from '../components/Icons';
import { StatusBar } from 'expo-status-bar';

export default function GeneratePassword() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [length, setLength] = useState('15');
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [special, setSpecial] = useState(false);
  const [copied, setCopied] = useState(false);

  const strengthColor = {
    'Débil': 'text-red-500',
    'Moderado': 'text-yellow-500',
    'Bueno': 'text-blue-500',
    'Fuerte': 'text-green-500',
    'Muy Fuerte': 'text-emerald-500',
  };

  const generate = async () => {
    if (!uppercase && !lowercase && !numbers && !special) {
      Alert.alert('Error', 'Debes seleccionar al menos un tipo de carácter');
      return;
    }
    try {
      const res = await api.post('/generate-password', {
        length: Number(length),
        uppercase,
        lowercase,
        numbers,
        special,
      });
      setPassword(res.data.password);
      setStrength(res.data.strength);
      setCopied(false);
    } catch (e) {
      Alert.alert('Error', 'No se pudo generar la contraseña');
    }
  };

  useEffect(() => {
    generate();
  }, []);

  const copyToClipboard = async () => {
    if (!password) return;
    await Clipboard.setStringAsync(password);
    setCopied(true);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Contraseña copiada', ToastAndroid.SHORT);
    }
  };

  const ToggleBox = ({ label, subLabel, value, onToggle }) => (
    <Pressable
      onPress={() => onToggle(!value)}
      className="flex-row items-center mb-2 w-30 justify-between"
    >
      <Text className="ml-10 mr-2 font-bold text-base text-gray-600">{label}</Text>
      <Text className=" mr-5 font-bold text-xs text-gray-400">{subLabel}</Text>
      <View
        className={`w-7 h-7 border rounded-md items-center justify-center ${
          value ? 'border-green-500' : 'border-red-400'
        }`}
      >
        {value ? (
          <AntDesign name="check" size={14} color="green" />
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-4">
      <StatusBar style="dark" />

      {/* Botón de regresar */}
      <Pressable
        onPress={() => router.back()}
        className="absolute left-4 top-14 z-10 bg-yellow-400 rounded-full p-2"
      >
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>

      {/* Título */}
      <Text className="text-3xl font-bold text-center mt-14 mb-6">Generator</Text>

      {/* Input contraseña */}
      <View className='pt-28'>
        <Text className="text-gray-500 mb-2">New Password</Text>
        <View className="rounded-xl bg-white px-3 py-3 mb-2 shadow-md flex-row items-center justify-between border border-green-400">
          <Text selectable className="text-base font-mono flex-1 pr-2">{password}</Text>
          <Pressable onPress={generate}>
            <RegenerateIcon />
          </Pressable>
        </View>

        {/* Fuerza */}
        {strength ? (
          <View className="flex-row items-center gap-2 mb-4">
            <Text className={`${strengthColor[strength] || 'text-gray-500'} font-semibold text-base`}>
              {strength}
            </Text>
            <MaterialIcons name="verified-user" size={18} color="green" />
          </View>
        ) : null}

        {/* Botón Copy */}
        <Pressable
          onPress={copyToClipboard}
          className="bg-yellow-400 py-3 rounded-xl mb-2 shadow-md"
        >
          <Text className="text-center font-bold text-black">Copy</Text>
        </Pressable>

        {copied && (
          <View className="row text-center items-center font-semibold">
            <Text className="text-green-500">Copied <CheckIcon size={18} /></Text>
          </View>
        )}

        {/* Longitud */}
        <View className="flex-row items-center mt-6">
          <Text className="mr-5 font-bold text-base text-gray-600">Length</Text>
          <TextInput
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
            className="w-14 h-10 text-center border border-gray-300 rounded-lg bg-white shadow-md"
          />
        </View>

        {/* Checkboxes */}
        <View className="flex-row flex-wrap gap-4 mt-8 mb-8">
          <ToggleBox label="Letters" subLabel="A-Z" value={uppercase} onToggle={setUppercase} />
          <ToggleBox label="Letters" subLabel="a-z" value={lowercase} onToggle={setLowercase} />
          <ToggleBox label="Numbers" value={numbers} onToggle={setNumbers} />
          <ToggleBox label="Special" subLabel="!@#$%^&" value={special} onToggle={setSpecial} />
        </View>
      </View>
      
    </ScrollView>
  );
}
