import { useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useDistributionLog,
  type LoggedItem,
} from "./hooks/useDistributionLog";
import type { Product } from "./mock/products";
import { ProductsDao } from "@/lib/sqlite/dao/products-dao";

// ── Shared product picker modal ────────────────────────────

type PickerModalProps = {
  visible: boolean;
  products: Product[];
  showPrice: boolean;
  onSelect: (product: Product) => void;
  onClose: () => void;
};
function PickerModal({
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

// ── Inline adder panel (sold or bad orders) ────────────────

type AdderPanelProps = {
  products: Product[];
  showPrice: boolean;
  onAdd: (productId: string, qty: number) => void;
};
function AdderPanel({ products, showPrice, onAdd }: AdderPanelProps) {
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

// ── Sold order row ─────────────────────────────────────────

type SoldRowProps = {
  item: LoggedItem;
  index: number;
  onUpdateQty: (i: number, d: number) => void;
  onDelete: (i: number) => void;
};
function SoldOrderRow({ item, index, onUpdateQty, onDelete }: SoldRowProps) {
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

// ── Bad order row ──────────────────────────────────────────

type BadRowProps = {
  item: LoggedItem;
  index: number;
  onDelete: (i: number) => void;
};
function BadOrderRow({ item, index, onDelete }: BadRowProps) {
  return (
    <View style={styles.orderCard}>
      <Text style={[styles.orderCardName, styles.flex1]} numberOfLines={1}>
        {item.productName}
      </Text>
      <View style={styles.damagedBadge}>
        <Text style={styles.damagedBadgeText}>damaged</Text>
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

// ── Section row header ─────────────────────────────────────

type SectionRowProps = {
  label: string;
  buttonLabel: string;
  onToggle: () => void;
};
function SectionRow({ label, buttonLabel, onToggle }: SectionRowProps) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.sectionBtn}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionBtnText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main StorePage ─────────────────────────────────────────

export default function StorePage() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    storeId?: string;
    storeName?: string;
    storeAddress?: string;
    contactName?: string;
    provinceName?: string;
    sessionStoreId?: string;
  }>();

  const storeName =
    typeof params.storeName === "string" ? params.storeName : null;
  const storeAddress =
    typeof params.storeAddress === "string" ? params.storeAddress : "";
  const provinceName =
    typeof params.provinceName === "string" ? params.provinceName : "";
  const location = provinceName
    ? `${provinceName}  •  ${storeAddress}`
    : storeAddress;

  const products = useMemo(() => ProductsDao.getAllProducts(), []);

  const { loggedItems, logItem, updateItemQty, removeItem } =
    useDistributionLog(products);

  const [showSoldAdder, setShowSoldAdder] = useState(false);
  const [showBadAdder, setShowBadAdder] = useState(false);

  if (!storeName) return null;

  // Map items with their original index for correct stepper/delete targeting
  const soldItems = loggedItems
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.qty > 0);
  const badItems = loggedItems
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.boQty > 0);

  const grossSales = loggedItems.reduce((s, i) => s + i.qty * i.price, 0);
  const boDeduction = loggedItems.reduce((s, i) => s + i.boQty * i.price, 0);
  const netTotal = grossSales - boDeduction;

  return (
    <SafeAreaView
      style={[styles.safeArea, { paddingTop: insets.top }]}
      edges={["left", "right", "bottom"]}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 12 : 16 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerStoreName} numberOfLines={1}>
              {storeName}
            </Text>
            {!!location && (
              <Text style={styles.headerLocation} numberOfLines={1}>
                {location}
              </Text>
            )}
          </View>
          <View style={styles.inProgressBadge}>
            <Text style={styles.inProgressText}>In progress</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Sold Orders ── */}
        <View style={styles.section}>
          <SectionRow
            label="SOLD ORDERS"
            buttonLabel="+ Add Sale"
            onToggle={() => {
              setShowSoldAdder((v) => !v);
              setShowBadAdder(false);
            }}
          />
          {showSoldAdder && (
            <AdderPanel
              products={products}
              showPrice
              onAdd={(productId, qty) => {
                logItem(productId, qty, 0);
                setShowSoldAdder(false);
              }}
            />
          )}
          {soldItems.length > 0 ? (
            <View style={styles.itemList}>
              {soldItems.map(({ item, idx }) => (
                <SoldOrderRow
                  key={idx}
                  item={item}
                  index={idx}
                  onUpdateQty={updateItemQty}
                  onDelete={removeItem}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No sold orders yet.</Text>
            </View>
          )}
        </View>

        {/* ── Bad Orders ── */}
        <View style={styles.section}>
          <SectionRow
            label="BAD ORDERS"
            buttonLabel="+ Add Bad Order"
            onToggle={() => {
              setShowBadAdder((v) => !v);
              setShowSoldAdder(false);
            }}
          />
          {showBadAdder && (
            <AdderPanel
              products={products}
              showPrice={false}
              onAdd={(productId, qty) => {
                logItem(productId, 0, qty);
                setShowBadAdder(false);
              }}
            />
          )}
          {badItems.length > 0 ? (
            <View style={styles.itemList}>
              {badItems.map(({ item, idx }) => (
                <BadOrderRow
                  key={idx}
                  item={item}
                  index={idx}
                  onDelete={removeItem}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No bad orders.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Sticky footer: summary + confirm ── */}
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Gross sales</Text>
          <Text style={styles.summaryValue}>
            ₱{grossSales.toLocaleString()}
          </Text>
        </View>
        {boDeduction > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Bad orders deduction</Text>
            <Text style={styles.summaryDeduction}>
              −₱{boDeduction.toLocaleString()}
            </Text>
          </View>
        )}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryNetLabel}>Net total</Text>
          <Text style={styles.summaryNetValue}>
            ₱{netTotal.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8}>
          <Text style={styles.confirmBtnText}>Confirm visit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const HEADER_BG = "#0b4c29";
const BODY_BG = "#F0F0EB";
const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: HEADER_BG },

  // ── Header ────────────────────────────────────────────────
  header: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { padding: 4 },
  headerInfo: { flex: 1 },
  headerStoreName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  headerLocation: { fontSize: 12, color: "#86EFAC", marginTop: 2 },
  inProgressBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.4)",
    backgroundColor: "rgba(74,222,128,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  inProgressText: { fontSize: 11, fontWeight: "600", color: "#4ADE80" },

  // ── Scroll ────────────────────────────────────────────────
  scroll: { flex: 1, backgroundColor: BODY_BG },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 16 },

  // ── Section ───────────────────────────────────────────────
  section: { gap: 8 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  sectionBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionBtnText: { fontSize: 12, fontWeight: "600", color: HEADER_BG },

  // ── Adder panel ───────────────────────────────────────────
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

  // ── Stepper ───────────────────────────────────────────────
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

  // ── Order cards ───────────────────────────────────────────
  itemList: { gap: 6 },
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
  flex1: { flex: 1 },

  // ── Bad order badge ────────────────────────────────────────
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

  // ── Empty state ───────────────────────────────────────────
  emptyCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
  },
  emptyText: { fontSize: 14, color: "#94A3B8" },

  // ── Sticky footer ─────────────────────────────────────────
  footer: {
    backgroundColor: CARD_BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: "#64748B" },
  summaryValue: { fontSize: 14, color: "#64748B" },
  summaryDeduction: { fontSize: 14, color: "#EF4444" },
  summaryDivider: { height: 1, backgroundColor: BORDER },
  summaryNetLabel: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  summaryNetValue: { fontSize: 15, fontWeight: "700", color: "#0F172A" },

  // ── Confirm button ────────────────────────────────────────
  confirmBtn: {
    backgroundColor: HEADER_BG,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmBtnText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },

  // ── Product picker modal ──────────────────────────────────
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
