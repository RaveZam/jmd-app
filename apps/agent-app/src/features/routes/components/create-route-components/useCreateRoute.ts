import { useState } from "react";

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

export function useCreateRoute() {
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
        province.id === editingProvinceId
          ? { ...province, name: trimmed }
          : province,
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

  return {
    provinceName,
    setProvinceName,
    provinces,
    storeModalVisible,
    openStoreModal,
    closeStoreModal,
    handleAddProvince,
    handleAddStoreToProvince,
    handleRemoveProvince,
    handleRemoveStore,
    startEditProvince,
    finishEditProvince,
    openEditStoreModal,
    // store form state
    storeProvinceId,
    storeProvinceName,
    editingStoreRef,
    editingProvinceId,
    editingProvinceName,
    setEditingProvinceName,
    storeName,
    setStoreName,
    storeAddress,
    setStoreAddress,
    storeContactName,
    setStoreContactName,
    storeContactPhone,
    setStoreContactPhone,
    storeVisitedToday,
    setStoreVisitedToday,
  } as const;
}
