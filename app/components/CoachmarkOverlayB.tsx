"use client";

import { useEffect, useRef, useState } from "react";

export type CoachmarkStepB = 1 | 2;

interface CoachmarkOverlayBProps {
  step: CoachmarkStepB;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onNext: () => void;
  onDone: () => void;
}

const COACHMARK_DATA: Record<CoachmarkStepB, { title: string; body: string; action: "Next" | "OK" }> = {
  1: {
    title: "This Is Your Position",
    body: "Monitor your unrealized P&L here and easily adjust your TP/SL settings anytime.",
    action: "Next",
  },
  2: {
    title: "Track Your Floating P&L",
    body: "See your ROI in real-time based on the difference between your entry price and the current market price, amplified by your leverage.",
    action: "OK",
  },
};

const COACHMARK_TARGETS: Record<CoachmarkStepB, string> = {
  1: "position-card",
  2: "position-pnl",
};

const SPOTLIGHT_PADDING = 8;

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
}

export default function CoachmarkOverlayB({
  step,
  scrollContainerRef,
  onNext,
  onDone,
}: CoachmarkOverlayBProps) {
  const data = COACHMARK_DATA[step];
  const isLast = step === 2;
  const overlayRef = useRef<HTMLDivElement>(null);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);

  // Auto-scroll to target
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const target = container.querySelector(`[data-coachmark="${COACHMARK_TARGETS[step]}"]`);
    if (!target) return;
    const targetEl = target as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
    container.scrollTo({ top: Math.max(0, relativeTop - 80), behavior: "smooth" });
  }, [step, scrollContainerRef]);

  // Calculate spotlight rect
  useEffect(() => {
    function updateSpotlight() {
      const container = scrollContainerRef.current;
      const overlay = overlayRef.current;
      if (!container || !overlay) return;
      const target = container.querySelector(`[data-coachmark="${COACHMARK_TARGETS[step]}"]`) as HTMLElement | null;
      if (!target) return;
      const overlayRect = overlay.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const br = step === 1 ? 16 : 8;
      setSpotlightRect({
        top: targetRect.top - overlayRect.top - SPOTLIGHT_PADDING,
        left: targetRect.left - overlayRect.left - SPOTLIGHT_PADDING,
        width: targetRect.width + SPOTLIGHT_PADDING * 2,
        height: targetRect.height + SPOTLIGHT_PADDING * 2,
        borderRadius: br + SPOTLIGHT_PADDING,
      });
    }
    const timer = setTimeout(updateSpotlight, 350);
    updateSpotlight();
    return () => clearTimeout(timer);
  }, [step, scrollContainerRef]);

  return (
    <div ref={overlayRef} className="absolute inset-0 z-30 pointer-events-none">
      {/* Spotlight mask */}
      {spotlightRect && (
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          <defs>
            <mask id="spotlight-mask-b">
              <rect width="100%" height="100%" fill="white" />
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
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#spotlight-mask-b)" />
        </svg>
      )}
      {!spotlightRect && <div className="absolute inset-0 bg-black/60" />}

      {/* Tooltip card */}
      <div className="pointer-events-auto">
        <TooltipCard
          step={step}
          title={data.title}
          body={data.body}
          action={data.action}
          scrollContainerRef={scrollContainerRef}
          spotlightRect={spotlightRect}
          onAction={isLast ? onDone : onNext}
        />
      </div>
    </div>
  );
}

interface TooltipCardProps {
  step: CoachmarkStepB;
  title: string;
  body: string;
  action: "Next" | "OK";
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  spotlightRect: SpotlightRect | null;
  onAction: () => void;
}

const TooltipCard = ({ step, title, body, action, scrollContainerRef, spotlightRect, onAction }: TooltipCardProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;
    let topPx: number;
    if (spotlightRect) {
      const tooltipHeight = tooltipRef.current.offsetHeight || 140;
      topPx = spotlightRect.top - tooltipHeight - 11;
    } else {
      const container = scrollContainerRef.current;
      if (!container) return;
      const target = container.querySelector(`[data-coachmark="${COACHMARK_TARGETS[step]}"]`) as HTMLElement | null;
      if (!target) return;
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight || 140;
      topPx = targetRect.top - containerRect.top - tooltipHeight - 11;
    }
    topPx = Math.max(60, topPx);
    tooltipRef.current.style.top = `${topPx}px`;
  });

  return (
    <div
      ref={tooltipRef}
      className="absolute left-[16px] right-[16px] z-40"
      style={{ top: 200 }}
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
            className="bg-[#0f7bff] rounded-[8px] px-[24px] py-[8px] flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity"
          >
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">
              {action}
            </span>
          </button>
        </div>
      </div>

      {/* Downward arrow */}
      <div className="flex justify-center">
        <svg width="13" height="11" viewBox="0 0 13 11" fill="white">
          <path d="M6.5 11L0 0h13L6.5 11z" />
        </svg>
      </div>
    </div>
  );
};
