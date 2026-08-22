import { useCallback, useRef, useState } from "react";

export const DEFAULT_REPORT_ROW_HEIGHT = 54;

export function useInfiniteRowHeight() {
  const expandedHeights = useRef(new Map<number, number>());
  const [rowHeight, setRowHeight] = useState(DEFAULT_REPORT_ROW_HEIGHT);

  const updateExpandedHeight = useCallback(
    (rowId: number, height: number | null) => {
      if (height === null) expandedHeights.current.delete(rowId);
      else expandedHeights.current.set(rowId, height);

      const nextHeight = Math.max(
        DEFAULT_REPORT_ROW_HEIGHT,
        ...expandedHeights.current.values(),
      );
      setRowHeight((current) => (current === nextHeight ? current : nextHeight));
    },
    [],
  );

  return { rowHeight, updateExpandedHeight };
}
