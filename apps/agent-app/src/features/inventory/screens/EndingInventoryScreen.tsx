import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/src/shared/components/ThemedView";
import SessionInventoryDao from "@/src/lib/dao/session-inventory-dao";
import EndingInventoryDao from "@/src/lib/dao/ending-inventory-dao";

const HEADER_BG = "#0b4c29";

type CountRow = {
  productId: string;
  productName: string;
  morningQty: number;
  raw: string;
};

function parseCount(raw: string): number {
  const n = parseInt(raw, 10);
  return isNaN(n) || n < 0 ? 0 : n;
}

export default function EndingInventoryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ sessionId?: string; routeName?: string }>();
  const sessionId = typeof params.sessionId === "string" ? params.sessionId : "";
  const routeName = typeof params.routeName === "string" ? params.routeName : "Route";

  const [rows, setRows] = useState<CountRow[]>(() => {
    const morning = SessionInventoryDao.getBySessionId(sessionId);
    const existing = EndingInventoryDao.getBySessionId(sessionId);
    const existingMap: Record<string, number> = {};
    for (const e of existing) existingMap[e.productId] = e.quantity;
    return morning.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      morningQty: item.qty,
      raw: existingMap[item.productId] !== undefined
        ? String(existingMap[item.productId])
        : "",
    }));
  });

  function handleChange(productId: string, val: string) {
    const cleaned = val.replace(/[^0-9]/g, "");
    setRows((prev) =>
      prev.map((r) => {
        if (r.productId !== productId) return r;
        const count = parseCount(cleaned);
        EndingInventoryDao.upsert(sessionId, r.productId, r.productName, count);
        return { ...r, raw: cleaned };
      }),
    );
  }

  const totalCounted = rows.reduce((s, r) => s + parseCount(r.raw), 0);

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ animation: "slide_from_bottom" }} />
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerLabel}>ENDING INVENTORY</Text>
            </View>
            <Text style={styles.headerTitle} numberOfLines={1}>{routeName}</Text>
            <Text style={styles.headerSub}>Count remaining bread in the van</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillNum}>{totalCounted}</Text>
                <Text style={styles.summaryPillLabel}>pcs remaining</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillNum}>{rows.length}</Text>
                <Text style={styles.summaryPillLabel}>products</Text>
              </View>
            </View>
          </View>

          {/* Instruction strip */}
          <View style={styles.instructionStrip}>
            <Ionicons name="keypad-outline" size={14} color="#64748B" />
            <Text style={styles.instructionText}>
              Tap a count field and type the number of pieces remaining
            </Text>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {rows.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🥖</Text>
                <Text style={styles.emptyTitle}>No morning inventory found</Text>
                <Text style={styles.emptyDesc}>
                  There are no products to count for this session.
                </Text>
              </View>
            ) : (
              rows.map((row) => {
                const count = parseCount(row.raw);
                const variance = row.morningQty - count;
                const hasInput = row.raw.length > 0;
                const varSign = variance > 0 ? `-${variance}` : variance < 0 ? `+${Math.abs(variance)}` : "OK";
                const varColor =
                  variance === 0 ? "#16A34A" : Math.abs(variance) <= 2 ? "#B45309" : "#DC2626";
                const varBg =
                  variance === 0 ? "#DCFCE7" : Math.abs(variance) <= 2 ? "#FEF3C7" : "#FEE2E2";

                return (
                  <View key={row.productId} style={styles.card}>
                    <View style={styles.cardTop}>
                      <Text style={styles.cardProductName} numberOfLines={1}>
                        {row.productName}
                      </Text>
                      <View style={styles.morningBadge}>
                        <Text style={styles.morningBadgeText}>Loaded: {row.morningQty}</Text>
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <TextInput
                        style={styles.countInput}
                        value={row.raw}
                        onChangeText={(val) => handleChange(row.productId, val)}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor="#CBD5E1"
                        maxLength={4}
                        returnKeyType="done"
                        selectTextOnFocus
                      />
                      <Text style={styles.countUnit}>pcs</Text>
                    </View>

                    {hasInput && (
                      <View style={[styles.varianceChip, { backgroundColor: varBg }]}>
                        <Text style={[styles.varianceText, { color: varColor }]}>
                          {varSign === "OK" ? "✓ All accounted for" : `${varSign} vs morning load`}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>

          {rows.length > 0 && (
            <TouchableOpacity
              style={styles.doneBtn}
              activeOpacity={0.85}
              onPress={() => router.back()}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.doneBtnText}>Done — Save & Go Back</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F0EB" },
  container: { flex: 1, backgroundColor: "#F0F0EB" },

  header: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  backBtn: { marginLeft: -4 },
  headerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#86EFAC",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: "#BBF7D0",
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  summaryPill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  summaryPillNum: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  summaryPillLabel: {
    fontSize: 12,
    color: "#BBF7D0",
    fontWeight: "500",
  },

  instructionStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  instructionText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
  },

  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardProductName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
    marginRight: 10,
  },
  morningBadge: {
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  morningBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 8,
  },
  countInput: {
    fontSize: 56,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -2,
    textAlign: "center",
    minWidth: 120,
    borderBottomWidth: 2.5,
    borderBottomColor: "#0b4c29",
    paddingBottom: 2,
    includeFontPadding: false,
  },
  countUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },

  varianceChip: {
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignItems: "center",
  },
  varianceText: {
    fontSize: 13,
    fontWeight: "600",
  },

  doneBtn: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: "#0b4c29",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
