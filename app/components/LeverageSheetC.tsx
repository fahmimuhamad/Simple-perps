"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "../LangContext";

const MIN = 1;
const MAX = 25;
const ALL_TICKS = Array.from({ length: MAX - MIN + 1 }, (_, i) => i + MIN);
const TICK_W = 8;
const TICK_GAP = 28;
const TICK_STEP = TICK_W + TICK_GAP;

const PROFIT_SCENARIOS = [5, 10, 20] as const;
type ProfitScenario = typeof PROFIT_SCENARIOS[number];

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
  const [activeScenario, setActiveScenario] = useState<ProfitScenario>(10);
  const [liqTooltipOpen, setLiqTooltipOpen] = useState(false);

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
  const offset = tickOffset(leverage);

  const investAmount = margin > 0 ? margin : 100;
  const spotPnl = investAmount * (activeScenario / 100);
  const futuresPnl = investAmount * leverage * (activeScenario / 100);
  const futuresRoi = activeScenario * leverage;

  return (
    <div className="bg-white w-full rounded-t-[16px] pt-[12px] pb-0 flex flex-col items-center gap-[24px]">

      {/* Drag handle */}
      <div className="bg-[#d0d0d0] h-[4px] rounded-full w-[36px]" />

      {/* Title + description */}
      <div className="flex flex-col gap-[6px] items-center px-[24px] w-full text-center">
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

      {/* Leverage number + ruler — grouped with tight internal gap */}
      <div className="flex flex-col gap-0 w-full">
        <div className="flex items-center justify-between w-full px-[24px]">
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
          className="w-full px-[24px] relative overflow-hidden select-none"
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

      {/* Chips */}
      <div className="flex gap-[8px] w-full px-[24px]">
        <div className="flex-1 bg-[#f7f7f7] rounded-[12px] px-[14px] py-[12px] flex flex-col gap-[4px]">
          <span className="font-['Inter',sans-serif] text-[11px] text-[#8d8e8e]">
            {t("investmentMargin")}
          </span>
          <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#020203]">
            USDT {margin > 0 ? Math.round(margin).toLocaleString("en-US") : "—"}
          </span>
        </div>

        <div className="flex-1 bg-[#f7f7f7] rounded-[12px] px-[14px] py-[12px] flex flex-col gap-[4px] relative">
          <div className="flex items-center gap-[4px]">
            <span className="font-['Inter',sans-serif] text-[11px] text-[#8d8e8e]">
              {lang === "id" ? "Harga Likuidasi" : "Liq. Price"}
            </span>
            <button onClick={() => setLiqTooltipOpen((v) => !v)}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="#c0c0c0"/>
                <line x1="7" y1="6" x2="7" y2="10" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7" cy="4.5" r="0.75" fill="#c0c0c0"/>
              </svg>
            </button>
          </div>
          <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#020203]">
            {liqPrice > 0 ? `USDT ${formatEuropean(liqPrice)}` : "—"}
          </span>
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

      {/* Illustration */}
      <div className="flex flex-col gap-[16px] w-full px-[24px]">

        <div className="flex items-center justify-between w-full">
          <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#020203]">
            {lang === "id"
              ? side === "Long" ? "Jika harga naik" : "Jika harga turun"
              : side === "Long" ? "If price goes up" : "If price goes down"}
          </span>
          <div className="flex items-center gap-[6px]">
            {PROFIT_SCENARIOS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveScenario(s)}
                className="px-[10px] h-[26px] rounded-full text-[11px] font-semibold font-['Inter',sans-serif] transition-colors"
                style={{
                  backgroundColor: activeScenario === s ? "#25a764" : "#f2f2f2",
                  color: activeScenario === s ? "#fff" : "#626363",
                }}
              >
                {side === "Long" ? "+" : "-"}{s}%
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <span className="font-['Inter',sans-serif] text-[12px] text-[#8d8e8e]">Spot 1x</span>
              <span className="font-['Inter',sans-serif] text-[12px] text-[#8d8e8e]">
                {side === "Long"
                  ? `+USDT ${Math.round(spotPnl).toLocaleString("en-US")} · +${activeScenario}%`
                  : lang === "id" ? "Tidak bisa profit" : "Can't profit"}
              </span>
            </div>
            <div className="w-full h-[8px] bg-[#f0f0f0] rounded-full overflow-hidden">
              <div style={{
                width: side === "Short" ? "0%" : leverage > 1 ? `${(1 / leverage) * 100}%` : "100%",
                height: "100%",
                backgroundColor: "#d0d0d0",
                borderRadius: 999,
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <span className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#25a764]">
                Futures {leverage}x
              </span>
              <span className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#25a764]">
                +USDT {Math.round(futuresPnl).toLocaleString("en-US")} · +{futuresRoi}%
              </span>
            </div>
            <div className="w-full h-[8px] bg-[#f0f0f0] rounded-full overflow-hidden">
              <div style={{ width: "100%", height: "100%", backgroundColor: "#25a764", borderRadius: 999 }} />
            </div>
          </div>
        </div>

        <div className="bg-[#f3faf6] rounded-[14px] px-[16px] py-[14px] flex items-center justify-between">
          <div className="flex flex-col gap-[2px]">
            <span className="font-['Inter',sans-serif] text-[11px] text-[#25a764]">
              {lang === "id"
                ? side === "Long" ? `Profitmu jika harga naik +${activeScenario}%` : `Profitmu jika harga turun -${activeScenario}%`
                : side === "Long" ? `Your profit if price +${activeScenario}%` : `Your profit if price -${activeScenario}%`}
            </span>
            <span style={{
              fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
              fontWeight: 500,
              fontSize: 24,
              lineHeight: "30px",
              color: "#25a764",
              transition: "all 0.2s ease",
            }}>
              +USDT {Math.round(futuresPnl).toLocaleString("en-US")}
            </span>
          </div>
          {leverage > 1 && (
            <div className="flex flex-col items-center justify-center w-[56px] h-[56px] rounded-full bg-white border border-[#d4edd9]">
              <span style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500, fontSize: 16, color: "#25a764" }}>
                {leverage}×
              </span>
              <span className="font-['Inter',sans-serif] text-[9px] text-[#25a764] text-center leading-[12px]">
                vs Spot
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Confirm button */}
      <div className="w-full px-[24px]">
        <button
          onClick={() => { onConfirm(leverage); onClose(); }}
          className="w-full h-[52px] bg-[#0a68f4] rounded-[14px] flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity"
        >
          <span className="font-['Inter',sans-serif] font-semibold text-[15px] text-white">{t("confirm")}</span>
        </button>
      </div>

      {/* Home indicator */}
      <div className="flex items-end justify-center pb-[8px]">
        <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
      </div>
    </div>
  );
}
