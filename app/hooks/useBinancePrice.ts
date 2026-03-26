"use client";

import { useEffect, useState, useRef } from "react";

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
  const wsRef = useRef<WebSocket | null>(null);
  const sym = symbol.toUpperCase();

  // Initial REST snapshot
  useEffect(() => {
    fetch(`https://api.bybit.com/v5/market/tickers?category=linear&symbol=${sym}`)
      .then((r) => r.json())
      .then((json) => {
        const t = json.result?.list?.[0];
        if (!t) return;
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
      })
      .catch(() => {});
  }, [sym]);

  // Live updates via Bybit WebSocket
  useEffect(() => {
    function connect() {
      const ws = new WebSocket("wss://stream.bybit.com/v5/public/linear");
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ op: "subscribe", args: [`tickers.${sym}`] }));
      };

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.topic === `tickers.${sym}` && msg.data) {
          const t = msg.data;
          setData((prev) => {
            const price = t.lastPrice ? parseFloat(t.lastPrice) : (prev?.price ?? 0);
            const prevClose = t.prevPrice24h ? parseFloat(t.prevPrice24h) : (prev ? prev.price - prev.change : price);
            const changePct = t.price24hPcnt ? parseFloat(t.price24hPcnt) * 100 : (prev?.changePct ?? 0);
            return {
              price,
              change: price - prevClose,
              changePct,
              high: t.highPrice24h ? parseFloat(t.highPrice24h) : (prev?.high ?? 0),
              low: t.lowPrice24h ? parseFloat(t.lowPrice24h) : (prev?.low ?? 0),
              volume: t.turnover24h ? parseFloat(t.turnover24h) : (prev?.volume ?? 0),
            };
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
  }, [sym]);

  return data;
}
