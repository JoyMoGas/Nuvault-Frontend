import { View, Text, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CopyIcon, DeleteIcon, EditIcon, FavoriteIcon, HideIcon, ShowIcon } from './Icons';

export default function PasswordCard({
  item,
  visible,
  onToggleVisibility,
  onToggleFavorite,
  onCopy,
  onEdit,
  onDelete,
  IconComponent, // <-- aquí pasamos el icono que queremos mostrar en el recuadro gris
}) {
  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex-row h-full items-center space-x-2 mr-7">
          <Pressable
            onPress={() => onEdit(item.pass_id)}
            style={{ backgroundColor: '#808080', height: 48, width: 48 }}
            className="justify-center items-center rounded-full"
          >
            <EditIcon />
          </Pressable>
          <Pressable
            onPress={() => onDelete(item.pass_id)}
            style={{ backgroundColor: '#FFD400', height: 48, width: 48 }}
            className="justify-center items-center rounded-full"
          >
            <DeleteIcon />
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
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 16,
            borderWidth: 0.5,
            borderColor: '#e5e7eb',
            shadowColor: 'rgba(0,0,0,0.6)',
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          {/* Recuadro gris con icono a la izquierda */}
          <View
            style={{
              width: 66,
              height: 66,
              backgroundColor: '#F5F5F5', // gris claro
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            {/* Aquí renderizamos el icono recibido, si no se pasa ninguno puede ir un placeholder */}
            {IconComponent ? <IconComponent /> : null}
          </View>

          {/* Bloque de texto apilado vertical */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
              {item.service}
            </Text>
            <Text style={{ color: '#808080', fontSize: 13, marginTop: 2 }}>
              {item.username}
            </Text>

            {/* Password y botón Ver/Ocultar en fila */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Text
                style={{ color: '#808080', flexShrink: 1, fontWeight: 'bold', fontSize: visible ? 15 : 20, }}
              >
                {visible ? item.password : '********'}
              </Text>
              <Pressable
                onPress={() => onToggleVisibility(item.pass_id)}
                style={{
                  paddingHorizontal: 10,
                }}
              >
                {visible ? <HideIcon /> : <ShowIcon />}
              </Pressable>
            </View>
          </View>

          {/* Botones a la derecha, en fila */}
          <View style={{ marginLeft: 3, flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => onCopy(item.password)}>
              <CopyIcon />
            </Pressable>

            <Pressable
              onPress={() => onToggleFavorite(item.pass_id)}
              style={{
                paddingLeft: 15,
              }}
            >
              {item.is_favorite ? (
                <FavoriteIcon color="#FF4C29" />
              ) : (
                <FavoriteIcon color="#D0D0D0" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}
