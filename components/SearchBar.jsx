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
        borderWidth: 0.5,
        borderColor: '#e5e7eb',
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center space-x-2">
        <SearchIcon />
        <TextInput
          placeholder="Search Password..."
          value={value}
          onChangeText={onChange}
          className="text-base text-gray-800 flex-1"
          placeholderTextColor="#808080"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChange('')}>
            <Ionicons name="close-circle" size={20} color="#808080" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
