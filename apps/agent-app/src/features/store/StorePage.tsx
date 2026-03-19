import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStorePage } from "./hooks/useStorePage";
import { AdderPanel } from "./components/AdderPanel";
import { SoldOrderRow } from "./components/SoldOrderRow";
import { BadOrderRow } from "./components/BadOrderRow";
import { SectionRow } from "./components/SectionRow";

const HEADER_BG = "#0b4c29";
const BODY_BG = "#F0F0EB";
const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";

export default function StorePage() {
  const insets = useSafeAreaInsets();
  const {
    storeName,
    location,
    products,
    logItem,
    updateItemQty,
    removeItem,
    soldItems,
    badItems,
    summary,
    showSoldAdder,
    setShowSoldAdder,
    showBadAdder,
    setShowBadAdder,
  } = useStorePage();

  if (!storeName) return null;

  const { grossSales, boDeduction, netTotal } = summary;

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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: HEADER_BG },

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

  scroll: { flex: 1, backgroundColor: BODY_BG },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 16 },

  section: { gap: 8 },
  itemList: { gap: 6 },

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

  confirmBtn: {
    backgroundColor: HEADER_BG,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmBtnText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
});
