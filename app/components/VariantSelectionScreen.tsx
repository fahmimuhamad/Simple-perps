"use client";

interface VariantSelectionScreenProps {
  onSelect: (variant: "A" | "B") => void;
}

export default function VariantSelectionScreen({ onSelect }: VariantSelectionScreenProps) {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center px-[24px] gap-[32px]">
      {/* Logo / header */}
      <div className="flex flex-col items-center gap-[8px]">
        <div className="w-[48px] h-[48px] rounded-full bg-[#F78B1A] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#F78B1A" />
            <text x="14" y="19" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">₿</text>
          </svg>
        </div>
        <p
          className="text-[22px] leading-[28px] text-[#020203] text-center"
          style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
        >
          Pintu Futures
        </p>
        <p className="font-['Inter',sans-serif] text-[13px] leading-[18px] text-[#626363] text-center">
          Choose a concept to test
        </p>
      </div>

      {/* Option cards */}
      <div className="flex flex-col gap-[12px] w-full">
        {/* Option A */}
        <button
          onClick={() => onSelect("A")}
          className="w-full border border-[rgba(2,2,3,0.1)] rounded-[12px] p-[16px] flex flex-col gap-[6px] items-start text-left hover:bg-[#fafafa] active:bg-[#f2f2f2] transition-colors"
        >
          <div className="flex items-center gap-[8px]">
            <div className="w-[28px] h-[28px] rounded-full bg-[#0a68f4] flex items-center justify-center shrink-0">
              <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-white leading-none">A</span>
            </div>
            <span className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[#020203]">
              Option A — Current Flow
            </span>
          </div>
          <p className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363] pl-[36px]">
            Standard position card with entry price, liquidation price, and 3-step coachmark.
          </p>
        </button>

        {/* Option B */}
        <button
          onClick={() => onSelect("B")}
          className="w-full border border-[rgba(2,2,3,0.1)] rounded-[12px] p-[16px] flex flex-col gap-[6px] items-start text-left hover:bg-[#fafafa] active:bg-[#f2f2f2] transition-colors"
        >
          <div className="flex items-center gap-[8px]">
            <div className="w-[28px] h-[28px] rounded-full bg-[#25a764] flex items-center justify-center shrink-0">
              <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-white leading-none">B</span>
            </div>
            <span className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[#020203]">
              Option B — Simplified View
            </span>
          </div>
          <p className="font-['Inter',sans-serif] text-[12px] leading-[16px] text-[#626363] pl-[36px]">
            Streamlined position card with prominent P&L display, and 2-step coachmark focused on position monitoring.
          </p>
        </button>
      </div>
    </div>
  );
}
