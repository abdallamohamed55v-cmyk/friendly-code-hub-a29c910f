import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { glassModelMenu, glassModelMenuStyle } from "@/components/model-picker/glassModelMenuStyles";

export type ResearchDepth = "lite" | "medium" | "max";

interface ResearchDepthDropdownProps {
  researchDepth: ResearchDepth;
  setResearchDepth: (depth: ResearchDepth) => void;
  researchDepthOpen: boolean;
  setResearchDepthOpen: (open: boolean | ((v: boolean) => boolean)) => void;
}

const DEPTH_OPTIONS: Array<{ id: ResearchDepth; label: string }> = [
  { id: "lite", label: "Lite" },
  { id: "medium", label: "Medium" },
  { id: "max", label: "Max" },
];

const LABEL_MAP: Record<ResearchDepth, string> = {
  lite: "Lite",
  medium: "Medium",
  max: "Max",
};

export default function ResearchDepthDropdown({
  researchDepth,
  setResearchDepth,
  researchDepthOpen,
  setResearchDepthOpen,
}: ResearchDepthDropdownProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; placeAbove: boolean } | null>(null);
  const MENU_W = 160;
  const MENU_EST_H = 168; // ~3 items + padding

  useLayoutEffect(() => {
    if (!researchDepthOpen || !btnRef.current) return;
    const update = () => {
      const r = btnRef.current!.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const spaceAbove = r.top;
      const spaceBelow = vh - r.bottom;
      const placeAbove = spaceAbove >= MENU_EST_H || spaceAbove >= spaceBelow;
      const top = placeAbove ? r.top - 8 : r.bottom + 8;
      let left = r.right - MENU_W;
      // Clamp horizontally inside the viewport with an 8px margin.
      left = Math.max(8, Math.min(left, vw - MENU_W - 8));
      setPos({ top, left, placeAbove });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [researchDepthOpen]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setResearchDepthOpen((v) => !v)}
        className={glassModelMenu.triggerPill}
        aria-label="Report depth"
        aria-expanded={researchDepthOpen}
      >
        <span>{LABEL_MAP[researchDepth]}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-70 transition-transform ${researchDepthOpen ? "rotate-180" : ""}`}
        />
      </button>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {researchDepthOpen && pos && (
              <>
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={() => setResearchDepthOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  style={{
                    position: "fixed",
                    top: pos.top,
                    left: pos.left,
                    width: MENU_W,
                    transform: pos.placeAbove ? "translateY(-100%)" : "translateY(0)",
                    ...glassModelMenuStyle,
                  }}
                  className={`${glassModelMenu.panel} p-1.5`}
                >
                  {DEPTH_OPTIONS.map((d) => {
                    const active = researchDepth === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setResearchDepth(d.id);
                          setResearchDepthOpen(false);
                        }}
                        className={glassModelMenu.depthItem(active)}
                      >
                        <span>{d.label}</span>
                        {active && <Check className="w-4 h-4" strokeWidth={2.5} />}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
