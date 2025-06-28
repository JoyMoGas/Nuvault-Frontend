import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const AddIcon = (props) => (
  <FontAwesome6 name="plus" size={36} color={"white"} {...props} />
);

export const KeyIcon = (props) => (
  <MaterialIcons name="key" size={24} color={"black"} {...props} />
);

export const GenerateIcon = (props) => (
  <Octicons
    name="key"
    size={24}
    color="black"
    style={{ transform: [{ rotate: '315deg' }, { scaleX: -1 }] }}
    {...props}
  />
);

export const CopyIcon = (props) => (
  <Feather name="copy" size={28} color="#808080" {...props} />
);

export const FavoriteIcon = (props) => (
  <AntDesign name="heart" size={28} color="#FF4C29" {...props} />
);

export const ShowIcon = (props) => (
  <Ionicons name="eye" size={20} color="#808080" {...props} />
);

export const HideIcon = (props) => (
  <Ionicons name="eye-off" size={20} color="#808080" {...props} />
);

export const SearchIcon = (props) => (
  <Ionicons name="search" size={20} color="#808080" {...props} />
);

export const EditIcon = (props) => (
  <Ionicons name="pencil-sharp" size={24} color="#fff" {...props} />
);

export const DeleteIcon = (props) => (
  <Ionicons name="trash-outline" size={24} color="black" {...props} />
);

export const CheckIcon = (props) => (
  <FontAwesome6 name="check" size={46} color="#10B981" {...props} />
);

export const SettingsIcon = (props) => (
  <Ionicons name="options" size={26} color="white" {...props} />
);

export const VerifiedIcon = (props) => (
  <MaterialIcons name="verified-user" size={18} color="green" />
);

export const RegenerateIcon = (props) => (
  <MaterialCommunityIcons name="restart" size={24} color="black" />
);