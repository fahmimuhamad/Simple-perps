"use client";

import { useEffect, useState, useRef } from "react";

export interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const INTERVAL_MAP: Record<string, string> = {
  "1m": "1",
  "15m": "15",
  "1H": "60",
  "4H": "240",
  "1D": "D",
};

function parseBybitKlines(list: string[][]): Kline[] {
  return list.slice().reverse().map((k) => ({
    openTime: parseInt(k[0]),
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }));
}

export function useBinanceKlines(symbol = "BTCUSDT", timeframe = "15m", limit = 500): Kline[] {
  const [klines, setKlines] = useState<Kline[]>([]);
  const interval = INTERVAL_MAP[timeframe] ?? "15";

  // Initial fetch + poll every 15s to refresh last candle
  useEffect(() => {
    let cancelled = false;

    async function fetchKlines() {
      try {
        const res = await fetch(`/api/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
        const data = await res.json();
        if (!cancelled && data.result?.list) {
          setKlines(parseBybitKlines(data.result.list));
        }
      } catch {}
    }

    fetchKlines();
    const id = setInterval(fetchKlines, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol, interval, limit]);

  return klines;
}
