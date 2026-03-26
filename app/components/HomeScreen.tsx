"use client";

import { useState } from "react";
import { useBinancePrice } from "../hooks/useBinancePrice";

const USDT_TO_IDR = 15382;

// ── Bottom Nav Icon assets (from Figma) ─────────────────────────────────────
const imgNavHome    = "https://www.figma.com/api/mcp/asset/9c02c2e8-1ffe-47dc-b18d-d27412b070e5"; // Home Filled
const imgNavMarkets = "https://www.figma.com/api/mcp/asset/eb922f9d-3367-4ff9-8214-29c82a2032cd";
const imgNavTrade   = "https://www.figma.com/api/mcp/asset/b9f28d1e-b5eb-4c90-927e-5b99ddcbec96";
const imgNavWallet  = "https://www.figma.com/api/mcp/asset/ffda615b-2a2c-43f6-911b-e7c09a2f7a45";
// Futures icon — CSS-drawn (document + pen)
const imgNavFuturesCombined = "https://www.figma.com/api/mcp/asset/7fbd155d-3684-490e-be7c-331ef7731bc6";
const imgNavFuturesVector   = "https://www.figma.com/api/mcp/asset/6ae7c423-a050-45d9-9ba6-b60d1190c9c2";

function BtcIcon() {
  return (
    <div className="size-[24px] rounded-full bg-[#F78B1A] flex items-center justify-center shrink-0">
      <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 11, color: "white" }}>₿</span>
    </div>
  );
}

function EthIcon({ size = 24 }: { size?: number }) {
  return (
    <div className="rounded-full bg-[#9D2BFF] flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: size * 0.5, color: "white" }}>Ξ</span>
    </div>
  );
}

function SolIcon({ size = 24 }: { size?: number }) {
  return (
    <div className="rounded-full bg-[#17DE8B] flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: size * 0.42, color: "white" }}>◎</span>
    </div>
  );
}

function PtuIcon({ size = 24 }: { size?: number }) {
  return (
    <div className="rounded-full bg-[#0a68f4] flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: size * 0.42, color: "white" }}>P</span>
    </div>
  );
}

function SortIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 5l3-3 3 3M4 9l3 3 3-3" stroke="#8d8e8e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 5l3-3 3 3" stroke="#8d8e8e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M4 9l3 3 3-3" stroke="#020203" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ color = "#8d8e8e" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LightBulbIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a7 7 0 015 11.95V16a1 1 0 01-1 1H8a1 1 0 01-1-1v-2.05A7 7 0 0112 2z" stroke="#020203" strokeWidth="1.5" />
      <path d="M9 17v1a3 3 0 006 0v-1" stroke="#020203" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="white" strokeWidth="1.5" />
      <path d="M3 10h5l2 3h4l2-3h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="white" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

function PriceChangeBadge({ change, positive }: { change: string; positive: boolean }) {
  return (
    <div
      className="flex items-center justify-center px-[8px] py-[6px] rounded-[4px] w-[72px] shrink-0"
      style={{ backgroundColor: positive ? "#25a764" : "#e54040" }}
    >
      <span className="text-white text-[12px] leading-[16px] text-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
        {change}
      </span>
    </div>
  );
}

