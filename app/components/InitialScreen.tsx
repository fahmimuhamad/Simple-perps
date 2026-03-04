"use client";

import { useState, useRef } from "react";
import OrderTypeSheet from "./OrderTypeSheet";
import PositionCard from "./PositionCard";
import CoachmarkOverlay, { CoachmarkStep } from "./CoachmarkOverlay";

type Side = "Long" | "Short";

// Inline SVG icons
function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="#F78B1A">
      <path d="M10 2l2.39 4.84 5.35.78-3.87 3.77.91 5.32L10 14.27l-4.78 2.44.91-5.32L2.26 7.62l5.35-.78L10 2z" />
    </svg>
  );
}

function IconDots() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="5" r="1.25" fill="#020203" />
      <circle cx="10" cy="10" r="1.25" fill="#020203" />
      <circle cx="10" cy="15" r="1.25" fill="#020203" />
    </svg>
  );
}

function IconOrderList() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="#020203" strokeWidth="1.5" />
      <path d="M6 7h8M6 10h8M6 13h5" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 4h10l6 6v18H8V4z" stroke="#8d8e8e" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 4v6h6" stroke="#8d8e8e" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11 14h10M11 18h10M11 22h6" stroke="#8d8e8e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconHome({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconMarket({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 17l5-5 4 4 5-6 4 3" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrade({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" />
      <path d="M12 8v4l3 3" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconFutures({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1" fill={active ? "#020203" : "none"} stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" />
    </svg>
  );
}

function IconWallet({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" />
      <path d="M16 13a1 1 0 110 2 1 1 0 010-2z" fill={active ? "#020203" : "#8d8e8e"} />
      <path d="M6 6V5a2 2 0 012-2h8a2 2 0 012 2v1" stroke={active ? "#020203" : "#8d8e8e"} strokeWidth="1.5" />
    </svg>
  );
}

function ChartPlaceholder() {
  return (
    <div className="relative w-full h-[274px] overflow-hidden">
      <svg viewBox="0 0 375 260" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#25a764" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#25a764" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 180 L20 170 L40 175 L60 155 L80 160 L100 140 L120 145 L140 120 L160 130 L170 100 L180 110 L190 90 L200 80 L210 95 L220 75 L230 85 L240 70 L260 80 L280 65 L300 75 L320 60 L340 70 L360 55 L375 60" stroke="#25a764" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 180 L20 170 L40 175 L60 155 L80 160 L100 140 L120 145 L140 120 L160 130 L170 100 L180 110 L190 90 L200 80 L210 95 L220 75 L230 85 L240 70 L260 80 L280 65 L300 75 L320 60 L340 70 L360 55 L375 60 L375 260 L0 260 Z" fill="url(#chartGrad)" />
        <circle cx="375" cy="60" r="4" fill="#25a764" />
        <circle cx="375" cy="60" r="8" fill="#25a764" fillOpacity="0.2" />
      </svg>
      <span className="absolute top-0 left-[100px] font-['Inter',sans-serif] text-[10px] leading-[12px] text-[#8d8e8e]">70.488,5</span>
      <span className="absolute bottom-[20px] left-[50px] font-['Inter',sans-serif] text-[10px] leading-[12px] text-[#8d8e8e]">341.747.942</span>
      <div className="absolute bottom-0 left-0 right-0 border-t border-[rgba(2,2,3,0.2)]" />
      <div className="absolute bottom-0 left-0 right-0 flex gap-[36px] px-[8px] pb-[3px]">
        {["12:15", "12:30", "12:45", "13:00", "13:15"].map((t) => (
          <span key={t} className="font-['Inter',sans-serif] text-[8px] leading-[14px] text-[#8d8e8e]">{t}</span>
        ))}
      </div>
    </div>
  );
}

const TIMEFRAMES = ["1m", "15m", "1H", "4H", "1D"];

// Simulated "current" price for position P&L calculation
const CURRENT_PRICE = 72000;
const ENTRY_PRICE = 70488.5;

interface OpenPosition {
  side: Side;
  leverage: number;
  positionSize: number;
  margin: number;
  entryPrice: number;
  tpPrice: number;
  slPrice: number;
  estLiqPrice: number;
}

