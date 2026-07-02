import { supabase } from "@/integrations/supabase/client";
import ComposerModelMenu from "../ComposerModelMenu";
import SlidesTemplateButton from "./SlidesTemplateButton";
import ResearchDepthDropdown from "./ResearchDepthDropdown";
import type { ChatMode } from "../chatConstants";
import type { AgentDef } from "@/lib/agentRegistry";


interface ComposerInlineSlotProps {
  isMobileViewport: boolean;
  chatMode: ChatMode;
  tierMenuOpen: boolean;
  setTierMenuOpen: (v: boolean) => void;
  selectedModel: any;
  setSelectedModel: (m: any) => void;
  megsyTier: any;
  setMegsyTier: (t: any) => void;
  userPlan: string | null | undefined;
  mediaModel: any;
  setMediaModel: (m: any) => void;
  chatUserId: string | null;
  selectedAgent: AgentDef | null;
  slidesTemplate: any;
  setSlidesPickerOpen: (v: boolean) => void;
  researchDepth: any;
  setResearchDepth: (v: any) => void;
  researchDepthOpen: boolean;
  setResearchDepthOpen: (v: boolean) => void;
}

/** Inline pills/menus rendered inside the composer (AnimatedInput.inlineSlot). */
export function ComposerInlineSlot(props: ComposerInlineSlotProps) {
  const {
    chatMode,
    tierMenuOpen,
    setTierMenuOpen,
    selectedModel,
    setSelectedModel,
    megsyTier,
    setMegsyTier,
    userPlan,
    mediaModel,
    setMediaModel,
    chatUserId,
    selectedAgent,
    slidesTemplate,
    setSlidesPickerOpen,
    researchDepth,
    setResearchDepth,
    researchDepthOpen,
    setResearchDepthOpen,
  } = props;

  const isSlidesMode =
    chatMode === "slides" ||
    chatMode === "slides-images" ||
    selectedAgent?.id === "slides" ||
    selectedAgent?.id === "slides-images";

  return (
    <>
      <ComposerModelMenu
        mode={chatMode}
        open={tierMenuOpen}
        onOpenChange={setTierMenuOpen}
        selectedModel={selectedModel}
        megsyTier={megsyTier}
        userPlan={userPlan as any}
        mediaModel={mediaModel}
        onTierSelect={(tier) => {
          setSelectedModel(null);
          setMegsyTier(tier);
          if (chatUserId) {
            void supabase
              .from("ai_personalization")
              .upsert({ user_id: chatUserId, preferred_tier: tier } as any, {
                onConflict: "user_id",
              });
          }
        }}
        onChatModelSelect={(model) =>
          setSelectedModel({ id: model.id, label: model.label, cost: 0 })
        }
        onMediaModelSelect={setMediaModel}
        side="top"
        align="center"
      />
      {isSlidesMode ? (
        <SlidesTemplateButton
          slidesTemplate={slidesTemplate}
          onOpenPicker={() => setSlidesPickerOpen(true)}
        />
      ) : null}
      {chatMode === "deep-research" ? (
        <ResearchDepthDropdown
          researchDepth={researchDepth}
          setResearchDepth={setResearchDepth}
          researchDepthOpen={researchDepthOpen}
          setResearchDepthOpen={setResearchDepthOpen}
        />
      ) : null}
      <UpgradeInlinePill />
    </>
  );
}

function UpgradeInlinePill() {
  const { isPaid, loading } = useUserPlan();
  if (loading || isPaid) return null;
  return (
    <Link
      to="/pricing"
      aria-label="Upgrade to Megsy Pro"
      className="shrink-0 inline-flex items-center gap-2 h-9 pl-2.5 pr-3.5 rounded-full text-[13px] font-semibold transition-colors active:scale-[0.97]"
      style={{
        background: "#2A2520",
        border: "1px solid #3A332C",
        color: "#D97757",
      }}
    >
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full"
        style={{ background: "rgba(217, 119, 87, 0.18)" }}
      >
        <Zap className="w-3 h-3" fill="#D97757" stroke="#D97757" />
      </span>
      <span style={{ color: "#E8DDD4" }}>Get 50% off Pro</span>
    </Link>
  );
}

