import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { modalStyles as m } from "@/styles/modalStyles";

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function EndRouteModal({ visible, onConfirm, onCancel }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={m.backdrop}>
        <View style={m.content}>
          <View style={m.deleteIconWrap}>
            <Ionicons name="navigate-outline" size={28} color="#EF4444" />
          </View>
          <Text style={m.title}>End Route</Text>
          <Text style={m.body}>
            Are you sure you want to end this route session?
          </Text>
          <View style={m.buttons}>
            <TouchableOpacity style={m.cancelButton} onPress={onCancel}>
              <Text style={m.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={m.deleteButton} onPress={onConfirm}>
              <Text style={m.deleteText}>End Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
