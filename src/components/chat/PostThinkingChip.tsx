import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, X } from "lucide-react";

interface Props {
  seconds: number;
  isArabic?: boolean;
  thoughts?: string[];
}

/**
 * Compact "Thinking >" chip that appears above an assistant message
 * AFTER the reply is done. Tapping it opens a clean sheet with the
 * thought trace — mirrors Claude mobile style.
 */
const PostThinkingChip = ({ seconds, isArabic, thoughts = [] }: Props) => {
  const [open, setOpen] = useState(false);
  const label = isArabic ? "التفكير" : "Thinking";
  const durationLabel = isArabic ? `فكّرت لـ ${seconds} ث` : `Thought for ${seconds}s`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 mb-2 -mt-0.5 text-[13px] font-medium text-foreground/60 hover:text-foreground/90 transition"
        aria-label={label}
      >
        <Clock className="w-3.5 h-3.5 opacity-70" strokeWidth={2} />
        <span>{label}</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className="fixed inset-x-0 bottom-0 z-[121] rounded-t-3xl bg-[#1a1a1a] border-t border-white/10 p-5 pb-8 max-h-[75vh] overflow-y-auto"
              dir={isArabic ? "rtl" : undefined}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/70" />
                  <h3 className="text-[15px] font-semibold text-white">
                    {isArabic ? "خطوات التفكير" : "Thought process"}
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[12px] uppercase tracking-wide text-white/50 mb-3">
                {durationLabel}
              </div>
              {thoughts.length === 0 ? (
                <p className="text-[14px] leading-6 text-white/70">
                  {isArabic
                    ? "لا توجد تفاصيل إضافية عن هذا الرد."
                    : "No additional reasoning details for this reply."}
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {thoughts.map((t, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] leading-6 text-white/85">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostThinkingChip;
