import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";

type LocalProvince = {
  id: string;
  name: string;
};

export function CreateRouteForm() {
  const [provinceName, setProvinceName] = useState("");
  const [provinces, setProvinces] = useState<LocalProvince[]>([]);

  function handleAddProvince() {
    const trimmed = provinceName.trim();
    if (!trimmed) {
      return;
    }

    setProvinces((current) => [
      ...current,
      { id: `${Date.now()}-${current.length}`, name: trimmed },
    ]);
    setProvinceName("");
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
            <View key={province.id} style={styles.tableRow}>
              <Text style={styles.tableCellIndex}>{index + 1}</Text>
              <Text style={styles.tableCellText}>{province.name}</Text>
              <TouchableOpacity
                style={styles.tableAddStoreButton}
                activeOpacity={0.8}
                // TODO: Wire this up once store creation is implemented
                onPress={() => {}}
              >
                <Text style={styles.tableAddStoreButtonText}>Add Store</Text>
              </TouchableOpacity>
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
  tableCellIndex: {
    fontSize: 13,
    color: "#0F172A",
  },
  tableCellText: {
    flex: 3,
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
  emptyState: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#94A3B8",
  },
});
