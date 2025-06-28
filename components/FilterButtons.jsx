import { View, Pressable, Text } from 'react-native';

const FILTERS = ['All', 'Favorites', 'Recent', 'Oldest'];

export default function FilterButtons({ activeFilter, onChange }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={{
              width: 80,               // ancho fijo igual para todos
              paddingVertical: 8,
              borderRadius: 9999,
              backgroundColor: isActive ? '#FFD400' : '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 5,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 8,     // margen igual a ambos lados
            }}
          >
            <Text className='font-bold' style={{ color: '#000', textAlign: 'center', fontSize: 12 }}>
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
