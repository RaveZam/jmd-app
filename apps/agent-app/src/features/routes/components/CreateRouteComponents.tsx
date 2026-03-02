import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Switch,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";

type LocalStore = {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  visitedToday: boolean;
};

type LocalProvince = {
  id: string;
  name: string;
  stores: LocalStore[];
};

export function CreateRouteForm() {
  const [provinceName, setProvinceName] = useState("");
  const [provinces, setProvinces] = useState<LocalProvince[]>([]);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [storeProvinceId, setStoreProvinceId] = useState<string | null>(null);
  const [storeProvinceName, setStoreProvinceName] = useState<string | null>(
    null,
  );
  const [editingStoreRef, setEditingStoreRef] = useState<{
    provinceId: string;
    storeId: string;
  } | null>(null);
  const [editingProvinceId, setEditingProvinceId] = useState<string | null>(
    null,
  );
  const [editingProvinceName, setEditingProvinceName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeContactName, setStoreContactName] = useState("");
  const [storeContactPhone, setStoreContactPhone] = useState("");
  const [storeVisitedToday, setStoreVisitedToday] = useState(false);

  function handleAddProvince() {
    const trimmed = provinceName.trim();
    if (!trimmed) {
      return;
    }

    setProvinces((current) => [
      ...current,
      { id: `${Date.now()}-${current.length}`, name: trimmed, stores: [] },
    ]);
    setProvinceName("");
  }

  function openStoreModal(province: LocalProvince) {
    setStoreProvinceId(province.id);
    setStoreProvinceName(province.name);
    setEditingStoreRef(null);
    setStoreName("");
    setStoreAddress("");
    setStoreContactName("");
    setStoreContactPhone("");
    setStoreVisitedToday(false);
    setStoreModalVisible(true);
  }

  function closeStoreModal() {
    setStoreModalVisible(false);
    setStoreProvinceId(null);
    setStoreProvinceName(null);
    setEditingStoreRef(null);
  }

  function handleAddStoreToProvince() {
    if (!storeProvinceId) {
      return;
    }

    const trimmedName = storeName.trim();
    if (!trimmedName) {
      return;
    }

    if (editingStoreRef && editingStoreRef.provinceId === storeProvinceId) {
      setProvinces((current) =>
        current.map((province) =>
          province.id === storeProvinceId
            ? {
                ...province,
                stores: province.stores.map((store) =>
                  store.id === editingStoreRef.storeId
                    ? {
                        ...store,
                        name: trimmedName,
                        address: storeAddress.trim(),
                        contactName: storeContactName.trim(),
                        contactPhone: storeContactPhone.trim(),
                        visitedToday: storeVisitedToday,
                      }
                    : store,
                ),
              }
            : province,
        ),
      );
    } else {
      const newStore: LocalStore = {
        id: `${Date.now()}`,
        name: trimmedName,
        address: storeAddress.trim(),
        contactName: storeContactName.trim(),
        contactPhone: storeContactPhone.trim(),
        visitedToday: storeVisitedToday,
      };

      setProvinces((current) =>
        current.map((province) =>
          province.id === storeProvinceId
            ? { ...province, stores: [...province.stores, newStore] }
            : province,
        ),
      );
    }

    closeStoreModal();
  }

  function handleRemoveProvince(provinceId: string) {
    setProvinces((current) =>
      current.filter((province) => province.id !== provinceId),
    );
    if (editingProvinceId === provinceId) {
      setEditingProvinceId(null);
      setEditingProvinceName("");
    }
  }

  function handleRemoveStore(provinceId: string, storeId: string) {
    setProvinces((current) =>
      current.map((province) =>
        province.id === provinceId
          ? {
              ...province,
              stores: province.stores.filter((store) => store.id !== storeId),
            }
          : province,
      ),
    );
  }

  function startEditProvince(province: LocalProvince) {
    setEditingProvinceId(province.id);
    setEditingProvinceName(province.name);
  }

  function finishEditProvince() {
    if (!editingProvinceId) {
      return;
    }

    const trimmed = editingProvinceName.trim();
    if (!trimmed) {
      setEditingProvinceId(null);
      setEditingProvinceName("");
      return;
    }

    setProvinces((current) =>
      current.map((province) =>
        province.id === editingProvinceId ? { ...province, name: trimmed } : province,
      ),
    );

    setEditingProvinceId(null);
    setEditingProvinceName("");
  }

  function openEditStoreModal(province: LocalProvince, store: LocalStore) {
    setStoreProvinceId(province.id);
    setStoreProvinceName(province.name);
    setEditingStoreRef({ provinceId: province.id, storeId: store.id });
    setStoreName(store.name);
    setStoreAddress(store.address);
    setStoreContactName(store.contactName);
    setStoreContactPhone(store.contactPhone);
    setStoreVisitedToday(store.visitedToday);
    setStoreModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <ThemedText
        type="defaultSemiBold"
        style={styles.headerTitle}
        lightColor="#0F172A"
        darkColor="#0F172A"
      >
        Create Route
      </ThemedText>

      <View style={styles.divider} />

      <View style={styles.fieldRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Province</Text>
          <TextInput
            value={provinceName}
            onChangeText={setProvinceName}
            placeholder="Enter province name"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.9}
          onPress={handleAddProvince}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>#</Text>
          <Text style={[styles.tableHeaderText, styles.tableHeaderProvince]}>
            Province
          </Text>
          <Text style={[styles.tableHeaderText, styles.tableHeaderActions]}>
            Actions
          </Text>
        </View>

        <ScrollView style={styles.tableBody}>
          {provinces.map((province, index) => (
            <View key={province.id}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCellIndex}>{index + 1}</Text>
                {editingProvinceId === province.id ? (
                  <TextInput
                    value={editingProvinceName}
                    onChangeText={setEditingProvinceName}
                    style={styles.tableProvinceInput}
                    autoFocus
                    onBlur={finishEditProvince}
                    onSubmitEditing={finishEditProvince}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.tableProvinceButton}
                    activeOpacity={0.7}
                    onPress={() => startEditProvince(province)}
                  >
                    <Text style={styles.tableCellText}>{province.name}</Text>
                  </TouchableOpacity>
                )}
                <View style={styles.tableActionsRow}>
                  <TouchableOpacity
                    style={styles.tableAddStoreButton}
                    activeOpacity={0.8}
                    onPress={() => openStoreModal(province)}
                  >
                    <Text style={styles.tableAddStoreButtonText}>Add Store</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tableDeleteButton}
                    activeOpacity={0.8}
                    onPress={() => handleRemoveProvince(province.id)}
                  >
                    <Text style={styles.tableDeleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {province.stores.map((store) => (
                <View key={store.id} style={styles.storeRow}>
                  <TouchableOpacity
                    style={styles.storeTextColumn}
                    activeOpacity={0.7}
                    onPress={() => openEditStoreModal(province, store)}
                  >
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeMeta}>{store.address}</Text>
                    <Text style={styles.storeMeta}>
                      {store.contactName}
                      {store.contactPhone ? ` · ${store.contactPhone}` : ""}
                      {store.visitedToday ? " · Visited today" : ""}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.storeDeleteButton}
                    activeOpacity={0.8}
                    onPress={() => handleRemoveStore(province.id, store.id)}
                  >
                    <Text style={styles.storeDeleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}

          {provinces.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Added provinces will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <Modal
        visible={storeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeStoreModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <ThemedText
              type="defaultSemiBold"
              style={styles.modalTitle}
              lightColor="#0F172A"
              darkColor="#0F172A"
            >
              Add Store{storeProvinceName ? ` · ${storeProvinceName}` : ""}
            </ThemedText>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalField}>
                <Text style={styles.label}>Store name</Text>
                <TextInput
                  value={storeName}
                  onChangeText={setStoreName}
                  placeholder="e.g. Puregold"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  value={storeAddress}
                  onChangeText={setStoreAddress}
                  placeholder="e.g. Brgy. San Roque"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>

              <View style={styles.modalRow}>
                <View style={styles.modalHalfField}>
                  <Text style={styles.label}>Contact name</Text>
                  <TextInput
                    value={storeContactName}
                    onChangeText={setStoreContactName}
                    placeholder="e.g. Aira"
                    placeholderTextColor="#94A3B8"
                    style={styles.input}
                  />
                </View>
                <View style={styles.modalHalfField}>
                  <Text style={styles.label}>Contact phone</Text>
                  <TextInput
                    value={storeContactPhone}
                    onChangeText={setStoreContactPhone}
                    placeholder="e.g. 0917 000 0001"
                    placeholderTextColor="#94A3B8"
                    style={styles.input}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.visitedRow}>
                <Switch
                  value={storeVisitedToday}
                  onValueChange={setStoreVisitedToday}
                  thumbColor={storeVisitedToday ? "#1F6B46" : "#FFFFFF"}
                  trackColor={{ false: "#CBD5E1", true: "#BBF7D0" }}
                />
                <Text style={styles.visitedLabel}>Visited today</Text>
              </View>
            </ScrollView>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                activeOpacity={0.8}
                onPress={closeStoreModal}
              >
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalPrimaryButton}
                activeOpacity={0.9}
                onPress={handleAddStoreToProvince}
              >
                <Text style={styles.modalPrimaryButtonText}>Add Store</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    gap: 16,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 14,
    color: "#0F172A",
  },
  addButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#1F6B46",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  tableHeaderProvince: {
    flex: 3,
  },
  tableHeaderActions: {
    flex: 2,
    textAlign: "right",
  },
  tableBody: {
    maxHeight: 260,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 12,
  },
  tableActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tableCellIndex: {
    fontSize: 13,
    color: "#0F172A",
  },
  tableCellText: {
    flex: 3,
    fontSize: 13,
    color: "#0F172A",
  },
  tableProvinceButton: {
    flex: 3,
  },
  tableProvinceInput: {
    flex: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 13,
    color: "#0F172A",
  },
  tableAddStoreButton: {
    flex: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E0F2F1",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  tableAddStoreButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#115E3B",
  },
  tableDeleteButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  tableDeleteButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B91C1C",
    lineHeight: 14,
  },
  storeRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storeTextColumn: {
    flex: 1,
    marginRight: 8,
  },
  storeName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  storeMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  storeDeleteButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  storeDeleteButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B91C1C",
    lineHeight: 14,
  },
  emptyState: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#94A3B8",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  modalScroll: {
    maxHeight: 360,
  },
  modalScrollContent: {
    paddingVertical: 4,
    gap: 10,
  },
  modalField: {
    gap: 4,
  },
  modalRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalHalfField: {
    flex: 1,
    gap: 4,
  },
  visitedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  visitedLabel: {
    fontSize: 13,
    color: "#0F172A",
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  modalSecondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  modalSecondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  modalPrimaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F6B46",
  },
  modalPrimaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
