import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const AddIcon = (props) => (
  <FontAwesome6 name="plus" size={32} color={"white"} {...props} />
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
  <MaterialCommunityIcons name="restart" size={24} color="#808080" />
);

export const BrowserIcon = (props) => (
  <MaterialCommunityIcons name="web" size={38} color="#808080" {...props} />
);

export const MobileIcon = (props) => (
  <AntDesign name="mobile1" size={38} color="#808080" {...props} />
);

export const SocialMediaIcon = (props) => (
  <FontAwesome name="slideshare" size={38} color="#808080" {...props} />
);

export const EmailIcon = (props) => (
  <MaterialCommunityIcons name="email-outline" size={38} color="#808080" {...props} />
);

export const BankIcon = (props) => (
  <MaterialCommunityIcons name="finance" size={38} color="#808080" {...props} />
);

export const WorkIcon = (props) => (
  <MaterialIcons name="work-outline" size={38} color="#808080" {...props} />
);

export const ShoppingIcon = (props) => (
  <MaterialCommunityIcons name="shopping-outline" size={38} color="#808080" {...props} />
);

export const GamingIcon = (props) => (
  <MaterialCommunityIcons name="gamepad-variant-outline" size={38} color="#808080" {...props} />
);

export const MediaIcon = (props) => (
  <MaterialIcons name="ondemand-video" size={38} color="#808080" {...props} />
);

export const BillIcon = (props) => (
  <MaterialIcons name="payment" size={38} color="#808080" {...props} />
);

export const EducationIcon = (props) => (
  <MaterialCommunityIcons name="book-education-outline" size={38} color="#808080" {...props} />
);

export const OtherIcon = (props) => (
  <MaterialIcons name="password" size={38} color="#808080" {...props} />
);

export const ErrorIcon = (props) => (
  <Ionicons name="alert-circle-outline" size={72} color="#FFA500" />
);

export const WorkingIcon = (props) => (
  <Ionicons name="construct" size={24} color="#808080" {...props} />
);

export const CheckEmailIcon = (props) => (
  <MaterialIcons name="mark-email-read" size={82} color="#808080" {...props} />
);

export const VeryStrongIcon = (props) => (
  <FontAwesome5 name="user-shield" size={16} color="#10B981" {...props} />
);

export const StrongIcon = (props) => (
  <FontAwesome5 name="shield-alt" size={16} color="#34D399" {...props} />
);

export const GoodIcon = (props) => (
  <FontAwesome5 name="shield-alt" size={16} color="#3c83f6" {...props} />
);

export const ModerateIcon = (props) => (
  <FontAwesome5 name="exclamation-circle" size={16} color="#F59E42" {...props} />
);

export const WeakIcon = (props) => (
  <FontAwesome5 name="feather-alt" size={16} color="#EF4444" {...props} />
);

export const HealthIcon = (props) => (
  <FontAwesome5 name="heartbeat" size={24} color="#facc15" {...props} />
);

export const ResetIcon = (props) => (
  <MaterialCommunityIcons name="form-textbox-password" size={82} color="#808080" {...props} />
);