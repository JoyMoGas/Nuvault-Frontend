import { View, TextInput, Pressable } from 'react-native';
import { SearchIcon } from './Icons';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ value, onChange }) {
  return (
    <View
      className="mx-4 mb-7 rounded-2xl"
      style={{
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <View className="flex-row items-center space-x-2">
        <SearchIcon />
        <TextInput
          placeholder="Search Password..."
          value={value}
          onChangeText={onChange}
          className="text-base text-gray-800 flex-1"
          placeholderTextColor="#A0A0A0"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChange('')}>
            <Ionicons name="close-circle" size={20} color="#A0A0A0" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
