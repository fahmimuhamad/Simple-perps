"use client";

import { useState, useRef, useEffect } from "react";
import OrderTypeSheet from "./OrderTypeSheet";
import PositionCard from "./PositionCard";
import PositionCardB from "./PositionCardB";
import CoachmarkOverlay, { CoachmarkStep } from "./CoachmarkOverlay";
import CoachmarkOverlayB, { CoachmarkStepB } from "./CoachmarkOverlayB";
import LiveChart from "./LiveChart";
import AddRemoveMarginSheet from "./AddRemoveMarginSheet";
import TpSlSheet from "./TpSlSheet";
import LeverageSheet from "./LeverageSheet";
import ConfirmationSheet from "./ConfirmationSheet";
import TransferSheet from "./TransferSheet";
import { useBinancePrice } from "../hooks/useBinancePrice";
import { useBinanceKlines } from "../hooks/useBinanceKlines";
import { useFundingRate, useLongShortRatio } from "../hooks/useBinanceFutures";

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

// ── Bottom Nav Icon assets (from Figma) ─────────────────────────────────────
const imgNavHome    = "https://www.figma.com/api/mcp/asset/6e416875-ca78-4fd8-8283-dae81af72035";
const imgNavMarkets = "https://www.figma.com/api/mcp/asset/feda7c4d-c058-419b-af41-6f1b7a99f5e7";
const imgNavTrade   = "https://www.figma.com/api/mcp/asset/5d999868-aed7-462a-9cf7-794922086c8b";
const imgNavFutures = "https://www.figma.com/api/mcp/asset/ab636837-5216-4107-853e-26441640c081";
const imgNavWallet  = "https://www.figma.com/api/mcp/asset/c878f658-0ed4-460a-af6f-843e76fdbfea";

const TIMEFRAMES = ["1m", "15m", "1H", "4H", "1D"];

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

interface InitialScreenProps {
  onNavigateHome?: () => void;
  variant?: "A" | "B";
  startWithPosition?: boolean;
}

