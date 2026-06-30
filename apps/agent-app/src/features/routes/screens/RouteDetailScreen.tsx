import { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { Colors } from "@/src/shared/constants/Colors";

import { ProvinceList } from "../components/route-detail-screen-components/ProvinceList";
import { AddProvinceModal } from "../components/route-detail-screen-components/AddProvinceModal";
import { EditProvinceModal } from "../components/route-detail-screen-components/EditProvinceModal";
import { RenameRouteModal } from "../components/route-detail-screen-components/RenameRouteModal";
import { RouteDetailBanner } from "../components/route-detail-screen-components/RouteDetailBanner";
import { useProvinces } from "../hooks/useProvinces";
import { useRouteName } from "../hooks/useRouteName";
import { useStartSession } from "@/src/features/sessions/hooks/useStartSession";
import { ProvinceRow } from "../types/db-rows";

type ProvinceModals = ReturnType<typeof useProvinceModals>;
type RenameHook = ReturnType<typeof useRouteName>["rename"];

function useProvinceModals(loadProvinces: () => void) {
  const [showAdd, setShowAdd] = useState(false);
  const [editProvince, setEditProvince] = useState<ProvinceRow | null>(null);
  return {
    showAdd,
    openAdd: () => setShowAdd(true),
    closeAdd: () => setShowAdd(false),
    onAdded: () => { setShowAdd(false); loadProvinces(); },
    editProvince,
    openEdit: setEditProvince,
    closeEdit: () => setEditProvince(null),
  };
}

function RouteModals({ routeId, m, rename, routeName, onChanged }: {
  routeId: string;
  m: ProvinceModals;
  rename: RenameHook;
  routeName: string;
  onChanged: () => void;
}): React.JSX.Element {
  return (
    <>
      <AddProvinceModal routeId={routeId} visible={m.showAdd} onClose={m.closeAdd} onAdded={m.onAdded} />
      <EditProvinceModal province={m.editProvince} onClose={m.closeEdit} onChanged={onChanged} />
      <RenameRouteModal visible={rename.isModalOpen} currentName={routeName} onSubmit={rename.submit} onClose={rename.closeModal} />
    </>
  );
}

function StartSessionFooter({ disabled, loading, onPress }: {
  disabled: boolean; loading: boolean; onPress: () => void;
}): React.JSX.Element {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={[styles.startBtn, disabled && styles.startBtnDisabled]} activeOpacity={0.85} onPress={onPress} disabled={disabled}>
        {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.startBtnText}>Start Session</Text>}
      </TouchableOpacity>
    </View>
  );
}

export default function RouteDetailScreen(): React.JSX.Element {
  const { routeId } = useLocalSearchParams<{ routeId?: string }>();
  const { name, rename } = useRouteName();
  const { provinces, loadProvinces } = useProvinces();
  const { loading, start } = useStartSession();
  const m = useProvinceModals(loadProvinces);

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ThemedView style={styles.container}>
        <RouteDetailBanner
          routeName={name}
          provinceCount={provinces.length}
          onBack={() => router.back()}
          onAddLocation={m.openAdd}
          onRename={rename.openModal}
        />
        <ProvinceList provinces={provinces} onEditProvince={m.openEdit} />
      </ThemedView>
      <StartSessionFooter disabled={loading || provinces.length === 0} loading={loading} onPress={start} />
      <RouteModals routeId={routeId ?? ""} m={m} rename={rename} routeName={name} onChanged={loadProvinces} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { flex: 1, backgroundColor: Colors.light.background },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  startBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#0b4c29",
  },
  startBtnDisabled: { opacity: 0.4 },
  startBtnText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
});
