export type FilterRange = "today" | "7days" | "30days";
export const FILTERS: { label: string; value: FilterRange }[] = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
];