export default function InitialScreen({ onNavigateHome, variant = "A", startWithPosition }: InitialScreenProps) {
  const [activeTimeframe, setActiveTimeframe] = useState("15m");
  const [chartType, setChartType] = useState<"line" | "candle">("line");
  const [openSheet, setOpenSheet] = useState<Side | null>(null);
  const [position, setPosition] = useState<OpenPosition | null>(null);
  const [showMarginSheet, setShowMarginSheet] = useState(false);
  const [showTpSlSheet, setShowTpSlSheet] = useState(false);
  const [showLeverageSheet, setShowLeverageSheet] = useState(false);
  const [coachmarkStep, setCoachmarkStep] = useState<CoachmarkStep | null>(null);
  const [coachmarkStepB, setCoachmarkStepB] = useState<CoachmarkStepB | null>(null);
  const [hasSeenCoachmark, setHasSeenCoachmark] = useState(false);
  const [showTransferSheet, setShowTransferSheet] = useState(false);
  const [currentMargin, setCurrentMargin] = useState("0");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Order sheet sub-overlays (lifted so they cover full frame)
  const [pendingPos, setPendingPos] = useState<OpenPosition | null>(null);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showOrderLeverage, setShowOrderLeverage] = useState(false);
  const [orderLeverageInit, setOrderLeverageInit] = useState<{ leverage: number; margin: number; entryPrice: number } | null>(null);
  const [showOrderTpSl, setShowOrderTpSl] = useState(false);
  const [orderTpSlInit, setOrderTpSlInit] = useState<{ tpPrice: number; slPrice: number; tpEnabled: boolean; slEnabled: boolean; positionSize: number; leverage: number; estLiqPrice: number } | null>(null);
  // Controlled state fed back into OrderTypeSheet
  const [orderLeverage, setOrderLeverage] = useState(25);
  const [orderTpPrice, setOrderTpPrice] = useState<number | undefined>(undefined);
  const [orderSlPrice, setOrderSlPrice] = useState<number | undefined>(undefined);
  const [orderTpEnabled, setOrderTpEnabled] = useState<boolean | undefined>(variant === "B" ? false : undefined);
  const [orderSlEnabled, setOrderSlEnabled] = useState<boolean | undefined>(undefined);

  // Live Binance data
  const ticker = useBinancePrice("btcusdt");
  const klines = useBinanceKlines("BTCUSDT", activeTimeframe, 80);
  const { funding, countdown } = useFundingRate("BTCUSDT");
  const longShort = useLongShortRatio("BTCUSDT");

  // Format price for display (e.g. 70488.5 → "70,488.5")
  function formatDisplayPrice(n: number): string {
    return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  // Format price as European format string for OrderTypeSheet (e.g. 70488.5 → "70.488,5")
  function toEuropeanPrice(n: number): string {
    const [int, dec] = n.toFixed(1).split(".");
    const intFormatted = parseInt(int).toLocaleString("de-DE");
    return `${intFormatted},${dec}`;
  }

  const livePrice = ticker?.price ?? 0;
  const livePriceDisplay = livePrice > 0 ? formatDisplayPrice(livePrice) : "—";
  const livePriceForSheet = livePrice > 0 ? toEuropeanPrice(livePrice) : "70.488,5";

  // Seed position with live price when startWithPosition is true
  useEffect(() => {
    if (!startWithPosition || position !== null || livePrice <= 0) return;
    const leverage = 10;
    const margin = 200;
    const positionSize = margin * leverage;
    const estLiqPrice = livePrice * (1 - 1 / leverage);
    setPosition({
      side: "Long",
      leverage,
      positionSize,
      margin,
      entryPrice: livePrice,
      tpPrice: 0,
      slPrice: livePrice * 0.96,
      estLiqPrice,
    });
  }, [startWithPosition, livePrice, position]);

  const changeAbs = ticker?.change ?? 0;
  const changePct = ticker?.changePct ?? 0;
  const changePositive = changeAbs >= 0;
  const changeColor = changePositive ? "#25a764" : "#e54040";
  const changeLabel = `${changePositive ? "+" : ""}${formatDisplayPrice(Math.abs(changeAbs))} (${changePositive ? "+" : ""}${changePct.toFixed(2)}%)`;

  function handleOrderConfirm(pos: OpenPosition) {
    setPosition(pos);
    setOpenSheet(null);
    if (!hasSeenCoachmark) {
      if (variant === "B") {
        setCoachmarkStepB(1);
      } else {
        setCoachmarkStep(1);
      }
    }
  }

  function handleMarginConfirm(newMargin: number) {
    if (!position) return;
    const newLeverage = newMargin > 0 ? position.positionSize / newMargin : position.leverage;
    const isLong = position.side === "Long";
    const newEstLiqPrice = newLeverage >= 1
      ? isLong
        ? position.entryPrice * (1 - 1 / newLeverage)
        : position.entryPrice * (1 + 1 / newLeverage)
      : 0;
    setPosition({
      ...position,
      margin: newMargin,
      leverage: newLeverage,
      estLiqPrice: newEstLiqPrice,
    });
  }

  function handleTpSlConfirm(tpPrice: number, slPrice: number) {
    if (!position) return;
    setPosition({ ...position, tpPrice, slPrice });
  }

  function handleLeverageConfirm(newLeverage: number) {
    if (!position) return;
    const newPositionSize = position.margin * newLeverage;
    const isLong = position.side === "Long";
    const newEstLiqPrice = newLeverage >= 1
      ? isLong
        ? position.entryPrice * (1 - 1 / newLeverage)
        : position.entryPrice * (1 + 1 / newLeverage)
      : 0;
    setPosition({ ...position, leverage: newLeverage, positionSize: newPositionSize, estLiqPrice: newEstLiqPrice });
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
    <div className="relative w-full h-full bg-white flex flex-col overflow-hidden">

      {/* Navigation bar */}
      <div className="h-[48px] bg-white flex items-center justify-between px-[16px] shrink-0">
        {/* Left: menu + coin + name/pair */}
        <div className="flex items-center gap-[4px]">
          <button className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
            <IconMenu />
          </button>
          {/* BTC coin icon */}
          <div className="w-[16px] h-[16px] rounded-full bg-[#F78B1A] flex items-center justify-center overflow-hidden shrink-0 ml-[4px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#F78B1A" />
              <text x="8" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">₿</text>
            </svg>
          </div>
          {/* Name + pair stacked */}
          <div className="flex flex-col items-start ml-[4px]">
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">Bitcoin</span>
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#626363]">BTCUSDT-PERP</span>
          </div>
        </div>
        {/* Right: star + controller */}
        <div className="flex items-center gap-[8px]">
          {/* Star (filled orange) */}
          <button className="w-[20px] h-[20px] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2.5l2.17 4.4 4.85.7-3.51 3.42.83 4.83L10 13.5l-4.34 2.35.83-4.83L2.98 7.6l4.85-.7L10 2.5z" fill="#F78B1A" />
            </svg>
          </button>
          {/* Game controller */}
          <button className="w-[20px] h-[20px] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="6" width="16" height="10" rx="3" stroke="#020203" strokeWidth="1.3" />
              <path d="M7 9v4M5 11h4" stroke="#020203" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="13" cy="10" r="0.8" fill="#020203" />
              <circle cx="15" cy="12" r="0.8" fill="#020203" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Price + Funding */}
        <div className="px-[16px] pt-[8px] pb-[4px] flex items-start justify-between">
          <div className="flex flex-col gap-[4px]">
            <span className="font-['Neue_Haas_Grotesk_Display_Pro',sans-serif] text-[20px] leading-[24px] text-[#020203]">
              {livePriceDisplay}
            </span>
            <span
              className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px]"
              style={{ color: changeColor }}
            >
              {ticker ? changeLabel : "—"}
            </span>
          </div>
          <div className="flex flex-col gap-[4px] items-end">
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#8d8e8e] border-b border-dashed border-[#8d8e8e]">Funding / Countdown</span>
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#626363]">
              {funding
                ? `${(funding.fundingRate * 100).toFixed(4)}% / ${countdown}`
                : `— / ${countdown}`}
            </span>
          </div>
        </div>

        {/* Chart */}
        <LiveChart
          klines={klines}
          chartType={chartType}
          entryPrice={variant === "B" && position ? position.entryPrice : undefined}
          tpPrice={variant === "B" && position && position.tpPrice > 0 ? position.tpPrice : undefined}
          slPrice={variant === "B" && position ? position.slPrice : undefined}
        />

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
              <button
                onClick={() => setChartType("line")}
                className="flex items-center p-[2.7px] rounded-full transition-colors"
                style={{ background: chartType === "line" ? "#ffffff" : "transparent", opacity: chartType === "line" ? 1 : 0.6 }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 8L4 5l2.5 2.5L9 3" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button
                onClick={() => setChartType("candle")}
                className="flex items-center p-[2.7px] rounded-full transition-colors"
                style={{ background: chartType === "candle" ? "#ffffff" : "transparent", opacity: chartType === "candle" ? 1 : 0.6 }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <rect x="2" y="4" width="2" height="5" rx="0.5" stroke="#020203" strokeWidth="1" />
                  <rect x="7" y="2" width="2" height="7" rx="0.5" stroke="#020203" strokeWidth="1" />
                  <path d="M3 6.5V4M8 4.5V2" stroke="#020203" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <button className="w-[20px] h-[20px] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        {/* Pintu Users Positions */}
        {!position && (
        <div className="px-[16px] py-[8px] flex flex-col gap-[8px]">
          <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#020203]">User Position Distribution</span>
          <div className="flex flex-col gap-[2px]">
            <div className="flex gap-[4px] w-full">
              <div
                className="bg-[#25a764] h-[4px] rounded-l-[4px] transition-all duration-500"
                style={{ width: `${longShort?.longPct ?? 70}%` }}
              />
              <div className="bg-[#e54040] h-[4px] rounded-r-[4px] flex-1" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#25a764]" />
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#020203]">
                  {longShort ? `${longShort.longPct.toFixed(1)}% Long` : "— Long"}
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#e54040]" />
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#020203]">
                  {longShort ? `${longShort.shortPct.toFixed(1)}% Short` : "— Short"}
                </span>
              </div>
            </div>
          </div>
          <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-[#626363]">Based on current open positions by other Pintu users for this asset. This is not a financial advice.</span>
        </div>
        )}

        {/* Divider */}
        <div className="h-px bg-[#f2f2f2] mx-[16px]" />

        {/* Long / Short buttons */}
        {!position && (
        <div className="px-[16px] py-[16px] flex gap-[16px]">
          <button onClick={() => setOpenSheet("Long")} className="flex-1 h-[52px] bg-[#25a764] rounded-[8px] flex flex-col gap-[2px] items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-[4px]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L10 2M10 2H4M10 2v6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">Long</span>
            </div>
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-white text-center px-[8px]">Profit when price goes up</span>
          </button>
          <button onClick={() => setOpenSheet("Short")} className="flex-1 h-[52px] bg-[#e54040] rounded-[8px] flex flex-col gap-[2px] items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-[4px]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L10 10M10 10H4M10 10V4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-white">Short</span>
            </div>
            <span className="font-['Inter',sans-serif] text-[10px] leading-[14px] text-white text-center px-[8px]">Profit when price goes down</span>
          </button>
        </div>
        )}

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
            {variant === "B" ? (
              <PositionCardB
                assetTicker="BTC"
                side={position.side}
                leverage={position.leverage}
                entryPrice={position.entryPrice}
                currentPrice={livePrice > 0 ? livePrice : position.entryPrice}
                positionSize={position.positionSize}
                margin={position.margin}
                tpPrice={position.tpPrice}
                slPrice={position.slPrice}
                onAdjustMargin={() => setShowMarginSheet(true)}
                onEditTpSl={() => setShowTpSlSheet(true)}
              />
            ) : (
              <PositionCard
                assetTicker="BTC"
                side={position.side}
                leverage={position.leverage}
                entryPrice={position.entryPrice}
                currentPrice={livePrice > 0 ? livePrice : position.entryPrice}
                positionSize={position.positionSize}
                margin={position.margin}
                estLiqPrice={position.estLiqPrice}
                tpPrice={position.tpPrice}
                slPrice={position.slPrice}
                onAdjustMargin={() => setShowMarginSheet(true)}
                onEditTpSl={() => setShowTpSlSheet(true)}
                onAdjustLeverage={() => setShowLeverageSheet(true)}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-[8px] py-[32px]">
            <IconDocument />
            <span className="font-['Inter',sans-serif] font-semibold text-[12px] leading-[16px] text-[#626363]">No Open Positions</span>
          </div>
        )}

        {/* Bottom nav spacer */}
      </div>

      {/* Bottom Navigation */}
      <div className="shrink-0 flex flex-col items-center pt-[8px] border-t-[0.5px] border-[rgba(2,2,3,0.1)] bg-[rgba(255,255,255,0.96)] safe-bottom">
        <div className="flex items-start justify-between w-full px-[8px]">
          {/* Home */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]" onClick={onNavigateHome}>
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[12.36%_12.5%_12.5%_12.5%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavHome} />
              </div>
            </div>
            <span className="font-['Inter',sans-serif] font-normal text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap">Home</span>
          </button>
          {/* Market */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]">
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[8.33%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavMarkets} />
              </div>
            </div>
            <span className="font-['Inter',sans-serif] font-normal text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap">Market</span>
          </button>
          {/* Trade */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]">
            <div className="relative shrink-0 size-[24px]">
              <div className="absolute inset-[8.33%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavTrade} />
              </div>
            </div>
            <span className="font-['Inter',sans-serif] font-normal text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap">Trade</span>
          </button>
          {/* Futures (active) */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]">
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[12.5%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavFutures} />
              </div>
            </div>
            <span className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap">Futures</span>
          </button>
          {/* Wallet */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]">
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[12.5%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavWallet} />
              </div>
            </div>
            <span className="font-['Inter',sans-serif] font-normal text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap">Wallet</span>
          </button>
        </div>
        <div className="w-[134px] h-[5px] rounded-full bg-[#020203] my-[8px]" />
      </div>

      {/* Transfer Sheet — full screen, top-level so it covers everything */}
      {showTransferSheet && (
        <div className="absolute inset-0 z-40">
          <TransferSheet
            onConfirm={(transferred) => {
              const prev = parseFloat(currentMargin) || 0;
              setCurrentMargin(String(prev + transferred));
              setShowTransferSheet(false);
            }}
            onClose={() => setShowTransferSheet(false)}
          />
        </div>
      )}

      {/* Order Sheet overlay */}
      {openSheet && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-black/70" onClick={() => {
            setOpenSheet(null);
            setOrderLeverage(25);
            setOrderTpPrice(undefined);
            setOrderSlPrice(undefined);
            setOrderTpEnabled(undefined);
            setOrderSlEnabled(undefined);
          }} />
          <div className="absolute inset-0 flex items-end pointer-events-none">
            <div className="pointer-events-auto w-full">
              <OrderTypeSheet
                side={openSheet}
                assetTicker="BTC"
                price={livePriceForSheet}
                initialLeverage={25}
                availableMargin={currentMargin}
                onConfirm={(pos) => handleOrderConfirm(pos)}
                onClose={() => {
                  setOpenSheet(null);
                  setOrderLeverage(25);
                  setOrderTpPrice(undefined);
                  setOrderSlPrice(undefined);
                  setOrderTpEnabled(undefined);
                  setOrderSlEnabled(undefined);
                }}
                onOpenTransfer={() => setShowTransferSheet(true)}
                leverage={orderLeverage}
                tpPrice={orderTpPrice}
                slPrice={orderSlPrice}
                tpEnabled={orderTpEnabled}
                slEnabled={orderSlEnabled}
                onOpenConfirmation={(pos) => {
                  setPendingPos(pos);
                  setShowOrderConfirmation(true);
                }}
                onOpenLeverage={(leverage, margin, entryPrice) => {
                  setOrderLeverageInit({ leverage, margin, entryPrice });
                  setShowOrderLeverage(true);
                }}
                onOpenTpSl={(tpPrice, slPrice, tpEnabled, slEnabled, positionSize, leverage, estLiqPrice) => {
                  setOrderTpSlInit({ tpPrice, slPrice, tpEnabled, slEnabled, positionSize, leverage, estLiqPrice });
                  setShowOrderTpSl(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Coachmark overlay — variant A */}
      {variant === "A" && coachmarkStep !== null && position && (
        <CoachmarkOverlay
          step={coachmarkStep}
          scrollContainerRef={scrollRef}
          onNext={() => {
            if (coachmarkStep === 1) setCoachmarkStep(2);
            else if (coachmarkStep === 2) setCoachmarkStep(3);
          }}
          onDone={() => {
            setCoachmarkStep(null);
            setHasSeenCoachmark(true);
          }}
        />
      )}

      {/* Coachmark overlay — variant B */}
      {variant === "B" && coachmarkStepB !== null && position && (
        <CoachmarkOverlayB
          step={coachmarkStepB}
          scrollContainerRef={scrollRef}
          onNext={() => setCoachmarkStepB(2)}
          onDone={() => {
            setCoachmarkStepB(null);
            setHasSeenCoachmark(true);
          }}
        />
      )}

      {/* Add/Remove Margin Sheet overlay */}
      {showMarginSheet && position && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowMarginSheet(false)} />
          <div className="absolute inset-0 flex items-end pointer-events-none">
            <div className="pointer-events-auto w-full">
              <AddRemoveMarginSheet
                assetTicker="BTC"
                side={position.side}
                leverage={position.leverage}
                margin={position.margin}
                positionSize={position.positionSize}
                entryPrice={position.entryPrice}
                availableBalance={300}
                onConfirm={handleMarginConfirm}
                onClose={() => setShowMarginSheet(false)}
              />
            </div>
          </div>
        </div>
      )}
      {/* TP/SL Sheet overlay */}
      {showTpSlSheet && position && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowTpSlSheet(false)} />
          <div className="absolute inset-0 flex items-end pointer-events-none">
            <div className="pointer-events-auto w-full">
              <TpSlSheet
                side={position.side}
                entryPrice={position.entryPrice}
                positionSize={position.positionSize}
                tpPrice={position.tpPrice}
                slPrice={position.slPrice}
                tpEnabled={position.tpPrice > 0}
                slEnabled={position.slPrice > 0}
                estLiqPrice={position.estLiqPrice}
                onConfirm={handleTpSlConfirm}
                onClose={() => setShowTpSlSheet(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Leverage Sheet overlay */}
      {showLeverageSheet && position && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowLeverageSheet(false)} />
          <div className="absolute inset-0 flex items-end pointer-events-none">
            <div className="pointer-events-auto w-full">
              <LeverageSheet
                initialLeverage={Math.round(position.leverage)}
                margin={position.margin}
                entryPrice={position.entryPrice}
                onConfirm={handleLeverageConfirm}
                onClose={() => setShowLeverageSheet(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Order Sheet — Leverage overlay (full-frame) */}
      {showOrderLeverage && orderLeverageInit && (
        <div className="absolute inset-0 z-20">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowOrderLeverage(false)} />
          <div className="absolute inset-0 flex items-end pointer-events-none">
            <div className="pointer-events-auto w-full">
              <LeverageSheet
                initialLeverage={orderLeverageInit.leverage}
                margin={orderLeverageInit.margin}
                entryPrice={orderLeverageInit.entryPrice}
                onConfirm={(lev) => {
                  setOrderLeverage(lev);
                  setShowOrderLeverage(false);
                }}
                onClose={() => setShowOrderLeverage(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Order Sheet — TpSl overlay (full-frame) */}
      {showOrderTpSl && orderTpSlInit && openSheet && (
        <div className="absolute inset-0 z-20">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowOrderTpSl(false)} />
          <div className="absolute inset-0 flex items-end pointer-events-none">
            <div className="pointer-events-auto w-full">
              <TpSlSheet
                side={openSheet}
                entryPrice={parseFloat(livePriceForSheet.replace(/\./g, "").replace(",", ".")) || 0}
                positionSize={orderTpSlInit.positionSize}
                tpPrice={orderTpSlInit.tpPrice}
                slPrice={orderTpSlInit.slPrice}
                tpEnabled={orderTpSlInit.tpEnabled}
                slEnabled={orderTpSlInit.slEnabled}
                estLiqPrice={orderTpSlInit.estLiqPrice}
                onConfirm={(tpPrice, slPrice) => {
                  setOrderTpPrice(tpPrice > 0 ? tpPrice : undefined);
                  setOrderSlPrice(slPrice > 0 ? slPrice : undefined);
                  setOrderTpEnabled(tpPrice > 0);
                  setOrderSlEnabled(slPrice > 0);
                  setShowOrderTpSl(false);
                }}
                onClose={() => setShowOrderTpSl(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Order Sheet — Confirmation overlay (full-frame) */}
      {showOrderConfirmation && pendingPos && (
        <div className="absolute inset-0 z-20">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowOrderConfirmation(false)} />
          <div className="absolute inset-0 flex items-end pointer-events-none">
            <div className="pointer-events-auto w-full">
              <ConfirmationSheet
                side={pendingPos.side}
                assetTicker="BTC"
                leverage={pendingPos.leverage}
                margin={pendingPos.margin}
                price={livePriceForSheet}
                estLiqPrice={pendingPos.estLiqPrice}
                onConfirm={() => {
                  setShowOrderConfirmation(false);
                  handleOrderConfirm(pendingPos);
                  setOpenSheet(null);
                  setOrderLeverage(25);
                  setOrderTpPrice(undefined);
                  setOrderSlPrice(undefined);
                  setOrderTpEnabled(undefined);
                  setOrderSlEnabled(undefined);
                }}
                onClose={() => setShowOrderConfirmation(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
