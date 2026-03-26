"use client";

import { useState, useRef } from "react";

const FAB_SIZE = 52;
const EDGE_MARGIN = 24;

type Pos = { x: number; y: number };

export function useDraggableFab(onTap: () => void) {
  const [pos, setPos] = useState<Pos | null>(null);
  const [snapping, setSnapping] = useState(false);
  const dragRef = useRef<{
    startMx: number;
    startMy: number;
    startBx: number;
    startBy: number;
    moved: boolean;
  } | null>(null);

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      startMx: e.clientX,
      startMy: e.clientY,
      startBx: rect.left,
      startBy: rect.top,
      moved: false,
    };
    setSnapping(false);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startMx;
    const dy = e.clientY - dragRef.current.startMy;
    if (!dragRef.current.moved && Math.sqrt(dx * dx + dy * dy) > 6) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      setPos({ x: dragRef.current.startBx + dx, y: dragRef.current.startBy + dy });
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current) return;
    const { moved } = dragRef.current;
    dragRef.current = null;

    if (!moved) {
      onTap();
      return;
    }

    setSnapping(true);
    setPos((prev) => {
      if (!prev) return prev;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const snapX =
        prev.x + FAB_SIZE / 2 > vw / 2
          ? vw - FAB_SIZE - EDGE_MARGIN
          : EDGE_MARGIN;
      const clampedY = Math.max(EDGE_MARGIN, Math.min(vh - FAB_SIZE - EDGE_MARGIN, prev.y));
      return { x: snapX, y: clampedY };
    });
  }

  return { pos, snapping, dragRef, handlePointerDown, handlePointerMove, handlePointerUp };
}
