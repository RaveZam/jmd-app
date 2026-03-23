"use client";

import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function PortalTooltip({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible || !tooltipRef.current) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    const overflow = rect.right - (window.innerWidth - 8);
    if (overflow > 0) {
      setPos((prev) => ({ ...prev, x: prev.x - overflow }));
    }
  }, [visible]);

  function show() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top });
    setVisible(true);
  }

  return (
    <div ref={ref} onMouseEnter={show} onMouseLeave={() => setVisible(false)} style={{ display: "inline-flex" }}>
      {children}
      {mounted &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              left: pos.x,
              top: pos.y - 8,
              transform: "translate(-50%, -100%)",
              zIndex: 9999,
              opacity: visible ? 1 : 0,
              transition: "opacity 150ms ease",
              pointerEvents: "none",
              backgroundColor: "white",
              color: "black",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              border: "1px solid #e5e7eb",
              fontSize: "11px",
              lineHeight: "1.4",
              padding: "4px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
            }}
          >
            {content}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "100%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: "4px solid white",
              }}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
