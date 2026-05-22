import { Modal, StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import type { PickerModalProps } from "../types/store-types";

const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";

export function PickerModal({
  visible,
  products,
  showPrice,
  remainingByProduct,
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
            renderItem={({ item }) => {
              const remaining = remainingByProduct?.[item.id];
              const outOfStock =
                remainingByProduct !== undefined && (remaining ?? 0) <= 0;
              return (
                <TouchableOpacity
                  style={[styles.modalOption, outOfStock && styles.modalOptionDisabled]}
                  disabled={outOfStock}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      outOfStock && styles.modalOptionTextDisabled,
                    ]}
                  >
                    {item.name}
                    {showPrice ? `  —  ₱${item.price}` : ""}
                  </Text>
                  {remaining !== undefined && (
                    <View
                      style={[
                        styles.remainingBadge,
                        remaining <= 0 && styles.remainingBadgeEmpty,
                      ]}
                    >
                      <Text
                        style={[
                          styles.remainingText,
                          remaining <= 0 && styles.remainingTextEmpty,
                        ]}
                      >
                        {remaining} left
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  modalOptionDisabled: { backgroundColor: "#F8FAFC", opacity: 0.55 },
  modalOptionText: { flex: 1, fontSize: 14, color: "#0F172A" },
  modalOptionTextDisabled: { color: "#94A3B8" },
  remainingBadge: {
    borderRadius: 999,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  remainingBadgeEmpty: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  remainingText: { fontSize: 12, fontWeight: "700", color: "#16A34A" },
  remainingTextEmpty: { color: "#DC2626" },
});
