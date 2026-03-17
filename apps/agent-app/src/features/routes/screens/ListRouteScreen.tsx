import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { AddProvinceModal } from "../components/create-route-components/addProvinceModal";
import { AddStoreModal } from "../components/create-route-components/addStoreModal";
import { Header } from "@/components/ui/header";
import ProvincesDao from "@/lib/sqlite/dao/province-dao";
import StoresDao from "@/lib/sqlite/dao/store-dao";

type ProvinceRow = { id: string; name: string; route_id: string };
type StoreRow = {
  id: string;
  name: string;
  province_id: string;
  address: string;
  contact_number: string;
  contact_name: string;
};

export default function ListRouteScreen() {
  const params = useLocalSearchParams<{
    routeId?: string;
    routeName?: string;
  }>();
  const routeId =
    typeof params.routeId === "string" ? params.routeId : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [showAddProvince, setShowAddProvince] = useState(false);
  const [addStoreForProvince, setAddStoreForProvince] =
    useState<ProvinceRow | null>(null);

  const [provinces, setProvinces] = useState<ProvinceRow[]>([]);
  const [storesByProvince, setStoresByProvince] = useState<
    Record<string, StoreRow[]>
  >({});

  const loadProvinces = useCallback(() => {
    if (!routeId) return;
    const loaded = ProvincesDao.getProvincesForRoute(routeId);
    setProvinces(loaded);
    const map: Record<string, StoreRow[]> = {};
    for (const p of loaded) {
      map[p.id] = StoresDao.getStoresForProvince(p.id);
    }
    setStoresByProvince(map);
  }, [routeId]);

  const loadStoresForProvince = useCallback((provinceId: string) => {
    setStoresByProvince((prev) => ({
      ...prev,
      [provinceId]: StoresDao.getStoresForProvince(provinceId),
    }));
  }, []);

  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <ThemedView style={styles.container}>
        <Header
          title={params?.routeName ?? "Route"}
          onBack={() => router.push("/main/routes")}
          rightElement={
            <TouchableOpacity
              onPress={() => setIsEditing((v) => !v)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.editButton}>
                {isEditing ? "Done" : "Edit"}
              </Text>
            </TouchableOpacity>
          }
        />

        <View style={styles.content}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search-outline" size={16} color="#94A3B8" />
            <TextInput
              placeholder="Search Store..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
            <View style={styles.filterDivider} />
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="options-outline" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {provinces.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons
                  name="location-outline"
                  size={32}
                  color="#CBD5E1"
                />
                <Text style={styles.emptyStateText}>
                  No provinces yet.{"\n"}Add one below to get started.
                </Text>
              </View>
            )}

            {provinces.length > 0 && provinces.map((province) => {
                  const stores = storesByProvince[province.id] ?? [];
                  return (
                    <View key={province.id} style={styles.provincePanel}>
                      {/* Province header row */}
                      <View style={styles.provinceHeader}>
                        <Text style={styles.provinceName}>{province.name}</Text>
                        {isEditing && (
                          <TouchableOpacity
                            style={styles.addStoreButton}
                            activeOpacity={0.7}
                            onPress={() => setAddStoreForProvince(province)}
                          >
                            <Ionicons name="add" size={14} color="#1b6e40" />
                            <Text style={styles.addStoreButtonText}>
                              Add Store
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Store list */}
                      {stores.length === 0 ? (
                        <Text style={styles.noStoresText}>
                          No stores added yet
                        </Text>
                      ) : (
                        <View style={styles.storeList}>
                          {stores.map((store, index) => (
                            <View key={store.id}>
                              {index > 0 && (
                                <View style={styles.storeDivider} />
                              )}
                              <TouchableOpacity
                                style={styles.storeRow}
                                activeOpacity={0.7}
                                onPress={() =>
                                  router.push({
                                    pathname: "/main/routes/store/[storeId]",
                                    params: { storeId: store.id },
                                  })
                                }
                              >
                                <View style={styles.storeInfo}>
                                  <Text style={styles.storeName}>
                                    {store.name}
                                  </Text>
                                  {store.address ? (
                                    <Text style={styles.storeAddress}>
                                      {store.address}
                                    </Text>
                                  ) : null}
                                </View>
                                <Ionicons
                                  name="chevron-forward"
                                  size={16}
                                  color="#CBD5E1"
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
          </ScrollView>
        </View>

        <View style={styles.startRouteBar}>
          {isEditing && (
            <TouchableOpacity
              style={styles.addProvinceButton}
              activeOpacity={0.8}
              onPress={() => setShowAddProvince(true)}
            >
              <Ionicons name="location-outline" size={18} color="#1b6e40" />
              <Text style={styles.addProvinceButtonText}>
                Add Province/Municipality
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.startRouteButton}
            activeOpacity={0.85}
            onPress={() => {
              // TODO: Start route / begin expedition
            }}
          >
            <LinearGradient
              colors={["#1b6e40", "#0b4c29"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startRouteButtonGradient}
            >
              <Ionicons name="navigate" size={22} color="#FFFFFF" />
              <Text style={styles.startRouteButtonText}>Start Route</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {showAddProvince && routeId && (
          <AddProvinceModal
            routeId={routeId}
            onClose={() => setShowAddProvince(false)}
            onAdded={() => {
              setShowAddProvince(false);
              loadProvinces();
            }}
          />
        )}

        {addStoreForProvince && (
          <AddStoreModal
            provinceId={addStoreForProvince.id}
            provinceName={addStoreForProvince.name}
            onClose={() => setAddStoreForProvince(null)}
            onAdded={() => {
              setAddStoreForProvince(null);
              loadStoresForProvince(addStoreForProvince.id);
            }}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F0EB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0EB",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  searchInputWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
  },
  filterDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#E2E8F0",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 24,
  },
  editButton: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    padding: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
  },
  // Province panel card
  provincePanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  provinceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  provinceName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  addStoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1b6e40",
  },
  addStoreButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1b6e40",
  },
  noStoresText: {
    fontSize: 13,
    color: "#94A3B8",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  storeList: {
    paddingHorizontal: 14,
  },
  storeDivider: {
    height: 1,
    backgroundColor: "#F0F0EB",
  },
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  storeInfo: {
    flex: 1,
    gap: 2,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  storeAddress: {
    fontSize: 12,
    color: "#64748B",
  },
  // Bottom bar
  startRouteBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 12,
  },
  addProvinceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#1b6e40",
    backgroundColor: "#FFFFFF",
  },
  addProvinceButtonText: {
    color: "#1b6e40",
    fontSize: 15,
    fontWeight: "600",
  },
  startRouteButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  startRouteButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  startRouteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
