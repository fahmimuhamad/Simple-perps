"use client";

interface InsufficientMarginSheetProps {
  onTransfer: () => void;
  onBuyUsdt?: () => void;
  onClose: () => void;
}

export default function InsufficientMarginSheet({ onTransfer, onBuyUsdt, onClose }: InsufficientMarginSheetProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      {/* Drag indicator */}
      <div className="bg-white h-[8px] rounded-full w-[64px] mb-[8px] shrink-0" />

      {/* Sheet */}
      <div
        className="bg-white flex flex-col gap-[24px] items-center pt-[8px] rounded-tl-[8px] rounded-tr-[8px] w-full max-w-[430px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="flex flex-col gap-[24px] items-center w-full">
          {/* Drag handle + Title */}
          <div className="flex flex-col gap-[24px] items-center w-full">
            <div className="bg-[#8d8e8e] h-[4px] rounded-full w-[40px]" />
            <div className="px-[16px] w-full">
              <p
                className="text-[#020203] text-[20px] leading-[24px] text-center w-full"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
              >
                Insufficient Margin Balance
              </p>
            </div>
          </div>

          {/* Body text */}
          <div className="flex flex-col gap-[8px] items-start px-[16px] w-full pb-[8px]">
            <p
              className="text-[#020203] text-[14px] leading-[20px] w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              To trade your desired amount, you can:
            </p>
            <p
              className="text-[#020203] text-[14px] leading-[20px] w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              1. Add more margin by transferring USDT to your Futures wallet.
              <br />
              2. Buy USDT from the Spot market, then transfer to your Futures wallet.
            </p>
            <p
              className="text-[#020203] text-[14px] leading-[20px] w-full"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              You can still trade by using a smaller amount.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-[8px] items-center px-[16px] w-full">
            <button
              onClick={onTransfer}
              className="flex h-[40px] items-center justify-center overflow-hidden px-[24px] py-[8px] rounded-[8px] w-full"
              style={{ backgroundColor: "#0a68f4" }}
            >
              <span
                className="text-white text-[14px] leading-[20px] text-center"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                Transfer USDT to Future Wallet
              </span>
            </button>
            <button
              onClick={onBuyUsdt}
              className="flex h-[40px] items-center justify-center w-full"
            >
              <span
                className="text-[14px] leading-[20px] text-center"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#0a68f4" }}
              >
                Buy USDT
              </span>
            </button>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex items-end justify-center h-[34px] w-[134px] pb-2">
          <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
        </div>
      </div>
    </div>
  );
}
