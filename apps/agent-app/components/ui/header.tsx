import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  onBack?: () => void;
  rightElement?: ReactNode;
};

export function Header({ title, onBack, rightElement }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={onBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.right}>{rightElement ?? null}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0b4c29",
    paddingBottom: 14,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 36,
  },
  left: {
    minWidth: 44,
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  right: {
    minWidth: 44,
    alignItems: "flex-end",
  },
  backButton: {
    padding: 6,
  },
});
