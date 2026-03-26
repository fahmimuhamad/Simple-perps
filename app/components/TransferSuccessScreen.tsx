"use client";

const imgRectangle328 = "https://www.figma.com/api/mcp/asset/01c55705-1a69-45e5-92e3-3bf837317cfd";
const imgRectangle329 = "https://www.figma.com/api/mcp/asset/fabc7582-5c22-4a9e-8b63-5cc1fc54e57b";
const imgGroup = "https://www.figma.com/api/mcp/asset/3482ad3f-2bd5-4905-8e39-40745f491338";
const imgEllipse261 = "https://www.figma.com/api/mcp/asset/7195cca0-3d20-44fa-a99f-08398d6ca770";
const imgEllipse260 = "https://www.figma.com/api/mcp/asset/06e51076-b243-40e7-b0c2-7f7e226bbf61";
const imgIcons24Switch = "https://www.figma.com/api/mcp/asset/05297446-982d-4457-aabc-758d58fd68d2";

interface TransferSuccessScreenProps {
  usdtAmount: number;
  onOk: () => void;
  onTrade: () => void;
}

export default function TransferSuccessScreen({ usdtAmount, onOk, onTrade }: TransferSuccessScreenProps) {
  const usdtFormatted = usdtAmount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return (
    <div className="absolute inset-0 z-50 w-full h-full overflow-hidden" style={{ background: "#020303" }}>
      {/* Background layers */}
      <div className="absolute inset-0">
        <img alt="" className="absolute block w-full h-full object-cover" src={imgRectangle328} />
      </div>
      <div className="absolute inset-0">
        <img alt="" className="absolute block w-full h-full object-cover" src={imgRectangle329} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col">
        {/* Icon + title */}
        <div className="flex flex-col items-center px-[16px] pt-[134px]">
          <div className="flex flex-col items-center w-full">
            {/* Success icon */}
            <div className="relative shrink-0" style={{ width: 224.211, height: 160 }}>
              {/* Check circle background */}
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  background: "#e6f4ea",
                  top: "19%", bottom: "19%",
                  left: "27.86%", right: "27.86%",
                }}
              >
                <div className="absolute inset-[8.33%]">
                  <img alt="" className="absolute block max-w-none size-full" src={imgGroup} />
                </div>
              </div>
              {/* Rings */}
              <div className="absolute" style={{ top: "18.75%", bottom: "18.75%", left: "27.48%", right: "27.92%" }}>
                <img alt="" className="absolute block max-w-none size-full" src={imgEllipse261} />
              </div>
              <div className="absolute" style={{ top: "23.96%", bottom: "23.96%", left: "31.19%", right: "31.64%" }}>
                <img alt="" className="absolute block max-w-none size-full" src={imgEllipse260} />
              </div>
              {/* Switch icon center */}
              <div className="absolute overflow-hidden" style={{ top: "34.38%", bottom: "34.37%", left: "38.63%", right: "39.07%" }}>
                <div className="absolute inset-[8.33%_12.5%]">
                  <img alt="" className="absolute block max-w-none size-full" src={imgIcons24Switch} />
                </div>
              </div>
            </div>

            {/* Title */}
            <p
              className="text-white text-[20px] leading-[24px] text-center w-full mt-0"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
            >
              Transferring USDT {usdtFormatted}
            </p>
          </div>
        </div>

        {/* Detail rows */}
        <div className="flex flex-col gap-[25px] px-[16px] mt-[56px]">
          {[
            { label: "From",           value: "Pintu Spot",    bold: true },
            { label: "To",             value: "Pintu Futures", bold: true },
            { label: "Amount",         value: `USDT ${usdtFormatted}`, bold: false },
            { label: "Blockchain Fee", value: "Free",          bold: false },
          ].map(({ label, value, bold }) => (
            <div key={label} className="flex items-start w-[343px]" style={{ gap: 64 }}>
              <span
                className="text-white text-[14px] leading-[20px] whitespace-nowrap shrink-0"
                style={{ fontFamily: "'Inter', sans-serif", opacity: 0.6 }}
              >
                {label}
              </span>
              <span
                className="text-white text-[14px] leading-[20px] text-right flex-1"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: bold ? 600 : 400 }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex flex-col gap-[8px] px-[16px]">
          <button
            onClick={onOk}
            className="w-full h-[40px] rounded-[8px] flex items-center justify-center"
            style={{ backgroundColor: "#0a68f4" }}
          >
            <span className="text-white text-[14px] leading-[20px] text-center"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>OK</span>
          </button>
          <button
            onClick={onTrade}
            className="w-full h-[40px] flex items-center justify-center"
          >
            <span className="text-[14px] leading-[20px] text-center"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#0a68f4" }}>
              View History
            </span>
          </button>
        </div>

        {/* Home indicator */}
        <div className="flex items-end justify-center pb-2 safe-bottom">
          <div className="w-[134px] h-[5px] rounded-full bg-white" style={{ opacity: 0.3 }} />
        </div>
      </div>
    </div>
  );
}
