import { View, Pressable, Text } from 'react-native';

const FILTERS = ['All', 'Favorites', 'Recent', 'Oldest'];

export default function FilterButtons({ activeFilter, onChange }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={{
              width: 90,               // ancho fijo igual para todos
              paddingVertical: 8,
              borderRadius: 9999,
              marginHorizontal: 4,
              backgroundColor: isActive ? '#FFD400' : '#FFFFFF',
              // Sombra para todos
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 5,  // para Android sombra
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#000', textAlign: 'center' }}>{filter}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
