import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SoldRowProps } from "../types/store-types";

const BORDER = "#E2E8F0";

export function SoldOrderRow({ item, index, onUpdateQty, onDelete }: SoldRowProps) {
  return (
    <View style={styles.row}>
      {/* Product */}
      <View style={styles.colProduct}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.productName}
        </Text>
        <Text style={styles.productPrice}>₱{item.price} / pack</Text>
      </View>

      {/* Sold qty stepper */}
      <View style={styles.colSold}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onUpdateQty(index, -1)}
          hitSlop={6}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.soldQty}>{item.qty}</Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onUpdateQty(index, 1)}
          hitSlop={6}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* BO */}
      <View style={styles.colBo}>
        {item.boQty > 0 ? (
          <>
            <Text style={styles.boQty}>{item.boQty}</Text>
            <Text style={styles.boReason} numberOfLines={1}>
              {item.boReason ?? "bad order"}
            </Text>
          </>
        ) : (
          <Text style={styles.dash}>—</Text>
        )}
      </View>

      {/* Total */}
      <Text style={styles.colTotal}>₱{(item.qty * item.price).toLocaleString()}</Text>

      {/* Delete */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(index)}
        hitSlop={8}
      >
        <Ionicons name="close" size={13} color="#CBD5E1" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  colProduct: { flex: 1, marginRight: 8 },
  productName: { fontSize: 13, fontWeight: "600", color: "#0F172A" },
  productPrice: { fontSize: 11, color: "#94A3B8", marginTop: 2 },

  colSold: {
    width: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  stepBtn: { padding: 2 },
  stepBtnText: { fontSize: 16, color: "#64748B", lineHeight: 20 },
  soldQty: {
    width: 24,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  colBo: {
    width: 64,
    alignItems: "center",
  },
  boQty: { fontSize: 14, fontWeight: "700", color: "#F97316" },
  boReason: { fontSize: 10, color: "#94A3B8", marginTop: 1, textAlign: "center" },
  dash: { fontSize: 14, color: "#CBD5E1" },

  colTotal: {
    width: 68,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  deleteBtn: { marginLeft: 8 },
});