function CoinListRow({ icon, symbol, volume, price, change, positive }: {
  icon: React.ReactNode; symbol: string; volume: string; price: string; change: string; positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-[16px] py-[10px] w-full">
      <div className="flex gap-[10px] items-center min-w-0">
        {icon}
        <div className="flex flex-col items-start">
          <p className="text-[0px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            <span className="text-[#020203] text-[14px] leading-[20px]">{symbol}</span>
            <span className="text-[#8d8e8e] text-[12px] leading-[20px]">/IDR</span>
          </p>
          <span className="text-[#8d8e8e] text-[10px] leading-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>{volume}</span>
        </div>
      </div>
      <div className="flex gap-[16px] items-center shrink-0">
        <span className="text-[#020203] text-[14px] leading-[20px] text-right" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
          {price}
        </span>
        <PriceChangeBadge change={change} positive={positive} />
      </div>
    </div>
  );
}

function NewsCard() {
  return (
    <div className="flex gap-[16px] items-start p-[16px] w-full border-b border-[rgba(2,2,3,0.1)]">
      <div className="rounded-[8px] shrink-0 size-[84px] bg-[#f2f2f2] flex items-center justify-center overflow-hidden">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#e0e0e0" />
          <path d="M8 24l6-8 4 5 3-4 5 7H8z" fill="#bdbdbd" />
          <circle cx="21" cy="11" r="3" fill="#bdbdbd" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
        <p className="text-[#020203] text-[14px] leading-[20px] line-clamp-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
          FTX Users Describe &apos;Emotional Toll&apos; From Bankruptcy in Letters to Judge Ahead of Sam Bankman-Fried&apos;s Sentencing
        </p>
        <div className="flex gap-[4px] items-center">
          <div className="flex items-center">
            {[SolIcon, EthIcon].map((Icon, i) => (
              <div key={i} className="border border-white rounded-full overflow-hidden size-[16px] shrink-0" style={{ marginRight: i < 1 ? -4 : 0 }}>
                <Icon size={16} />
              </div>
            ))}
          </div>
          <div className="size-[3px] rounded-full bg-[#8d8e8e] mx-[2px]" />
          <span className="text-[#8d8e8e] text-[12px] leading-[16px] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>CoinDesk</span>
          <div className="size-[3px] rounded-full bg-[#8d8e8e] mx-[2px]" />
          <span className="text-[#8d8e8e] text-[12px] leading-[16px] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>3d</span>
        </div>
      </div>
    </div>
  );
}

function AcademyCard({ title, color }: { title: string; color: string }) {
  return (
    <div className="bg-white border border-[rgba(2,2,3,0.1)] flex flex-col overflow-hidden rounded-[8px]">
      <div className="h-[130px] w-full flex items-center justify-center" style={{ backgroundColor: color }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
          <path d="M8 40l10-14 7 9 5-7 10 12H8z" fill="white" />
          <circle cx="34" cy="16" r="6" fill="white" />
        </svg>
      </div>
      <div className="flex items-start px-[12px] py-[8px]">
        <span className="text-[#020203] text-[14px] leading-[20px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{title}</span>
      </div>
    </div>
  );
}

interface HomeScreenProps {
  onNavigateFutures: () => void;
}

export default function HomeScreen({ onNavigateFutures }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<"home" | "markets" | "trade" | "futures" | "wallet">("home");
  const [promoPage, setPromoPage] = useState(0);
  const btcTicker = useBinancePrice("BTCUSDT");
  const ethTicker = useBinancePrice("ETHUSDT");
  const solTicker = useBinancePrice("SOLUSDT");

  // Prices in IDR
  const btcIdr = (btcTicker?.price ?? 0) * USDT_TO_IDR;
  const ethIdr = (ethTicker?.price ?? 0) * USDT_TO_IDR;
  const solIdr = (solTicker?.price ?? 0) * USDT_TO_IDR;

  function formatIdr(n: number): string {
    if (!n) return "—";
    return n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
  }

  function formatPct(n: number): string {
    const sign = n >= 0 ? "+" : "";
    return `${sign}${n.toFixed(2)}%`;
  }

  function handleTabPress(tab: typeof activeTab) {
    setActiveTab(tab);
    if (tab === "futures") onNavigateFutures();
  }

  return (
    <div className="bg-white w-full h-full flex flex-col relative">

      {/* ── Scrollable content (header scrolls with it) ─────── */}
      <div className="flex-1 overflow-y-auto pb-[80px]">

      {/* ── Dark header ─────────────────────────────── */}
      <div className="bg-[#020203] flex flex-col shrink-0 pt-[44px]">

        {/* Nav row */}
        <div className="flex h-[32px] items-center justify-between px-[16px] mb-[16px]">
          <div className="bg-[#212429] flex items-start p-[2px] rounded-[8px] w-[210px]">
            {(["Pintu", "Pro", "Web3"] as const).map((label) => (
              <div key={label} className="flex-1 h-[28px] rounded-[6px] flex items-center justify-center"
                style={{ backgroundColor: label === "Pro" ? "#020303" : "transparent" }}>
                <span className="text-[14px] leading-[20px] text-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: label === "Pro" ? "#ffffff" : "#b1b1b1" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-[8px] items-center">
            <button className="size-[32px] flex items-center justify-center"><InboxIcon /></button>
            <button className="size-[32px] flex items-center justify-center"><UserIcon /></button>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between px-[16px]">
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[2px]">
              <span className="text-[#b1b1b1] text-[12px] leading-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>Total Asset Value</span>
              <ChevronRightIcon color="#b1b1b1" />
            </div>
            <div className="flex gap-[6px] items-center">
              <span className="text-white text-[20px] leading-[24px]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 700 }}>
                Rp 3.500.000
              </span>
              <EyeIcon />
            </div>
          </div>
          <div className="bg-[#152a1d] flex gap-[4px] items-center px-[4px] py-[2px] rounded-[4px]">
            <div className="bg-[#020203] border border-[#25a764] flex h-[16px] items-center justify-center rounded-[4px] w-[20px]">
              <span className="text-[#25a764] text-[8px] leading-[12px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>MU</span>
            </div>
            <span className="text-[#25a764] text-[10px] leading-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>12,7%</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[8px] items-center mt-[12px] px-[16px] pb-[16px]">
          {[{ label: "Deposit", bg: "#0f7bff", border: false }, { label: "Tarik", bg: "transparent", border: true }, { label: "Transfer", bg: "transparent", border: true }].map(({ label, bg, border }) => (
            <button key={label} className="flex flex-1 items-center justify-center p-[8px] rounded-[4px]"
              style={{ backgroundColor: bg, border: border ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
              <span className="text-white text-[12px] leading-[16px] text-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

        {/* Promo carousel */}
        <div className="bg-[#fafafa] pt-[16px] pb-[8px] pl-[16px]">
          <div className="flex gap-[16px] overflow-x-auto scrollbar-hide pr-[16px]">
            {[
              { bg: "#020203", text: "Zero Trading Fees", sub: "Limited Time Offer", badge: "~Rp 100 rb" },
              { bg: "#0a68f4", text: "Trade Now", sub: "New pairs available", badge: "HOT" },
            ].map((promo, i) => (
              <div key={i} className="rounded-[8px] shrink-0 overflow-hidden flex items-end" style={{ width: 320, height: 130, backgroundColor: promo.bg }}>
                <div className="p-[16px] w-full">
                  <div className="flex items-center gap-[8px] mb-[4px]">
                    <span className="text-white text-[10px] leading-[14px] opacity-70" style={{ fontFamily: "'Inter', sans-serif" }}>PINTU Pro</span>
                    <div className="bg-white/20 px-[6px] py-[2px] rounded-full">
                      <span className="text-white text-[10px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{promo.badge}</span>
                    </div>
                  </div>
                  <p className="text-white text-[16px] leading-[20px]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 700 }}>{promo.text}</p>
                  <p className="text-white/60 text-[12px] mt-[2px]" style={{ fontFamily: "'Inter', sans-serif" }}>{promo.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-[6px] items-center justify-center mt-[8px] pr-[16px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-full" style={{ width: i === promoPage ? 8 : 4, height: 4, backgroundColor: i === promoPage ? "#020203" : "#d0d0d0", transition: "all 0.2s" }} />
            ))}
          </div>
        </div>

        <div className="h-[4px] bg-[#f2f2f2] w-full" />

        {/* Market tabs */}
        <div className="flex flex-col gap-[16px]">
          <div className="border-b border-[rgba(2,2,3,0.1)] flex items-start overflow-x-auto scrollbar-hide">
            {[
              { label: "Watchlist", active: true },
              { label: "Pro Spot", active: false },
              { label: "Tokenized Stocks", active: false },
              { label: "Futures", active: false, badge: "25x" },
            ].map(({ label, active, badge }) => (
              <button key={label} className="flex flex-col items-center px-[8px] py-[14px] shrink-0"
                style={{ borderBottom: active ? "2px solid #0a68f4" : "2px solid transparent", marginBottom: -1 }}
                onClick={label === "Futures" ? () => handleTabPress("futures") : undefined}>
                <div className="flex gap-[4px] items-center">
                  <span className="text-[14px] leading-[20px] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: active ? "#020203" : "#8d8e8e" }}>
                    {label}
                  </span>
                  {badge && (
                    <div className="bg-[#e9f1fe] px-[4px] rounded-[4px]">
                      <span className="text-[#0a68f4] text-[10px] leading-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{badge}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Filter pills + Edit */}
          <div className="flex items-center justify-between pl-[16px] pr-[8px]">
            <div className="flex gap-[8px] items-center overflow-x-auto scrollbar-hide">
              {[{ label: "Pro Spot", active: true }, { label: "Tokenized Stocks", active: false }, { label: "Futures", active: false }].map(({ label, active }) => (
                <button key={label} className="flex items-center justify-center px-[12px] py-[8px] rounded-full shrink-0"
                  style={{ backgroundColor: active ? "#e9f1fe" : "transparent", border: active ? "1px solid #0a68f4" : "1px solid rgba(2,2,3,0.1)" }}
                  onClick={label === "Futures" ? () => handleTabPress("futures") : undefined}>
                  <span className="text-[12px] leading-[16px] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: active ? "#0a68f4" : "#020203" }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
            <button className="p-[8px] rounded-[8px]">
              <span className="text-[#0a68f4] text-[12px] leading-[16px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Edit</span>
            </button>
          </div>

          {/* Column headers */}
          <div className="flex items-center justify-between px-[16px]">
            <div className="flex items-center gap-[2px]">
              <span className="text-[#8d8e8e] text-[10px] leading-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>NAME </span>
              <SortIcon />
              <span className="text-[#020203] text-[10px] leading-[14px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>/ VOL</span>
              <SortDownIcon />
            </div>
            <div className="flex items-center gap-[4px]">
              <span className="text-[#8d8e8e] text-[10px] leading-[14px] text-right" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>PRICE (IDR)</span>
              <SortIcon />
              <span className="text-[#8d8e8e] text-[10px] leading-[14px] text-right" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>24H CHANGE</span>
              <SortIcon />
            </div>
          </div>

          {/* Coin rows */}
          <div className="flex flex-col">
            <CoinListRow icon={<BtcIcon />} symbol="BTC" volume="Vol. 92M" price={btcIdr ? formatIdr(btcIdr) : "—"} change={btcTicker ? formatPct(btcTicker.changePct) : "—"} positive={(btcTicker?.changePct ?? 0) >= 0} />
            <CoinListRow icon={<EthIcon />} symbol="ETH" volume="Vol. 92M" price={ethIdr ? formatIdr(ethIdr) : "—"} change={ethTicker ? formatPct(ethTicker.changePct) : "—"} positive={(ethTicker?.changePct ?? 0) >= 0} />
            <CoinListRow icon={<SolIcon />} symbol="SOL" volume="Vol. 92M" price={solIdr ? formatIdr(solIdr) : "—"} change={solTicker ? formatPct(solTicker.changePct) : "—"} positive={(solTicker?.changePct ?? 0) >= 0} />
            <CoinListRow icon={<PtuIcon />} symbol="PTU" volume="Vol. 92M" price="5.400" change="+1,24%" positive={true} />
          </div>

          <button className="flex items-center justify-center p-[8px] rounded-[8px] w-full">
            <span className="text-[#0a68f4] text-[14px] leading-[20px] text-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>View All Markets</span>
          </button>
        </div>

        {/* Discover */}
        <div className="flex flex-col gap-[16px] mt-[16px]">
          <span className="text-[#020203] text-[20px] leading-[24px] px-[16px]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}>
            Discover
          </span>

          {/* Events horizontal scroll */}
          <div className="flex gap-[8px] px-[16px] overflow-x-auto scrollbar-hide">
            {[
              { coins: [<EthIcon key="eth" size={16} />], sentiment: "Bullish", sentimentColor: "#25a764", title: "Dencun Upgrade", date: "09 Mar" },
              { coins: [], sentiment: "Uncertain", sentimentColor: "#ffa009", title: "Token Unlock", date: "16 Jun" },
              { coins: [<SolIcon key="sol" size={16} />], sentiment: "Bearish", sentimentColor: "#e54040", title: "Gas Fee Reduction", date: "09 Aug" },
              { coins: [], sentiment: "Uncertain", sentimentColor: "#ffa009", title: "Fed Rate Update", date: "16 Jun" },
            ].map(({ coins, sentiment, sentimentColor, title, date }, i) => (
              <div key={i} className="bg-white border border-[rgba(2,2,3,0.1)] flex flex-col gap-[8px] items-start justify-center p-[16px] rounded-[8px] shrink-0">
                <div className="flex gap-[8px] items-center">
                  {coins.length > 0 && <div className="flex">{coins}</div>}
                  <span className="text-[12px] leading-[16px] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: sentimentColor }}>{sentiment}</span>
                </div>
                <span className="text-[#020203] text-[14px] leading-[20px] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{title}</span>
                <span className="text-[#8d8e8e] text-[12px] leading-[16px] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>{date}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <NewsCard />
            <NewsCard />
            <NewsCard />
          </div>

          <button className="flex items-center justify-center p-[8px] w-full">
            <span className="text-[#0a68f4] text-[14px] leading-[20px] text-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Go to Discover</span>
          </button>
        </div>

        {/* Trading Basics */}
        <div className="flex flex-col gap-[16px] pb-[16px] px-[16px] pt-[8px] mt-[8px]">
          <div className="flex items-center gap-[8px]">
            <LightBulbIcon />
            <span className="text-[20px] leading-[24px] text-black" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}>Trading Basics</span>
          </div>
          <div className="grid grid-cols-2 gap-[16px]">
            {[
              { title: "Beginner's Guide to Crypto Trading", color: "#FF6B35" },
              { title: "Introduction to Technical Analysis", color: "#E8C547" },
              { title: "What Is Crypto Futures?", color: "#E8C547" },
              { title: "Futures Trading Terms: A Complete Guide", color: "#E8C547" },
            ].map(({ title, color }) => (
              <AcademyCard key={title} title={title} color={color} />
            ))}
          </div>
        </div>

        {/* Latest Academy Articles */}
        <div className="flex flex-col gap-[16px] pb-[16px] pt-[8px]">
          <div className="flex items-center justify-between px-[16px]">
            <div className="flex gap-[8px] items-center">
              <LightBulbIcon />
              <span className="text-[20px] leading-[24px] text-black" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}>Latest Academy Articles</span>
            </div>
            <button>
              <span className="text-[#0a68f4] text-[14px] leading-[20px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>View All</span>
            </button>
          </div>

          <div className="flex gap-[16px] overflow-x-auto scrollbar-hide px-[16px]">
            {["NFT For Beginners and How to Buy One", "Crypto Trading 101", "Understanding DeFi"].map((title, i) => (
              <div key={i} className="bg-white border border-[rgba(2,2,3,0.1)] flex flex-col overflow-hidden rounded-[8px] shrink-0 w-[152px]">
                <div className="h-[96px] w-full flex items-center justify-center" style={{ backgroundColor: i === 0 ? "#3ECFCF" : i === 1 ? "#FF6B35" : "#E8C547" }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.4">
                    <rect width="40" height="40" rx="8" fill="white" />
                  </svg>
                </div>
                <div className="flex items-start p-[12px]">
                  <span className="text-[#020203] text-[14px] leading-[20px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{title}</span>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-[8px] items-center justify-center px-[16px] shrink-0 w-[120px]">
              <div className="bg-[#0a68f4] flex items-center justify-center p-[8px] rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[#0a68f4] text-[14px] leading-[20px] text-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                See All on{"\n"}Pintu Academy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Navigation ───────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 border-t-[0.5px] border-[rgba(2,2,3,0.2)] bg-white flex flex-col items-center pt-[8px] z-10 safe-bottom">
        <div className="flex items-start justify-between w-full px-[8px]">

          {/* Home */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]"
            onClick={() => handleTabPress("home")}>
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[12.36%_12.5%_12.5%_12.5%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavHome} />
              </div>
            </div>
            <span className="text-[10px] leading-[14px] text-[#020203] whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: activeTab === "home" ? 600 : 400 }}>Home</span>
          </button>

          {/* Markets */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]"
            onClick={() => handleTabPress("markets")}>
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[8.33%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavMarkets} />
              </div>
            </div>
            <span className="text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: activeTab === "markets" ? 600 : 400 }}>Markets</span>
          </button>

          {/* Trade */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]"
            onClick={() => handleTabPress("trade")}>
            <div className="relative shrink-0 size-[24px]">
              <div className="absolute inset-[8.33%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavTrade} />
              </div>
            </div>
            <span className="text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: activeTab === "trade" ? 600 : 400 }}>Trade</span>
          </button>

          {/* Futures — CSS-drawn icon */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]"
            onClick={() => handleTabPress("futures")}>
            <div className="relative shrink-0 size-[24px]">
              <div className="absolute border-2 border-[#020203] border-solid bottom-[8.33%] left-1/4 right-[8.33%] rounded-br-[2px] rounded-tl-[2px] rounded-tr-[2px] top-[8.33%]" />
              <div className="absolute flex inset-[14.35%_14.5%_33.49%_33.33%] items-center justify-center">
                <div className="-rotate-45 flex-none h-[8.079px] w-[9.626px]">
                  <div className="relative size-full">
                    <img alt="" className="absolute block max-w-none size-full" src={imgNavFuturesCombined} />
                  </div>
                </div>
              </div>
              <div className="absolute border-2 border-[#020203] border-solid inset-[45.83%_66.67%_8.33%_8.33%] rounded-bl-[3px] rounded-br-[3px] rounded-tl-[2px] rounded-tr-[2px]" />
              <div className="absolute bg-[#020203] bottom-1/4 left-[41.67%] right-1/4 rounded-[1px] top-[66.67%]" />
              <div className="absolute inset-[87.5%_70.83%_8.33%_20.83%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavFuturesVector} />
              </div>
            </div>
            <span className="text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: activeTab === "futures" ? 600 : 400 }}>Futures</span>
          </button>

          {/* Wallet */}
          <button className="flex flex-col gap-[4px] items-center justify-center overflow-clip px-[16px] w-[58px]"
            onClick={() => handleTabPress("wallet")}>
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[12.5%]">
                <img alt="" className="absolute block max-w-none size-full" src={imgNavWallet} />
              </div>
            </div>
            <span className="text-[10px] leading-[14px] text-center text-[#020203] whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: activeTab === "wallet" ? 600 : 400 }}>Wallet</span>
          </button>

        </div>
        <div className="w-[134px] h-[5px] rounded-full bg-[#020203] my-[8px]" />
      </div>
    </div>
  );
}
