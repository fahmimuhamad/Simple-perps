"use client";

import { useState } from "react";

type Side = "Long" | "Short";

const ASSET_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  BNB: "BNB",
  XRP: "XRP",
};

interface ConfirmationSheetProps {
  side: Side;
  assetTicker: string;
  leverage: number;
  margin: number;
  price: string;
  estLiqPrice: number;
  onConfirm: () => void;
  onClose: () => void;
}

function formatPrice(n: number): string {
  if (!isFinite(n) || n === 0) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function ConfirmationSheet({
  side,
  assetTicker,
  leverage,
  margin,
  price,
  estLiqPrice,
  onConfirm,
  onClose,
}: ConfirmationSheetProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const isLong = side === "Long";
  const sideColor = isLong ? "#25a764" : "#e54040";
  const assetName = ASSET_NAMES[assetTicker] ?? assetTicker;

  const liqPriceDisplay =
    estLiqPrice > 0 ? `USDT ${formatPrice(estLiqPrice)}` : "—";

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Side",
      value: (
        <span className="font-['Inter',sans-serif] text-[14px] leading-[20px]" style={{ color: sideColor }}>
          {side}
        </span>
      ),
    },
    {
      label: "Market",
      value: assetName,
    },
    {
      label: "Price",
      value: `USDT ${price}`,
    },
    {
      label: "Amount",
      value: `USDT ${margin.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
    },
    {
      label: "Leverage",
      value: `${leverage}x`,
    },
    {
      label: "Est. Liquidation Price",
      value: liqPriceDisplay,
    },
  ];

  return (
    <div className="bg-white w-[375px] rounded-t-[8px] pt-[16px] flex flex-col gap-[24px] items-center">
      {/* Title */}
      <div className="flex flex-col gap-[4px] items-center w-[343px] pb-[8px]">
        <span
          className="text-[20px] leading-[24px] text-[#020203] text-center w-full"
          style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 700 }}
        >
          Order Confirmation
        </span>
      </div>

      {/* Summary rows */}
      <div className="flex flex-col gap-[12px] w-[343px]">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between w-full">
            <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203] w-[160px]">
              {label}
            </span>
            {typeof value === "string" ? (
              <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[#020203] text-right">
                {value}
              </span>
            ) : (
              <div className="text-right">{value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-[343px] h-px bg-[rgba(2,2,3,0.1)]" />

      {/* Don't show again */}
      <div className="flex gap-[8px] items-start w-full px-[16px]">
        <button
          onClick={() => setDontShowAgain((v) => !v)}
          className="shrink-0 w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-colors"
          style={{
            backgroundColor: dontShowAgain ? "#0a68f4" : "transparent",
            border: dontShowAgain ? "none" : "1.5px solid #0a68f4",
          }}
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
          className="w-full h-[40px] bg-[#0a68f4] rounded-[8px] flex items-center justify-center hover:opacity-90 active:opacity-80 transition-opacity"
        >
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">
            Confirm
          </span>
        </button>
        <button
          onClick={onClose}
          className="w-full h-[40px] flex items-center justify-center hover:opacity-70 transition-opacity"
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
