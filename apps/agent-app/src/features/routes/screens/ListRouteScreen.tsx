import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { ThemedView } from "@/components/ThemedView";
import { AddProvinceModal } from "../components/create-route-components/addProvinceModal";
import { AddStoreModal } from "../components/create-route-components/addStoreModal";
import { ViewStoreModal } from "../components/route-components/ViewStoreModal";
import { DeleteProvinceModal } from "../components/route-components/DeleteProvinceModal";
import { DeleteStoreModal } from "../components/route-components/DeleteStoreModal";
import { Header } from "@/components/ui/header";
import { useRouteEditing } from "../hooks/useRouteEditing";
import { useProvinces } from "../hooks/useProvinces";
import { useRouteModals } from "../hooks/useRouteModals";
import { StoreRow } from "../types/db-rows";
import { usePlanRoute } from "../hooks/session_hooks/usePlanRoute";

export default function ListRouteScreen() {
  const params = useLocalSearchParams<{
    routeId?: string;
    routeName?: string;
  }>();
  const routeId =
    typeof params.routeId === "string" ? params.routeId : undefined;

  const {
    isEditing,
    isEditingName,
    setIsEditingName,
    routeName,
    routeNameDraft,
    setRouteNameDraft,
    swipeableRefs,
    handleSaveRouteName,
    handleToggleEditing,
  } = useRouteEditing(routeId, params.routeName ?? "Route");

  const { createSession } = usePlanRoute(routeId ?? "", routeName);

  const {
    provinces,
    storesByProvince,
    loadProvinces,
    loadStoresForProvince,
    deleteProvince,
    deleteStore,
  } = useProvinces(routeId);

  const {
    showAddProvince,
    setShowAddProvince,
    addStoreForProvince,
    setAddStoreForProvince,
    pendingDelete,
    setPendingDelete,
    pendingDeleteProvince,
    setPendingDeleteProvince,
    viewStore,
    setViewStore,
    editStore,
    setEditStore,
  } = useRouteModals();

  const handleDeleteProvinceConfirm = () => {
    if (!pendingDeleteProvince) return;
    deleteProvince(pendingDeleteProvince.id);
    setPendingDeleteProvince(null);
  };

  const handleDeleteStoreConfirm = () => {
    if (!pendingDelete) return;
    deleteStore(pendingDelete);
    setPendingDelete(null);
  };

  const handleDeleteStoreCancel = () => {
    if (pendingDelete) swipeableRefs.current[pendingDelete.id]?.close();
    setPendingDelete(null);
  };

  const renderStoreRightActions = (
    store: StoreRow,
    progress: Animated.AnimatedInterpolation<number>,
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
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
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
              onPress={handleToggleEditing}
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
                <Ionicons name="location-outline" size={32} color="#CBD5E1" />
                <Text style={styles.emptyStateText}>
                  No provinces yet.{"\n"}Add one below to get started.
                </Text>
              </View>
            )}

            {provinces.length > 0 &&
              provinces.map((province) => {
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
                            <Ionicons
                              name="trash-outline"
                              size={15}
                              color="#EF4444"
                            />
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
                            {index > 0 && <View style={styles.storeDivider} />}
                            <Swipeable
                              ref={(ref) => {
                                swipeableRefs.current[store.id] = ref;
                              }}
                              enabled={isEditing}
                              renderRightActions={
                                isEditing
                                  ? (progress) =>
                                      renderStoreRightActions(store, progress)
                                  : undefined
                              }
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
                                  {(store.barangay || store.city) ? (
                                    <Text style={styles.storeAddress}>
                                      {[store.barangay, store.city].filter(Boolean).join(", ")}
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
            onPress={async () => {
              const newSessionId = await createSession();
              router.push({
                pathname: "/main/routes/session",
                params: { routeId, routeName, sessionId: newSessionId },
              });
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

        <ViewStoreModal store={viewStore} onClose={() => setViewStore(null)} />

        <DeleteProvinceModal
          province={pendingDeleteProvince}
          onConfirm={handleDeleteProvinceConfirm}
          onCancel={() => setPendingDeleteProvince(null)}
        />

        <DeleteStoreModal
          store={pendingDelete}
          onConfirm={handleDeleteStoreConfirm}
          onCancel={handleDeleteStoreCancel}
        />
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
});
