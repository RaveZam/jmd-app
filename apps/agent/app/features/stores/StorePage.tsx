import type { ReactElement } from "react";

import { mockStoreLists } from "@/lib/mock/storelists";
import { StoreList } from "./components/StoreList";

export function StorePage(): ReactElement {
  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.20),transparent_55%),linear-gradient(180deg,#ecfdf5_0%,#fafafa_35%,#ffffff_100%)] dark:bg-black">
      <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/65 px-5 py-4 backdrop-blur dark:border-zinc-800/80 dark:bg-black/60">
        <div className="mx-auto w-full max-w-[720px] space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 dark:text-zinc-50">
            Stores
          </h1>
          <p className="text-sm text-emerald-900/70 dark:text-zinc-400">
            View stores first — pick one to start your run.
          </p>
        </div>
      </header>

      <main className="px-5 py-5">
        <div className="mx-auto w-full max-w-[720px] space-y-4">
          <StoreList stores={mockStoreLists} />
        </div>
      </main>
    </div>
  );
}

export default StorePage;
