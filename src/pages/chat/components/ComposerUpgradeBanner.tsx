/** @doc Compact Upgrade banner rendered inside the composer on the empty landing state (mobile). Hides after the first message and for paid users. */
import { Link } from "react-router-dom";
import { useUserPlan } from "@/hooks/useUserPlan";

export function ComposerUpgradeBanner() {
  const { isPaid, loading } = useUserPlan();
  if (loading || isPaid) return null;
  return (
    <div className="md:hidden px-2 pt-2 pb-1">
      <div
        className="flex items-center justify-between gap-3 rounded-2xl pl-4 pr-1.5 py-1.5"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <span className="text-[14px] text-white/55 truncate font-normal">
          Get more with Megsy Pro
        </span>
        <Link
          to="/pricing"
          aria-label="Upgrade to Megsy Pro"
          className="shrink-0 inline-flex items-center justify-center h-9 px-5 rounded-full text-[14px] font-semibold text-white active:scale-[0.97] transition-transform"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
