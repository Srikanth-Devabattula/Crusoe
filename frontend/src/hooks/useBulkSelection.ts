import { useCallback, useEffect, useMemo, useState } from "react";

export function useBulkSelection(visibleIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedIds((prev) => {
      const visible = new Set(visibleIds);
      const next = new Set([...prev].filter((id) => visible.has(id)));
      if (next.size === prev.size) return prev;
      return next;
    });
  }, [visibleIds]);

  const selectedCount = useMemo(
    () => visibleIds.filter((id) => selectedIds.has(id)).length,
    [visibleIds, selectedIds]
  );

  const allSelected = visibleIds.length > 0 && selectedCount === visibleIds.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const visible = new Set(visibleIds);
      const allVisibleSelected = visibleIds.every((id) => prev.has(id));
      if (allVisibleSelected) {
        return new Set([...prev].filter((id) => !visible.has(id)));
      }
      return new Set([...prev, ...visibleIds]);
    });
  }, [visibleIds]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const getSelectedIds = useCallback(
    () => visibleIds.filter((id) => selectedIds.has(id)),
    [visibleIds, selectedIds]
  );

  return {
    selectedCount,
    allSelected,
    someSelected,
    isSelected,
    toggleOne,
    toggleAll,
    clear,
    getSelectedIds,
  };
}
