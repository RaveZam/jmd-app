import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SoldRowProps } from "../types/store-types";

const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";

export function SoldOrderRow({ item, index, onUpdateQty, onDelete }: SoldRowProps) {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderCardInfo}>
        <Text style={styles.orderCardName} numberOfLines={1}>
          {item.productName}
        </Text>
        <Text style={styles.orderCardSub}>₱{item.price} / pack</Text>
      </View>
      <View style={styles.orderCardControls}>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => onUpdateQty(index, -1)}
          >
            <Text style={styles.stepperBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{item.qty}</Text>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => onUpdateQty(index, 1)}
          >
            <Text style={styles.stepperBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orderCardPrice}>₱{item.qty * item.price}</Text>
        <TouchableOpacity
          onPress={() => onDelete(index)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={16} color="#FCA5A5" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  orderCardInfo: { flex: 1 },
  orderCardName: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  orderCardSub: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  orderCardControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderCardPrice: {
    width: 56,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
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
