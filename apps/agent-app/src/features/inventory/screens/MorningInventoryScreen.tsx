import { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { ProductsDao } from "@/src/lib/dao/products-dao";
import { PickerModal } from "@/src/features/store/components/PickerModal";
import { useMorningInventory } from "@/src/features/store/hooks/useMorningInventory";
import type { Product } from "@/src/features/store/types/store-types";

const HEADER_BG = "#0b4c29";

export default function MorningInventoryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    routeId?: string;
    routeName?: string;
    sessionId?: string;
  }>();
  const routeId = typeof params.routeId === "string" ? params.routeId : "";
  const routeName =
    typeof params.routeName === "string" ? params.routeName : "Route";
  const sessionId =
    typeof params.sessionId === "string" ? params.sessionId : "";

  const products = useMemo<Product[]>(
    () =>
      ProductsDao.getAllProducts().map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
      })),
    [],
  );

  const { items, setItemQty, removeItem } = useMorningInventory(
    products,
    sessionId,
  );

  const [adderOpen, setAdderOpen] = useState(false);

  const goToRoute = () => {
    router.replace({
      pathname: "/main/routes/session",
      params: { routeId, routeName, sessionId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.headerLabel}>MORNING INVENTORY</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {routeName}
          </Text>
          <Text style={styles.headerSub}>
            Record the stock you loaded for today.
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => setAdderOpen(true)}
          >
            <Ionicons name="add-circle-outline" size={18} color="#1b6e40" />
            <Text style={styles.addBtnText}>Add Product</Text>
          </TouchableOpacity>

          {items.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No products loaded yet.</Text>
            </View>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.colHead, styles.colHeadProduct]}>
                  PRODUCT
                </Text>
                <Text style={[styles.colHead, styles.colHeadQty]}>QTY</Text>
                <View style={styles.colHeadDelete} />
              </View>
              {items.map((item) => (
                <View key={item.inventoryId} style={styles.row}>
                  <Text style={styles.rowProduct} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => setItemQty(item.productId, item.qty - 1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => setItemQty(item.productId, item.qty + 1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeItem(item.productId)}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={goToRoute}
          >
            <Text style={styles.continueBtnText}>Continue to Route</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <InventoryAdderModal
          visible={adderOpen}
          products={products}
          onClose={() => setAdderOpen(false)}
          onAdd={(productId, qty) => {
            setItemQty(productId, qty);
            setAdderOpen(false);
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

function InventoryAdderModal({
  visible,
  products,
  onClose,
  onAdd,
}: {
  visible: boolean;
  products: Product[];
  onClose: () => void;
  onAdd: (productId: string, qty: number) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<Product | undefined>(products[0]);
  const [qty, setQty] = useState(1);

  const canAdd = !!selected && qty > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sheetWrapper}>
        <KeyboardAvoidingView
          style={styles.sheet}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Add Product</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={8}
            >
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetBody}>
            <Text style={styles.fieldLabel}>Product</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setPickerOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownText} numberOfLines={1}>
                {selected?.name ?? "Select product"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.stepperWrap}>
              <Text style={styles.fieldLabel}>Quantity</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setQty((q) => Math.max(1, q - 1))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.stepValue}
                  keyboardType="number-pad"
                  value={String(qty)}
                  onChangeText={(v) => {
                    const n = parseInt(v, 10);
                    setQty(isNaN(n) || n < 1 ? 1 : n);
                  }}
                  selectTextOnFocus
                />
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setQty((q) => q + 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.confirmAdd, !canAdd && styles.confirmAddDisabled]}
              activeOpacity={0.85}
              disabled={!canAdd}
              onPress={() => {
                if (!selected) return;
                onAdd(selected.id, qty);
                setQty(1);
              }}
            >
              <Text style={styles.confirmAddText}>Add to Inventory</Text>
            </TouchableOpacity>
          </View>

          <PickerModal
            visible={pickerOpen}
            products={products}
            showPrice={false}
            onSelect={setSelected}
            onClose={() => setPickerOpen(false)}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: HEADER_BG },
  container: { flex: 1, backgroundColor: "#F0F0EB" },

  header: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#86EFAC",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 13, color: "#BBF7D0", marginTop: 6 },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#1b6e40",
    borderStyle: "dashed",
    backgroundColor: "#FFFFFF",
  },
  addBtnText: { fontSize: 14, fontWeight: "600", color: "#1b6e40" },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
  },
  emptyText: { fontSize: 14, color: "#94A3B8" },

  table: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F0",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  colHead: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  colHeadProduct: { flex: 1 },
  colHeadQty: { width: 132, textAlign: "center" },
  colHeadDelete: { width: 24 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 8,
  },
  rowProduct: { flex: 1, fontSize: 14, fontWeight: "600", color: "#0F172A" },
  qtyControls: {
    width: 132,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 18, color: "#475569", lineHeight: 22 },
  qtyValue: {
    minWidth: 28,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  deleteBtn: { width: 24, alignItems: "center" },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: HEADER_BG,
  },
  continueBtnText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },

  // ── Adder sheet ──
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: HEADER_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    elevation: 24,
  },
  handleWrap: { alignItems: "center", paddingTop: 10, paddingBottom: 4 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 18,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBody: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingBottom: 32,
    gap: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#0F172A" },
  stepperWrap: { alignItems: "center", gap: 10 },
  stepperRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: { fontSize: 22, color: "#475569", lineHeight: 28 },
  stepValue: {
    width: 60,
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 2,
  },
  confirmAdd: {
    backgroundColor: HEADER_BG,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  confirmAddDisabled: { opacity: 0.35 },
  confirmAddText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
});