export default function InitialScreen() {
  const [activeTimeframe, setActiveTimeframe] = useState("15m");
  const [openSheet, setOpenSheet] = useState<Side | null>(null);
  const [position, setPosition] = useState<OpenPosition | null>(null);
  const [coachmarkStep, setCoachmarkStep] = useState<CoachmarkStep | null>(null);
  const [hasSeenCoachmark, setHasSeenCoachmark] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleOrderConfirm(pos: OpenPosition) {
    setPosition(pos);
    setOpenSheet(null);
    // Show coachmarks only for first-time users
    if (!hasSeenCoachmark) {
      setCoachmarkStep(1);
    }
  }

  function handleCoachmarkNext() {
    if (coachmarkStep === 1) setCoachmarkStep(2);
    else if (coachmarkStep === 2) setCoachmarkStep(3);
  }

  function handleCoachmarkDone() {
    setCoachmarkStep(null);
    setHasSeenCoachmark(true);
  }

  const positionCount = position ? 1 : 0;

  return (
    <div className="relative w-[375px] h-screen bg-white flex flex-col overflow-hidden">
      {/* Status Bar */}
      <div className="h-[44px] bg-white flex items-center justify-between px-[16px] shrink-0">
        <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">9:41</span>
        <div className="flex items-center gap-[6px]">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="4" width="3" height="8" rx="0.5" fill="#020203" />
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" fill="#020203" />
            <rect x="9" y="1" width="3" height="11" rx="0.5" fill="#020203" />
            <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="#020203" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 3a7 7 0 017 7" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 6a4 4 0 014 4" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="10" r="1" fill="#020203" />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="#020203" strokeOpacity="0.35" />
            <rect x="2" y="2" width="18" height="8" rx="1.5" fill="#020203" />
            <path d="M23 4v4a2 2 0 000-4z" fill="#020203" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="h-[48px] bg-white flex items-center justify-between px-[16px] shrink-0">
        <div className="flex items-center gap-[8px]">
          <button className="w-[20px] h-[20px] flex items-center justify-center"><IconMenu /></button>
          <div className="w-[16px] h-[16px] rounded-full bg-[#F78B1A] flex items-center justify-center overflow-hidden shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#F78B1A" />
              <text x="8" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">₿</text>
            </svg>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">Bitcoin</span>
          <IconStar />
        </div>
        <button className="w-[20px] h-[20px] flex items-center justify-center"><IconDots /></button>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Price + Funding */}
        <div className="px-[16px] pt-[8px] pb-[4px] flex items-start justify-between">
          <div className="flex flex-col gap-[4px]">
            <span className="font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] text-[20px] leading-[24px] text-[#020203]">70.488,5</span>
            <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#25a764]">+345,34 (1,2%)</span>
          </div>
          <div className="flex flex-col gap-[4px] items-end">
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e] border-b border-dashed border-[#8d8e8e]">Funding / Countdown</span>
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#626363]">-0,0063% / 01:49:08</span>
          </div>
        </div>

        {/* Chart */}
        <ChartPlaceholder />

        {/* Timeframe bar */}
        <div className="flex items-center justify-between px-[16px] py-[4px]">
          <div className="flex items-start">
            {TIMEFRAMES.map((tf) => (
              <button key={tf} onClick={() => setActiveTimeframe(tf)} className="flex flex-col gap-[2px] items-center px-[8px] py-[4px] rounded-[4px]">
                <span className={`font-['Inter',sans-serif] text-[10px] leading-[14px] text-center ${activeTimeframe === tf ? "font-semibold text-[#020203]" : "font-normal text-[#8d8e8e]"}`}>{tf}</span>
                {activeTimeframe === tf && <div className="bg-[#0a68f4] h-[2px] rounded-[8px] w-[20px]" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-[12px]">
            <div className="bg-[rgba(2,2,3,0.1)] flex items-center p-[1.3px] rounded-full overflow-hidden">
              <div className="bg-white flex items-center p-[2.7px] rounded-full">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 8L4 5l2.5 2.5L9 3" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div className="flex items-center p-[2.7px] rounded-full opacity-60">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <rect x="2" y="4" width="2" height="5" rx="0.5" stroke="#020203" strokeWidth="1" />
                  <rect x="7" y="2" width="2" height="7" rx="0.5" stroke="#020203" strokeWidth="1" />
                  <path d="M3 6.5V4M8 4.5V2" stroke="#020203" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <button className="w-[20px] h-[20px] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        {/* Pintu Users Positions */}
        <div className="px-[16px] py-[8px] flex flex-col gap-[8px]">
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">Pintu Users Positions</span>
          <div className="flex flex-col gap-[2px]">
            <div className="flex gap-[4px] w-full">
              <div className="bg-[#25a764] h-[4px] rounded-l-[4px]" style={{ width: "70%" }} />
              <div className="bg-[#e54040] h-[4px] rounded-r-[4px] flex-1" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#25a764]" />
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#020203]">70% Long</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#e54040]" />
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#020203]">30% Short</span>
              </div>
            </div>
          </div>
          <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#626363]">What other users hold right now. Not a financial recommendation.</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#f2f2f2] mx-[16px]" />

        {/* Long / Short buttons */}
        <div className="px-[16px] py-[16px] flex gap-[16px]">
          <button onClick={() => setOpenSheet("Long")} className="flex-1 h-[52px] bg-[#25a764] rounded-[8px] flex flex-col gap-[2px] items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">↗ Long</span>
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-white text-center px-[8px]">Profit when price goes up</span>
          </button>
          <button onClick={() => setOpenSheet("Short")} className="flex-1 h-[52px] bg-[#e54040] rounded-[8px] flex flex-col gap-[2px] items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">↘ Short</span>
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-white text-center px-[8px]">Profit when price goes down</span>
          </button>
        </div>

        {/* Positions header */}
        <div className="px-[16px] py-[8px] flex items-center justify-between">
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">
            Positions ({positionCount})
          </span>
          <button className="w-[20px] h-[20px] flex items-center justify-center"><IconOrderList /></button>
        </div>

        {/* Position card or empty state */}
        {position ? (
          <div className="px-[16px] pb-[16px]">
            <PositionCard
              assetTicker="BTC"
              side={position.side}
              leverage={position.leverage}
              entryPrice={position.entryPrice}
              currentPrice={CURRENT_PRICE}
              positionSize={position.positionSize}
              margin={position.margin}
              estLiqPrice={position.estLiqPrice}
              tpPrice={position.tpPrice}
              slPrice={position.slPrice}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-[8px] py-[32px]">
            <IconDocument />
            <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#626363]">No Open Orders</span>
          </div>
        )}

        {/* Bottom nav spacer */}
      </div>

      {/* Bottom Navigation */}
      <div
        className="shrink-0 flex flex-col items-center pt-[8px] border-t border-[rgba(2,2,3,0.1)]"
        style={{ backgroundColor: "rgba(255,255,255,0.96)" }}
      >
        <div className="flex items-start justify-between w-full px-[8px]">
          {[
            { label: "Home", icon: <IconHome /> },
            { label: "Market", icon: <IconMarket /> },
            { label: "Trade", icon: <IconTrade /> },
            { label: "Futures", icon: <IconFutures active />, active: true },
            { label: "Wallet", icon: <IconWallet /> },
          ].map(({ label, icon, active }) => (
            <div key={label} className="flex flex-col gap-[4px] items-center justify-center w-[58px] overflow-hidden px-[16px]">
              <div className="w-[24px] h-[24px] flex items-center justify-center">{icon}</div>
              <span className={`text-[10px] leading-[14px] text-center whitespace-nowrap ${active ? "font-['Inter',sans-serif] font-semibold text-[#020203]" : "font-['Inter',sans-serif] font-normal text-[#020203]"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-[34px] flex items-end justify-center pb-2">
          <div className="w-[134px] h-[5px] rounded-full bg-[#020203]" />
        </div>
      </div>

      {/* Order Sheet overlay */}
      {openSheet && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpenSheet(null)} />
          <div className="absolute inset-0 flex items-end pointer-events-none">
            <div className="pointer-events-auto w-full">
              <OrderTypeSheet
                side={openSheet}
                assetTicker="BTC"
                price="70.488,5"
                initialLeverage={25}
                availableMargin="300"
                onConfirm={(pos) => handleOrderConfirm(pos)}
                onClose={() => setOpenSheet(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Coachmark overlay */}
      {coachmarkStep !== null && position && (
        <CoachmarkOverlay
          step={coachmarkStep}
          scrollContainerRef={scrollRef}
          onNext={handleCoachmarkNext}
          onDone={handleCoachmarkDone}
        />
      )}
    </div>
  );
}
