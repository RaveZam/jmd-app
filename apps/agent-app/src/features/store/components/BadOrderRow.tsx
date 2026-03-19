import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BadRowProps } from "../types/store-types";

const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";

export function BadOrderRow({ item, index, onDelete }: BadRowProps) {
  return (
    <View style={styles.orderCard}>
      <Text style={[styles.orderCardName, styles.flex1]} numberOfLines={1}>
        {item.productName}
      </Text>
      <View style={styles.damagedBadge}>
        <Text style={styles.damagedBadgeText}>{item.boReason ?? "Bad order"}</Text>
      </View>
      <Text style={styles.boQtyText}>−{item.boQty}</Text>
      <TouchableOpacity
        onPress={() => onDelete(index)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={16} color="#FCA5A5" />
      </TouchableOpacity>
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
  orderCardName: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  flex1: { flex: 1 },
  damagedBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  damagedBadgeText: { fontSize: 11, fontWeight: "600", color: "#EF4444" },
  boQtyText: { fontSize: 14, fontWeight: "600", color: "#EF4444" },
});
