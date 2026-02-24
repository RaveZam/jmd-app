import { Suspense } from "react";
import { StorePage } from "@/app/features/store";

export default function Page() {
  return (
    <Suspense>
      <StorePage />
    </Suspense>
  );
}
