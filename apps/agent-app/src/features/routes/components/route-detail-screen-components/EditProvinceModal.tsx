import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { modalStyles as m } from "@/src/shared/styles/modalStyles";
import { ProvinceRow } from "../../types/db-rows";
import { useStores } from "../../hooks/useStores";
import {
  updateProvinceName,
  deleteProvince,
} from "../../services/province-save-service";
import { DeleteProvinceModal } from "./DeleteProvinceModal";

type Props = {
  province: ProvinceRow | null;
  onClose: () => void;
  onChanged: () => void;
};

export function EditProvinceModal({ province, onClose, onChanged }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { stores } = useStores(province?.id ?? "");

  const canSave = name.trim().length > 0;

  const close = () => {
    setEditing(false);
    setConfirmDelete(false);
    onClose();
  };

  const handleSave = () => {
    if (!province || !canSave) return;
    updateProvinceName(province.id, name);
    onChanged();
    close();
  };

  const handleDelete = () => {
    if (!province) return;
    deleteProvince(province.id);
    onChanged();
    close();
  };

  const storeCount =
    stores.length === 0
      ? "No stores yet"
      : `${stores.length} ${stores.length === 1 ? "store" : "stores"}`;

  return (
    <Modal
      visible={!!province}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={close}
      onShow={() => {
        setName(province?.name ?? "");
        setEditing(false);
      }}
    >
      <View style={m.backdrop}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={close}
            hitSlop={8}
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={18} color="#64748B" />
          </TouchableOpacity>

          {editing ? (
            <View style={styles.editForm}>
              <View style={styles.editHeader}>
                <View style={styles.eyebrowRow}>
                  <View style={styles.eyebrowTick} />
                  <Text style={styles.eyebrow}>EDIT PROVINCE</Text>
                </View>
                <Text style={styles.editTitle}>Update name</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Province / municipality *</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Makati, Quezon City"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  autoFocus
                />
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditing(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.saveButton,
                    !canSave && styles.saveDisabled,
                  ]}
                  disabled={!canSave}
                  onPress={handleSave}
                  activeOpacity={0.85}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <View style={styles.iconWrap}>
                  <Ionicons name="map-outline" size={22} color="#3F7355" />
                </View>
                <View style={styles.headerText}>
                  <View style={styles.eyebrowRow}>
                    <View style={styles.eyebrowTick} />
                    <Text style={styles.eyebrow}>PROVINCE</Text>
                  </View>
                  <Text style={styles.name} numberOfLines={2}>
                    {province?.name}
                  </Text>
                  <Text style={styles.subline}>{storeCount}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => setEditing(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="create-outline" size={17} color="#FFFFFF" />
                  <Text style={styles.editText}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => setConfirmDelete(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="trash-outline" size={17} color="#DC2626" />
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      <DeleteProvinceModal
        province={confirmDelete ? province : null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  // Shared eyebrow (gold tick + uppercase kicker)
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eyebrowTick: {
    width: 3,
    height: 11,
    borderRadius: 2,
    backgroundColor: "#E8B04B",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#B8923F",
  },

  // View state
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 28,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F1F5F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 19,
    fontWeight: "600",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  subline: {
    fontSize: 13,
    fontWeight: "300",
    color: "#64748B",
    lineHeight: 18,
  },

  // Edit state
  editForm: {
    gap: 16,
    paddingTop: 4,
  },
  editHeader: {
    gap: 3,
    paddingRight: 28,
  },
  editTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 14,
    fontWeight: "400",
    color: "#1E293B",
  },

  // Actions (shared by both states)
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  editButton: {
    backgroundColor: "#0b4c29",
  },
  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  saveButton: {
    backgroundColor: "#0b4c29",
  },
  saveText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  saveDisabled: {
    backgroundColor: "#94A3B8",
  },
});
