"use client";

import { useRef, useState, useEffect } from "react";
import { Kline } from "../hooks/useBinanceKlines";

interface LiveChartProps {
  klines: Kline[];
  chartType?: "line" | "candle";
  width?: number;
  height?: number;
  entryPrice?: number;
  tpPrice?: number;
  slPrice?: number;
}

export default function LiveChart({ klines, chartType = "line", width = 375, height = 260, entryPrice, tpPrice, slPrice }: LiveChartProps) {
  const [visibleCount, setVisibleCount] = useState(80);
  const [offsetRight, setOffsetRight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(width);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartVisible = useRef(80);

  const totalN = klines.length;

  // Attach non-passive touchmove to prevent parent scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => {
      if (e.touches.length >= 1) e.preventDefault();
    };
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  // Measure actual container width for responsive chart
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width || width);
      }
    });
    observer.observe(el);
    setContainerWidth(el.clientWidth || width);
    return () => observer.disconnect();
  }, [width]);

  if (!klines.length) {
    return (
      <div className="relative w-full h-[274px] overflow-hidden bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8d8e8e" }}>Loading chart...</span>
        </div>
      </div>
    );
  }

  const clampedVisible = Math.max(10, Math.min(totalN, visibleCount));
  const maxOffset = Math.max(0, totalN - clampedVisible);
  const clampedOffset = Math.max(0, Math.min(maxOffset, offsetRight));

  const startIdx = totalN - clampedVisible - clampedOffset;
  const slicedKlines = klines.slice(startIdx, startIdx + clampedVisible);
  const n = slicedKlines.length;

  const paddingLeft = 8;
  const paddingRight = 8;
  const paddingTop = 16;
  const paddingBottom = 28;

  const chartWidth = containerWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const pxPerCandle = chartWidth / clampedVisible;

  const closes = slicedKlines.map((k) => k.close);
  const priceMin = chartType === "candle" ? Math.min(...slicedKlines.map((k) => k.low)) : Math.min(...closes);
  const priceMax = chartType === "candle" ? Math.max(...slicedKlines.map((k) => k.high)) : Math.max(...closes);
  const priceRange = priceMax - priceMin || 1;

  const xStep = chartWidth / (n - 1 || 1);
  const candleSpacing = chartWidth / n;
  const candleW = Math.max(1, (chartWidth / n) * 0.6);

  function toY(price: number) {
    return paddingTop + chartHeight - ((price - priceMin) / priceRange) * chartHeight;
  }
  function toX(i: number) {
    return chartType === "candle"
      ? paddingLeft + i * candleSpacing + candleSpacing / 2
      : paddingLeft + i * xStep;
  }

  const firstClose = slicedKlines[0].close;
  const lastClose = slicedKlines[n - 1].close;
  const trendColor = lastClose >= firstClose ? "#25a764" : "#e54040";
  const gradientId = lastClose >= firstClose ? "chartGradGreen" : "chartGradRed";

  const closePath = slicedKlines
    .map((k, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(k.close).toFixed(1)}`)
    .join(" ");
  const fillPath = `${closePath} L${toX(n - 1).toFixed(1)},${(paddingTop + chartHeight).toFixed(1)} L${paddingLeft.toFixed(1)},${(paddingTop + chartHeight).toFixed(1)} Z`;

  const labelIndices = [0, Math.floor(n * 0.25), Math.floor(n * 0.5), Math.floor(n * 0.75), n - 1];
  function formatTime(ts: number) {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }

  const liveClose = klines[totalN - 1].close;
  const liveColor = liveClose >= klines[0].close ? "#25a764" : "#e54040";
  const currentY = toY(liveClose);
  const currentYPct = (currentY / height) * 100;
  const priceText = liveClose.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const showLive = clampedOffset === 0;

  // --- Pointer handlers (works on touch + mouse, no passive conflict) ---
  function onPointerDown(e: React.PointerEvent) {
    // Only single-touch / mouse drag for panning
    if (e.pointerType === "touch") {
      const touches = (e.nativeEvent.target as Element).closest("[data-chart]")?.querySelectorAll(":hover");
      // Use pointerId count workaround — track via ref
    }
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = clampedOffset;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return;
    const dx = dragStartX.current - e.clientX; // drag left = positive = older candles
    const deltaCandles = Math.round(dx / pxPerCandle);
    setOffsetRight(Math.max(0, Math.min(maxOffset, dragStartOffset.current + deltaCandles)));
  }

  function onPointerUp() {
    isDragging.current = false;
  }

  // Pinch via touch events (registered non-passive above)
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      isDragging.current = false;
      const [a, b] = [e.touches[0], e.touches[1]];
      pinchStartDist.current = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchStartVisible.current = clampedVisible;
    }
  }

  function onTouchMoveReact(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchStartDist.current !== null) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const scale = pinchStartDist.current / dist;
      setVisibleCount(Math.max(10, Math.min(totalN, Math.round(pinchStartVisible.current * scale))));
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) pinchStartDist.current = null;
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? 1.15 : 0.87;
      setVisibleCount(Math.max(10, Math.min(totalN, Math.round(clampedVisible * delta))));
    } else {
      const raw = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      setOffsetRight(Math.max(0, Math.min(maxOffset, clampedOffset + Math.round(raw / pxPerCandle))));
    }
  }

  return (
    <div
      ref={containerRef}
      data-chart
      className="relative w-full h-[274px] overflow-hidden"
      style={{ touchAction: "none", userSelect: "none", cursor: isDragging.current ? "grabbing" : "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMoveReact}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      <svg
        viewBox={`0 0 ${containerWidth} ${height}`}
        fill="none"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        style={{ pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={fillPath} fill={`url(#${gradientId})`} />

        {chartType === "line" ? (
          <path d={closePath} stroke={trendColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        ) : (
          slicedKlines.map((k, i) => {
            const x = toX(i);
            const isGreen = k.close >= k.open;
            const color = isGreen ? "#25a764" : "#e54040";
            const bodyTop = toY(Math.max(k.open, k.close));
            const bodyBottom = toY(Math.min(k.open, k.close));
            const bodyH = Math.max(1, bodyBottom - bodyTop);
            return (
              <g key={k.openTime}>
                <line x1={x} y1={toY(k.high)} x2={x} y2={toY(k.low)} stroke={color} strokeWidth="0.8" opacity="0.7" />
                <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={color} opacity="0.85" />
              </g>
            );
          })
        )}

        {showLive && (
          <line x1={paddingLeft} y1={currentY} x2={containerWidth - paddingRight} y2={currentY}
            stroke={liveColor} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
        )}
        {showLive && (
          <>
            <circle cx={toX(n - 1)} cy={currentY} r="3" fill={liveColor} />
            <circle cx={toX(n - 1)} cy={currentY} r="6" fill={liveColor} fillOpacity="0.2" />
          </>
        )}


        {labelIndices.map((idx) => (
          <text key={idx} x={toX(idx)} y={height - 6} textAnchor="middle" fill="#8d8e8e" fontSize="8" fontFamily="Inter, sans-serif">
            {formatTime(slicedKlines[idx].openTime)}
          </text>
        ))}

        <line x1={0} y1={paddingTop + chartHeight} x2={containerWidth} y2={paddingTop + chartHeight}
          stroke="rgba(2,2,3,0.1)" strokeWidth="0.5" />
      </svg>

      {showLive && (
        <div className="absolute right-0 flex items-center pointer-events-none"
          style={{ top: `${currentYPct}%`, transform: "translateY(-50%)" }}>
          <div className="px-[6px] py-[2px] rounded-[3px]" style={{ backgroundColor: liveColor }}>
            <span className="text-white font-semibold"
              style={{ fontFamily: "Inter, sans-serif", fontSize: 9, lineHeight: "13px", whiteSpace: "nowrap" }}>
              {priceText}
            </span>
          </div>
        </div>
      )}

      {/* Entry price line — HTML overlay matching Figma */}
      {entryPrice && (() => {
        const rawY = toY(entryPrice);
        const clampedY = Math.max(paddingTop, Math.min(paddingTop + chartHeight, rawY));
        const yPct = (clampedY / height) * 100;
        const label = entryPrice.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        return (
          <div
            className="absolute inset-x-0 flex items-center pointer-events-none gap-px"
            style={{ top: `${yPct}%`, transform: "translateY(-50%)", paddingLeft: paddingLeft, paddingRight: paddingRight }}
          >
            <div className="bg-white border border-[rgba(2,2,3,0.1)] rounded-[4px] px-[4px] flex items-center justify-center shrink-0" style={{ height: 16 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, lineHeight: "14px", color: "#020203", whiteSpace: "nowrap" }}>Entry</span>
            </div>
            <div className="flex-1 h-px border-0 border-t border-dashed border-[rgba(2,2,3,0.3)]" />
            <div className="bg-white border border-[rgba(2,2,3,0.1)] rounded-[4px] px-[4px] flex items-center justify-center shrink-0" style={{ height: 16 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, lineHeight: "14px", color: "#020203", whiteSpace: "nowrap" }}>{label}</span>
            </div>
          </div>
        );
      })()}

      {/* TP price line */}
      {tpPrice && (() => {
        const rawY = toY(tpPrice);
        const clampedY = Math.max(paddingTop, Math.min(paddingTop + chartHeight, rawY));
        const yPct = (clampedY / height) * 100;
        const label = tpPrice.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        return (
          <div
            className="absolute inset-x-0 flex items-center pointer-events-none gap-px"
            style={{ top: `${yPct}%`, transform: "translateY(-50%)", paddingLeft: paddingLeft, paddingRight: paddingRight }}
          >
            <div className="bg-white border border-[#25a764] rounded-[4px] px-[4px] flex items-center justify-center shrink-0" style={{ height: 16 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, lineHeight: "14px", color: "#25a764", whiteSpace: "nowrap" }}>TP</span>
            </div>
            <div className="flex-1 h-px border-0 border-t border-dashed border-[#25a764]" />
            <div className="bg-white border border-[#25a764] rounded-[4px] px-[4px] flex items-center justify-center shrink-0" style={{ height: 16 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, lineHeight: "14px", color: "#25a764", whiteSpace: "nowrap" }}>{label}</span>
            </div>
          </div>
        );
      })()}

      {/* SL price line — HTML overlay matching Figma */}
      {slPrice && (() => {
        const rawY = toY(slPrice);
        const clampedY = Math.max(paddingTop, Math.min(paddingTop + chartHeight, rawY));
        const yPct = (clampedY / height) * 100;
        const label = slPrice.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        return (
          <div
            className="absolute inset-x-0 flex items-center pointer-events-none gap-px"
            style={{ top: `${yPct}%`, transform: "translateY(-50%)", paddingLeft: paddingLeft, paddingRight: paddingRight }}
          >
            <div className="bg-white border border-[#c62f2f] rounded-[4px] px-[4px] flex items-center justify-center shrink-0" style={{ height: 16 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, lineHeight: "14px", color: "#c62f2f", whiteSpace: "nowrap" }}>SL</span>
            </div>
            <div className="flex-1 h-px border-0 border-t border-dashed border-[#c62f2f]" />
            <div className="bg-white border border-[#c62f2f] rounded-[4px] px-[4px] flex items-center justify-center shrink-0" style={{ height: 16 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, lineHeight: "14px", color: "#c62f2f", whiteSpace: "nowrap" }}>{label}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
