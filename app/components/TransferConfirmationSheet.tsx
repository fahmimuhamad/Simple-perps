"use client";

// Icon assets from Figma (expire after 7 days)
const imgIdrtBase   = "https://www.figma.com/api/mcp/asset/93ed4dba-e445-47a4-81c1-30aab7fe0012";
const imgIdrtColor  = "https://www.figma.com/api/mcp/asset/51c6958d-2ef9-4e70-b16d-c7bb8575aaf6";
const imgUsdtBase   = "https://www.figma.com/api/mcp/asset/93ed4dba-e445-47a4-81c1-30aab7fe0012";
const imgUsdtColor  = "https://www.figma.com/api/mcp/asset/35f69c5e-c820-4f7d-a8bb-2232da8ba9b0";

interface TransferConfirmationSheetProps {
  /** Amount in IDR */
  idrAmount?: number;
  /** Converted USDT amount */
  usdtAmount?: number;
  /** Est. exchange rate */
  estRate?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function IdrtIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-0 overflow-clip">
        <img alt="" className="absolute block max-w-none size-full" src={imgIdrtBase} />
      </div>
      <div className="absolute inset-[0.39%_0.52%_0.18%_0.25%]">
        <img alt="" className="absolute block max-w-none size-full" src={imgIdrtColor} />
      </div>
    </div>
  );
}

function UsdtIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-0 overflow-clip">
        <img alt="" className="absolute block max-w-none size-full" src={imgUsdtBase} />
      </div>
      <img alt="" className="absolute block max-w-none size-full" src={imgUsdtColor} />
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#8d8e8e" strokeWidth="1.2" />
      <path d="M8 7v5" stroke="#8d8e8e" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="#8d8e8e" />
    </svg>
  );
}

export default function TransferConfirmationSheet({
  idrAmount = 1_000_000,
  usdtAmount = 59.123456,
  estRate = 16800,
  onConfirm,
  onCancel,
}: TransferConfirmationSheetProps) {
  const idrFormatted  = idrAmount.toLocaleString("id-ID");
  const usdtFormatted = usdtAmount.toLocaleString("en-US", { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  const rateFormatted = estRate.toLocaleString("id-ID");

  return (
    /* Full-screen overlay */
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-end" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      {/* Drag indicator */}
      <div className="bg-white h-[8px] rounded-full w-[64px] mb-[8px] shrink-0" />

      {/* Sheet */}
      <div className="bg-white flex flex-col gap-[16px] items-center pt-[24px] px-[16px] rounded-tl-[8px] rounded-tr-[8px] w-full max-w-[430px]">

        {/* Content */}
        <div className="flex flex-col gap-[24px] items-center w-full">
          <div className="flex flex-col gap-[16px] items-center w-full">

            {/* Title */}
            <div className="pb-[8px] w-full">
              <p className="text-[#020203] text-[20px] leading-[24px] text-center w-full"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}>
                Swap &amp; Transfer Confirmation
              </p>
            </div>

            {/* Amount row */}
            <div className="flex flex-col gap-[16px] items-center w-full">
              <div className="flex gap-[35px] items-start justify-center w-full">
                {/* Left — IDR */}
                <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                  <div className="flex gap-[4px] items-end">
                    <IdrtIcon />
                    <span className="text-[#020203] text-[14px] leading-[20px] whitespace-nowrap"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>IDR</span>
                  </div>
                  <span className="text-[#020203] text-[20px] leading-[28px] whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                    {idrFormatted}
                  </span>
                  <span className="text-[#020203] text-[12px] leading-[16px] whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    From: Pintu
                  </span>
                </div>

                {/* ≈ */}
                <div className="flex items-center self-stretch">
                  <span className="text-black text-[20px] leading-[28px] whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>≈</span>
                </div>

                {/* Right — USDT */}
                <div className="flex flex-1 flex-col gap-[8px] items-end min-w-0">
                  <div className="flex gap-[4px] items-center">
                    <UsdtIcon />
                    <span className="text-[#020203] text-[14px] leading-[20px] whitespace-nowrap"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>USDT</span>
                  </div>
                  <span className="text-[#020203] text-[20px] leading-[28px] text-right whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                    {usdtFormatted}
                  </span>
                  <span className="text-[#020203] text-[12px] leading-[16px] text-right whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    To: Pintu Futures
                  </span>
                </div>
              </div>

              {/* Est. rate */}
              <div className="flex gap-[2px] items-center justify-center">
                <span className="text-[#8d8e8e] text-[12px] leading-[16px] border-b border-dashed border-[#8d8e8e]"
                  style={{ fontFamily: "'Inter', sans-serif" }}>Est. Price:</span>
                <span className="text-[#020203] text-[12px] leading-[16px] text-right"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  USDT 1 = IDR {rateFormatted}
                </span>
                <InfoIcon />
              </div>

              {/* Breakdown */}
              <div className="flex flex-col gap-[12px] items-start w-full">
                {/* Divider */}
                <div className="h-px w-full bg-[rgba(2,2,3,0.1)]" />

                {[
                  { label: "Swap Amount", value: `IDR ${idrFormatted}`, bold: false },
                  { label: "PPN (0%)", value: "IDR 0", bold: false },
                  { label: "Total", value: `IDR ${idrFormatted}`, bold: true },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="flex items-start justify-between w-full">
                    <span className="text-[#020203] text-[12px] leading-[16px]"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: bold ? 600 : 400 }}>
                      {label}
                    </span>
                    <span className="text-[#020203] text-[12px] leading-[16px] text-right"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: bold ? 600 : 400 }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[#626363] text-[10px] leading-[14px] text-center w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Your swap trade will be executed on Pintu and transferred to Futures once finalized.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-[8px] items-center w-full">
            <button
              onClick={onConfirm}
              className="flex h-[40px] items-center justify-center overflow-hidden px-[24px] py-[8px] rounded-[8px] w-full"
              style={{ backgroundColor: "#0a68f4" }}
            >
              <span className="text-white text-[14px] leading-[20px] text-center"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Confirm</span>
            </button>
            <button
              onClick={onCancel}
              className="flex h-[40px] items-center justify-center overflow-hidden px-[24px] py-[8px] rounded-[8px] w-full"
              style={{ border: "1px solid #0a68f4" }}
            >
              <span className="text-[#0a68f4] text-[14px] leading-[20px] text-center"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Cancel</span>
            </button>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex items-end justify-center h-[34px] w-[134px]">
          <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
        </div>
      </div>
    </div>
  );
}
