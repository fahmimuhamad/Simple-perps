"use client";

import { useEffect, useState, useRef } from "react";

export interface BinanceTickerData {
  price: number;       // last price
  change: number;      // 24h price change
  changePct: number;   // 24h price change %
  high: number;        // 24h high
  low: number;         // 24h low
  volume: number;      // 24h volume in USDT
}

export function useBinancePrice(symbol = "btcusdt"): BinanceTickerData | null {
  const [data, setData] = useState<BinanceTickerData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;

    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        setData({
          price: parseFloat(msg.c),
          change: parseFloat(msg.p),
          changePct: parseFloat(msg.P),
          high: parseFloat(msg.h),
          low: parseFloat(msg.l),
          volume: parseFloat(msg.q), // quote asset volume (USDT)
        });
      };

      ws.onerror = () => ws.close();
      ws.onclose = () => {
        // Reconnect after 3s if not intentionally closed
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
  }, [symbol]);

  return data;
}
