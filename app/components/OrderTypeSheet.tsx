"use client";

import { useState } from "react";
import LeverageSheet from "./LeverageSheet";
import ConfirmationSheet from "./ConfirmationSheet";
import TpSlSheet from "./TpSlSheet";

type Side = "Long" | "Short";

const PRESETS = ["25%", "50%", "75%", "100%"];
const KEYBOARD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [",", "0", "⌫"],
];

const DEFAULT_TP_PCT = 8;
const DEFAULT_SL_PCT = 4;

interface OpenPosition {
  side: Side;
  leverage: number;
  positionSize: number;
  margin: number;
  entryPrice: number;
  tpPrice: number;
  slPrice: number;
  estLiqPrice: number;
}

interface OrderTypeSheetProps {
  assetTicker?: string;
  side?: Side;
  price?: string;
  initialLeverage?: number;
  availableMargin?: string;
  onConfirm?: (pos: OpenPosition) => void;
  onClose?: () => void;
}

export default function OrderTypeSheet({
  assetTicker = "BTC",
  side: initialSide = "Long",
  price = "70.488,5",
  initialLeverage = 25,
  availableMargin = "300",
  onConfirm,
  onClose,
}: OrderTypeSheetProps) {
  const [side] = useState<Side>(initialSide);
  const [amount, setAmount] = useState("0");
  const [leverage, setLeverage] = useState(initialLeverage);
  const [showLeverageSheet, setShowLeverageSheet] = useState(false);
  const [showConfirmationSheet, setShowConfirmationSheet] = useState(false);
  const [showTpSlSheet, setShowTpSlSheet] = useState(false);

  const [tpPct, setTpPct] = useState(DEFAULT_TP_PCT);
  const [slPct, setSlPct] = useState(DEFAULT_SL_PCT);
  const [tpEnabled, setTpEnabled] = useState(true);
  const [slEnabled, setSlEnabled] = useState(true);

  const isLong = side === "Long";
  const sideColor = isLong ? "#25a764" : "#e54040";
  const buttonLabel = isLong ? `Open Long ${assetTicker}` : `Open Short ${assetTicker}`;

  // Parse entry price (European format "70.488,5" → 70488.5)
  const entryPrice = parseFloat(price.replace(/\./g, "").replace(",", ".")) || 0;
  const margin = parseFloat(amount.replace(",", ".")) || 0;
  const positionSize = margin * leverage;

  const tpPrice = isLong
    ? entryPrice * (1 + tpPct / 100)
    : entryPrice * (1 - tpPct / 100);
  const slPrice = isLong
    ? entryPrice * (1 - slPct / 100)
    : entryPrice * (1 + slPct / 100);

  const estLiqPrice = leverage >= 1
    ? isLong
      ? entryPrice * (1 - 1 / leverage)
      : entryPrice * (1 + 1 / leverage)
    : 0;

  function formatPosSizeDisplay(n: number): string {
    if (!isFinite(n) || n === 0) return "0";
    return Math.round(n).toLocaleString("en-US");
  }

  function handleKey(key: string) {
    const maxMargin = parseFloat(availableMargin.replace(",", ".")) || 0;
    if (key === "⌫") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    if (key === ",") {
      if (!amount.includes(",")) setAmount((prev) => prev + ",");
      return;
    }
    const next = amount === "0" ? key : amount + key;
    const nextVal = parseFloat(next.replace(",", ".")) || 0;
    if (nextVal > maxMargin) {
      setAmount(String(maxMargin));
    } else {
      setAmount(next);
    }
  }

  function handlePreset(preset: string) {
    const pct = parseInt(preset) / 100;
    const val = Math.floor(parseFloat(availableMargin.replace(",", ".")) * pct);
    setAmount(String(val));
  }

  function handleTpSlConfirm(newTpPrice: number, newSlPrice: number) {
    setTpEnabled(newTpPrice > 0);
    setSlEnabled(newSlPrice > 0);
    if (entryPrice > 0) {
      if (newTpPrice > 0) {
        setTpPct(parseFloat((Math.abs((newTpPrice - entryPrice) / entryPrice) * 100).toFixed(2)));
      }
      if (newSlPrice > 0) {
        setSlPct(parseFloat((Math.abs((newSlPrice - entryPrice) / entryPrice) * 100).toFixed(2)));
      }
    }
  }

  return (
    <div className="relative">
      {/* Confirmation Sheet overlay */}
      {showConfirmationSheet && (
        <div className="fixed inset-0 flex items-end justify-center z-20">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowConfirmationSheet(false)} />
          <div className="relative z-30">
            <ConfirmationSheet
              side={side}
              assetTicker={assetTicker}
              leverage={leverage}
              margin={margin}
              price={price}
              estLiqPrice={estLiqPrice}
              onConfirm={() => {
                setShowConfirmationSheet(false);
                onConfirm?.({ side, leverage, positionSize, margin, entryPrice, tpPrice, slPrice, estLiqPrice });
                onClose?.();
              }}
              onClose={() => setShowConfirmationSheet(false)}
            />
          </div>
        </div>
      )}

      {/* Leverage Sheet overlay */}
      {showLeverageSheet && (
        <div className="fixed inset-0 flex items-end justify-center z-20">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowLeverageSheet(false)} />
          <div className="relative z-30">
            <LeverageSheet
              initialLeverage={leverage}
              margin={margin}
              entryPrice={entryPrice}
              onConfirm={(lev) => setLeverage(lev)}
              onClose={() => setShowLeverageSheet(false)}
            />
          </div>
        </div>
      )}

      {/* TP/SL Sheet overlay */}
      {showTpSlSheet && (
        <div className="fixed inset-0 flex items-end justify-center z-20">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowTpSlSheet(false)} />
          <div className="relative z-30">
            <TpSlSheet
              side={side}
              entryPrice={entryPrice}
              positionSize={positionSize}
              leverage={leverage}
              tpPrice={tpPrice}
              slPrice={slPrice}
              tpEnabled={tpEnabled}
              slEnabled={slEnabled}
              estLiqPrice={estLiqPrice}
              onConfirm={handleTpSlConfirm}
              onClose={() => setShowTpSlSheet(false)}
            />
          </div>
        </div>
      )}

      {/* Main Order Sheet */}
      <div className="bg-white w-[375px] rounded-t-[8px] flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center w-[343px] pt-[16px] pb-0">
          <div className="flex flex-col items-start gap-[2px]">
            <p className="font-['Inter',sans-serif] font-semibold text-[16px] leading-[22px] text-[#020203]">
              {isLong ? "Long" : "Short"} {assetTicker}
            </p>
            <p className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#626363]">
              USDT {price}
            </p>
          </div>
        </div>

        {/* Amount Display */}
        <div className="flex flex-col items-center justify-center py-[32px] gap-[12px] w-full">
          <p className="font-['Inter',sans-serif] font-normal text-[12px] leading-[16px] text-[#626363]">
            Investment Margin
          </p>
          <p
            className="text-[36px] leading-[44px] text-[#020203] whitespace-nowrap"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
          >
            <span>USDT</span>
            <span> {amount}</span>
          </p>
          <p className="font-['Inter',sans-serif] font-normal text-[12px] leading-[16px] text-[#626363]">
            Pos. Size ~ USDT {formatPosSizeDisplay(positionSize)}
          </p>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-[8px] w-[343px]">
          {/* Leverage */}
          <div className="bg-[#fafafa] rounded-[10px] px-[12px] flex flex-col w-full">
            <div className="flex items-center justify-between h-[40px]">
              <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
                Leverage
              </span>
              <button
                onClick={() => setShowLeverageSheet(true)}
                className="flex items-center gap-[4px] px-[4px] py-[2px] rounded-[4px] hover:bg-[#f2f2f2] transition-colors active:scale-95"
              >
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#020203]">
                  {leverage}x
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3.75 1.875L6.875 5 3.75 8.125" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Available Balance */}
          <div className="bg-[#fafafa] rounded-[10px] px-[12px] py-[12px] flex items-center justify-between w-full">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#020203]">
              Available Balance
            </span>
            <div className="flex items-center gap-[4px]">
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#020203]">
                USDT {availableMargin}
              </span>
              <button className="w-[12px] h-[12px] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" fill="#0a68f4" />
                  <path d="M6 3.5v5M3.5 6h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex gap-[8px] px-[24px] w-[375px] mt-[8px]">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className="flex-1 h-[32px] border border-[rgba(2,2,3,0.1)] rounded-full font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#626363] flex items-center justify-center hover:bg-[#f2f2f2] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Numeric Keyboard */}
        <div className="flex flex-col w-[375px] h-[200px] mt-[8px]">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex flex-1 items-center justify-center">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className="flex-1 h-full flex items-center justify-center font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] text-[20px] leading-[24px] text-[#020303] hover:bg-[#f2f2f2] transition-colors"
                >
                  {key === "⌫" ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M17.5 5H7.5L2.5 10l5 5h10a.833.833 0 00.833-.833V5.833A.833.833 0 0017.5 5zM15 7.5l-2.5 2.5 2.5 2.5M12.5 7.5L10 10l2.5 2.5"
                        stroke="#020203"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    key
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* CTA Button — full width with top border, matches Figma */}
        <div className="w-full border-t border-[rgba(2,2,3,0.1)] px-[16px] py-[12px]">
          <button
            onClick={() => margin > 0 && setShowConfirmationSheet(true)}
            disabled={margin === 0}
            className="w-full h-[44px] rounded-[8px] font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white flex items-center justify-center transition-opacity"
            style={{
              backgroundColor: sideColor,
              opacity: margin === 0 ? 0.4 : 1,
              cursor: margin === 0 ? "not-allowed" : "pointer",
            }}
          >
            {buttonLabel}
          </button>
        </div>

        {/* Home Indicator */}
        <div className="w-[134px] h-[34px] flex items-end justify-center pb-2">
          <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
        </div>
      </div>
    </div>
  );
}
