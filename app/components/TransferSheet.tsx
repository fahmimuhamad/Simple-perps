"use client";

import { useState } from "react";
import TransferConfirmationSheet from "./TransferConfirmationSheet";
import TransferSuccessScreen from "./TransferSuccessScreen";

const AVAILABLE = 300;
const USDT_TO_IDR_RATE = 15382;

const KEYBOARD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
];

interface TransferSheetProps {
  available?: number;
  onConfirm?: (amount: number) => void;
  onClose: () => void;
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4l8 8" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="#8d8e8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 3v10M5 13l-2-2M5 13l2-2" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 13V3M11 3l-2 2M11 3l2 2" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PintuSpotIcon() {
  return (
    <div className="relative size-[24px]">
      <div className="bg-white border border-[rgba(2,2,3,0.2)] rounded-[4px] size-[24px]" />
      {/* Pintu "n" lettermark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, color: "#0a68f4", lineHeight: 1 }}>n</span>
      </div>
    </div>
  );
}

function FuturesIcon() {
  return (
    <div className="relative size-[24px]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="13" height="16" rx="2" stroke="#020203" strokeWidth="2" />
        <rect x="2" y="11" width="4" height="9" rx="1.5" stroke="#020203" strokeWidth="2" />
        <path d="M10 6l3-3 3 3" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function UsdtIcon() {
  return (
    <div className="size-[24px] rounded-full bg-[#26a17b] flex items-center justify-center shrink-0 overflow-hidden">
      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10, color: "white" }}>₮</span>
    </div>
  );
}

export default function TransferSheet({ available = AVAILABLE, onConfirm, onClose }: TransferSheetProps) {
  const [amount, setAmount] = useState("0");
  const [showBanner, setShowBanner] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const canTransfer = numericAmount > 0 && numericAmount <= available;
  // Approximate IDR conversion
  const idrValue = (numericAmount * USDT_TO_IDR_RATE).toLocaleString("id-ID", { maximumFractionDigits: 0 });

  function handleKey(key: string) {
    if (key === "") return;
    if (key === "⌫") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    const next = amount === "0" ? key : amount + key;
    const nextVal = parseFloat(next) || 0;
    setAmount(nextVal > available ? String(available) : next);
  }

  function handleMax() {
    setAmount(String(available));
  }

  function handleTransfer() {
    if (!canTransfer) return;
    setShowConfirmation(true);
  }

  return (
    <div className="bg-white w-full h-full flex flex-col">
      {showSuccess && (
        <TransferSuccessScreen
          usdtAmount={numericAmount}
          onOk={() => {
            onConfirm?.(numericAmount);
            onClose();
          }}
          onTrade={() => {
            onConfirm?.(numericAmount);
            onClose();
          }}
        />
      )}
      {showConfirmation && !showSuccess && (
        <TransferConfirmationSheet
          idrAmount={numericAmount * USDT_TO_IDR_RATE}
          usdtAmount={numericAmount}
          estRate={USDT_TO_IDR_RATE}
          onConfirm={() => {
            setShowConfirmation(false);
            setShowSuccess(true);
          }}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {/* Navigation Bar */}
      <div className="bg-white flex flex-col shrink-0 pb-[4px]">
        {/* Nav row */}
        <div className="relative flex h-[38px] items-center w-full px-[8px]">
          <button onClick={onClose} className="size-[32px] flex items-center justify-center">
            <BackIcon />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-[#020203] text-[14px] leading-[20px] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Transfer Balance
            </span>
          </div>
        </div>
      </div>

      {/* Info banner */}
      {showBanner && (
        <div className="bg-[#e6f4ea] flex items-center justify-between px-[16px] py-[8px]">
          <span className="text-[#020203] text-[12px] leading-[16px] flex-1 mr-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Easily transfer balances between Pintu wallets for free.
          </span>
          <button onClick={() => setShowBanner(false)} className="size-[20px] flex items-center justify-center shrink-0">
            <CloseIcon />
          </button>
        </div>
      )}

      {/* From / To card */}
      <div className="mx-[16px] mt-[16px] border border-[rgba(2,2,3,0.2)] rounded-[8px] py-[16px]">
        {/* From */}
        <div className="flex items-center justify-between px-[16px]">
          <div className="flex gap-[12px] items-center">
            <PintuSpotIcon />
            <div className="flex flex-col items-start">
              <span className="text-[#8d8e8e] text-[12px] leading-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>From</span>
              <span className="text-[#020203] text-[14px] leading-[20px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Pintu Spot</span>
            </div>
          </div>
          <ChevronRightIcon />
        </div>

        {/* Swap divider */}
        <div className="flex items-center pl-[52px] pr-[16px] my-[8px]">
          <div className="flex-1 h-px bg-[rgba(2,2,3,0.1)]" />
          <div className="border border-[rgba(2,2,3,0.2)] flex items-center justify-center rounded-full size-[32px] ml-[12px]">
            <SwapIcon />
          </div>
        </div>

        {/* To */}
        <div className="flex items-center justify-between px-[16px]">
          <div className="flex gap-[12px] items-center">
            <FuturesIcon />
            <div className="flex flex-col items-start">
              <span className="text-[#8d8e8e] text-[12px] leading-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>To</span>
              <span className="text-[#020203] text-[14px] leading-[20px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Futures</span>
            </div>
          </div>
          <ChevronRightIcon />
        </div>
      </div>

      {/* Amount input card */}
      <div className="mx-[16px] mt-[8px] border border-[rgba(2,2,3,0.2)] rounded-[8px] pt-[16px] pb-[8px]">
        {/* USDT selector + amount */}
        <div className="flex items-center justify-between px-[16px]">
          <div className="flex gap-[8px] items-center">
            <UsdtIcon />
            <span className="text-[#020203] text-[16px] leading-[22px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>USDT</span>
            <ChevronDownIcon />
          </div>
          <div className="flex flex-col gap-[4px] items-end flex-1 ml-[16px]">
            <div className="flex gap-[4px] items-baseline border-b border-[rgba(2,2,3,0.2)] pb-[2px]">
              <span className="text-[#020203] text-[20px] leading-[24px]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 700 }}>
                {amount}
              </span>
              <div className="bg-[#0a68f4] h-[24px] w-[1.5px]" />
            </div>
            <span className="text-[#8d8e8e] text-[10px] leading-[14px] text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
              ~ Rp {idrValue}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(2,2,3,0.1)] mx-[16px] my-[8px]" />

        {/* Available + Max */}
        <div className="flex items-center justify-between px-[16px]">
          <span className="text-[12px] leading-[16px] text-[#020203]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Available: <span style={{ fontWeight: 600 }}>USDT {available}</span>
          </span>
          <button onClick={handleMax}>
            <span className="text-[#0a68f4] text-[12px] leading-[16px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Max</span>
          </button>
        </div>
      </div>

      {/* Transfer button */}
      <div className="mx-[16px] mt-[16px]">
        <button
          onClick={handleTransfer}
          disabled={!canTransfer}
          className="w-full h-[44px] rounded-[8px] flex items-center justify-center transition-opacity"
          style={{ backgroundColor: "#0a68f4", opacity: canTransfer ? 1 : 0.4, cursor: canTransfer ? "pointer" : "not-allowed" }}
        >
          <span className="text-white text-[14px] leading-[20px] text-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            Transfer
          </span>
        </button>
      </div>

      <div className="flex-1" />

      {/* Numeric keyboard */}
      <div className="w-full shrink-0" style={{ backgroundColor: "#d1d5db" }}>
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex">
            {row.map((key, ki) => (
              <button
                key={ki}
                onClick={() => handleKey(key)}
                disabled={key === ""}
                className="flex-1 h-[60px] flex flex-col items-center justify-center transition-colors active:bg-[#b0b3b8]"
                style={{ backgroundColor: key === "⌫" ? "#adb0b5" : key === "" ? "#d1d5db" : "#ffffff" }}
              >
                {key === "⌫" ? (
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                    <path d="M21 2H8.5L2 9l6.5 7H21a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 6l-4 4M12 6l4 4" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : key === "" ? null : (
                  <span className="text-black text-[25px] leading-[30px]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    {key}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
        {/* Home indicator */}
        <div className="flex items-center justify-center py-[8px]">
          <div className="w-[134px] h-[5px] rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}
