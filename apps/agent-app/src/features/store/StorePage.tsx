import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { DistributionLogHeader } from "./components/DistributionLogHeader";
import { StoreInfoSection } from "./components/StoreInfoSection";
import { ProductLogForm } from "./components/ProductLogForm";
import { LoggedItemsArea } from "./components/LoggedItemsArea";
import { useDistributionLog } from "./hooks/useDistributionLog";
import { PRODUCTS } from "./mock/products";
import { STORES } from "../routes/mock/stores";
import { PROVINCES } from "../routes/mock/province";

export default function StorePage() {
  const params = useLocalSearchParams<{ storeId?: string }>();
  const storeId =
    typeof params.storeId === "string" ? params.storeId : undefined;

  const store = storeId ? (STORES.find((s) => s.id === storeId) ?? null) : null;

  const province = store
    ? (PROVINCES.find((p) => p.storeIds.includes(store.id)) ?? null)
    : null;
  const location = province
    ? `${province.name} • ${store?.address ?? ""}`
    : (store?.address ?? "");

  const {
    selectedProduct,
    qty,
    setQty,
    boQty,
    setBoQty,
    loggedItems,
    onSelectProduct,
    onLogProduct,
    onRemoveItem,
  } = useDistributionLog(PRODUCTS);

  if (!store) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <DistributionLogHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StoreInfoSection
          storeName={store.name}
          location={location}
          contactName={store.contactName}
          contactNumber={store.contactNumber}
        />
        <ProductLogForm
          products={PRODUCTS}
          selectedProduct={selectedProduct}
          onSelectProduct={onSelectProduct}
          qty={qty}
          onQtyChange={setQty}
          boQty={boQty}
          onBoQtyChange={setBoQty}
          onLogProduct={onLogProduct}
        />
        <LoggedItemsArea items={loggedItems} onRemoveItem={onRemoveItem} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
