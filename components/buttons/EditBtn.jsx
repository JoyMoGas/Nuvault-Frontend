import { View, Pressable } from "react-native";

export function EditBtn() {
  const toggleVisibility = (id) =>
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <View>
      <Pressable
        onPress={() => toggleVisibility(item.pass_id)}
        className="bg-yellow-500 py-2 px-4 rounded"
      >
        <Text className="text-white font-semibold">{show ? 'Ocultar' : 'Ver'}</Text>
      </Pressable>
    </View>
  )
}