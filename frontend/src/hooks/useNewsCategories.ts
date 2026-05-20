"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api-error";
import { newsCategoryService } from "@/services/newsCategory.service";
import type { NewsCategoryItem } from "@/types";

export function useNewsCategories() {
  const [categories, setCategories] = useState<NewsCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await newsCategoryService.getAll();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getLabel = useCallback(
    (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug,
    [categories]
  );

  return { categories, isLoading, error, reload: load, getLabel };
}
