import { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Animated,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { ThemedView } from "@/components/ThemedView";
import { AddProvinceModal } from "../components/create-route-components/addProvinceModal";
import { AddStoreModal } from "../components/create-route-components/addStoreModal";
import { Header } from "@/components/ui/header";
import ProvincesDao from "@/lib/sqlite/dao/province-dao";
import StoresDao from "@/lib/sqlite/dao/store-dao";
import RoutesDao from "@/lib/sqlite/dao/routes-dao";

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
  const [routeName, setRouteName] = useState(params.routeName ?? "Route");
  const [isEditingName, setIsEditingName] = useState(false);
  const [routeNameDraft, setRouteNameDraft] = useState(params.routeName ?? "Route");
  const [showAddProvince, setShowAddProvince] = useState(false);
  const [addStoreForProvince, setAddStoreForProvince] =
    useState<ProvinceRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<StoreRow | null>(null);
  const [pendingDeleteProvince, setPendingDeleteProvince] = useState<ProvinceRow | null>(null);
  const [viewStore, setViewStore] = useState<StoreRow | null>(null);
  const [editStore, setEditStore] = useState<{ store: StoreRow; province: ProvinceRow } | null>(null);
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

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

  const handleSaveRouteName = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const trimmed = e.nativeEvent.text.trim();
    if (trimmed && routeId) {
      const dao = new RoutesDao();
      dao.renameRoute(routeId, trimmed);
      setRouteName(trimmed);
      setRouteNameDraft(trimmed);
    } else {
      setRouteNameDraft(routeName);
    }
    setIsEditingName(false);
  };

  const handleDeleteProvinceConfirm = () => {
    if (!pendingDeleteProvince) return;
    ProvincesDao.deleteProvince(pendingDeleteProvince.id);
    setPendingDeleteProvince(null);
    loadProvinces();
  };

  const handleDeleteStoreConfirm = () => {
    if (!pendingDelete) return;
    StoresDao.deleteStore(pendingDelete.id);
    setPendingDelete(null);
    loadStoresForProvince(pendingDelete.province_id);
  };

  const handleDeleteStoreCancel = () => {
    if (pendingDelete) {
      swipeableRefs.current[pendingDelete.id]?.close();
    }
    setPendingDelete(null);
  };

  const renderStoreRightActions = (
    store: StoreRow,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    const opacity = progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
      extrapolate: "clamp",
    });
    return (
      <Animated.View style={[styles.deleteAction, { opacity }]}>
        <TouchableOpacity
          style={styles.deleteActionInner}
          activeOpacity={0.8}
          onPress={() => setPendingDelete(store)}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.deleteActionText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <ThemedView style={styles.container}>
        <Header
          title={routeName}
          onBack={() => router.push("/main/routes")}
          titleElement={
            isEditing ? (
              isEditingName ? (
                <TextInput
                  value={routeNameDraft}
                  onChangeText={setRouteNameDraft}
                  onEndEditing={handleSaveRouteName}
                  autoFocus
                  selectTextOnFocus
                  style={styles.routeNameInput}
                  returnKeyType="done"
                />
              ) : (
                <TouchableOpacity
                  style={styles.routeNameTouchable}
                  activeOpacity={0.7}
                  onPress={() => {
                    setRouteNameDraft(routeName);
                    setIsEditingName(true);
                  }}
                >
                  <Text style={styles.routeNameEditable} numberOfLines={1}>
                    {routeName}
                  </Text>
                  <Ionicons name="pencil-outline" size={13} color="#FFFFFF" />
                </TouchableOpacity>
              )
            ) : undefined
          }
          rightElement={
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  Object.values(swipeableRefs.current).forEach((ref) => ref?.close());
                  setIsEditingName(false);
                }
                setIsEditing((v) => !v);
              }}
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
                          <View style={styles.provinceHeaderActions}>
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
                            <TouchableOpacity
                              style={styles.deleteProvinceButton}
                              activeOpacity={0.7}
                              onPress={() => setPendingDeleteProvince(province)}
                            >
                              <Ionicons name="trash-outline" size={15} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
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
                              <Swipeable
                                ref={(ref) => { swipeableRefs.current[store.id] = ref; }}
                                enabled={isEditing}
                                renderRightActions={isEditing ? (progress) => renderStoreRightActions(store, progress) : undefined}
                                rightThreshold={60}
                                overshootRight={false}
                              >
                                <TouchableOpacity
                                  style={styles.storeRow}
                                  activeOpacity={0.7}
                                  onPress={() => {
                                    if (isEditing) {
                                      setEditStore({ store, province });
                                    } else {
                                      setViewStore(store);
                                    }
                                  }}
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
                              </Swipeable>
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

        {editStore && (
          <AddStoreModal
            provinceId={editStore.province.id}
            provinceName={editStore.province.name}
            initialStore={editStore.store}
            onClose={() => setEditStore(null)}
            onAdded={() => {}}
            onUpdated={() => {
              loadStoresForProvince(editStore.province.id);
              setEditStore(null);
            }}
          />
        )}

        <Modal
          visible={!!viewStore}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setViewStore(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.storeDetailIconWrap}>
                <Ionicons name="storefront-outline" size={26} color="#1b6e40" />
              </View>
              <Text style={styles.modalTitle}>{viewStore?.name}</Text>

              <View style={styles.storeDetailFields}>
                {viewStore?.address ? (
                  <View style={styles.storeDetailRow}>
                    <Ionicons name="location-outline" size={15} color="#64748B" />
                    <Text style={styles.storeDetailText}>{viewStore.address}</Text>
                  </View>
                ) : null}
                {viewStore?.contact_name ? (
                  <View style={styles.storeDetailRow}>
                    <Ionicons name="person-outline" size={15} color="#64748B" />
                    <Text style={styles.storeDetailText}>{viewStore.contact_name}</Text>
                  </View>
                ) : null}
                {viewStore?.contact_number ? (
                  <View style={styles.storeDetailRow}>
                    <Ionicons name="call-outline" size={15} color="#64748B" />
                    <Text style={styles.storeDetailText}>{viewStore.contact_number}</Text>
                  </View>
                ) : null}
                {!viewStore?.address && !viewStore?.contact_name && !viewStore?.contact_number && (
                  <Text style={styles.storeDetailEmpty}>No additional details.</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setViewStore(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={!!pendingDeleteProvince}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setPendingDeleteProvince(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="trash-outline" size={28} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>Delete Province</Text>
              <Text style={styles.modalBody}>
                Are you sure you want to delete{" "}
                <Text style={styles.modalStoreName}>{pendingDeleteProvince?.name}</Text>?{"\n"}
                All stores in this province will also be removed.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setPendingDeleteProvince(null)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteProvinceConfirm}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={!!pendingDelete}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={handleDeleteStoreCancel}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="trash-outline" size={28} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>Delete Store</Text>
              <Text style={styles.modalBody}>
                Are you sure you want to delete{" "}
                <Text style={styles.modalStoreName}>{pendingDelete?.name}</Text>?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleDeleteStoreCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteStoreConfirm}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  routeNameTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  routeNameEditable: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textDecorationLine: "underline",
    textDecorationColor: "rgba(255,255,255,0.6)",
    flexShrink: 1,
  },
  routeNameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255,255,255,0.7)",
    paddingVertical: 2,
    paddingHorizontal: 4,
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
  provinceHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteProvinceButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
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
  // Store detail view modal
  storeDetailIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  storeDetailFields: {
    width: "100%",
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  storeDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  storeDetailText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  storeDetailEmpty: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },
  closeButton: {
    width: "100%",
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  // Swipe delete
  deleteAction: {
    width: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteActionInner: {
    flex: 1,
    width: "100%",
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  deleteActionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  // Delete modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalBody: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
  modalStoreName: {
    fontWeight: "700",
    color: "#0F172A",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  deleteButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
