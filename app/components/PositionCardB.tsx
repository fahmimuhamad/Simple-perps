"use client";

// Asset URLs from Figma
const imgUnion = "https://www.figma.com/api/mcp/asset/d2e15b2c-cb20-4812-a6c2-a7827c08897d";

type Side = "Long" | "Short";

interface PositionCardBProps {
  assetTicker: string;
  side: Side;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  positionSize: number;
  margin: number;
  tpPrice: number;
  slPrice: number;
  onAdjustMargin?: () => void;
  onEditTpSl?: () => void;
  onClosePosition?: () => void;
}

function formatEuropean(n: number, decimals = 2): string {
  if (!isFinite(n) || n === 0) return "—";
  return n.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function PositionCardB({
  assetTicker,
  side,
  leverage,
  entryPrice,
  currentPrice,
  positionSize,
  margin,
  tpPrice,
  slPrice,
  onAdjustMargin,
  onEditTpSl,
  onClosePosition,
}: PositionCardBProps) {
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
  const pnlSign = pnl >= 0 ? "+" : "-";

  const tpDisplay = tpPrice > 0 ? formatEuropean(tpPrice, 1) : "-";
  const slDisplay = slPrice > 0 ? formatEuropean(slPrice, 1) : "—";

  return (
    <div
      data-coachmark="position-card"
      className="bg-white border border-[rgba(2,2,3,0.1)] rounded-[8px] flex flex-col gap-[16px] items-center p-[16px] w-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-[4px]">
          {/* BTC coin icon */}
          <div className="w-[16px] h-[16px] rounded-full bg-[#F78B1A] flex items-center justify-center shrink-0 overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#F78B1A" />
              <text x="8" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">₿</text>
            </svg>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
            {assetTicker === "BTC" ? "Bitcoin" : assetTicker}
          </span>
          <div className="px-[4px] rounded-[2px] flex items-center" style={{ backgroundColor: sideBg }}>
            <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px]" style={{ color: sideColor }}>
              {side}
            </span>
          </div>
          <div className="bg-[#f2f2f2] px-[4px] rounded-[2px] flex items-center">
            <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px] text-[#8d8e8e]">
              {Math.round(leverage)}x
            </span>
          </div>
        </div>
        {/* Share icon */}
        <button className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
          <div className="relative size-[20px] overflow-clip">
            <div className="absolute inset-[8.33%_12.5%]">
              <img alt="" className="absolute block max-w-none size-full" src={imgUnion} />
            </div>
          </div>
        </button>
      </div>

      {/* P&L + stats */}
      <div className="flex flex-col gap-[16px] items-center w-full">
        {/* Unrealized P&L box */}
        <div
          data-coachmark="position-pnl"
          className="flex flex-col items-center justify-center px-[16px] py-[12px] rounded-[8px] w-full"
          style={{ backgroundColor: pnlBg }}
        >
          <span
            className="leading-[34px] text-[28px]"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500, color: pnlTextColor }}
          >
            {pnlSign} USDT {Math.abs(pnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px]" style={{ color: pnlTextColor }}>
            ROI {roi >= 0 ? "+" : ""}{roi.toFixed(0)}%
          </span>
        </div>

        {/* Position Size + Margin tiles */}
        <div className="flex gap-[16px] items-start w-full">
          <div className="bg-[#fafafa] flex-1 flex flex-col gap-[2px] items-start p-[8px] rounded-[8px]">
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#626363]">
              Position Size (USDT)
            </span>
            <span className="font-['Inter',sans-serif] font-semibold text-[16px] leading-[22px] text-[#020203]">
              {formatEuropean(positionSize)}
            </span>
          </div>
          <div className="bg-[#fafafa] flex-1 flex flex-col gap-[2px] items-end p-[8px] rounded-[8px]">
            <div className="flex items-center gap-[2px]">
              <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#626363]">
                Margin (USDT)
              </span>
              <button className="w-[12px] h-[12px] flex items-center justify-center" onClick={onAdjustMargin}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" fill="#0a68f4" />
                  <path d="M6 3.5v5M3.5 6h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <span className="font-['Inter',sans-serif] font-semibold text-[16px] leading-[22px] text-[#020203]">
              {formatEuropean(margin)}
            </span>
          </div>
        </div>

        {/* TP/SL row */}
        <div className="bg-[#fafafa] flex flex-col items-start p-[8px] rounded-[8px] w-full">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#626363]">
              TP/SL
            </span>
            <div className="flex items-center gap-[2px]">
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#25a764]">
                {tpDisplay}
              </span>
              <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e]">/</span>
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#626363]">
                {slDisplay}
              </span>
              <button className="w-[14px] h-[14px] flex items-center justify-center ml-[2px] overflow-hidden" onClick={onEditTpSl}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="#0a68f4" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[16px] items-start w-full">
          <button
            onClick={onAdjustMargin}
            className="border border-[rgba(2,2,3,0.1)] rounded-[4px] h-[44px] px-[16px] flex items-center justify-center hover:bg-[#f2f2f2] transition-colors whitespace-nowrap shrink-0"
          >
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
              Adjust Position
            </span>
          </button>
          <button className="border border-[rgba(2,2,3,0.1)] rounded-[4px] h-[44px] flex-1 flex items-center justify-center hover:bg-[#f2f2f2] transition-colors" onClick={onClosePosition}>
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
              Close Position
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
