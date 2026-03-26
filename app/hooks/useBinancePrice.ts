"use client";

import { useEffect, useState } from "react";

export interface BinanceTickerData {
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  volume: number;
}

export function useBinancePrice(symbol = "BTCUSDT"): BinanceTickerData | null {
  const [data, setData] = useState<BinanceTickerData | null>(null);
  const sym = symbol.toUpperCase();

  useEffect(() => {
    let cancelled = false;

    async function fetchTicker() {
      try {
        const res = await fetch(`/api/ticker?symbol=${sym}`);
        const json = await res.json();
        const t = json.result?.list?.[0];
        if (!t || cancelled) return;
        const price = parseFloat(t.lastPrice);
        const prevClose = parseFloat(t.prevPrice24h);
        setData({
          price,
          change: price - prevClose,
          changePct: parseFloat(t.price24hPcnt) * 100,
          high: parseFloat(t.highPrice24h),
          low: parseFloat(t.lowPrice24h),
          volume: parseFloat(t.turnover24h),
        });
      } catch {}
    }

    fetchTicker();
    const id = setInterval(fetchTicker, 5_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sym]);

  return data;
}
