"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "musas-favorites";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(readIds());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, ready]);

  const favoriteSet = useMemo(() => new Set(ids), [ids]);

  const isFavorite = useCallback(
    (id: string) => favoriteSet.has(id),
    [favoriteSet],
  );

  const toggleFavorite = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  return {
    favoriteIds: ids,
    favoriteSet,
    count: ids.length,
    isFavorite,
    toggleFavorite,
    ready,
  };
}
