import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StoreRow } from "../../types/db-rows";

type Props = {
  store: StoreRow | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteStoreModal({ store, onConfirm, onCancel }: Props) {
  return (
    <Modal
      visible={!!store}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Ionicons name="trash-outline" size={28} color="#EF4444" />
          </View>
          <Text style={styles.title}>Delete Store</Text>
          <Text style={styles.body}>
            Are you sure you want to delete{" "}
            <Text style={styles.highlight}>{store?.name}</Text>?
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  body: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
  highlight: {
    fontWeight: "700",
    color: "#0F172A",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  deleteButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
