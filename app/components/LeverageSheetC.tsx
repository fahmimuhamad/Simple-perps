"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "../LangContext";

const MIN = 1;
const MAX = 25;
const ALL_TICKS = Array.from({ length: MAX - MIN + 1 }, (_, i) => i + MIN);
const TICK_W = 8;
const TICK_GAP = 28;
const TICK_STEP = TICK_W + TICK_GAP;

interface LeverageSheetCProps {
  initialLeverage?: number;
  margin?: number;
  entryPrice?: number;
  side?: "Long" | "Short";
  onConfirm: (leverage: number) => void;
  onClose: () => void;
}

function formatEuropean(n: number): string {
  if (!isFinite(n) || n === 0) return "—";
  const [int, dec] = n.toFixed(1).split(".");
  return `${parseInt(int).toLocaleString("de-DE")},${dec}`;
}

export default function LeverageSheetC({
  initialLeverage = 2,
  margin = 0,
  entryPrice = 0,
  side = "Long",
  onConfirm,
  onClose,
}: LeverageSheetCProps) {
  const { t, lang } = useLang();
  const [leverage, setLeverage] = useState(initialLeverage);
  const [animating, setAnimating] = useState(false);
  const [liqTooltipOpen, setLiqTooltipOpen] = useState(false);
  const [illustrationSheetOpen, setIllustrationSheetOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartLev = useRef(initialLeverage);
  const containerWidth = useRef(343);
  const [dragging, setDragging] = useState(false);
  const leverageRef = useRef(leverage);
  leverageRef.current = leverage;

  useEffect(() => {
    if (containerRef.current) containerWidth.current = containerRef.current.clientWidth;
  }, []);

  const haptic = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(6);
  }, []);

  const changeLeverage = useCallback((newLev: number, fromDrag = false) => {
    const clamped = Math.max(MIN, Math.min(MAX, Math.round(newLev)));
    if (clamped === leverageRef.current && fromDrag) return;
    leverageRef.current = clamped;
    setLeverage(clamped);
    haptic();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 120);
  }, [haptic]);

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

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    changeLeverage(dragStartLev.current + (dragStartX.current - e.clientX) / TICK_STEP, true);
  }, [changeLeverage]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  const liqPrice = leverage >= 2 && entryPrice > 0 ? entryPrice * (1 - 1 / leverage) : 0;
  const liqPct = liqPrice > 0 && entryPrice > 0
    ? (((liqPrice - entryPrice) / entryPrice) * 100).toFixed(1)
    : null;
  const positionSize = margin * leverage;
  const offset = tickOffset(leverage);
  const maxAdverseMove = Math.min(100, Math.round((1 / leverage) * 100));

  return (
    <div className="bg-white w-full rounded-t-[8px] pt-[12px] pb-0 flex flex-col items-center gap-[24px] relative">

      {/* Drag handle */}
      <div className="bg-[#d0d0d0] h-[4px] rounded-full w-[36px]" />

      {/* Title + description */}
      <div className="flex flex-col gap-[8px] items-center px-[16px] w-full text-center">
        <span
          className="text-[20px] leading-[24px] text-[#020203] w-full text-center"
          style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
        >
          {t("leverage")}
        </span>
        <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
          {lang === "id"
            ? "Kalikan potensi profitmu dengan leverage."
            : "Multiply your potential profit with leverage."}
        </span>
      </div>

      {/* Leverage number + ruler */}
      <div className="flex flex-col gap-0 w-full">
        <div className="flex items-center justify-between w-full px-[16px]">
          <button
            onClick={() => changeLeverage(MIN)}
            className="w-[56px] h-[36px] rounded-[8px] bg-[#f2f2f2] flex items-center justify-center active:bg-[#e4e4e4] transition-colors"
          >
            <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#020203]">{t("min")}</span>
          </button>

          <span
            className="text-[48px] leading-[52px] text-[#020203] select-none tabular-nums"
            style={{
              fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
              fontWeight: 500,
              transition: "transform 0.1s ease, opacity 0.1s ease",
              transform: animating ? "scale(1.08)" : "scale(1)",
              opacity: animating ? 0.6 : 1,
            }}
          >
            {leverage}x
          </span>

          <button
            onClick={() => changeLeverage(MAX)}
            className="w-[56px] h-[36px] rounded-[8px] bg-[#f2f2f2] flex items-center justify-center active:bg-[#e4e4e4] transition-colors"
          >
            <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#020203]">{t("max")}</span>
          </button>
        </div>

        {/* Drag ruler */}
        <div
          ref={containerRef}
          className="w-full px-[16px] relative overflow-hidden select-none"
          style={{
            height: 72,
            cursor: dragging ? "grabbing" : "grab",
            maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
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
              return (
                <div
                  key={tick}
                  className="flex flex-col items-center"
                  style={{ width: TICK_W, flexShrink: 0 }}
                  onClick={() => changeLeverage(tick)}
                >
                  <span
                    className="font-['Inter',sans-serif] text-[10px] leading-[12px]"
                    style={{ color: isSelected ? "#0a68f4" : "#c0c0c0", visibility: isSelected ? "hidden" : "visible" }}
                  >
                    {tick}
                  </span>
                  <div style={{
                    width: isSelected ? 3 : 1,
                    height: isSelected ? 52 : 20,
                    background: isSelected ? "#0a68f4" : "#d0d0d0",
                    borderRadius: 2,
                    transition: "height 0.12s ease",
                    marginTop: 2,
                  }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info cards — same structure as LeverageSheet */}
      <div className="flex flex-col gap-[8px] items-start w-full px-[16px]">

        {/* Card 1: Investment + Leverage + Position Size */}
        <div className="bg-[#fafafa] rounded-[10px] p-[12px] flex flex-col gap-[10px] w-full">
          <div className="flex items-center justify-between">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              {t("investment")}
            </span>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              USDT {margin > 0 ? Math.round(margin).toLocaleString("en-US") : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              {t("leverage")}
            </span>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              x {leverage}
            </span>
          </div>
          <div className="h-px bg-[rgba(2,2,3,0.1)] w-full" />
          <div className="flex items-center justify-between">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
              {t("positionSize")}
            </span>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              USDT {positionSize > 0 ? Math.round(positionSize).toLocaleString("en-US") : "—"}
            </span>
          </div>
        </div>

        {/* Card 2: Est. Liquidation Price */}
        <div className="bg-[#fafafa] rounded-[10px] p-[12px] flex flex-col w-full relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[4px]">
              <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#8d8e8e]">
                {t("estLiqPriceLeverage")}
              </span>
              <button onClick={() => setLiqTooltipOpen((v) => !v)}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="#c0c0c0"/>
                  <line x1="7" y1="6" x2="7" y2="10" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="7" cy="4.5" r="0.75" fill="#c0c0c0"/>
                </svg>
              </button>
            </div>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              {liqPrice > 0
                ? `USDT ${formatEuropean(liqPrice)} (${liqPct}%)`
                : "—"}
            </span>
          </div>
          {liqTooltipOpen && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: 0, right: 0,
              zIndex: 50,
              backgroundColor: "#1a1a1a",
              borderRadius: 10,
              padding: "10px 12px",
            }}>
              <span className="font-['Inter',sans-serif] text-[11px] leading-[16px] text-white">
                {lang === "id"
                  ? "Harga di mana posisimu otomatis ditutup."
                  : "The price at which your position automatically closes."}
              </span>
              <div style={{
                position: "absolute",
                bottom: -6, left: "50%",
                transform: "translateX(-50%)",
                width: 0, height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #1a1a1a",
              }} />
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[rgba(2,2,3,0.06)]" />

      {/* Illustration entry point */}
      <button
        onClick={() => setIllustrationSheetOpen(true)}
        className="flex items-center justify-between w-full px-[16px] active:opacity-60 transition-opacity"
      >
        <div className="flex flex-col gap-[2px] items-start text-left">
          <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.6px] text-[#8d8e8e]">
            {t("illustrationBadge")}
          </span>
          <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#020203]">
            {t("illustrationTitle")}
          </span>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginLeft: 8 }}>
          <path d="M7.5 5L12.5 10L7.5 15" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Confirm button */}
      <button
        onClick={() => { onConfirm(leverage); onClose(); }}
        className="w-[calc(100%-32px)] h-[44px] bg-[#0a68f4] rounded-[8px] flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity"
      >
        <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">{t("confirm")}</span>
      </button>

      {/* Home indicator */}
      <div className="w-[134px] flex items-end justify-center pb-2 safe-bottom">
        <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
      </div>

      {/* ── Illustration sheet overlay ── */}
      {/* Scrim — full viewport, but pointer-events only when open */}
      <div
        onClick={() => setIllustrationSheetOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          opacity: illustrationSheetOpen ? 1 : 0,
          transition: "opacity 0.25s ease",
          zIndex: 40,
          pointerEvents: illustrationSheetOpen ? "auto" : "none",
        }}
      />

      {/* Sheet panel — constrained to phone frame width, centered */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: illustrationSheetOpen
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(100%)",
          width: "100%",
          maxWidth: 390,
          zIndex: 41,
          backgroundColor: "#fff",
          borderRadius: "8px 8px 0 0",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92dvh",
          overflow: "hidden",
        }}
      >
        {/* Scrollable content */}
        <div
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            paddingTop: 12,
          }}
        >
          {/* Drag handle */}
          <div className="bg-[#d0d0d0] h-[4px] rounded-full w-[36px] self-center flex-shrink-0" />

          {/* Header */}
          <div className="flex flex-col gap-[4px] px-[24px]">
            <span className="font-['Inter',sans-serif] text-[10px] font-semibold uppercase tracking-[0.6px] text-[#8d8e8e]">
              {t("illustrationBadge")}
            </span>
            <span style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500, fontSize: 20, lineHeight: "24px", color: "#020203" }}>
              {t("illustrationTitle")}
            </span>
          </div>

          {/* ── Comparison bars — fixed +10% scenario, 4 levels ── */}
          <div className="flex flex-col gap-[14px] px-[24px]">

            <div className="flex items-baseline justify-between">
              <span className="font-['Inter',sans-serif] text-[11px] text-[#8d8e8e]">
                {lang === "id"
                  ? side === "Long" ? "Jika harga naik +10%" : "Jika harga turun -10%"
                  : side === "Long" ? "If price goes up +10%" : "If price goes down -10%"}
              </span>
              <span className="font-['Inter',sans-serif] text-[10px] text-[#c0c0c0]">ROI</span>
            </div>

            {(() => {
              // Build the bar set: anchors 1x, 2x, 5x + user's leverage (deduplicated)
              const ANCHOR_LEVS = [1, 2, 5];
              const allLevs = [...new Set([...ANCHOR_LEVS, leverage])].sort((a, b) => a - b);
              const maxLev = Math.max(...allLevs);

              return allLevs.map((lev) => {
                const isUser = lev === leverage;
                const roi = lev * 10;
                const barPct = (lev / maxLev) * 100;
                const label = lev === 1
                  ? (lang === "id" ? "Spot 1x" : "Spot 1x")
                  : `Futures ${lev}x`;

                return (
                  <div key={lev} className="flex flex-col gap-[6px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[6px]">
                        <span
                          className="font-['Inter',sans-serif] text-[12px]"
                          style={{
                            fontWeight: isUser ? 600 : 400,
                            color: isUser ? "#25a764" : "#8d8e8e",
                          }}
                        >
                          {label}
                        </span>
                        {isUser && (
                          <span className="font-['Inter',sans-serif] text-[10px] text-white bg-[#25a764] px-[6px] py-[1px] rounded-full leading-[16px]">
                            {lang === "id" ? "kamu" : "you"}
                          </span>
                        )}
                      </div>
                      <span
                        className="font-['Inter',sans-serif] text-[12px]"
                        style={{
                          fontWeight: isUser ? 600 : 400,
                          color: isUser ? "#25a764" : "#8d8e8e",
                        }}
                      >
                        +{roi}%
                      </span>
                    </div>
                    <div className="w-full h-[8px] bg-[#f0f0f0] rounded-full overflow-hidden">
                      <div style={{
                        width: `${barPct}%`,
                        height: "100%",
                        backgroundColor: isUser ? "#25a764" : "#d8d8d8",
                        borderRadius: 999,
                        transition: "width 0.35s ease",
                      }} />
                    </div>
                  </div>
                );
              });
            })()}

          </div>

          {/* ── Neutral mechanic callout ── */}
          <div className="bg-[#f7f7f7] rounded-[14px] mx-[24px] px-[16px] py-[14px] flex items-start gap-[12px]">
            <div className="flex-shrink-0 w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center">
              {/* Balance scale icon — neutral, not warning */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2v14M4 5l5-3 5 3M4 13l5 3 5-3M4 5l-2 4 2 4M14 5l2 4-2 4M4 9h10" stroke="#8d8e8e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[#626363]">
              {lang === "id"
                ? `Leverage ${leverage}x memperbesar profit dan loss kamu ${leverage}× lebih besar dari Spot. Semakin tinggi leverage, semakin besar pengaruhnya.`
                : `${leverage}x leverage multiplies both your profit and loss by ${leverage}×. The higher the leverage, the bigger the effect.`}
            </span>
          </div>

          {/* ── Liquidation note — plain text, no bar, no color alarm ── */}
          <div className="px-[24px] flex items-start gap-[8px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="7" cy="7" r="6.5" stroke="#c0c0c0"/>
              <line x1="7" y1="6" x2="7" y2="10" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="7" cy="4.5" r="0.75" fill="#c0c0c0"/>
            </svg>
            <span className="font-['Inter',sans-serif] text-[11px] leading-[16px] text-[#8d8e8e]">
              {lang === "id"
                ? `Dengan leverage ${leverage}x, posisimu akan ditutup otomatis jika harga bergerak lebih dari ${maxAdverseMove}% melawanmu.`
                : `With ${leverage}x leverage, your position closes automatically if price moves more than ${maxAdverseMove}% against you.`}
            </span>
          </div>

          {/* Home indicator */}
          <div className="w-[134px] flex items-end justify-center pb-2 safe-bottom self-center">
            <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
          </div>
        </div>
      </div>
    </div>
  );
}
