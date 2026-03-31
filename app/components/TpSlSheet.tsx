"use client";

import { useState } from "react";
import { useLang } from "../LangContext";

type Side = "Long" | "Short";
type Mode = "PnL" | "Price";

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
  const [int, dec] = n.toFixed(1).split(".");
  return `${parseInt(int).toLocaleString("de-DE")},${dec}`;
}

// PnL amount → trigger price
function pnlToPrice(pnl: number, entryPrice: number, positionSize: number, side: Side): number {
  if (!entryPrice || !positionSize) return 0;
  const priceDelta = (pnl / positionSize) * entryPrice;
  return side === "Long" ? entryPrice + priceDelta : entryPrice - priceDelta;
}

// trigger price → PnL amount
function priceToPnl(triggerPrice: number, entryPrice: number, positionSize: number, side: Side): number {
  if (!entryPrice || !positionSize || !triggerPrice) return 0;
  const priceDiff = side === "Long" ? triggerPrice - entryPrice : entryPrice - triggerPrice;
  return (priceDiff / entryPrice) * positionSize;
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="flex-shrink-0 w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-colors"
      style={{
        backgroundColor: checked ? "#020203" : "transparent",
        border: checked ? "none" : "1.5px solid #8d8e8e",
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
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
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>("Price");
  const [tpEnabled, setTpEnabled] = useState(initialTpEnabled);
  const [slEnabled, setSlEnabled] = useState(initialSlEnabled);

  // PnL mode: store USDT amount strings
  const [tpPnlInput, setTpPnlInput] = useState(
    initialTpPrice > 0 ? priceToPnl(initialTpPrice, entryPrice, positionSize, side).toFixed(2) : ""
  );
  const [slPnlInput, setSlPnlInput] = useState(
    initialSlPrice > 0 ? Math.abs(priceToPnl(initialSlPrice, entryPrice, positionSize, side)).toFixed(2) : ""
  );

  // Price mode: store price strings
  const [tpPriceInput, setTpPriceInput] = useState(
    initialTpPrice > 0 ? initialTpPrice.toFixed(1) : ""
  );
  const [slPriceInput, setSlPriceInput] = useState(
    initialSlPrice > 0 ? initialSlPrice.toFixed(1) : ""
  );

  // Derived trigger prices
  const tpTrigger: number = (() => {
    if (!tpEnabled) return 0;
    if (mode === "Price") return parseFloat(tpPriceInput) || 0;
    const pnl = parseFloat(tpPnlInput) || 0;
    return pnl > 0 ? pnlToPrice(pnl, entryPrice, positionSize, side) : 0;
  })();

  const slTrigger: number = (() => {
    if (!slEnabled) return 0;
    if (mode === "Price") return parseFloat(slPriceInput) || 0;
    const pnl = parseFloat(slPnlInput) || 0;
    // SL is a loss → negate
    return pnl > 0 ? pnlToPrice(-pnl, entryPrice, positionSize, side) : 0;
  })();

  // Validate TP/SL direction: TP for Long must be > entry, Short must be < entry; SL is opposite
  const tpValidDir = tpTrigger > 0 && entryPrice > 0
    ? (side === "Long" ? tpTrigger > entryPrice : tpTrigger < entryPrice)
    : false;
  const slValidDir = slTrigger > 0 && entryPrice > 0
    ? (side === "Long" ? slTrigger < entryPrice : slTrigger > entryPrice)
    : false;

  // Derived PnL from price inputs (for Price mode hint) — only when direction is valid
  const tpEstProfit = tpValidDir ? priceToPnl(tpTrigger, entryPrice, positionSize, side) : 0;
  const slEstLoss = slValidDir ? Math.abs(priceToPnl(slTrigger, entryPrice, positionSize, side)) : 0;

  // SL validation
  const slBelowLiq: boolean =
    slEnabled && slTrigger > 0 && estLiqPrice > 0 &&
    (side === "Long" ? slTrigger <= estLiqPrice : slTrigger >= estLiqPrice);

  function handleModeSwitch(next: Mode) {
    if (next === mode) return;
    // Sync values across modes
    if (next === "Price") {
      if (tpPnlInput) {
        const pnl = parseFloat(tpPnlInput) || 0;
        if (pnl > 0) setTpPriceInput(pnlToPrice(pnl, entryPrice, positionSize, side).toFixed(1));
      }
      if (slPnlInput) {
        const pnl = parseFloat(slPnlInput) || 0;
        if (pnl > 0) setSlPriceInput(pnlToPrice(-pnl, entryPrice, positionSize, side).toFixed(1));
      }
    } else {
      if (tpPriceInput) {
        const price = parseFloat(tpPriceInput) || 0;
        if (price > 0) setTpPnlInput(priceToPnl(price, entryPrice, positionSize, side).toFixed(2));
      }
      if (slPriceInput) {
        const price = parseFloat(slPriceInput) || 0;
        if (price > 0) setSlPnlInput(Math.abs(priceToPnl(price, entryPrice, positionSize, side)).toFixed(2));
      }
    }
    setMode(next);
  }

  const tpDirError = tpEnabled && mode === "Price" && tpTrigger > 0 && !tpValidDir;
  const slDirError = slEnabled && mode === "Price" && slTrigger > 0 && !slValidDir;
  const hasError = slBelowLiq || tpDirError || slDirError;

  function handleConfirm() {
    if (hasError) return;
    onConfirm(tpEnabled ? tpTrigger : 0, slEnabled ? slTrigger : 0);
    onClose();
  }

  const inputBorder = (hasError: boolean) =>
    hasError ? "0.5px solid #e54040" : "0.5px solid rgba(2,2,3,0.1)";

  return (
    <div className="bg-white w-full rounded-t-[8px] pt-[8px] flex flex-col gap-[16px] items-center pb-0">
      {/* Drag indicator */}
      <div className="w-[40px] h-[4px] rounded-full bg-[#8d8e8e]" />

      {/* Title */}
      <span
        className="text-[20px] leading-[24px] text-[#020203] text-center w-[calc(100%-32px)]"
        style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
      >
        {t("takeProfitStopLoss")}
      </span>

      {/* Segmented Control: Price | % PnL */}
      <div className="bg-[#f2f2f2] flex items-start p-[2px] rounded-[8px] w-[calc(100%-32px)]">
        {(["Price", "PnL"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            className="flex-1 h-[28px] rounded-[6px] flex items-center justify-center transition-colors"
            style={{ backgroundColor: mode === m ? "#ffffff" : "transparent" }}
          >
            <span
              className="text-[14px] leading-[20px] text-center"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: mode === m ? "#020203" : "#8d8e8e" }}
            >
              {m === "PnL" ? "PnL" : "Price"}
            </span>
          </button>
        ))}
      </div>

      {/* Take Profit Card */}
      <div className="bg-[#fafafa] flex flex-col gap-[8px] p-[12px] rounded-[8px] w-[calc(100%-32px)]">
        {/* Header row */}
        <div className="flex items-center gap-[6px]">
          <Checkbox checked={tpEnabled} onChange={() => setTpEnabled((v) => !v)} />
          <span className="text-[12px] leading-[16px] text-[#020203]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            {mode === "PnL" ? t("profitAmount") : t("takeProfitPrice")}
          </span>
        </div>

        {/* Input — only shown when enabled */}
        {tpEnabled && (
          <>
            <div
              className="bg-white rounded-[6px] h-[32px] flex items-center px-[8px]"
              style={{ border: inputBorder(mode === "Price" && tpTrigger > 0 && !tpValidDir) }}
            >
              {mode === "PnL" && (
                <span className="text-[12px] leading-[16px] text-[#25a764] mr-[4px] shrink-0" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>+</span>
              )}
              <input
                type={(mode === "PnL" ? tpPnlInput : tpPriceInput) ? "number" : "text"}
                inputMode="decimal"
                value={mode === "PnL" ? tpPnlInput : tpPriceInput}
                onChange={(e) =>
                  mode === "PnL" ? setTpPnlInput(e.target.value) : setTpPriceInput(e.target.value)
                }
                placeholder={mode === "PnL" ? t("enterPnlAmount") : t("enterPrice")}
                className="flex-1 bg-transparent outline-none text-[12px] leading-[16px] text-[#020203] placeholder:text-[#8d8e8e] placeholder:font-normal"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              />
              <span className="text-[12px] leading-[16px] text-[#8d8e8e] ml-[4px] shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                USDT
              </span>
            </div>

            {/* TP direction error */}
            {mode === "Price" && tpTrigger > 0 && !tpValidDir && (
              <span className="text-[10px] leading-[14px] text-[#e54040]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {side === "Long" ? t("tpMustBeAboveEntry") : t("tpMustBeBelowEntry")}
              </span>
            )}

            {/* Estimated row — hide when direction error or no value */}
            {!tpDirError && (tpTrigger > 0 || (mode === "PnL" && parseFloat(tpPnlInput) > 0)) && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] leading-[16px] text-[#626363]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {mode === "PnL" ? t("estimatedPrice") : t("estimatedProfit")}
                </span>
                <span
                  className="text-[12px] leading-[16px]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#25a764" }}
                >
                  {mode === "PnL"
                    ? tpTrigger > 0 ? formatPrice(tpTrigger) : "—"
                    : tpEstProfit > 0 ? `USDT ${tpEstProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"
                  }
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stop Loss Card */}
      <div className="bg-[#fafafa] flex flex-col gap-[8px] p-[12px] rounded-[8px] w-[calc(100%-32px)]">
        {/* Header row */}
        <div className="flex items-center gap-[6px]">
          <Checkbox checked={slEnabled} onChange={() => setSlEnabled((v) => !v)} />
          <span className="text-[12px] leading-[16px] text-[#020203]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            {mode === "PnL" ? t("lossAmount") : t("stopLossPrice")}
          </span>
        </div>

        {/* Input — only shown when enabled */}
        {slEnabled && (
          <>
            <div
              className="bg-white rounded-[6px] h-[32px] flex items-center px-[8px]"
              style={{ border: inputBorder(slBelowLiq || slDirError) }}
            >
              {mode === "PnL" && (
                <span className="text-[12px] leading-[16px] text-[#e54040] mr-[4px] shrink-0" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>-</span>
              )}
              <input
                type={(mode === "PnL" ? slPnlInput : slPriceInput) ? "number" : "text"}
                inputMode="decimal"
                value={mode === "PnL" ? slPnlInput : slPriceInput}
                onChange={(e) =>
                  mode === "PnL" ? setSlPnlInput(e.target.value) : setSlPriceInput(e.target.value)
                }
                placeholder={mode === "PnL" ? t("enterLossAmount") : t("enterPrice")}
                className="flex-1 bg-transparent outline-none text-[12px] leading-[16px] text-[#020203] placeholder:text-[#8d8e8e] placeholder:font-normal"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              />
              <span className="text-[12px] leading-[16px] text-[#8d8e8e] ml-[4px] shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                USDT
              </span>
            </div>

            {/* Error */}
            {slBelowLiq && (
              <span className="text-[10px] leading-[14px] text-[#e54040]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("slBelowLiqError")}
              </span>
            )}
            {slDirError && !slBelowLiq && (
              <span className="text-[10px] leading-[14px] text-[#e54040]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {side === "Long" ? t("slMustBeBelowEntry") : t("slMustBeAboveEntry")}
              </span>
            )}

            {/* Estimated row */}
            {!slBelowLiq && !slDirError && (slTrigger > 0 || (mode === "PnL" && parseFloat(slPnlInput) > 0)) && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] leading-[16px] text-[#626363]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {mode === "PnL" ? t("estimatedPrice") : t("estimatedLoss")}
                </span>
                <span
                  className="text-[12px] leading-[16px]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#626363" }}
                >
                  {mode === "PnL"
                    ? slTrigger > 0 ? formatPrice(slTrigger) : "—"
                    : slEstLoss > 0 ? `USDT ${slEstLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"
                  }
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Est. Liquidation Price */}
      {estLiqPrice > 0 && (
        <div className="flex items-center justify-between w-full px-[16px]">
          <span className="text-[12px] leading-[16px] text-[#626363]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("estLiqPrice")}
          </span>
          <span className="text-[12px] leading-[16px] text-[#626363]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {`USDT ${formatPrice(estLiqPrice)} (${entryPrice > 0 ? ((side === "Long" ? estLiqPrice - entryPrice : entryPrice - estLiqPrice) / entryPrice * 100).toFixed(1) : "0"}%)`}
          </span>
        </div>
      )}

      {/* Confirm */}
      <button
        onClick={handleConfirm}
        disabled={hasError}
        className="w-[calc(100%-32px)] h-[44px] rounded-[8px] flex items-center justify-center transition-opacity"
        style={{ backgroundColor: "#0a68f4", opacity: hasError ? 0.4 : 1, cursor: hasError ? "not-allowed" : "pointer" }}
      >
        <span className="text-[14px] leading-[20px] text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
          {t("confirm")}
        </span>
      </button>

      {/* Home indicator */}
      <div className="w-[134px] flex items-end justify-center pb-2 safe-bottom">
        <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
      </div>
    </div>
  );
}
