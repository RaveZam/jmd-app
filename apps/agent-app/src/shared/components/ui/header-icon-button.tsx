import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type HeaderIconButtonProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  testID?: string;
  size?: number;
  color?: string;
};

export function HeaderIconButton({
  icon,
  onPress,
  testID,
  size = 22,
  color = "#FFFFFF",
}: HeaderIconButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.button}
      testID={testID}
    >
      <Ionicons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
  },
});
