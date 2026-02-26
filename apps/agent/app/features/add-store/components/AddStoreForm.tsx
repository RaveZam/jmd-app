"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";

function AddStoreHeader(): ReactElement {
  return (
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
  );
}

const inputClass =
  "mt-1 w-full rounded-full border-b border-black/40 px-4 py-3 bg-white text-sm placeholder:text-muted-foreground";

function LocationAndAddressFields(props: {
  province: string;
  setProvince: (v: string) => void;
  municipality: string;
  setMunicipality: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  addressLine: string;
  setAddressLine: (v: string) => void;
}): ReactElement {
  return (
    <>
      <div className="grid gap-3 items-end">
        <label className="col-span-3 block">
          <span className="text-sm font-medium">Province</span>
          <select
            value={props.province}
            onChange={(e) => props.setProvince(e.target.value)}
            className={inputClass}
          >
            <option>Isabela</option>
            <option>Kalinga</option>
            <option>Aurora Province</option>
          </select>
        </label>
        <label className="col-span-4 block">
          <span className="text-sm font-medium">Municipality</span>
          <input
            value={props.municipality}
            onChange={(e) => props.setMunicipality(e.target.value)}
            placeholder="e.g. Santiago"
            className={inputClass}
          />
        </label>
        <label className="col-span-5 block">
          <span className="text-sm font-medium">Store name</span>
          <input
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
            placeholder="e.g. Puregold"
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Address</span>
        <input
          value={props.addressLine}
          onChange={(e) => props.setAddressLine(e.target.value)}
          className={inputClass}
          placeholder="e.g. Brgy. San Roque"
        />
      </label>
    </>
  );
}

function ContactAndSubmitFields(props: {
  contactName: string;
  setContactName: (v: string) => void;
  contactPhone: string;
  setContactPhone: (v: string) => void;
  visitedToday: boolean;
  setVisitedToday: (v: boolean | ((prev: boolean) => boolean)) => void;
}): ReactElement {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Contact name</span>
          <input
            value={props.contactName}
            onChange={(e) => props.setContactName(e.target.value)}
            className={inputClass}
            placeholder="e.g. Aira"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Contact phone</span>
          <input
            value={props.contactPhone}
            onChange={(e) => props.setContactPhone(e.target.value)}
            className={inputClass}
            placeholder="e.g. 0917 000 0001"
          />
        </label>
      </div>
      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.visitedToday}
            onChange={() => props.setVisitedToday((v) => !v)}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm">Visited today</span>
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
    </>
  );
}

function AddStoreFormBody(): ReactElement {
  const [province, setProvince] = useState("Isabela");
  const [municipality, setMunicipality] = useState("");
  const [name, setName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [visitedToday, setVisitedToday] = useState(false);

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
  }

  return (
    <main className="px-5 py-6">
      <div className="mx-auto w-full max-w-[720px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-emerald-100/60 p-4"
        >
          <LocationAndAddressFields
            province={province}
            setProvince={setProvince}
            municipality={municipality}
            setMunicipality={setMunicipality}
            name={name}
            setName={setName}
            addressLine={addressLine}
            setAddressLine={setAddressLine}
          />
          <ContactAndSubmitFields
            contactName={contactName}
            setContactName={setContactName}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            visitedToday={visitedToday}
            setVisitedToday={setVisitedToday}
          />
        </form>
      </div>
    </main>
  );
}

export default function AddStoreForm(): ReactElement {
  return (
    <div className="min-h-dvh bg-white dark:bg-black">
      <AddStoreHeader />
      <AddStoreFormBody />
    </div>
  );
}
