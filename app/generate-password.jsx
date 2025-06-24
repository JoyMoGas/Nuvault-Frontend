import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import api from '../services/api';
import { useRouter } from 'expo-router';

export default function GeneratePassword() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [length, setLength] = useState('12');
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [special, setSpecial] = useState(true);

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
    } catch (e) {
      Alert.alert('Error', 'No se pudo generar la contraseña');
    }
  };

  useEffect(() => {
    generate();
  }, []);

  const ToggleButton = ({ label, value, onToggle }) => (
    <Pressable
      onPress={() => onToggle(!value)}
      className={`py-2 px-4 rounded border mr-3 ${
        value ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'
      }`}
    >
      <Text className={value ? 'text-white' : 'text-gray-700'}>{label}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1 px-6 pt-4">
      <Text className="text-2xl font-bold mb-4">Generar Contraseña</Text>

      <Text>Longitud:</Text>
      <TextInput
        keyboardType="numeric"
        value={length}
        onChangeText={setLength}
        className="border p-2 mb-4 rounded"
      />

      <Text className="mb-2 font-semibold">Opciones:</Text>
      <View className="flex-row mb-4">
        <ToggleButton label="Mayúsculas" value={uppercase} onToggle={setUppercase} />
        <ToggleButton label="Minúsculas" value={lowercase} onToggle={setLowercase} />
        <ToggleButton label="Números" value={numbers} onToggle={setNumbers} />
        <ToggleButton label="Especiales" value={special} onToggle={setSpecial} />
      </View>

      <Pressable
        onPress={generate}
        className="bg-green-600 py-3 rounded mb-4"
      >
        <Text className="text-white text-center">Generar</Text>
      </Pressable>

      {password ? (
        <>
          <Text className="mb-2">Contraseña: {password}</Text>
          <Text>Fuerza: {strength}</Text>
        </>
      ) : null}

      <Pressable
        onPress={() => router.back()}
        className="bg-gray-600 py-3 rounded mt-6"
      >
        <Text className="text-white text-center">Regresar</Text>
      </Pressable>
    </View>
  );
}
