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

const WS_INTERVAL_MAP: Record<string, string> = {
  "1m": "1",
  "15m": "15",
  "1H": "60",
  "4H": "240",
  "1D": "D",
};

function parseBybitKlines(list: string[][]): Kline[] {
  // Bybit returns newest first, so reverse
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
  const wsInterval = WS_INTERVAL_MAP[timeframe] ?? "15";
  const wsRef = useRef<WebSocket | null>(null);

  // Initial REST fetch from Bybit
  useEffect(() => {
    const url = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${interval}&limit=${limit}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.result?.list) {
          setKlines(parseBybitKlines(data.result.list));
        }
      })
      .catch(() => {});
  }, [symbol, interval, limit]);

  // Live updates via Bybit WebSocket
  useEffect(() => {
    const streamUrl = "wss://stream.bybit.com/v5/public/linear";

    function connect() {
      const ws = new WebSocket(streamUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          op: "subscribe",
          args: [`kline.${wsInterval}.${symbol}`],
        }));
      };

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.topic && msg.data?.[0]) {
          const k = msg.data[0];
          const updated: Kline = {
            openTime: k.start,
            open: parseFloat(k.open),
            high: parseFloat(k.high),
            low: parseFloat(k.low),
            close: parseFloat(k.close),
            volume: parseFloat(k.volume),
          };

          setKlines((prev) => {
            if (!prev.length) return prev;
            const last = prev[prev.length - 1];
            if (last.openTime === updated.openTime) {
              return [...prev.slice(0, -1), updated];
            } else {
              return [...prev.slice(1), updated];
            }
          });
        }
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
  }, [symbol, wsInterval]);

  return klines;
}
