"use client";

import { useState, useEffect } from "react";
import { useLang } from "../LangContext";

// Onboarding step images from Figma
const imgStep1 = "https://www.figma.com/api/mcp/asset/dde0af1d-146a-4ea1-95b4-5f71ca422722";
const imgStep2 = "https://www.figma.com/api/mcp/asset/1eb95d3d-c2a2-4e04-af2f-6c459ee83dcb";
const imgStep3 = "https://www.figma.com/api/mcp/asset/545c15dd-7f7b-4dbc-a589-0add260ababa";

interface OnboardingSheetProps {
  onDone: () => void;
}

export default function OnboardingSheet({ onDone }: OnboardingSheetProps) {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [displayStep, setDisplayStep] = useState(0);
  const [fading, setFading] = useState(false);

  const STEPS = [
    {
      image: imgStep1,
      title: t("whatIsFutures"),
      body: <span>{t("whatIsFuturesBody")}</span>,
      cta: t("next"),
    },
    {
      image: imgStep2,
      title: t("goingLong"),
      body: (
        <span>
          {t("goingLongBody").split('"Long"')[0]}&ldquo;<span style={{ color: "#25a764" }}>Long</span>&rdquo;{t("goingLongBody").split('"Long"')[1]}
        </span>
      ),
      cta: t("next"),
    },
    {
      image: imgStep3,
      title: t("goingShort"),
      body: (
        <span>
          {t("goingShortBody").split('"Short"')[0]}&ldquo;<span style={{ color: "#e54040" }}>Short</span>&rdquo;{t("goingShortBody").split('"Short"')[1]}
        </span>
      ),
      cta: t("tradeOnPintu"),
    },
  ];

  // Slide up on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function handleCta() {
    if (fading) return;
    if (step < STEPS.length - 1) {
      // Cross-fade to next step
      setFading(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setDisplayStep((s) => s + 1);
        setFading(false);
      }, 220);
    } else {
      // Slide down then call onDone
      setVisible(false);
      setTimeout(onDone, 320);
    }
  }

  const current = STEPS[displayStep];

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-end"
      style={{
        background: "rgba(0,0,0,0.6)",
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms ease",
      }}
    >
      {/* Drag indicator */}
      <div
        className="mb-[8px] h-[8px] w-[64px] rounded-full bg-white shrink-0"
        style={{
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      />

      {/* Sheet */}
      <div
        className="w-full bg-white rounded-t-[8px] flex flex-col gap-[24px] items-center pt-[16px] px-[16px]"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Content with cross-fade */}
        <div
          className="flex flex-col gap-[16px] items-center w-full px-[16px]"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(8px)" : "translateY(0)",
            transition: fading
              ? "opacity 200ms ease, transform 200ms ease"
              : "opacity 220ms ease 20ms, transform 220ms ease 20ms",
          }}
        >
          {/* Illustration */}
          <div className="relative w-[310px] h-[260px] overflow-hidden shrink-0">
            <img
              src={current.image}
              alt=""
              className="absolute w-full h-full object-contain"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-[8px] items-center text-center">
            <span
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
                fontWeight: 500,
                fontSize: 20,
                lineHeight: "24px",
                color: "#2c2f30",
              }}
            >
              {current.title}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "20px",
                color: "#020203",
                maxWidth: 343,
                display: "block",
                textAlign: "center",
              }}
            >
              {current.body}
            </span>
          </div>

          {/* Page dots */}
          <div className="flex gap-[6px] items-center justify-center">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === step ? 12 : 4,
                  height: 4,
                  backgroundColor: i === step ? "#0a68f4" : "rgba(2,2,3,0.15)",
                  transition: "width 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 250ms ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-[16px] items-center w-full">
          <button
            onClick={handleCta}
            disabled={fading}
            className="w-[343px] h-[44px] rounded-[8px] flex items-center justify-center active:scale-[0.98]"
            style={{
              backgroundColor: "#0a68f4",
              transition: "opacity 150ms ease, transform 150ms ease",
              opacity: fading ? 0.7 : 1,
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "20px",
                color: "white",
                transition: "opacity 200ms ease",
                opacity: fading ? 0 : 1,
              }}
            >
              {current.cta}
            </span>
          </button>

          {/* Home indicator */}
          <div className="w-[134px] flex items-center justify-center safe-bottom">
            <div className="w-[134px] h-[5px] rounded-full bg-[#020203] opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
