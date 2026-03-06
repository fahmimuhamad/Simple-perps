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
  "1m": "1m",
  "15m": "15m",
  "1H": "1h",
  "4H": "4h",
  "1D": "1d",
};

function parseKlines(raw: unknown[][]): Kline[] {
  return raw.map((k) => ({
    openTime: k[0] as number,
    open: parseFloat(k[1] as string),
    high: parseFloat(k[2] as string),
    low: parseFloat(k[3] as string),
    close: parseFloat(k[4] as string),
    volume: parseFloat(k[7] as string), // quote asset volume
  }));
}

export function useBinanceKlines(symbol = "BTCUSDT", timeframe = "15m", limit = 80): Kline[] {
  const [klines, setKlines] = useState<Kline[]>([]);
  const interval = INTERVAL_MAP[timeframe] ?? "15m";
  const wsRef = useRef<WebSocket | null>(null);

  // Initial REST fetch
  useEffect(() => {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => setKlines(parseKlines(data)))
      .catch(() => {});
  }, [symbol, interval, limit]);

  // Live updates via WebSocket — updates the last (current) candle
  useEffect(() => {
    const streamUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;

    function connect() {
      const ws = new WebSocket(streamUrl);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        const k = msg.k;
        const updated: Kline = {
          openTime: k.t,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.q),
        };

        setKlines((prev) => {
          if (!prev.length) return prev;
          const last = prev[prev.length - 1];
          if (last.openTime === updated.openTime) {
            // Update current candle
            return [...prev.slice(0, -1), updated];
          } else {
            // New candle opened
            return [...prev.slice(1), updated];
          }
        });
      };

      ws.onerror = () => ws.close();
      ws.onclose = () => {
        setTimeout(() => {
          if (wsRef.current === ws) connect();
        }, 3000);
      };
    }

    connect();

    return () => {
      const ws = wsRef.current;
      wsRef.current = null;
      ws?.close();
    };
  }, [symbol, interval]);

  return klines;
}
