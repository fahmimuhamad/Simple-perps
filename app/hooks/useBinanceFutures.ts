"use client";

import { useEffect, useState, useRef } from "react";

export interface FundingData {
  fundingRate: number;
  nextFundingTime: number; // unix ms
}

export interface LongShortData {
  longPct: number;
  shortPct: number;
}

function msToCountdown(targetMs: number): string {
  const diff = Math.max(0, targetMs - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function useFundingRate(symbol = "BTCUSDT"): { funding: FundingData | null; countdown: string } {
  const [funding, setFunding] = useState<FundingData | null>(null);
  const [countdown, setCountdown] = useState("—");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchFunding() {
      try {
        const res = await fetch(
          `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`
        );
        const data = await res.json();
        const t = data.result?.list?.[0];
        if (!t) return;
        setFunding({
          fundingRate: parseFloat(t.fundingRate),
          nextFundingTime: parseInt(t.nextFundingTime),
        });
      } catch {}
    }

    fetchFunding();
    const id = setInterval(fetchFunding, 30_000);
    return () => clearInterval(id);
  }, [symbol]);

  useEffect(() => {
    if (!funding) return;
    function tick() {
      setCountdown(msToCountdown(funding!.nextFundingTime));
    }
    tick();
    timerRef.current = setInterval(tick, 1_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [funding]);

  return { funding, countdown };
}

export function useLongShortRatio(symbol = "BTCUSDT"): LongShortData | null {
  const [data, setData] = useState<LongShortData | null>(null);

  useEffect(() => {
    async function fetchRatio() {
      try {
        // Bybit buy/sell ratio endpoint (long = buy side)
        const res = await fetch(
          `https://api.bybit.com/v5/market/account-ratio?category=linear&symbol=${symbol}&period=1h&limit=1`
        );
        const json = await res.json();
        const item = json.result?.list?.[0];
        if (!item) return;
        const buyRatio = parseFloat(item.buyRatio);
        const sellRatio = parseFloat(item.sellRatio);
        const total = buyRatio + sellRatio || 1;
        setData({
          longPct: (buyRatio / total) * 100,
          shortPct: (sellRatio / total) * 100,
        });
      } catch {}
    }

    fetchRatio();
    const id = setInterval(fetchRatio, 30_000);
    return () => clearInterval(id);
  }, [symbol]);

  return data;
}
