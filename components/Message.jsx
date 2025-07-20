import { View, Animated, StyleSheet, Text } from "react-native";
import { CheckIcon, ErrorIcon, EditIcon, CopyIcon } from "./Icons";

const getMessageContent = (action) => {
  switch (action) {
    case 'copy':
      return { text: 'Copied', color: '#10B981', Icon: CheckIcon };
    case 'delete':
      return { text: 'Deleted', color: '#dc2626', Icon: ErrorIcon };
    case 'edit':
      return { text: 'Edited', color: '#facc15', Icon: EditIcon };
    default:
      return { text: '', color: '#000', Icon: CopyIcon };
  }
};

export default function Message({ showMessage, messageAnim, action }) {
  const { text, color, Icon } = getMessageContent(action);

  return (
    <View pointerEvents="none">
      {showMessage && (
        <Animated.View 
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(255,255,255,0.85)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: messageAnim,
            zIndex: 999,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <Text className="font-bold" style={{ color, fontSize: 40 }}>{text}</Text>
            <Icon />
          </View>
        </Animated.View>
      )}
    </View>
  );
}