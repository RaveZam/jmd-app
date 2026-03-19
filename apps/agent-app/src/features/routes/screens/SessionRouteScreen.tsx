import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { EndRouteModal } from "../components/session-route-components/EndRouteModal";
import useSessionRoute, {
  SessionStore,
} from "../hooks/session_hooks/useSessionRoute";
import RouteSessionsDao from "@/lib/sqlite/dao/route-sessions-dao";

function StoreConnector() {
  return (
    <View style={styles.connectorWrapper}>
      <View style={styles.connectorLine} />
    </View>
  );
}

function SessionStoreItem({
  store,
  index,
  onPress,
}: {
  store: SessionStore;
  index: number;
  onPress: () => void;
}) {
  const visited = store.visited === 1;
  return (
    <TouchableOpacity
      style={[
        styles.storeCard,
        visited ? styles.storeCardVisited : styles.storeCardPending,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {visited ? (
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={13} color="#FFFFFF" />
        </View>
      ) : (
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
      )}
      <View style={styles.storeInfo}>
        <Text
          style={[styles.storeName, visited && styles.storeNameVisited]}
          numberOfLines={1}
        >
          {store.store_name}
        </Text>
        {(store.store_barangay || store.store_city) || store.store_contact_name ? (
          <View style={styles.storeMeta}>
            {store.store_barangay || store.store_city ? (
              <View style={styles.storeMetaRow}>
                <Ionicons
                  name="location-outline"
                  size={11}
                  color={visited ? "#4ADE80" : "#94A3B8"}
                />
                <Text
                  style={[
                    styles.storeMetaText,
                    visited && styles.storeMetaTextVisited,
                  ]}
                  numberOfLines={1}
                >
                  {[store.store_barangay, store.store_city].filter(Boolean).join(", ")}
                </Text>
              </View>
            ) : null}
            {store.store_contact_name ? (
              <View style={styles.storeMetaRow}>
                <Ionicons
                  name="person-outline"
                  size={11}
                  color={visited ? "#4ADE80" : "#94A3B8"}
                />
                <Text
                  style={[
                    styles.storeMetaText,
                    visited && styles.storeMetaTextVisited,
                  ]}
                  numberOfLines={1}
                >
                  {store.store_contact_name}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
      <View
        style={[
          styles.statusBadge,
          visited ? styles.statusBadgeVisited : styles.statusBadgePending,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            visited ? styles.statusTextVisited : styles.statusTextPending,
          ]}
        >
          {visited ? "Visited" : "Pending"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SessionRouteScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    routeId?: string;
    routeName?: string;
    sessionId?: string;
  }>();

  const routeName =
    typeof params.routeName === "string" ? params.routeName : "Route";
  const sessionId =
    typeof params.sessionId === "string" ? params.sessionId : "";

  const { session, sessionStores, visitedCount, totalCount } =
    useSessionRoute(sessionId);
  const progress = totalCount > 0 ? visitedCount / totalCount : 0;
  const progressPct = Math.round(progress * 100);

  const [showEndModal, setShowEndModal] = useState(false);

  // Global index map so numbering is continuous across province sections
  const storeIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    sessionStores.forEach((s, i) => map.set(s.id, i + 1));
    return map;
  }, [sessionStores]);

  // Group stores by province, preserving insertion order
  const sections = useMemo(() => {
    const grouped = new Map<string, typeof sessionStores>();
    sessionStores.forEach((store) => {
      const key = store.province_name ?? "Unknown";
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(store);
    });
    return Array.from(grouped.entries()).map(([title, data]) => ({
      title,
      data,
    }));
  }, [sessionStores]);

  const handleEndConfirm = () => {
    if (sessionId) RouteSessionsDao.complete(sessionId);
    setShowEndModal(false);
    router.push("/main/routes");
  };

  const formattedDate = session?.session_date
    ? new Date(session.session_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerLabel}>TODAY'S SESSION</Text>
            <View style={styles.stopsBadge}>
              <Text style={styles.stopsBadgeText}>{totalCount} stops</Text>
            </View>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {routeName}
          </Text>
          <View style={styles.headerMeta}>
            {formattedDate ? (
              <>
                <View style={styles.metaDot} />
                <Text style={styles.headerMetaText}>{formattedDate}</Text>
                <Text style={styles.headerMetaSep}>{"  •  "}</Text>
              </>
            ) : null}
            <Text style={styles.headerMetaText}>
              {visitedCount} of {totalCount} done
            </Text>
          </View>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressPct}>{progressPct}% completed</Text>
          </View>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={StoreConnector}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Ionicons name="map-outline" size={12} color="#64748B" />
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
          renderItem={({ item }) => (
            <SessionStoreItem
              store={item}
              index={(storeIndexMap.get(item.id) ?? 1) - 1}
              onPress={() =>
                router.push({
                  pathname: "/main/routes/store/[storeId]",
                  params: {
                    storeId: item.store_id,
                    storeName: item.store_name,
                    storeProvince: item.store_province ?? "",
                    storeCity: item.store_city ?? "",
                    storeBarangay: item.store_barangay ?? "",
                    contactName: item.store_contact_name ?? "",
                    provinceName: item.province_name ?? "",
                    sessionStoreId: item.id,
                  },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No stores in this session.</Text>
            </View>
          }
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.endRouteButton}
            activeOpacity={0.7}
            onPress={() => setShowEndModal(true)}
          >
            <Ionicons name="stop-circle-outline" size={17} color="#DC2626" />
            <Text style={styles.endRouteButtonText}>End Route</Text>
          </TouchableOpacity>
        </View>

        <EndRouteModal
          visible={showEndModal}
          onConfirm={handleEndConfirm}
          onCancel={() => setShowEndModal(false)}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b4c29",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0EB",
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    backgroundColor: "#0b4c29",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#86EFAC",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  stopsBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  stopsBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ADE80",
    marginRight: 6,
  },
  headerMetaText: {
    fontSize: 13,
    color: "#BBF7D0",
    fontWeight: "500",
  },
  headerMetaSep: {
    fontSize: 13,
    color: "#4ADE80",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ADE80",
    borderRadius: 3,
  },
  progressPct: {
    fontSize: 12,
    color: "#BBF7D0",
    fontWeight: "500",
    minWidth: 80,
    textAlign: "right",
  },

  // ── List ──────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // ── Section Header ────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    flex: 1,
  },
  sectionFooter: {
    height: 4,
  },

  // ── Connector ─────────────────────────────────────────────
  connectorWrapper: {
    alignItems: "center",
    paddingLeft: 20,
  },
  connectorLine: {
    width: 1.5,
    height: 10,
    backgroundColor: "#CBD5E1",
  },

  // ── Store Card ────────────────────────────────────────────
  storeCard: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  storeCardVisited: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  storeCardPending: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  numberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  storeNameVisited: {
    color: "#166534",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  statusBadgeVisited: {
    backgroundColor: "#16A34A",
    borderColor: "#15803D",
  },
  statusBadgePending: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextVisited: {
    color: "#FFFFFF",
  },
  statusTextPending: {
    color: "#94A3B8",
  },

  // ── Empty ─────────────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
  },

  // ── Footer ────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  endRouteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#991B1B",
  },
  endRouteButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  // ── Store Meta ────────────────────────────────────────────
  storeMeta: {
    marginTop: 4,
    gap: 2,
  },
  storeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  storeMetaText: {
    fontSize: 11,
    color: "#94A3B8",
    flex: 1,
  },
  storeMetaTextVisited: {
    color: "#4ADE80",
  },
});
