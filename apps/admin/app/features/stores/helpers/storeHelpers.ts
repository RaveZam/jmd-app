export function formatAddress(
  barangay: string | null,
  city: string | null,
  province: string | null,
): string {
  return [barangay, city, province].filter(Boolean).join(", ") || "No address";
}
