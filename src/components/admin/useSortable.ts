"use client";

import { useState, useMemo } from "react";

export type SortDir = "asc" | "desc";

// Client-side table sorting by column with direction toggle
export function useSortable<T>(data: T[], defaultKey?: keyof T) {
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultKey ?? null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Toggle direction if same column, otherwise sort asc on new column
  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Memoized sorted copy with null-safe string/numeric comparison
  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  // Font Awesome icon name for the sort indicator
  const sortIcon = (key: keyof T) => {
    if (sortKey !== key) return "fa-sort";
    return sortDir === "asc" ? "fa-sort-up" : "fa-sort-down";
  };

  return { sorted, sortKey, sortDir, toggleSort, sortIcon };
}
