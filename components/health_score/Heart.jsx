import { View } from "react-native";
import { HealthIcon } from "../Icons";
import { SecurityIcon } from "../Icons";

export default function Heart() {
  return (
    <View className='bg-white relative items-center justify-center rounded-full  h-11 w-11'
    >
      <SecurityIcon />
    </View>
  )
}
