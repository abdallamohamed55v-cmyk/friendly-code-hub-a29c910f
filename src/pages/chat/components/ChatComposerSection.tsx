
import { useState, type ReactNode } from "react";
import { Zap, ChevronRight } from "lucide-react";
import ComposerAttachments from "./ComposerAttachments";
import { RemoteAiBusyBanner } from "./RemoteAiBusyBanner";
import { MentionDropdown } from "./MentionDropdown";
import { ComposerMobileModeBar } from "./ComposerMobileModeBar";
import { ComposerAnimatedInput } from "./ComposerAnimatedInput";
import { DesktopModeChips } from "./DesktopModeChips";
import { ActiveServicePill } from "./ActiveServicePill";
import { useUserPlan } from "@/hooks/useUserPlan";
import type { AttachedFile } from "../hooks/useAttachments";



interface ChatComposerSectionProps {
  sidebarCollapsed: boolean;
  loadingMessages: boolean;
  messagesLength: number;
  attachedFiles: AttachedFile[];
  removeAttachment: (i: number) => void;
  remoteAiBusy: { name: string } | null;
  plusMenuOpen: boolean;
  renderPlusMenu: () => ReactNode;
  mentionQuery: { q: string } | null;
  members: any[];
  onlineUsers: any;
  colorForUser: (id?: string | null) => any;
  insertMention: (name: string) => void;
  composerMobileModeBarProps: Record<string, any>;
  composerAnimatedInputProps: Record<string, any>;
  navigate: any;
  desktopModeChipsProps: Record<string, any>;
  /** Optional greeting node rendered just above the input on empty desktop state. */
  desktopGreeting?: ReactNode;
  /** Ref forwarded to the composer wrapper so the plus menu can anchor to it. */
  composerRef?: React.Ref<HTMLDivElement>;
}

/**
 * Floating bottom composer dock. Lifts to vertical-center on empty desktop
 * state, otherwise sticks to the bottom. Hosts attachments preview, busy
 * banner, plus-menu overlay, @mention dropdown, mobile mode bar, animated
 * input, desktop integrations strip, and the desktop mode chips row.
 */
