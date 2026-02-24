import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { mockStoreLists } from "@/lib/mock/storelists";

export function useStore() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("id");

  const store = useMemo(
    () => mockStoreLists.find((s) => s.id === storeId) ?? null,
    [storeId],
  );

  return { store, storeId };
}

