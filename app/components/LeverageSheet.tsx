"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN = 1;
const MAX = 25;
const ALL_TICKS = Array.from({ length: MAX - MIN + 1 }, (_, i) => i + MIN);

// Each tick column is 8px wide, gaps between them are 28px → center-to-center = 36px
const TICK_W = 8;
const TICK_GAP = 28;
const TICK_STEP = TICK_W + TICK_GAP; // 36px center-to-center

interface LeverageSheetProps {
  initialLeverage?: number;
  margin?: number;
  entryPrice?: number;
  onConfirm: (leverage: number) => void;
  onClose: () => void;
}

function formatEuropean(n: number): string {
  if (!isFinite(n) || n === 0) return "—";
  const [int, dec] = n.toFixed(1).split(".");
  return `${parseInt(int).toLocaleString("de-DE")},${dec}`;
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

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartLev = useRef(initialLeverage);
  const containerWidth = useRef(343);
  const [dragging, setDragging] = useState(false);

  const leverageRef = useRef(leverage);
  leverageRef.current = leverage;

  useEffect(() => {
    if (containerRef.current) {
      containerWidth.current = containerRef.current.clientWidth;
    }
  }, []);

  const haptic = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(6);
    }
  }, []);

  const changeLeverage = useCallback(
    (newLev: number, fromDrag = false) => {
      const clamped = Math.max(MIN, Math.min(MAX, Math.round(newLev)));
      if (clamped === leverageRef.current && fromDrag) return;
      leverageRef.current = clamped;
      setLeverage(clamped);
      haptic();
      setAnimating(true);
      setTimeout(() => setAnimating(false), 120);
    },
    [haptic]
  );

  // Translate the ruler so the selected tick aligns to the horizontal center.
  // Tick index = leverage - MIN (0-based).
  // Center of tick[i] in ruler coords = i * TICK_STEP + TICK_W / 2
  // We want that center at containerWidth / 2:
  // offset = containerWidth/2 - (index * TICK_STEP + TICK_W/2)
  const tickOffset = (lev: number) => {
    const idx = lev - MIN;
    return containerWidth.current / 2 - (idx * TICK_STEP + TICK_W / 2);
  };

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
      // Dragging LEFT → ruler moves left → higher values scroll into center
      const dx = dragStartX.current - e.clientX;
      const deltaSteps = dx / TICK_STEP;
      changeLeverage(dragStartLev.current + deltaSteps, true);
    },
    [changeLeverage]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  const positionSize = margin * leverage;

  const liqPrice =
    leverage >= 2 && entryPrice > 0
      ? entryPrice * (1 - 1 / leverage)
      : 0;
  const liqPct =
    liqPrice > 0 && entryPrice > 0
      ? (((liqPrice - entryPrice) / entryPrice) * 100).toFixed(1)
      : null;

  const offset = tickOffset(leverage);

  return (
    <div className="bg-white w-[375px] rounded-t-[8px] pt-[8px] pb-0 flex flex-col gap-[24px] items-center">
      {/* Drag handle */}
      <div className="bg-[#8d8e8e] h-[4px] rounded-full w-[40px]" />

      {/* Title + description */}
      <div className="flex flex-col gap-[8px] items-center px-[16px] w-full text-center">
        <span
          className="text-[20px] leading-[24px] text-[#020203] w-[343px]"
          style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
        >
          Leverage
        </span>
        <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
          Multiply the amount you&apos;re investing.
          <br />
          Higher leverage gives you higher return but with higher risk.
        </span>
      </div>

      {/* Min / Value / Max + Slider — grouped tightly */}
      <div className="flex flex-col gap-[2px] items-center w-full">
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
            className="text-[36px] leading-[44px] text-[#020203] text-center select-none"
            style={{
              fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
              fontWeight: 500,
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

      {/* ── Ruler / Slider ───────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="w-[343px] relative overflow-hidden select-none"
        style={{ height: 72, cursor: dragging ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >


        {/* Sliding tick ruler — positioned at the bottom of the container */}
        <div
          className="absolute bottom-0 left-0 flex items-end"
          style={{
            gap: TICK_GAP,
            transition: dragging ? "none" : "transform 0.15s ease",
            transform: `translateX(${offset}px)`,
            willChange: "transform",
          }}
        >
          {ALL_TICKS.map((tick) => {
            const isSelected = tick === leverage;
            const isPast = tick < leverage;
            const isActive = isSelected || isPast;

            const tickColor = isActive ? "#020203" : "#8d8e8e";
            const labelColor = isActive ? "#020203" : "#8d8e8e";
            // Selected: tall bar; past: medium; future: short
            const tickH = isSelected ? 52 : isActive ? 18 : 12;

            return (
              <div
                key={tick}
                className="flex flex-col items-center"
                style={{ width: TICK_W, flexShrink: 0 }}
                onClick={() => changeLeverage(tick)}
              >
                {/* Number label — hidden for selected tick */}
                <span
                  className="font-['Inter',sans-serif] text-[10px] leading-[12px]"
                  style={{
                    color: labelColor,
                    whiteSpace: "nowrap",
                    visibility: isSelected ? "hidden" : "visible",
                    transition: "color 0.1s",
                  }}
                >
                  {tick}
                </span>
                {/* Tick bar */}
                <div
                  style={{
                    width: isSelected ? 2 : 1,
                    height: tickH,
                    background: tickColor,
                    borderRadius: 2,
                    transition: "height 0.12s ease, background 0.1s",
                    marginTop: 2,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* end Min/Max + Slider group */}
      </div>

      {/* Info cards */}
      <div className="flex flex-col gap-[8px] items-start w-[343px]">
        {/* Card 1: Investment + Leverage + divider + Position Size */}
        <div className="bg-[#fafafa] rounded-[10px] p-[12px] flex flex-col gap-[10px] w-full">
          <div className="flex items-center justify-between">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              Investment
            </span>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              USDT {margin > 0 ? Math.round(margin).toLocaleString("en-US") : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              Leverage
            </span>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              x {leverage}
            </span>
          </div>
          <div className="h-px bg-[rgba(2,2,3,0.1)] w-full" />
          <div className="flex items-center justify-between">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              Position Size
            </span>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              USDT {positionSize > 0 ? Math.round(positionSize).toLocaleString("en-US") : "—"}
            </span>
          </div>
        </div>

        {/* Card 2: Est. Liquidation Price */}
        <div className="bg-[#fafafa] rounded-[10px] p-[12px] flex flex-col w-full">
          <div className="flex items-center justify-between">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              Est. Liquidation Price
            </span>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              {liqPrice > 0
                ? `USDT ${formatEuropean(liqPrice)} (${liqPct}%)`
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <button
        onClick={() => { onConfirm(leverage); onClose(); }}
        className="w-[343px] h-[44px] bg-[#0a68f4] rounded-[8px] flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity"
      >
        <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">
          Confirm
        </span>
      </button>

      {/* Home indicator */}
      <div className="w-[134px] h-[34px] flex items-end justify-center pb-2">
        <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
      </div>
    </div>
  );
}