export function ChatComposerSection(props: ChatComposerSectionProps) {
  const {
    sidebarCollapsed,
    loadingMessages,
    messagesLength,
    attachedFiles,
    removeAttachment,
    remoteAiBusy,
    plusMenuOpen,
    renderPlusMenu,
    mentionQuery,
    members,
    onlineUsers,
    colorForUser,
    insertMention,
    composerMobileModeBarProps,
    composerAnimatedInputProps,
    navigate,
    desktopModeChipsProps,
    desktopGreeting,
    composerRef,
  } = props;

  const isEmpty = messagesLength === 0 && !loadingMessages;
  // Auto-hide modes/templates bar once the user sends a first message. They can
  // bring it back via the toggle on the composer.
  const [userToggled, setUserToggled] = useState(false);
  const [modesShown, setModesShownState] = useState(true);
  const setModesShown = (v: boolean | ((prev: boolean) => boolean)) => {
    setUserToggled(true);
    setModesShownState(v);
  };
  const effectiveModesShown = userToggled ? modesShown : isEmpty;
  const d = desktopModeChipsProps as any;
  const hasActiveService =
    d.selectedAgent?.id === "docs" || (d.chatMode && d.chatMode !== "normal");

  // After the first message we keep a single horizontally-scrollable strip
  // (compact). Before the first message (empty state) the user asked for two
  // explicit rows on desktop: 4 chips on top, 3 chips below, no scroll.
  const chipsRowCompact = hasActiveService ? null : (
    <div
      data-chips-row
      className="hidden md:flex items-center gap-3 px-1 overflow-x-auto flex-nowrap scrollbar-none [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none" }}
    >
      <DesktopModeChips {...(desktopModeChipsProps as any)} />
    </div>
  );
  const chipsRowsEmpty = hasActiveService ? null : (
    <div
      data-chips-row
      className="hidden md:flex flex-col items-center gap-3 px-1"
    >
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <DesktopModeChips {...(desktopModeChipsProps as any)} limit={4} />
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <DesktopModeChips {...(desktopModeChipsProps as any)} offset={4} />
      </div>
    </div>
  );


  return (
    <div
      style={{
        ["--sb-left" as any]: (sidebarCollapsed ? 56 : 260) + "px",
      }}
      className={`fixed left-0 md:left-[var(--sb-left)] right-0 bottom-[var(--kb-offset,0px)] z-30 px-2 md:px-6 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] md:pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-3 md:pt-6 pointer-events-none transition-[left,top,bottom] duration-200 ease-out bg-transparent ${
        isEmpty
          ? "md:bottom-auto md:top-[calc(50%-40px)] md:-translate-y-1/2 md:bg-transparent md:backdrop-blur-0 md:border-0"
          : "md:bg-transparent md:backdrop-blur-0 md:border-0"
      }`}
    >
      <div className="max-w-3xl mx-auto space-y-2 pointer-events-auto">
        <RemoteAiBusyBanner remoteAiBusy={remoteAiBusy} />

        <UpgradeBannerMobile isEmpty={isEmpty} navigate={navigate} />

        <div className="relative mx-auto w-full max-w-3xl">
          <div data-tour="composer" className="relative">
            {mentionQuery && (
              <MentionDropdown
                members={members}
                query={mentionQuery.q}
                onlineUsers={onlineUsers}
                colorForUser={colorForUser}
                insertMention={insertMention}
              />
            )}

            <ComposerMobileModeBar
              {...(composerMobileModeBarProps as any)}
              forceHidden={!effectiveModesShown}
            />

            {!isEmpty && effectiveModesShown && chipsRowCompact ? <div className="mb-3">{chipsRowCompact}</div> : null}

            {isEmpty && desktopGreeting ? (
              <div className="hidden md:flex justify-center mb-3">{desktopGreeting}</div>
            ) : null}

            <div ref={composerRef as any} className="relative md:p-[1px] md:rounded-[28px]">
              {plusMenuOpen ? renderPlusMenu() : null}
              <div className="md:rounded-[27px] md:overflow-hidden">

              <ComposerAnimatedInput
              {...(composerAnimatedInputProps as any)}
              modesToggleVisible
              modesShown={effectiveModesShown}
              onToggleModes={() => setModesShown((v) => !v)}
              chatContext
              activeServiceHeader={
                attachedFiles.length > 0 || hasActiveService ? (
                  <>
                    <ComposerAttachments files={attachedFiles} onRemove={removeAttachment} />
                    {hasActiveService ? (
                      <ActiveServicePill
                        chatMode={d.chatMode}
                        selectedAgent={d.selectedAgent}
                        onClear={() => {
                          if (d.selectedAgent?.id === "docs") {
                            d.setSelectedAgent(null);
                          } else {
                            d.handleModeChange("normal");
                          }
                        }}
                      />
                    ) : null}
                  </>
                ) : null
              }
              />
              </div>
            </div>


          </div>

          {isEmpty && effectiveModesShown && chipsRowsEmpty ? <div className="mt-3">{chipsRowsEmpty}</div> : null}
        </div>
      </div>
    </div>
  );

}

/**
 * Small mobile-only "Get more with Megsy Pro" pill shown above the composer
 * for free users. Hidden on desktop, hidden for paid plans, and hidden while
 * the empty-state hero owns the screen so it doesn't sit alone.
 */
function UpgradeBannerMobile({
  isEmpty,
  navigate,
}: {
  isEmpty: boolean;
  navigate: (path: string) => void;
}) {
  const { isPaid, loading } = useUserPlan();
  if (loading || isPaid) return null;
  return (
    <div className="md:hidden px-1">
      <button
        type="button"
        onClick={() => navigate("/settings/billing")}
        className="w-full flex items-center gap-2.5 rounded-[12px] px-4 min-h-[44px] transition-colors active:scale-[0.995]"
        style={{
          background: "#2A2520",
          border: "1px solid #3A332C",
        }}
      >
        <Zap className="w-4 h-4 shrink-0" style={{ color: "#D97757" }} fill="#D97757" />
        <span
          className="flex-1 text-left truncate"
          style={{
            fontFamily:
              '"Styrene A", Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            fontSize: 14,
            fontWeight: 500,
            color: "#E8E0D2",
            letterSpacing: "-0.1px",
          }}
        >
          Upgrade to Megsy Pro for more messages
        </span>
        <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "#8A7E72" }} />
      </button>
    </div>
  );
}

