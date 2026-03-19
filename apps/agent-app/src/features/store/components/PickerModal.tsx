import { Modal, StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import type { PickerModalProps } from "../types/store-types";

const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";

export function PickerModal({
  visible,
  products,
  showPrice,
  onSelect,
  onClose,
}: PickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={products}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.modalOptionText}>
                  {item.name}
                  {showPrice ? `  —  ₱${item.price}` : ""}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    maxHeight: 320,
    overflow: "hidden",
  },
  modalOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  modalOptionText: { fontSize: 14, color: "#0F172A" },
});
