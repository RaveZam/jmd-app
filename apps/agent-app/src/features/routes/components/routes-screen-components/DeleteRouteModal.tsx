import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Route } from "../../types/routes-type";
import { modalStyles as m } from "@/src/shared/styles/modalStyles";
import { useRoutesContext } from "../../context/useRoutesContext";

export function DeleteRouteModal() {
  const { deleteModal } = useRoutesContext();
  return (
    <Modal
      visible={!!deleteModal.pending}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={deleteModal.cancel}
    >
      <View style={m.backdrop}>
        <View style={m.content}>
          <View style={m.deleteIconWrap}>
            <Ionicons name="trash-outline" size={28} color="#EF4444" />
          </View>
          <Text style={m.title}>Delete Route</Text>
          <Text style={m.body}>
            Are you sure you want to delete{" "}
            <Text style={m.highlight}>{deleteModal.pending?.name}</Text>?{"\n"}
            All provinces and stores will be removed.
          </Text>
          <View style={m.buttons}>
            <TouchableOpacity
              style={m.cancelButton}
              onPress={deleteModal.cancel}
            >
              <Text style={m.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={m.deleteButton}
              onPress={deleteModal.confirm}
            >
              <Text style={m.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
