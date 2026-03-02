import { StyleSheet, View, Text } from "react-native";

export type StoreInfoSectionProps = {
  storeName: string;
  location: string;
  contactName: string;
  contactNumber: string;
};

export function StoreInfoSection({
  storeName,
  location,
  contactName,
  contactNumber,
}: StoreInfoSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.storeName}>{storeName}</Text>
      <Text style={styles.location}>{location}</Text>
      <Text style={styles.contact}>
        {contactName} • {contactNumber}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  storeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: "#475569",
  },
});
