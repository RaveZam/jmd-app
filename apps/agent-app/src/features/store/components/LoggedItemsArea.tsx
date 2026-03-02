import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { LoggedItem } from "../hooks/useDistributionLog";

export type LoggedItemsAreaProps = {
  items: LoggedItem[];
  onRemoveItem?: (index: number) => void;
};

export function LoggedItemsArea({ items, onRemoveItem }: LoggedItemsAreaProps) {
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const totalBoQty = items.reduce((s, i) => s + i.boQty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <View style={styles.area}>
      {items.length === 0 ? (
        <Text style={styles.placeholder}>
          No items logged yet. Select a product and tap Log.
        </Text>
      ) : (
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.headerCell, styles.colProduct]}>
              Product
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.colQty]}>
              Qty
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.colBoQty]}>
              BO Qty
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.colPrice]}>
              Price
            </Text>
            <View style={styles.colRemove} />
          </View>
          {items.map((item, index) => (
            <View key={`${item.productId}-${index}`} style={styles.dataRow}>
              <Text style={[styles.cell, styles.colProduct]} numberOfLines={1}>
                {item.productName}
              </Text>
              <Text style={[styles.cell, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.cell, styles.colBoQty]}>{item.boQty}</Text>
              <Text style={[styles.cell, styles.colPrice]}>
                ₱{item.price * item.qty}
              </Text>
              <View style={styles.colRemove}>
                <TouchableOpacity
                  onPress={() => onRemoveItem?.(index)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={22} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={[styles.cell, styles.totalLabel, styles.colProduct]}>
              Total
            </Text>
            <Text style={[styles.cell, styles.totalCell, styles.colQty]}>
              {totalQty}
            </Text>
            <Text style={[styles.cell, styles.totalCell, styles.colBoQty]}>
              {totalBoQty}
            </Text>
            <Text style={[styles.cell, styles.totalCell, styles.colPrice]}>
              ₱{totalPrice}
            </Text>
            <View style={styles.colRemove} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    minHeight: 120,
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  placeholder: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  table: {},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C8E6C9",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cell: {
    fontSize: 14,
    color: "#0F172A",
  },
  headerCell: {
    fontWeight: "600",
    color: "#1B5E20",
  },
  totalLabel: {
    fontWeight: "700",
    color: "#0F172A",
  },
  totalCell: {
    fontWeight: "600",
    color: "#0F172A",
  },
  colProduct: {
    flex: 2,
  },
  colQty: {
    width: 44,
    textAlign: "center",
  },
  colBoQty: {
    width: 52,
    textAlign: "center",
  },
  colPrice: {
    width: 56,
    textAlign: "right",
  },
  colRemove: {
    width: 32,
    alignItems: "flex-end",
  },
});
