"use client";

const RATE = 15382; // 1 USDT ≈ IDR 15,382

// Check circle icons (from Figma)
const imgCheckFill  = "https://www.figma.com/api/mcp/asset/68a93d4c-3820-4b95-aed5-0613b7d403ad";
const imgCheckMark  = "https://www.figma.com/api/mcp/asset/9b1ec308-cec9-4f37-ae78-3f0aebcb18f0";

interface TransferSuccessScreenProps {
  /** USDT amount transferred */
  usdtAmount: number;
  onOk: () => void;
  onTrade: () => void;
}

function CheckCircleIcon() {
  return (
    <div className="relative size-[20px]">
      <div className="absolute inset-[8.33%]">
        <img alt="" className="absolute block max-w-none size-full" src={imgCheckFill} />
      </div>
      <div className="absolute bottom-[29.17%] left-1/4 right-1/4 top-[33.33%]">
        <img alt="" className="absolute block max-w-none size-full" src={imgCheckMark} />
      </div>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="relative" style={{ width: 160, height: 160 }}>
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(15,123,255,0.15) 0%, transparent 70%)" }} />
      {/* Blue circle */}
      <div className="absolute inset-[19%] rounded-full bg-[#0f7bff] flex items-center justify-center shadow-lg">
        {/* Checkmark SVG */}
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M13 25l8 8 14-16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default function TransferSuccessScreen({ usdtAmount, onOk, onTrade }: TransferSuccessScreenProps) {
  const idrAmount    = Math.round(usdtAmount * RATE);
  const fee          = (usdtAmount * 0.025).toFixed(3); // mock 2.5% fee
  const received     = (usdtAmount - parseFloat(fee)).toFixed(2);

  const idrFormatted = idrAmount.toLocaleString("id-ID");
  const usdtReceived = parseFloat(received).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const usdtFee      = parseFloat(fee).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

  return (
    <div
      className="absolute inset-0 z-50 w-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a1628 0%, #020303 60%)" }}
    >
      {/* Status bar */}
      <div className="h-[44px] w-full flex items-center justify-between px-[16px] shrink-0">
        <span className="text-white text-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>9:41</span>
        <div className="flex gap-[6px] items-center">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="white"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4" y="2" width="3" height="10" rx="1"/><rect x="8" y="0" width="3" height="12" rx="1"/><rect x="12" y="0" width="3" height="12" rx="1" opacity="0.3"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><path d="M8 2.4C10.2 2.4 12.2 3.3 13.6 4.8L15 3.4C13.2 1.3 10.7 0 8 0S2.8 1.3 1 3.4l1.4 1.4C3.8 3.3 5.8 2.4 8 2.4z"/><path d="M8 5.6c1.4 0 2.6.6 3.5 1.5L13 5.6C11.7 4.1 9.9 3.2 8 3.2S4.3 4.1 3 5.6l1.5 1.5C5.4 6.2 6.6 5.6 8 5.6z"/><circle cx="8" cy="10" r="2"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/></svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-[16px] pt-[40px] overflow-y-auto">

        {/* Success icon */}
        <div className="flex flex-col items-center gap-[16px] mb-[24px]">
          <SuccessIcon />
          <div className="flex flex-col items-center gap-[4px]">
            <p className="text-white text-[20px] leading-[24px] text-center w-full"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}>
              Swap &amp; Transfer Successful
            </p>
            <p className="text-[#d4d4d4] text-[12px] leading-[16px] text-center w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Funds successfully transferred to your Pintu Futures wallet.
            </p>
          </div>
        </div>

        {/* Progress steps card */}
        <div className="bg-[#101214] border border-[rgba(255,255,255,0.2)] rounded-[8px] p-[16px] w-full max-w-[343px] flex gap-[8px] mb-[16px]">
          {/* Step icons + connector */}
          <div className="flex flex-col items-center justify-between self-stretch shrink-0">
            <CheckCircleIcon />
            {/* Connector line */}
            <div className="w-px flex-1 bg-[#d4d4d4] opacity-40 my-[4px]" />
            <CheckCircleIcon />
          </div>
          {/* Step labels */}
          <div className="flex flex-1 flex-col gap-[8px]">
            <span className="text-white text-[12px] leading-[16px]"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Swapping IDR to USDT
            </span>
            <span className="text-white text-[12px] leading-[16px]"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Transferring USDT to your Pintu Futures wallet
            </span>
          </div>
        </div>

        {/* Detail rows */}
        <div className="flex flex-col gap-[16px] w-full max-w-[343px] mb-[32px]">
          {[
            { label: "From",                    value: "Pro Spot",        bold: true },
            { label: "To",                      value: "Pintu Futures",   bold: true },
            { label: "Swap Amount",             value: `IDR ${idrFormatted}`, bold: false },
            { label: "Spot Taker Fee + PPN (0%)", value: `USDT ${usdtFee}`, bold: false },
            { label: "Amount Received",         value: `USDT ${usdtReceived}`, bold: false },
          ].map(({ label, value, bold }) => (
            <div key={label} className="flex items-start justify-between gap-[32px]">
              <span className="text-white text-[14px] leading-[20px] opacity-60 whitespace-nowrap"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {label}
              </span>
              <span className="text-white text-[14px] leading-[20px] text-right"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: bold ? 600 : 400 }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="px-[16px] flex flex-col gap-[8px] pb-[0px] shrink-0">
        <button
          onClick={onOk}
          className="h-[40px] rounded-[8px] flex items-center justify-center w-full"
          style={{ backgroundColor: "#0f7bff" }}
        >
          <span className="text-white text-[14px] leading-[20px] text-center"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>OK</span>
        </button>
        <button
          onClick={onTrade}
          className="h-[40px] rounded-[8px] flex items-center justify-center w-full"
        >
          <span className="text-[14px] leading-[20px] text-center"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#0f7bff" }}>
            Trade on Pintu Futures
          </span>
        </button>
      </div>

      {/* Home indicator */}
      <div className="flex items-end justify-center h-[34px] pb-2 shrink-0">
        <div className="w-[134px] h-[5px] rounded-full bg-white opacity-30" />
      </div>
    </div>
  );
}
