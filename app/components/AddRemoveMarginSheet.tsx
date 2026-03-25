"use client";

import { useRef, useState } from "react";

type Tab = "add" | "remove";
type Side = "Long" | "Short";

interface AddRemoveMarginSheetProps {
  assetTicker: string;
  side: Side;
  leverage: number;
  margin: number;           // current locked margin (USDT)
  positionSize: number;     // current position size (USDT)
  entryPrice: number;
  availableBalance: number; // wallet balance user can add from
  onConfirm: (newMargin: number) => void;
  onClose: () => void;
}

const SLIDER_STOPS = [0, 25, 50, 75, 100];

function formatEuropean(n: number): string {
  if (!isFinite(n) || n === 0) return "—";
  const [int, dec] = n.toFixed(1).split(".");
  return `${parseInt(int).toLocaleString("de-DE")},${dec}`;
}

function calcLiqPrice(entryPrice: number, leverage: number, side: Side): number {
  if (leverage < 1 || entryPrice <= 0) return 0;
  return side === "Long"
    ? entryPrice * (1 - 1 / leverage)
    : entryPrice * (1 + 1 / leverage);
}

export default function AddRemoveMarginSheet({
  assetTicker,
  side,
  leverage,
  margin,
  positionSize,
  entryPrice,
  availableBalance,
  onConfirm,
  onClose,
}: AddRemoveMarginSheetProps) {
  const [tab, setTab] = useState<Tab>("add");
  const [rawInput, setRawInput] = useState("");
  const [pct, setPct] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const isLong = side === "Long";
  const sideColor = isLong ? "#25a764" : "#e54040";
  const sideBg = isLong ? "#e6f4ea" : "#fde8e8";

  // Max amounts
  const maxAdd = availableBalance;
  // Can only remove margin while keeping leverage reasonable (keep liq price safe)
  // Max removable = margin - (positionSize / MAX_LEVERAGE), floor at 0
  const maxRemove = Math.max(0, margin - positionSize / 100);

  const maxAmount = tab === "add" ? maxAdd : maxRemove;

  // Parse the raw input to a number
  const inputAmount = Math.min(parseFloat(rawInput) || 0, maxAmount);

  // New margin after operation
  const newMargin =
    tab === "add" ? margin + inputAmount : margin - inputAmount;

  // Effective leverage after margin change
  const newLeverage = newMargin > 0 ? positionSize / newMargin : leverage;

  // New liq price after margin change
  const currentLiqPrice = calcLiqPrice(entryPrice, leverage, side);
  const newLiqPrice = calcLiqPrice(entryPrice, newLeverage, side);

  const hasInput = inputAmount > 0;
  const showArrow = hasInput;

  // ── Slider helpers ──────────────────────────────────────────────
  function pctToAmount(p: number): number {
    return parseFloat(((p / 100) * maxAmount).toFixed(2));
  }

  function xToPct(clientX: number): number {
    if (!sliderRef.current) return 0;
    const rect = sliderRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  function applyPct(p: number) {
    const rounded = Math.round(p);
    setPct(rounded);
    const amt = pctToAmount(rounded);
    setRawInput(amt > 0 ? String(amt) : "");
  }

  function onSliderPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    applyPct(xToPct(e.clientX));
  }
  function onSliderPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    applyPct(xToPct(e.clientX));
  }
  function onSliderPointerUp() {
    isDragging.current = false;
  }

  function handleInputChange(val: string) {
    // Only allow digits and one comma/dot
    const sanitized = val.replace(/[^0-9.,]/g, "").replace(",", ".");
    const num = parseFloat(sanitized) || 0;
    const clamped = Math.min(num, maxAmount);
    setRawInput(sanitized === "" ? "" : String(clamped));
    setPct(maxAmount > 0 ? Math.round((clamped / maxAmount) * 100) : 0);
  }

  function handleMax() {
    setRawInput(maxAmount.toFixed(2));
    setPct(100);
  }

  function handleStopClick(stop: number) {
    applyPct(stop);
  }

  function handleConfirm() {
    if (inputAmount <= 0) return;
    onConfirm(newMargin);
    onClose();
  }

  // Switch tab — reset input
  function switchTab(t: Tab) {
    setTab(t);
    setRawInput("");
    setPct(0);
  }

  return (
    <div className="bg-white w-full rounded-t-[8px] pt-[8px] flex flex-col gap-[24px] items-center">
      {/* Drag handle */}
      <div className="bg-[#8d8e8e] h-[4px] rounded-full w-[40px]" />

      <div className="flex flex-col gap-[16px] items-center w-full">
        {/* Segmented control */}
        <div className="bg-[#f2f2f2] flex items-start p-[2px] rounded-[8px] w-[calc(100%-32px)]">
          {(["add", "remove"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className="flex-1 h-[28px] rounded-[6px] flex items-center justify-center transition-colors"
              style={{ background: tab === t ? "#ffffff" : "transparent" }}
            >
              <span
                className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px]"
                style={{ color: tab === t ? "#020203" : "#8d8e8e" }}
              >
                {t === "add" ? "Add Margin" : "Remove Margin"}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-[12px] items-center w-full">
          {/* Position info */}
          <div className="flex flex-col gap-[12px] items-start px-[16px] w-full">
            {/* Header row: ticker + side + leverage */}
            <div className="flex items-center gap-[4px]">
              <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
                {assetTicker}USDT
              </span>
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#8d8e8e]">
                -PERP
              </span>
              <div className="px-[4px] rounded-[2px]" style={{ backgroundColor: sideBg }}>
                <span
                  className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px]"
                  style={{ color: sideColor }}
                >
                  {side}
                </span>
              </div>
              <div className="bg-[#f2f2f2] px-[4px] rounded-[2px]">
                <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px] text-[#020203]">
                  {Math.round(leverage)}x
                </span>
              </div>
            </div>

            {/* Size row */}
            <div className="flex items-center justify-between w-full">
              <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
                Size
              </span>
              <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
                {assetTicker}{" "}
                {entryPrice > 0
                  ? (positionSize / entryPrice).toFixed(4)
                  : "—"}{" "}
                (USDT {positionSize.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>

            {/* Locked Margin row */}
            <div className="flex items-center justify-between w-full">
              <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
                Locked Margin
              </span>
              <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
                USDT {margin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Input + Slider */}
          <div className="flex flex-col gap-[8px] items-start w-[calc(100%-32px)]">
            {/* Input field area */}
            <div className="relative w-full" style={{ height: 56 }}>
              {/* Top labels */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between">
                <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e]">
                  {tab === "add" ? "Margin to Add (USDT)" : "Margin to Remove (USDT)"}
                </span>
                <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e]">
                  {tab === "add" ? "Max Additional Margin:" : "Max Removable Margin:"}{" "}
                  <span className="font-semibold text-[#020203]">
                    USDT {maxAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </span>
              </div>

              {/* Input box */}
              <div className="absolute top-[16px] left-0 right-0 h-[32px] border border-[rgba(2,2,3,0.1)] rounded-[4px] bg-white flex items-center px-[8px]">
                <input
                  type="text"
                  inputMode="decimal"
                  value={rawInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={tab === "add" ? "Enter Margin to Add" : "Enter Margin to Remove"}
                  className="flex-1 bg-transparent font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#020203] placeholder:text-[#8d8e8e] placeholder:font-normal outline-none"
                />
                <button
                  onClick={handleMax}
                  className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px] text-[#0a68f4] ml-[4px] shrink-0"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Percentage slider */}
            <div
              ref={sliderRef}
              className="relative w-full h-[28px] cursor-pointer select-none"
              onPointerDown={onSliderPointerDown}
              onPointerMove={onSliderPointerMove}
              onPointerUp={onSliderPointerUp}
              onPointerCancel={onSliderPointerUp}
            >
              {/* Track background */}
              <div className="absolute top-[8.5px] left-0 right-0 h-[4px] bg-[rgba(2,2,3,0.15)] rounded-full" />
              {/* Track fill */}
              <div
                className="absolute top-[8.5px] left-0 h-[4px] bg-[#020203] rounded-full"
                style={{ width: `${pct}%` }}
              />
              {/* Stop dots */}
              {SLIDER_STOPS.map((stop) => (
                <button
                  key={stop}
                  onClick={(e) => { e.stopPropagation(); handleStopClick(stop); }}
                  className="absolute top-[6px] -translate-x-1/2 w-[8px] h-[8px] rounded-full border border-[rgba(2,2,3,0.2)]"
                  style={{
                    left: `${stop}%`,
                    background: pct >= stop ? "#020203" : "#ffffff",
                  }}
                />
              ))}
              {/* Thumb */}
              <div
                className="absolute top-[4px] -translate-x-1/2 w-[13px] h-[13px] rounded-full bg-[#020203] shadow"
                style={{ left: `${pct}%` }}
              />
              {/* Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e]">0%</span>
                <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e] translate-x-[50%]">25%</span>
                <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e] translate-x-[50%]">50%</span>
                <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e] translate-x-[50%]">75%</span>
                <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e]">100%</span>
              </div>
            </div>
          </div>

          {/* Est. Liquidation Price card */}
          <div className="bg-[#fafafa] rounded-[10px] p-[12px] flex items-center w-[calc(100%-32px)]">
            <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#8d8e8e] flex-1">
              Est Liquidation Price
            </span>
            <div className="flex items-center gap-[4px]">
              <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
                {currentLiqPrice > 0 ? formatEuropean(currentLiqPrice) : "—"}
              </span>
              {showArrow && (
                <>
                  {/* Right arrow */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
                    {newLiqPrice > 0 ? formatEuropean(newLiqPrice) : "—"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <div className="flex flex-col gap-[8px] items-center w-full">
        <button
          onClick={handleConfirm}
          disabled={inputAmount <= 0}
          className="w-[calc(100%-32px)] h-[44px] bg-[#0a68f4] rounded-[8px] flex items-center justify-center transition-opacity"
          style={{ opacity: inputAmount <= 0 ? 0.4 : 1, cursor: inputAmount <= 0 ? "not-allowed" : "pointer" }}
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
    </div>
  );
}
