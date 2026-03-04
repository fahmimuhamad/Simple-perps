"use client";

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
}

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatShort(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
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
}: PositionCardProps) {
  const isLong = side === "Long";
  const sideColor = isLong ? "#25a764" : "#e54040";
  const sideBg = isLong ? "#e6f4ea" : "#fde8e8";

  // Unrealized P&L
  const priceDiff = isLong ? currentPrice - entryPrice : entryPrice - currentPrice;
  const pnl = (priceDiff / entryPrice) * positionSize;
  const roi = entryPrice > 0 ? (priceDiff / entryPrice) * leverage * 100 : 0;
  const pnlPositive = pnl >= 0;
  const pnlBg = pnlPositive ? "#e6f4ea" : "#fde8e8";
  const pnlTextColor = pnlPositive ? "#25a764" : "#e54040";

  return (
    <div data-coachmark="position-card" className="bg-white rounded-[16px] shadow-[0px_0px_28px_0px_rgba(0,0,0,0.06)] flex flex-col gap-[16px] items-center py-[16px] w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[16px] w-full">
        <div className="flex items-center gap-[4px]">
          {/* BTC icon */}
          <div className="w-[16px] h-[16px] rounded-full bg-[#F78B1A] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#F78B1A" />
              <text x="8" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">₿</text>
            </svg>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
            {assetTicker === "BTC" ? "Bitcoin" : assetTicker}
          </span>
          <div className="px-[4px] rounded-[2px]" style={{ backgroundColor: sideBg }}>
            <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px]" style={{ color: sideColor }}>
              {side}
            </span>
          </div>
          <div className="bg-[#f2f2f2] px-[4px] rounded-[2px]">
            <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px] text-[#8d8e8e]">
              {leverage}x
            </span>
          </div>
        </div>
        {/* Share icon */}
        <button className="w-[20px] h-[20px] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2l4 4-4 4V8c-4 0-6 1-7 4 0-4 2-8 7-8V2z" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-[16px] items-center px-[16px] w-full">
        {/* Unrealized P&L */}
        <div data-coachmark="position-pnl" className="flex flex-col gap-[8px] items-center w-full">
          <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
            Unrealized P&L
          </span>
          <div className="w-full rounded-[8px] px-[16px] py-[12px] flex flex-col items-center" style={{ backgroundColor: pnlBg }}>
            <span
              className="font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] text-[28px] leading-[34px]"
              style={{ color: pnlTextColor }}
            >
              {pnl >= 0 ? "+" : ""}USDT {formatPrice(pnl)}
            </span>
            <span
              className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px]"
              style={{ color: pnlTextColor }}
            >
              ROI {roi >= 0 ? "+" : ""}{roi.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-[2px] flex-1">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
              Starting Price (USDT)
            </span>
            <span className="font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] text-[20px] leading-[24px] text-[#020203]">
              {formatPrice(entryPrice)}
            </span>
          </div>
          <div className="flex flex-col gap-[2px] flex-1 items-end">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
              Current Price (USDT)
            </span>
            <span className="font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] text-[20px] leading-[24px] text-[#020203]">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-[4px] w-full">
          {/* Est. Liq. Price */}
          <div data-coachmark="position-liq" className="flex items-center justify-between py-[4px]">
            <div className="flex items-center gap-[4px]">
              <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
                Est. Liq. Price
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#8d8e8e" strokeWidth="1.2" />
                <path d="M7 6.5v3.5M7 4.5v.5" stroke="#8d8e8e" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#020203]">
              {estLiqPrice > 0 ? formatShort(estLiqPrice) : "—"}
            </span>
          </div>

          {/* Locked Margin */}
          <div className="flex items-center justify-between py-[4px]">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
              Locked Margin
            </span>
            <div className="flex items-center gap-[4px]">
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#626363]">
                USDT {formatPrice(margin)}
              </span>
              <button className="w-[12px] h-[12px] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" fill="#0a68f4" />
                  <path d="M6 3.5v5M3.5 6h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* TP/SL */}
          <div className="flex items-center justify-between py-[4px]">
            <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363]">
              TP/SL
            </span>
            <div className="flex items-center gap-[4px]">
              <div className="flex items-center gap-[2px]">
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#25a764]">
                  {formatShort(tpPrice)}
                </span>
                <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e]">/</span>
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#626363]">
                  {formatShort(slPrice)}
                </span>
              </div>
              <button className="w-[12px] h-[12px] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 2l2 2-6 6H2V8l6-6z" stroke="#020203" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[16px] w-full">
          <button className="border border-[rgba(2,2,3,0.1)] rounded-[4px] h-[44px] w-[108px] flex items-center justify-center hover:bg-[#f2f2f2] transition-colors">
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
              Set TP/SL
            </span>
          </button>
          <button className="border border-[rgba(2,2,3,0.1)] rounded-[4px] h-[44px] flex-1 flex items-center justify-center hover:bg-[#f2f2f2] transition-colors">
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
              Close Position
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
