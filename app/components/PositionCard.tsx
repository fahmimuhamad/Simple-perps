"use client";

import { useLang } from "../LangContext";

type Side = "Long" | "Short";

interface PositionCardProps {
  assetTicker: string;
  side: Side;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  positionSize: number;
  margin: number;
  estLiqPrice: number;
  tpPrice: number;
  slPrice: number;
  onAdjustMargin?: () => void;
  onEditTpSl?: () => void;
  onAdjustLeverage?: () => void;
  onClosePosition?: () => void;
}

function formatPrice(n: number): string {
  if (!isFinite(n) || n === 0) return "—";
  // European-style: thousands separator = ".", decimal = ","
  const [int, dec] = n.toFixed(1).split(".");
  const intFormatted = parseInt(int).toLocaleString("de-DE");
  return `${intFormatted},${dec}`;
}

function formatInt(n: number): string {
  if (!isFinite(n) || n === 0) return "—";
  return Math.round(n).toLocaleString("de-DE");
}

export default function PositionCard({
  assetTicker,
  side,
  leverage,
  entryPrice,
  currentPrice,
  positionSize,
  margin,
  estLiqPrice,
  tpPrice,
  slPrice,
  onAdjustMargin,
  onEditTpSl,
  onAdjustLeverage,
  onClosePosition,
}: PositionCardProps) {
  const { t } = useLang();
  const isLong = side === "Long";
  const sideColor = isLong ? "#25a764" : "#e54040";
  const sideBg = isLong ? "#e6f4ea" : "#fde8e8";

  // Unrealized P&L
  const priceDiff = isLong ? currentPrice - entryPrice : entryPrice - currentPrice;
  const pnl = entryPrice > 0 ? (priceDiff / entryPrice) * positionSize : 0;
  const roi = entryPrice > 0 ? (priceDiff / entryPrice) * leverage * 100 : 0;
  const pnlPositive = pnl >= 0;
  const pnlBg = pnlPositive ? "#e6f4ea" : "#fde8e8";
  const pnlTextColor = pnlPositive ? "#25a764" : "#e54040";

  const pnlDisplay = `${pnl >= 0 ? "+ " : "- "}USDT ${Math.abs(pnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div
      data-coachmark="position-card"
      className="bg-white rounded-[16px] shadow-[0px_0px_28px_0px_rgba(0,0,0,0.06)] flex flex-col gap-[16px] items-center py-[16px] w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-[16px] w-full">
        <div className="flex items-center gap-[4px]">
          {/* BTC icon */}
          <div className="w-[16px] h-[16px] rounded-full bg-[#F78B1A] flex items-center justify-center shrink-0 overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#F78B1A" />
              <text x="8" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">₿</text>
            </svg>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
            {assetTicker === "BTC" ? "Bitcoin" : assetTicker}
          </span>
          <div className="px-[4px] h-[14px] rounded-[2px] flex items-center" style={{ backgroundColor: sideBg }}>
            <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-none" style={{ color: sideColor }}>
              {side}
            </span>
          </div>
          <div className="bg-[#f2f2f2] px-[4px] h-[14px] rounded-[2px] flex items-center">
            <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-none text-[#8d8e8e]">
              {leverage}x
            </span>
          </div>
        </div>
        {/* Share icon */}
        <button className="w-[20px] h-[20px] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="12" cy="3" r="1.5" stroke="#020203" strokeWidth="1.2" />
            <circle cx="4" cy="8" r="1.5" stroke="#020203" strokeWidth="1.2" />
            <circle cx="12" cy="13" r="1.5" stroke="#020203" strokeWidth="1.2" />
            <line x1="10.6" y1="3.7" x2="5.4" y2="7.3" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="5.4" y1="8.7" x2="10.6" y2="12.3" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-[16px] items-center px-[16px] w-full">
        {/* Unrealized P&L */}
        <div data-coachmark="position-pnl" className="flex flex-col gap-[8px] items-center w-full">
          <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
            {t("unrealizedPnl")}
          </span>
          <div
            className="w-full rounded-[8px] px-[16px] py-[12px] flex flex-col items-center gap-[2px]"
            style={{ backgroundColor: pnlBg }}
          >
            <span
              className="text-[28px] leading-[34px]"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 700, color: pnlTextColor }}
            >
              {pnlDisplay}
            </span>
            <span
              className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px]"
              style={{ color: pnlTextColor }}
            >
              ROI {roi >= 0 ? "+" : ""}{roi.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Position Size + Margin */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-[2px] flex-1 items-start">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
              {t("positionSizeUsdt")}
            </span>
            <span
              className="text-[20px] leading-[24px] text-[#020203]"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
            >
              {formatInt(positionSize)}
            </span>
          </div>
          <div className="flex flex-col gap-[2px] flex-1 items-end">
            <div className="flex items-center gap-[2px]">
              <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
                {t("marginUsdt")}
              </span>
              <button className="w-[12px] h-[12px] flex items-center justify-center" onClick={onAdjustMargin}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" fill="#0a68f4" />
                  <path d="M6 3.5v5M3.5 6h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <span
              className="text-[20px] leading-[24px] text-[#020203]"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
            >
              {formatInt(margin)}
            </span>
          </div>
        </div>

        {/* Entry Price + Current Price */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-[2px] flex-1 items-start">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
              {t("entryPriceUsdt")}
            </span>
            <span
              className="text-[20px] leading-[24px] text-[#020203]"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
            >
              {formatPrice(entryPrice)}
            </span>
          </div>
          <div className="flex flex-col gap-[2px] flex-1 items-end">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
              {t("currentPriceUsdt")}
            </span>
            <span
              className="text-[20px] leading-[24px] text-[#020203]"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
            >
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        {/* Est. Liq. Price + TP/SL */}
        <div className="flex flex-col gap-[8px] w-full">
          {/* Est. Liq. Price */}
          <div data-coachmark="position-liq" className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[4px]">
              <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
                {t("estLiqPrice")}
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#8d8e8e" strokeWidth="1.2" />
                <path d="M7 6.5v3.5M7 4.5v.5" stroke="#8d8e8e" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#626363]">
              {estLiqPrice > 0 ? formatPrice(estLiqPrice) : "—"}
            </span>
          </div>

          {/* TP/SL */}
          <div className="flex items-center justify-between w-full">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
              TP/SL
            </span>
            <div className="flex items-center gap-[2px]">
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#25a764]">
                {tpPrice > 0 ? formatPrice(tpPrice) : "—"}
              </span>
              <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e]">/</span>
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#626363]">
                {slPrice > 0 ? formatPrice(slPrice) : "—"}
              </span>
              {/* Edit pencil icon */}
              <button className="w-[14px] h-[14px] flex items-center justify-center ml-[2px]" onClick={onEditTpSl}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="#0a68f4" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[16px] w-full">
          <button onClick={onAdjustLeverage} className="border border-[rgba(2,2,3,0.1)] rounded-[4px] h-[44px] px-[16px] flex items-center justify-center hover:bg-[#f2f2f2] transition-colors whitespace-nowrap">
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
              {t("adjustPosition")}
            </span>
          </button>
          <button className="border border-[rgba(2,2,3,0.1)] rounded-[4px] h-[44px] flex-1 flex items-center justify-center hover:bg-[#f2f2f2] transition-colors" onClick={onClosePosition}>
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
              {t("closePosition")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
