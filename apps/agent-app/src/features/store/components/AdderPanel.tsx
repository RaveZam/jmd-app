import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PickerModal } from "./PickerModal";
import type { AdderPanelProps, Product } from "../types/store-types";

const HEADER_BG = "#0b4c29";
const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";

export function AdderPanel({ products, showPrice, onAdd }: AdderPanelProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<Product>(products[0]);
  const [qty, setQty] = useState(1);

  return (
    <View style={styles.adderPanel}>
      <TouchableOpacity
        style={styles.adderDropdown}
        onPress={() => setPickerOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.adderDropdownText} numberOfLines={1}>
          {selected
            ? `${selected.name}${showPrice ? `  —  ₱${selected.price}` : ""}`
            : "Select product"}
        </Text>
        <Ionicons name="chevron-down" size={15} color="#64748B" />
      </TouchableOpacity>

      <View style={styles.adderRow}>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => setQty(Math.max(1, qty - 1))}
          >
            <Text style={styles.stepperBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{qty}</Text>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => setQty(qty + 1)}
          >
            <Text style={styles.stepperBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.adderAddBtn}
          activeOpacity={0.8}
          onPress={() => {
            if (selected) {
              onAdd(selected.id, qty);
              setQty(1);
            }
          }}
        >
          <Text style={styles.adderAddBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <PickerModal
        visible={pickerOpen}
        products={products}
        showPrice={showPrice}
        onSelect={setSelected}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  adderPanel: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    gap: 10,
  },
  adderDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  adderDropdownText: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    marginRight: 8,
  },
  adderRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  adderAddBtn: {
    flex: 1,
    backgroundColor: HEADER_BG,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  adderAddBtnText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  stepperBtn: { width: 24, alignItems: "center" },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#475569",
    lineHeight: 22,
  },
  stepperValue: {
    width: 28,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
});
