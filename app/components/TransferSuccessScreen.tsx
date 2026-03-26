"use client";

const USDT_TO_IDR_RATE = 15382; // 1 USDT ≈ IDR 15,382

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
  const idrAmount    = Math.round(usdtAmount * USDT_TO_IDR_RATE);
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
