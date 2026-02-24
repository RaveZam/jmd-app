"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import Link from "next/link";

export function AddstorePage(): ReactElement {
  const [province, setProvince] = useState("Isabela");
  const [municipality, setMunicipality] = useState("");
  const [name, setName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [visitedToday, setVisitedToday] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // no-op by request
  }

  return (
    <div className="min-h-dvh bg-white dark:bg-black">
      <header className="sticky top-0 z-20">
        <div className="mx-auto w-full max-w-[720px]">
          <div className="bg-[linear-gradient(to_bottom_right,#064e3b_0%,#065f46_50%,#047857_100%)] p-4 text-white shadow-soft">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                aria-label="Back"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Add Store</h1>
                <p className="mt-1 text-sm text-emerald-50/90">
                  Create a new store to add to your list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 py-6">
        <div className="mx-auto w-full max-w-[720px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border border-emerald-100/60 p-4"
          >
            <div className="grid gap-3 items-end">
              <label className="col-span-3 block">
                <span className="text-sm font-medium">Province</span>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="mt-1 w-full rounded-full border-b border-black px-4 py-3 bg-white text-sm"
                >
                  <option>Isabela</option>
                  <option>Kalinga</option>
                  <option>Aurora Province</option>
                </select>
              </label>

              <label className="col-span-4 block">
                <span className="text-sm font-medium">Municipality</span>
                <input
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  placeholder="e.g. Santiago"
                  className="mt-1 w-full rounded-full border-b border-black px-4 py-3 bg-white text-sm placeholder:text-muted-foreground"
                />
              </label>

              <label className="col-span-5 block">
                <span className="text-sm font-medium">Store name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Puregold"
                  className="mt-1 w-full rounded-full border-b border-black px-4 py-3 bg-white text-sm placeholder:text-muted-foreground"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Address</span>
              <input
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="mt-1 w-full rounded-full border-b border-black px-4 py-3 bg-white text-sm"
                placeholder="e.g. Brgy. San Roque"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Contact name</span>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 w-full rounded-full border-b border-black px-4 py-3 bg-white text-sm"
                  placeholder="e.g. Aira"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Contact phone</span>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="mt-1 w-full rounded-full border-b border-black px-4 py-3 bg-white text-sm"
                  placeholder="e.g. 0917 000 0001"
                />
              </label>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg"
              >
                Add Store
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddstorePage;
