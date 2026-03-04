"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN = 1;
const MAX = 25;
const ALL_TICKS = Array.from({ length: MAX - MIN + 1 }, (_, i) => i + MIN);
const LABELED = new Set([1, 5, 10, 15, 20, 25]);
const TICK_SPACING = 28; // px between tick centers

interface LeverageSheetProps {
  initialLeverage?: number;
  margin?: number;
  entryPrice?: number;
  onConfirm: (leverage: number) => void;
  onClose: () => void;
}

export default function LeverageSheet({
  initialLeverage = 1,
  margin = 0,
  entryPrice = 0,
  onConfirm,
  onClose,
}: LeverageSheetProps) {
  const [leverage, setLeverage] = useState(initialLeverage);
  const [animating, setAnimating] = useState(false);
  const [pulseTick, setPulseTick] = useState<number | null>(null);

  // The outer container (measures available width)
  const containerRef = useRef<HTMLDivElement>(null);
  // Drag tracking
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartLev = useRef(initialLeverage);
  // Store containerWidth once measured
  const containerWidth = useRef(343);

  const leverageRef = useRef(leverage);
  leverageRef.current = leverage;

  useEffect(() => {
    if (containerRef.current) {
      containerWidth.current = containerRef.current.clientWidth;
    }
  }, []);

  const haptic = useCallback((strong = false) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(strong ? [8, 4, 8] : 6);
    }
  }, []);

  const changeLeverage = useCallback(
    (newLev: number, fromDrag = false) => {
      const clamped = Math.max(MIN, Math.min(MAX, Math.round(newLev)));
      if (clamped === leverageRef.current && fromDrag) return;
      leverageRef.current = clamped;
      setLeverage(clamped);
      haptic(fromDrag ? false : true);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 120);
      setPulseTick(clamped);
      setTimeout(() => setPulseTick(null), 300);
    },
    [haptic]
  );

  // The selected tick stays pinned at the center of the container.
  // translateX moves the ruler left/right so tick[leverage-MIN] is at center.
  // center of container = containerWidth / 2
  // position of selected tick in ruler = (leverage - MIN) * TICK_SPACING
  // offset = center - tickPos  →  ruler shifts so that tick lands at center
  const tickOffset = (lev: number) =>
    containerWidth.current / 2 - (lev - MIN) * TICK_SPACING;

  const [dragging, setDragging] = useState(false);

  // ── Pointer drag ──────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartLev.current = leverageRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      // Dragging LEFT increases leverage (ticks scroll left = higher values come to center)
      const dx = dragStartX.current - e.clientX;
      const deltaSteps = dx / TICK_SPACING;
      const newLev = dragStartLev.current + deltaSteps;
      changeLeverage(newLev, true);
    },
    [changeLeverage]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  // Liquidation price estimate
  const positionSize = margin * leverage;
  const liqPrice = leverage >= 2 ? entryPrice * (1 - 1 / leverage) * 1.02 : 0;
  const liqPct =
    liqPrice > 0
      ? (((liqPrice - entryPrice) / entryPrice) * 100).toFixed(1)
      : null;

  const offset = tickOffset(leverage);

  return (
    <div className="bg-white w-[375px] rounded-t-[8px] pt-[8px] pb-0 flex flex-col gap-[24px] items-center">
      {/* Drag handle */}
      <div className="w-[40px] h-[4px] rounded-full bg-[#8d8e8e]" />

      {/* Title + description */}
      <div className="flex flex-col gap-[8px] items-center px-[16px] w-full text-center">
        <span className="font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] text-[20px] leading-[24px] text-[#020203] w-[343px]">
          Leverage
        </span>
        <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
          Multiply your investment power.
          <br />
          Higher leverage gives you higher return but also higher risk
        </span>
      </div>

      {/* Min / Value / Max row */}
      <div className="flex gap-[8px] items-center justify-center w-[343px]">
        <button
          onClick={() => changeLeverage(MIN)}
          className="flex-1 h-[44px] bg-[#f2f2f2] rounded-[8px] flex items-center justify-center hover:bg-[#e8e8e8] active:scale-95 transition-all"
        >
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
            Min
          </span>
        </button>

        <div className="flex-1 flex items-center justify-center">
          <span
            className="font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] text-[36px] leading-[44px] text-[#020203] text-center select-none"
            style={{
              display: "inline-block",
              transition: "transform 0.1s ease, opacity 0.1s ease",
              transform: animating ? "scale(1.12)" : "scale(1)",
              opacity: animating ? 0.7 : 1,
            }}
          >
            {leverage}x
          </span>
        </div>

        <button
          onClick={() => changeLeverage(MAX)}
          className="flex-1 h-[44px] bg-[#f2f2f2] rounded-[8px] flex items-center justify-center hover:bg-[#e8e8e8] active:scale-95 transition-all"
        >
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
            Max
          </span>
        </button>
      </div>

      {/* ── Ruler ─────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="w-[343px] relative overflow-hidden select-none"
        style={{ height: 72, cursor: "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >

        {/* Sliding tick ruler */}
        <div
          className="absolute top-0 bottom-0 flex items-end"
          style={{
            // No transition during drag, smooth snap otherwise
            transition: dragging ? "none" : "transform 0.15s ease",
            transform: `translateX(${offset}px)`,
            willChange: "transform",
          }}
        >
          {ALL_TICKS.map((tick) => {
            const isSelected = tick === leverage;
            const isLabeled = LABELED.has(tick);
            const isPulsing = pulseTick === tick;
            const tickH = isSelected ? 52 : isLabeled ? 32 : 20;
            const tickW = isSelected ? 3 : 1.5;
            const tickColor =
              tick < leverage
                ? "#020203"
                : isSelected
                ? "#020203"
                : "#d0d0d0";

            return (
              <div
                key={tick}
                className="flex flex-col items-center justify-end"
                style={{ width: TICK_SPACING, height: "100%", flexShrink: 0 }}
                onClick={() => changeLeverage(tick)}
              >
                {/* Number label */}
                <span
                  className="font-['Inter',sans-serif] mb-[5px]"
                  style={{
                    fontSize: isSelected ? 12 : 11,
                    lineHeight: "14px",
                    fontWeight: isSelected ? 700 : 400,
                    color: isLabeled ? (isSelected ? "#020203" : "#8d8e8e") : "transparent",
                    transition: "transform 0.15s ease, color 0.1s",
                    transform: isPulsing ? "scale(1.25)" : "scale(1)",
                    display: "inline-block",
                  }}
                >
                  {tick}
                </span>
                {/* Tick bar */}
                <div
                  style={{
                    width: tickW,
                    height: tickH,
                    background: tickColor,
                    borderRadius: tickW,
                    transition: "height 0.15s ease, width 0.1s ease, background 0.1s",
                    transform: isPulsing ? "scaleY(1.18)" : "scaleY(1)",
                    transformOrigin: "bottom",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Info card */}
      <div className="bg-[#fafafa] rounded-[10px] p-[12px] flex flex-col gap-[10px] w-[343px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              Position Size
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#8d8e8e" strokeWidth="1.2" />
              <path d="M7 6.5v3.5M7 4.5v.5" stroke="#8d8e8e" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
            USDT {positionSize.toLocaleString("en-US")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              Est. Liq. Price
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#8d8e8e" strokeWidth="1.2" />
              <path d="M7 6.5v3.5M7 4.5v.5" stroke="#8d8e8e" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
            {liqPrice > 0
              ? `USDT ${liqPrice.toLocaleString("en-US", { maximumFractionDigits: 1 })} (${liqPct}%)`
              : "—"}
          </span>
        </div>
      </div>

      {/* Confirm */}
      <div className="w-[343px]">
        <button
          onClick={() => { onConfirm(leverage); onClose(); }}
          className="w-full h-[44px] bg-[#0a68f4] rounded-[8px] flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity"
        >
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">
            Confirm
          </span>
        </button>
      </div>

      {/* Home indicator */}
      <div className="w-[134px] h-[34px] flex items-end justify-center pb-2">
        <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
      </div>
    </div>
  );
}
