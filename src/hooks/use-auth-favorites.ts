"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import { useFavorites as useLocalFavorites } from "@/hooks/use-favorites";

const LOCAL_KEY = "musas-favorites";

export function useAuthFavorites() {
  const local = useLocalFavorites();
  const { isSignedIn, isLoaded } = useAuth();
  const remoteIds = useQuery(
    api.favorites.listMine,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const toggleRemote = useMutation(api.favorites.toggle);
  const mergeLocal = useMutation(api.favorites.mergeLocal);
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    if (!BACKEND_CONFIGURED || !isSignedIn || merged) return;
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) {
      setMerged(true);
      return;
    }
    try {
      const ids = JSON.parse(raw) as string[];
      // Demo local ids are slug-like ("casa-avila"); Convex `_id`s are opaque alphanumerics.
      const convexIds = ids.filter(
        (id) => typeof id === "string" && id.length >= 16 && !id.includes("-"),
      );
      if (convexIds.length === 0) {
        setMerged(true);
        return;
      }
      void mergeLocal({ listingIds: convexIds as Id<"listings">[] })
        .then(() => {
          window.localStorage.removeItem(LOCAL_KEY);
        })
        .finally(() => setMerged(true));
    } catch {
      setMerged(true);
    }
  }, [isSignedIn, mergeLocal, merged]);

  const favoriteSet = useMemo(() => {
    if (BACKEND_CONFIGURED && isSignedIn && remoteIds) {
      return new Set(remoteIds.map(String));
    }
    return local.favoriteSet;
  }, [BACKEND_CONFIGURED, isSignedIn, remoteIds, local.favoriteSet]);

  const isFavorite = useCallback(
    (id: string) => favoriteSet.has(id),
    [favoriteSet],
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (BACKEND_CONFIGURED && isSignedIn) {
        await toggleRemote({ listingId: id as Id<"listings"> });
        return;
      }
      local.toggleFavorite(id);
    },
    [isSignedIn, local, toggleRemote],
  );

  return {
    favoriteIds: Array.from(favoriteSet),
    favoriteSet,
    count: favoriteSet.size,
    isFavorite,
    toggleFavorite,
    ready: isLoaded && (!isSignedIn || remoteIds !== undefined || !BACKEND_CONFIGURED),
    isSignedIn: !!isSignedIn,
  };
}
