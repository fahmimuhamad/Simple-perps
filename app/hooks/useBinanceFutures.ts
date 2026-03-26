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
    let cancelled = false;

    async function fetchFunding() {
      try {
        const res = await fetch(`/api/funding?symbol=${symbol}`);
        const data = await res.json();
        const t = data.result?.list?.[0];
        if (!t || cancelled) return;
        setFunding({
          fundingRate: parseFloat(t.fundingRate),
          nextFundingTime: parseInt(t.nextFundingTime),
        });
      } catch {}
    }

    fetchFunding();
    const id = setInterval(fetchFunding, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol]);

  // Countdown ticker (every second)
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
    let cancelled = false;

    async function fetchRatio() {
      try {
        const res = await fetch(`/api/longshortratio?symbol=${symbol}`);
        const json = await res.json();
        const item = json.result?.list?.[0];
        if (!item || cancelled) return;
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
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol]);

  return data;
}
