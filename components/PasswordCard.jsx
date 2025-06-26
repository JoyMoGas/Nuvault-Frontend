import { View, Text, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function PasswordCard({ item, visible, onToggleVisibility, onToggleFavorite, onCopy, onEdit, onDelete }) {
  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex-row h-full items-center">
          <Pressable
            onPress={() => onEdit(item.pass_id)}
            className="bg-yellow-500 justify-center items-center px-4"
          >
            <Text>Editar</Text>
          </Pressable>
          <Pressable
            onPress={() => onDelete(item.pass_id)}
            className="bg-red-600 justify-center items-center px-4"
          >
            <Text className="text-white">Eliminar</Text>
          </Pressable>
        </View>
      )}
    >
      <View className="px-5 mb-2">
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 16,
            borderWidth: 0.5,
            borderColor: '#e5e7eb',
            shadowColor: 'rgba(0,0,0,0.6)',
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          {/* Bloque de texto apilado vertical */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
              {item.service}
            </Text>
            <Text style={{ color: '#808080', fontSize: 13, marginTop: 2 }}>
              {item.username}
            </Text>

            {/* Password y botón Ver/Ocultar en fila */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <Text style={{ color: '#808080', flexShrink: 1 }}>
                {visible ? item.password : '********'}
              </Text>
              <Pressable
                onPress={() => onToggleVisibility(item.pass_id)}
                style={{
                  backgroundColor: '#FFD400',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginLeft: 8,
                  minWidth: 50,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#000', fontWeight: '600', fontSize: 12 }}>
                  {visible ? 'Ocultar' : 'Ver'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Botones a la derecha, en fila */}
          <View style={{ marginLeft: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable
              onPress={() => onCopy(item.password)}
              style={{
                backgroundColor: '#3B82F6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                minWidth: 80,
                marginRight: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Copiar</Text>
            </Pressable>

            <Pressable
              onPress={() => onToggleFavorite(item.pass_id)}
              style={{
                backgroundColor: item.is_favorite ? '#DC2626' : '#9CA3AF',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                minWidth: 80,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff' }}>
                {item.is_favorite ? '❤️' : '♡'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}
