"use client";

import { useEffect, useState, useRef } from "react";

export interface FundingData {
  fundingRate: number;   // e.g. 0.00004713
  nextFundingTime: number; // unix ms
}

export interface LongShortData {
  longPct: number;   // e.g. 46.74
  shortPct: number;  // e.g. 53.26
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

  // Fetch funding rate (refreshes every 30s)
  useEffect(() => {
    async function fetchFunding() {
      try {
        const res = await fetch(
          `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`
        );
        const data = await res.json();
        setFunding({
          fundingRate: parseFloat(data.lastFundingRate),
          nextFundingTime: data.nextFundingTime,
        });
      } catch {}
    }

    fetchFunding();
    const id = setInterval(fetchFunding, 30_000);
    return () => clearInterval(id);
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

export function useLongShortRatio(symbol = "BTCUSDT", period = "5m"): LongShortData | null {
  const [data, setData] = useState<LongShortData | null>(null);

  useEffect(() => {
    async function fetchRatio() {
      try {
        const res = await fetch(
          `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=${period}&limit=1`
        );
        const json = await res.json();
        if (json.length) {
          const item = json[0];
          setData({
            longPct: parseFloat(item.longAccount) * 100,
            shortPct: parseFloat(item.shortAccount) * 100,
          });
        }
      } catch {}
    }

    fetchRatio();
    const id = setInterval(fetchRatio, 30_000); // refresh every 30s
    return () => clearInterval(id);
  }, [symbol, period]);

  return data;
}
