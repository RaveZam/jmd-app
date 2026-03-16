import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface CreateRouteModalProps {
  onClose: () => void;
}

export function CreateRouteModal({ onClose }: CreateRouteModalProps) {
  const [routeName, setRouteName] = useState("");
  const [visible, setVisible] = useState(false);
  const handleCancel = () => {
    setRouteName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
            Create Route
          </ThemedText>

          <View style={styles.modalField}>
            <Text style={styles.label}>Route name</Text>
            <TextInput
              value={routeName}
              onChangeText={setRouteName}
              placeholder="Enter route name"
              placeholderTextColor="#94A3B8"
              style={styles.modalInput}
              autoFocus={true}
            />
          </View>

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={handleCancel}
            >
              <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalPrimaryButton,
                !routeName.trim() && styles.modalPrimaryButtonDisabled,
              ]}
              disabled={!routeName.trim()}
              onPress={() => {}}
            >
              <Text style={styles.modalPrimaryButtonText}>
                Create New Route
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
  },
  modalField: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 14,
    color: "#0F172A",
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  modalSecondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  modalSecondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  modalPrimaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F6B46",
  },
  modalPrimaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalPrimaryButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
});
