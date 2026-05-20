"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api-error";
import { blogCategoryService } from "@/services/blogCategory.service";
import type { BlogCategoryItem } from "@/types";

export function useBlogCategories() {
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await blogCategoryService.getAll();
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
