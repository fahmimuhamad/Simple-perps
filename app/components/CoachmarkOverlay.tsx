"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "../LangContext";

export type CoachmarkStep = 1 | 2 | 3;

interface CoachmarkOverlayProps {
  step: CoachmarkStep;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onNext: () => void;
  onDone: () => void;
}

// Arrow horizontal alignment for each step
const ARROW_ALIGN: Record<CoachmarkStep, "center" | "left"> = {
  1: "center",
  2: "center",
  3: "left",
};

// data-coachmark attribute values to scroll to
const COACHMARK_TARGETS: Record<CoachmarkStep, string> = {
  1: "position-card",
  2: "position-pnl",
  3: "position-liq",
};

// Padding around the spotlight highlight (px)
const SPOTLIGHT_PADDING = 8;

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
}

export default function CoachmarkOverlay({
  step,
  scrollContainerRef,
  onNext,
  onDone,
}: CoachmarkOverlayProps) {
  const { t } = useLang();
  const COACHMARK_DATA: Record<CoachmarkStep, { title: string; body: string; action: "Next" | "OK" }> = {
    1: { title: t("coachA1Title"), body: t("coachA1Body"), action: "Next" },
    2: { title: t("coachA2Title"), body: t("coachA2Body"), action: "Next" },
    3: { title: t("coachA3Title"), body: t("coachA3Body"), action: "OK" },
  };
  const data = COACHMARK_DATA[step];
  const isLast = step === 3;
  const overlayRef = useRef<HTMLDivElement>(null);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);

  // Auto-scroll so the target element is visible when step changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const target = container.querySelector(`[data-coachmark="${COACHMARK_TARGETS[step]}"]`);
    if (!target) return;

    const targetEl = target as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // How far to scroll: bring target into view with some padding above
    const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
    const desiredScrollTop = relativeTop - 80; // 80px padding above target

    container.scrollTo({ top: Math.max(0, desiredScrollTop), behavior: "smooth" });
  }, [step, scrollContainerRef]);

  // Calculate spotlight rect relative to the overlay container
  useEffect(() => {
    function updateSpotlight() {
      const container = scrollContainerRef.current;
      const overlay = overlayRef.current;
      if (!container || !overlay) return;

      const target = container.querySelector(`[data-coachmark="${COACHMARK_TARGETS[step]}"]`) as HTMLElement | null;
      if (!target) return;

      const overlayRect = overlay.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Determine border radius based on target
      const br = step === 1 ? 16 : step === 2 ? 8 : 4;

      setSpotlightRect({
        top: targetRect.top - overlayRect.top - SPOTLIGHT_PADDING,
        left: targetRect.left - overlayRect.left - SPOTLIGHT_PADDING,
        width: targetRect.width + SPOTLIGHT_PADDING * 2,
        height: targetRect.height + SPOTLIGHT_PADDING * 2,
        borderRadius: br + SPOTLIGHT_PADDING,
      });
    }

    // Run after scroll settles
    const timer = setTimeout(updateSpotlight, 350);
    // Also run immediately (for cases where no scroll is needed)
    updateSpotlight();

    return () => clearTimeout(timer);
  }, [step, scrollContainerRef]);

  return (
    <div ref={overlayRef} className="absolute inset-0 z-30 pointer-events-none">
      {/* SVG spotlight mask — covers entire overlay with a cutout for the target */}
      {spotlightRect && (
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <mask id="spotlight-mask">
              {/* White = show overlay (dark) */}
              <rect width="100%" height="100%" fill="white" />
              {/* Black = hide overlay (spotlight/cutout) */}
              <rect
                x={spotlightRect.left}
                y={spotlightRect.top}
                width={spotlightRect.width}
                height={spotlightRect.height}
                rx={spotlightRect.borderRadius}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      )}

      {/* Fallback flat scrim if spotlight not calculated yet */}
      {!spotlightRect && (
        <div className="absolute inset-0 bg-black/60" />
      )}

      {/* Tooltip — interactive, needs pointer-events-auto */}
      <div className="pointer-events-auto">
        <TooltipCard
          step={step}
          title={data.title}
          body={data.body}
          action={data.action}
          arrowAlign={ARROW_ALIGN[step]}
          scrollContainerRef={scrollContainerRef}
          spotlightRect={spotlightRect}
          onAction={isLast ? onDone : onNext}
        />
      </div>
    </div>
  );
}

interface TooltipCardProps {
  step: CoachmarkStep;
  title: string;
  body: string;
  action: "Next" | "OK";
  arrowAlign: "center" | "left";
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  spotlightRect: SpotlightRect | null;
  onAction: () => void;
}

const TooltipCard = ({
  step,
  title,
  body,
  action,
  arrowAlign,
  scrollContainerRef,
  spotlightRect,
  onAction,
}: TooltipCardProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;

    let topPx: number;

    if (spotlightRect) {
      // Position tooltip above the spotlight rect
      const tooltipHeight = tooltipRef.current.offsetHeight || 140;
      topPx = spotlightRect.top - tooltipHeight - 11;
    } else {
      // Fallback: use target element position
      const container = scrollContainerRef.current;
      if (!container) return;
      const target = container.querySelector(`[data-coachmark="${COACHMARK_TARGETS[step]}"]`) as HTMLElement | null;
      if (!target) return;
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetTopInViewport = targetRect.top - containerRect.top;
      const tooltipHeight = tooltipRef.current.offsetHeight || 140;
      topPx = targetTopInViewport - tooltipHeight - 11;
    }

    // Clamp: don't go above 60px (below status bar + nav)
    topPx = Math.max(60, topPx);

    tooltipRef.current.style.top = `${topPx}px`;
  });

  return (
    <div
      ref={tooltipRef}
      className="absolute left-[16px] right-[16px] z-40"
      style={{ top: 200 }} // initial fallback, overridden by effect
    >
      {/* White card */}
      <div className="bg-white rounded-[8px] p-[16px] flex flex-col gap-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col gap-[8px]">
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
            {title}
          </span>
          <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
            {body}
          </span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onAction}
            className="bg-[#0a68f4] rounded-[8px] px-[24px] py-[8px] flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity"
          >
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">
              {action}
            </span>
          </button>
        </div>
      </div>

      {/* Downward arrow */}
      <div
        className="flex"
        style={{
          justifyContent: arrowAlign === "left" ? "flex-start" : "center",
          paddingLeft: arrowAlign === "left" ? 40 : 0,
        }}
      >
        <svg width="13" height="11" viewBox="0 0 13 11" fill="white">
          <path d="M6.5 11L0 0h13L6.5 11z" />
        </svg>
      </div>
    </div>
  );
};
