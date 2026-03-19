import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import type { SectionRowProps } from "../types/store-types";

const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";
const HEADER_BG = "#0b4c29";

export function SectionRow({ label, buttonLabel, onToggle }: SectionRowProps) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.sectionBtn}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionBtnText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  sectionBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionBtnText: { fontSize: 12, fontWeight: "600", color: HEADER_BG },
});
