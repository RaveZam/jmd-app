import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Product } from "../mock/products";

export type ProductLogFormProps = {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  qty: number;
  onQtyChange: (n: number) => void;
  boQty: number;
  onBoQtyChange: (n: number) => void;
  onLogProduct: () => void;
};

export function ProductLogForm({
  products,
  selectedProduct,
  onSelectProduct,
  qty,
  onQtyChange,
  boQty,
  onBoQtyChange,
  onLogProduct,
}: ProductLogFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  return (
    <>
      <View style={styles.form}>
        <Text style={styles.label}>Product</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setPickerOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>
            {selectedProduct
              ? `${selectedProduct.name} — P${selectedProduct.price}`
              : "Select product"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Qty</Text>
            <View style={styles.stepper}>
              <TextInput
                style={styles.stepperInput}
                value={String(qty)}
                keyboardType="number-pad"
                onChangeText={(t) => onQtyChange(parseInt(t, 10) || 0)}
              />
              <View style={styles.stepperArrows}>
                <TouchableOpacity
                  style={styles.arrowBtn}
                  onPress={() => onQtyChange(Math.max(0, qty + 1))}
                >
                  <Ionicons name="chevron-up" size={16} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.arrowBtn}
                  onPress={() => onQtyChange(Math.max(0, qty - 1))}
                >
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>BO Qty</Text>
            <View style={styles.stepper}>
              <TextInput
                style={styles.stepperInput}
                value={String(boQty)}
                keyboardType="number-pad"
                onChangeText={(t) => onBoQtyChange(parseInt(t, 10) || 0)}
              />
              <View style={styles.stepperArrows}>
                <TouchableOpacity
                  style={styles.arrowBtn}
                  onPress={() => onBoQtyChange(Math.max(0, boQty + 1))}
                >
                  <Ionicons name="chevron-up" size={16} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.arrowBtn}
                  onPress={() => onBoQtyChange(Math.max(0, boQty - 1))}
                >
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logButton}
          onPress={onLogProduct}
          activeOpacity={0.8}
        >
          <Text style={styles.logButtonText}>Log product</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }: { item: Product }) => (
                <TouchableOpacity
                  style={styles.productOption}
                  onPress={() => {
                    onSelectProduct(item);
                    setPickerOpen(false);
                  }}
                >
                  <Text style={styles.productOptionText}>
                    {item.name} — P{item.price}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 14,
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: "#0F172A",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  field: {
    flex: 1,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stepperInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    padding: 0,
  },
  stepperArrows: {
    gap: 0,
  },
  arrowBtn: {
    padding: 2,
  },
  logButton: {
    backgroundColor: "#1F6B46",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    maxHeight: 320,
  },
  productOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  productOptionText: {
    fontSize: 14,
    color: "#0F172A",
  },
});
