"use client";

import { useState } from "react";

type Side = "Long" | "Short";
type OrderType = "Market" | "Limit" | "Stop" | "StopLimit" | "TrailingStop";

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  Market: "Market Order",
  Limit: "Limit Order",
  Stop: "Stop Order",
  StopLimit: "Stop Limit",
  TrailingStop: "Trailing Stop",
};

interface ConfirmationSheetProps {
  side: Side;
  assetTicker: string;
  leverage: number;
  orderType: OrderType;
  positionSize: number;
  margin: number;
  estLiqPrice: number;
  onConfirm: () => void;
  onClose: () => void;
}

function formatUsdt(n: number): string {
  if (!isFinite(n) || n === 0) return "0.00";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatBtc(usdt: number, price: number): string {
  if (!price || !isFinite(usdt / price)) return "0.000";
  return (usdt / price).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 5 });
}

export default function ConfirmationSheet({
  side,
  assetTicker,
  leverage,
  orderType,
  positionSize,
  margin,
  estLiqPrice,
  onConfirm,
  onClose,
}: ConfirmationSheetProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const isLong = side === "Long";
  const sideLabel = isLong ? "Buy / Long" : "Sell / Short";
  const sideColor = isLong ? "#25a764" : "#e54040";

  // Estimated size in BTC (approximation: positionSize / 70488.5)
  const APPROX_PRICE = 70488.5;
  const btcSize = formatBtc(positionSize, APPROX_PRICE);

  const liqPriceDisplay =
    estLiqPrice > 0
      ? `USDT ${estLiqPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
      : "—";

  return (
    <div className="bg-white w-[375px] rounded-t-[8px] pt-[16px] flex flex-col gap-[24px] items-center">
      {/* Drag handle */}
      <div className="w-[40px] h-[4px] rounded-full bg-[rgba(2,2,3,0.2)]" />

      {/* Title */}
      <div className="flex flex-col gap-[4px] items-center w-[343px] pb-[8px]">
        <span className="font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] font-bold text-[20px] leading-[24px] text-[#020203] text-center w-full">
          Order Confirmation
        </span>
      </div>

      {/* Summary rows */}
      <div className="flex flex-col gap-[12px] w-[343px]">
        {/* Market */}
        <div className="flex items-start justify-between w-full">
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203] w-[135px]">
            Market
          </span>
          <div className="flex items-center gap-[4px] justify-end">
            <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
              {assetTicker}USDT-PERP
            </span>
            <div className="bg-[#f2f2f2] px-[4px] rounded-[2px]">
              <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px] text-[#8d8e8e]">
                {leverage}x
              </span>
            </div>
          </div>
        </div>

        {/* Order Type */}
        <div className="flex items-start justify-between w-full">
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203] w-[135px]">
            Order Type
          </span>
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
            {ORDER_TYPE_LABELS[orderType]}
          </span>
        </div>

        {/* Side */}
        <div className="flex items-start justify-between w-full">
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203] w-[135px]">
            Side
          </span>
          <span
            className="font-['Inter',sans-serif] text-[14px] leading-[20px]"
            style={{ color: sideColor }}
          >
            {sideLabel}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-start justify-between w-full">
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203] w-[135px]">
            Price
          </span>
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
            Market Price
          </span>
        </div>

        {/* Estimated Size */}
        <div className="flex items-start justify-between w-full">
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
            Estimated Size
          </span>
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
            {assetTicker} {btcSize} (USDT {formatUsdt(positionSize)})
          </span>
        </div>

        {/* Cost */}
        <div className="flex items-start justify-between w-full">
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203] w-[135px]">
            Cost
          </span>
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
            USDT {formatUsdt(margin)}
          </span>
        </div>

        {/* Est. Liquidation Price */}
        <div className="flex items-start justify-between w-full">
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
            Est. Liquidation Price
          </span>
          <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203]">
            {liqPriceDisplay}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-[343px] h-px bg-[rgba(2,2,3,0.1)]" />

      {/* Don't show again checkbox */}
      <div className="flex gap-[8px] items-start w-full px-[16px]">
        <button
          onClick={() => setDontShowAgain((v) => !v)}
          className="shrink-0 w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-colors"
          style={{ backgroundColor: dontShowAgain ? "#0a68f4" : "transparent", border: dontShowAgain ? "none" : "1.5px solid rgba(2,2,3,0.3)" }}
        >
          {dontShowAgain && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-black">
          Don't show this confirmation page again. This can be configured later in Settings.
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-[8px] items-center w-[343px]">
        <button
          onClick={onConfirm}
          className="w-full h-[44px] bg-[#0a68f4] rounded-[8px] flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity"
        >
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">
            Confirm
          </span>
        </button>
        <button
          onClick={onClose}
          className="w-full h-[44px] flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#0a68f4]">
            Cancel
          </span>
        </button>
      </div>

      {/* Home indicator */}
      <div className="w-[134px] h-[34px] flex items-end justify-center pb-2">
        <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
      </div>
    </div>
  );
}
