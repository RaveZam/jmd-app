"use client";

import type { ReactElement } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
};

export function SearchBar({ value, onChange, placeholder = "Search Store...", onFilterClick }: Props): ReactElement {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </span>
      <input
        type="search"
        role="searchbox"
        aria-label="Search stores"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full bg-white/95 px-4 py-3 pl-12 pr-14 text-sm shadow-sm transition-colors focus:outline-none dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-700"
      />
      <button
        type="button"
        aria-label="Open filters"
        onClick={() => onFilterClick?.()}
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full  bg-white/95 px-3 py-2 text-sm text-emerald-700  transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="black">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M7 12h10M10 19h4" />
        </svg>
        <span className="hidden sm:inline">Filters</span>
      </button>
    </div>
  );
}

export default SearchBar;
