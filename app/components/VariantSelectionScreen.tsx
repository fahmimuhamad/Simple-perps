"use client";

import { useLang } from "../LangContext";

type SelectVariant = "A" | "B" | "C" | "A-pos" | "B-pos" | "C-pos";

interface VariantSelectionScreenProps {
  onSelect: (variant: SelectVariant) => void;
}

export default function VariantSelectionScreen({ onSelect }: VariantSelectionScreenProps) {
  const { lang, setLang, t } = useLang();

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
          {t("chooseConceptToTest")}
        </p>
      </div>

      {/* Option cards */}
      <div className="flex flex-col gap-[12px] w-full">
        {/* Option A */}
        <button
          onClick={() => onSelect("A")}
          className="w-full border border-[rgba(2,2,3,0.1)] rounded-[12px] p-[16px] flex items-center text-left hover:bg-[#fafafa] active:bg-[#f2f2f2] transition-colors gap-[8px]"
        >
          <div className="w-[28px] h-[28px] rounded-full bg-[#0a68f4] flex items-center justify-center shrink-0">
            <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-white leading-none">A</span>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[#020203]">
            {t("optionAFlow")}
          </span>
        </button>

        {/* Option A with position */}
        <button
          onClick={() => onSelect("A-pos")}
          className="w-full border border-[#0a68f4] rounded-[12px] p-[16px] flex items-center text-left hover:bg-[#f0f5ff] active:bg-[#e0edff] transition-colors gap-[8px]"
        >
          <div className="w-[28px] h-[28px] rounded-full bg-[#0a68f4] flex items-center justify-center shrink-0">
            <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-white leading-none">A</span>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[#0a68f4]">
            {t("optionAPos")}
          </span>
        </button>

        {/* Option B */}
        <button
          onClick={() => onSelect("B")}
          className="w-full border border-[rgba(2,2,3,0.1)] rounded-[12px] p-[16px] flex items-center text-left hover:bg-[#fafafa] active:bg-[#f2f2f2] transition-colors gap-[8px]"
        >
          <div className="w-[28px] h-[28px] rounded-full bg-[#25a764] flex items-center justify-center shrink-0">
            <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-white leading-none">B</span>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[#020203]">
            {t("optionBView")}
          </span>
        </button>

        {/* Option B with position */}
        <button
          onClick={() => onSelect("B-pos")}
          className="w-full border border-[#25a764] rounded-[12px] p-[16px] flex items-center text-left hover:bg-[#f0faf5] active:bg-[#e0f5ea] transition-colors gap-[8px]"
        >
          <div className="w-[28px] h-[28px] rounded-full bg-[#25a764] flex items-center justify-center shrink-0">
            <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-white leading-none">B</span>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[#25a764]">
            {t("optionBPos")}
          </span>
        </button>

        {/* Option C */}
        <button
          onClick={() => onSelect("C")}
          className="w-full border border-[rgba(2,2,3,0.1)] rounded-[12px] p-[16px] flex items-center text-left hover:bg-[#fafafa] active:bg-[#f2f2f2] transition-colors gap-[8px]"
        >
          <div className="w-[28px] h-[28px] rounded-full bg-[#7c3aed] flex items-center justify-center shrink-0">
            <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-white leading-none">C</span>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[#020203]">
            {t("optionCFlow")}
          </span>
        </button>

        {/* Option C with position */}
        <button
          onClick={() => onSelect("C-pos")}
          className="w-full border border-[#7c3aed] rounded-[12px] p-[16px] flex items-center text-left hover:bg-[#f5f0ff] active:bg-[#ede0ff] transition-colors gap-[8px]"
        >
          <div className="w-[28px] h-[28px] rounded-full bg-[#7c3aed] flex items-center justify-center shrink-0">
            <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-white leading-none">C</span>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[15px] leading-[22px] text-[#7c3aed]">
            {t("optionCPos")}
          </span>
        </button>
      </div>

      {/* Language toggle */}
      <div className="bg-[#f2f2f2] flex items-center p-[2px] rounded-[8px]">
        {(["en", "id"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="w-[60px] h-[28px] rounded-[6px] flex items-center justify-center transition-colors"
            style={{ backgroundColor: lang === l ? "#ffffff" : "transparent" }}
          >
            <span
              className="text-[13px] leading-[18px]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: lang === l ? "#020203" : "#8d8e8e" }}
            >
              {l === "en" ? "EN" : "ID"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
