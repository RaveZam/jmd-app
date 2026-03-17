import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  // Layout
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },

  // Typography
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  body: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
  highlight: {
    fontWeight: "700",
    color: "#0F172A",
  },

  // Delete confirmation icon wrap
  deleteIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  // Buttons
  buttons: {
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
  cancelText: {
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
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
