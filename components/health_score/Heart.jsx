import { View } from "react-native";
import { HealthIcon } from "../Icons";

export default function Heart() {
  return (
    <View className='bg-white relative items-center justify-center rounded-full  h-11 w-11'
    >
      <HealthIcon />
    </View>
  )
}
