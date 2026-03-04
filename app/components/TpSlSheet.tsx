"use client";

import { useState, useEffect } from "react";

type Side = "Long" | "Short";
type Mode = "Price" | "% PnL";

interface TpSlSheetProps {
  side: Side;
  entryPrice: number;
  positionSize: number;
  tpPrice: number;
  slPrice: number;
  tpEnabled: boolean;
  slEnabled: boolean;
  estLiqPrice: number;
  onConfirm: (tpPrice: number, slPrice: number) => void;
  onClose: () => void;
}

function formatPrice(n: number): string {
  if (!isFinite(n) || n === 0) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatUsdt(n: number): string {
  if (!isFinite(n) || n <= 0) return "0.00";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function priceToPnlPct(triggerPrice: number, entryPrice: number, side: Side): number {
  if (!entryPrice) return 0;
  const diff = side === "Long"
    ? (triggerPrice - entryPrice) / entryPrice
    : (entryPrice - triggerPrice) / entryPrice;
  return parseFloat((diff * 100).toFixed(2));
}

function pnlPctToPrice(pct: number, entryPrice: number, side: Side): number {
  if (side === "Long") return entryPrice * (1 + pct / 100);
  return entryPrice * (1 - pct / 100);
}

export default function TpSlSheet({
  side,
  entryPrice,
  positionSize,
  tpPrice: initialTpPrice,
  slPrice: initialSlPrice,
  tpEnabled: initialTpEnabled,
  slEnabled: initialSlEnabled,
  estLiqPrice,
  onConfirm,
  onClose,
}: TpSlSheetProps) {
  const [mode, setMode] = useState<Mode>("Price");
  const [tpEnabled, setTpEnabled] = useState(initialTpEnabled);
  const [slEnabled, setSlEnabled] = useState(initialSlEnabled);

  // Price mode inputs
  const [tpPriceInput, setTpPriceInput] = useState(
    initialTpPrice > 0 ? initialTpPrice.toFixed(1) : ""
  );
  const [slPriceInput, setSlPriceInput] = useState(
    initialSlPrice > 0 ? initialSlPrice.toFixed(1) : ""
  );

  // % PnL mode inputs
  const [tpPnlInput, setTpPnlInput] = useState(
    initialTpPrice > 0
      ? String(priceToPnlPct(initialTpPrice, entryPrice, side))
      : ""
  );
  const [slPnlInput, setSlPnlInput] = useState(
    initialSlPrice > 0
      ? String(Math.abs(priceToPnlPct(initialSlPrice, entryPrice, side)))
      : ""
  );

  // Derived trigger prices for calculation
  const tpTrigger = (() => {
    if (!tpEnabled) return 0;
    if (mode === "Price") return parseFloat(tpPriceInput) || 0;
    const pct = parseFloat(tpPnlInput) || 0;
    return pnlPctToPrice(pct, entryPrice, side);
  })();

  const slTrigger = (() => {
    if (!slEnabled) return 0;
    if (mode === "Price") return parseFloat(slPriceInput) || 0;
    // SL: loss direction
    const pct = parseFloat(slPnlInput) || 0;
    return pnlPctToPrice(-pct, entryPrice, side);
  })();

  // Estimated profit = positionSize × |tpTrigger - entryPrice| / entryPrice
  const estProfit =
    tpEnabled && tpTrigger > 0 && entryPrice > 0
      ? positionSize * (Math.abs(tpTrigger - entryPrice) / entryPrice)
      : 0;

  // Estimated loss = positionSize × |slTrigger - entryPrice| / entryPrice
  const estLoss =
    slEnabled && slTrigger > 0 && entryPrice > 0
      ? positionSize * (Math.abs(slTrigger - entryPrice) / entryPrice)
      : 0;

  // Sync price <-> pnl when switching mode
  function handleModeSwitch(next: Mode) {
    if (next === mode) return;
    if (next === "% PnL") {
      // convert current price inputs to pnl %
      const tp = parseFloat(tpPriceInput) || 0;
      const sl = parseFloat(slPriceInput) || 0;
      if (tp) setTpPnlInput(String(priceToPnlPct(tp, entryPrice, side)));
      if (sl) setSlPnlInput(String(Math.abs(priceToPnlPct(sl, entryPrice, side))));
    } else {
      // convert current pnl % inputs to prices
      const tpPct = parseFloat(tpPnlInput) || 0;
      const slPct = parseFloat(slPnlInput) || 0;
      if (tpPct) setTpPriceInput(pnlPctToPrice(tpPct, entryPrice, side).toFixed(1));
      if (slPct) setSlPriceInput(pnlPctToPrice(-slPct, entryPrice, side).toFixed(1));
    }
    setMode(next);
  }

  function handleConfirm() {
    onConfirm(tpEnabled ? tpTrigger : 0, slEnabled ? slTrigger : 0);
    onClose();
  }

  // Format est liq price display
  const liqPricePct =
    entryPrice > 0 && estLiqPrice > 0
      ? ((estLiqPrice - entryPrice) / entryPrice) * 100
      : 0;

  return (
    <div className="bg-white w-[375px] rounded-t-[8px] pt-[8px] flex flex-col gap-[16px] items-center pb-0">
      {/* Drag indicator */}
      <div className="w-[40px] h-[4px] rounded-full bg-[#8d8e8e]" />

      {/* Title */}
      <div className="flex flex-col gap-[8px] items-center w-[343px]">
        <span
          className="text-[20px] leading-[24px] text-[#020203] text-center w-full"
          style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
        >
          Take Profit/Stop Loss
        </span>
      </div>

      {/* Segmented Control: Price / % PnL */}
      <div className="bg-[#f2f2f2] flex items-start p-[2px] rounded-[8px] w-[343px]">
        {(["Price", "% PnL"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            className="flex-1 h-[28px] rounded-[6px] flex items-center justify-center transition-colors"
            style={{
              backgroundColor: mode === m ? "#ffffff" : "transparent",
            }}
          >
            <span
              className="text-[14px] leading-[20px] text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: mode === m ? "#020203" : "#8d8e8e",
              }}
            >
              {m}
            </span>
          </button>
        ))}
      </div>

      {/* Take Profit section */}
      <div className="bg-[#fafafa] flex flex-col p-[12px] rounded-[8px] w-[343px]">
        <div className="flex flex-col gap-[8px] w-full">
          {/* Checkbox + label */}
          <div className="flex h-[16px] items-center">
            <div className="flex gap-[6px] items-center">
              <button
                onClick={() => setTpEnabled((v) => !v)}
                className="flex-shrink-0 w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-colors"
                style={{ backgroundColor: tpEnabled ? "#020203" : "transparent", border: tpEnabled ? "none" : "1.5px solid #8d8e8e" }}
              >
                {tpEnabled && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span
                className="text-[12px] leading-[16px] text-[#0b0a0a]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                Take Profit
              </span>
            </div>
          </div>

          {/* Trigger Price input */}
          <div className="relative h-[48px] w-full">
            <span
              className="absolute top-0 left-0 text-[10px] leading-[14px] text-[#8d8e8e]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {mode === "Price" ? "Trigger Price (USDT)" : "PnL (%)"}
            </span>
            <div
              className="absolute bottom-0 left-0 right-0 bg-white border rounded-[6px] h-[32px] flex items-center px-[8px]"
              style={{ borderColor: "rgba(2,2,3,0.1)", borderWidth: "0.5px" }}
            >
              <input
                type="number"
                disabled={!tpEnabled}
                value={mode === "Price" ? tpPriceInput : tpPnlInput}
                onChange={(e) =>
                  mode === "Price"
                    ? setTpPriceInput(e.target.value)
                    : setTpPnlInput(e.target.value)
                }
                placeholder={tpEnabled ? (mode === "Price" ? "0.0" : "0.00") : "—"}
                className="flex-1 bg-transparent outline-none text-[12px] leading-[16px] text-[#020203] disabled:text-[#8d8e8e]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              />
              {mode === "% PnL" && (
                <span
                  className="text-[12px] text-[#8d8e8e] ml-[4px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  %
                </span>
              )}
            </div>
          </div>

          {/* Show derived value in opposite mode */}
          {tpEnabled && tpTrigger > 0 && (
            <span
              className="text-[10px] leading-[14px] text-[#8d8e8e]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {mode === "Price"
                ? `≈ +${priceToPnlPct(tpTrigger, entryPrice, side).toFixed(2)}% PnL`
                : `≈ ${formatPrice(tpTrigger)} USDT`}
            </span>
          )}
        </div>
      </div>

      {/* Stop Loss section */}
      <div className="bg-[#fafafa] flex flex-col gap-[12px] p-[12px] rounded-[8px] w-[343px]">
        <div className="flex flex-col gap-[8px] w-full">
          {/* Checkbox + label */}
          <div className="flex h-[16px] items-center">
            <div className="flex gap-[6px] items-center">
              <button
                onClick={() => setSlEnabled((v) => !v)}
                className="flex-shrink-0 w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-colors"
                style={{ backgroundColor: slEnabled ? "#020203" : "transparent", border: slEnabled ? "none" : "1.5px solid #8d8e8e" }}
              >
                {slEnabled && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span
                className="text-[12px] leading-[16px] text-[#0b0a0a]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                Stop Loss
              </span>
            </div>
          </div>

          {/* Trigger Price input */}
          <div className="relative h-[48px] w-full">
            <span
              className="absolute top-0 left-0 text-[10px] leading-[14px] text-[#8d8e8e]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {mode === "Price" ? "Trigger Price (USDT)" : "PnL (%)"}
            </span>
            <div
              className="absolute bottom-0 left-0 right-0 bg-white border rounded-[6px] h-[32px] flex items-center px-[8px]"
              style={{ borderColor: "rgba(2,2,3,0.1)", borderWidth: "0.5px" }}
            >
              <input
                type="number"
                disabled={!slEnabled}
                value={mode === "Price" ? slPriceInput : slPnlInput}
                onChange={(e) =>
                  mode === "Price"
                    ? setSlPriceInput(e.target.value)
                    : setSlPnlInput(e.target.value)
                }
                placeholder={slEnabled ? (mode === "Price" ? "0.0" : "0.00") : "—"}
                className="flex-1 bg-transparent outline-none text-[12px] leading-[16px] text-[#020203] disabled:text-[#8d8e8e]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              />
              {mode === "% PnL" && (
                <span
                  className="text-[12px] text-[#8d8e8e] ml-[4px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  %
                </span>
              )}
            </div>
          </div>

          {/* Show derived value in opposite mode */}
          {slEnabled && slTrigger > 0 && (
            <span
              className="text-[10px] leading-[14px] text-[#8d8e8e]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {mode === "Price"
                ? `≈ ${priceToPnlPct(slTrigger, entryPrice, side).toFixed(2)}% PnL`
                : `≈ ${formatPrice(slTrigger)} USDT`}
            </span>
          )}
        </div>
      </div>

      {/* Est. Liquidation Price row */}
      <div className="flex items-center justify-between px-[16px] w-full">
        <span
          className="text-[12px] leading-[16px] text-[#626363]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Est. Liquidation Price
        </span>
        <span
          className="text-[12px] leading-[16px] text-[#626363] text-right"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {estLiqPrice > 0
            ? `USDT ${formatPrice(estLiqPrice)} (${liqPricePct >= 0 ? "+" : ""}${liqPricePct.toFixed(1)}%)`
            : "—"}
        </span>
      </div>

      {/* Estimated Profit / Estimated Loss summary */}
      <div
        className="flex items-center justify-between py-[8px] rounded-[8px] w-[343px]"
        style={{ border: "1px solid rgba(2,2,3,0.1)" }}
      >
        {/* Estimated Profit */}
        <div className="flex flex-1 flex-col gap-[2px] items-center justify-center text-center">
          <span
            className="text-[10px] leading-[14px] text-[#626363]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Estimated Profit
          </span>
          <span
            className="text-[16px] leading-[22px]"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: estProfit > 0 ? "#25a764" : "#8d8e8e",
            }}
          >
            {tpEnabled && estProfit > 0 ? `USDT ${formatUsdt(estProfit)}` : "—"}
          </span>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-[24px] bg-[rgba(2,2,3,0.1)]" />

        {/* Estimated Loss */}
        <div className="flex flex-1 flex-col gap-[2px] items-center justify-center text-center">
          <span
            className="text-[10px] leading-[14px] text-[#626363]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Estimated Loss
          </span>
          <span
            className="text-[16px] leading-[22px] text-[#020203]"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
          >
            {slEnabled && estLoss > 0 ? `USDT ${formatUsdt(estLoss)}` : "—"}
          </span>
        </div>
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        className="bg-[#0a68f4] w-[343px] h-[44px] rounded-[8px] flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <span
          className="text-[14px] leading-[20px] text-white"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
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
