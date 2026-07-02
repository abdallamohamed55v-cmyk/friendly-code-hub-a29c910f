/** @doc Compact Upgrade banner rendered inside the composer on the empty landing state (mobile). Hides after the first message and for paid users. */
import { Link } from "react-router-dom";
import { useUserPlan } from "@/hooks/useUserPlan";

export function ComposerUpgradeBanner() {
  const { isPaid, loading } = useUserPlan();
  if (loading || isPaid) return null;
  return (
    <div className="md:hidden px-1 pt-1 pb-1.5">
      <div
        className="flex items-center justify-between gap-3 rounded-2xl pl-4 pr-1.5 py-1.5"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="text-[13.5px] text-white/70 truncate">
          Get more with Megsy Pro
        </span>
        <Link
          to="/pricing"
          aria-label="Upgrade to Megsy Pro"
          className="shrink-0 inline-flex items-center justify-center h-8 px-4 rounded-full text-[13px] font-semibold text-white active:scale-[0.97] transition-transform"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
