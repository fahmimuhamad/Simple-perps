"use client";

import { Kline } from "../hooks/useBinanceKlines";

interface LiveChartProps {
  klines: Kline[];
  chartType?: "line" | "candle";
  width?: number;
  height?: number;
}

export default function LiveChart({ klines, chartType = "line", width = 375, height = 260 }: LiveChartProps) {
  if (!klines.length) {
    // Loading skeleton — same static chart as before
    return (
      <div className="relative w-full h-[274px] overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradSkeleton" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#25a764" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#25a764" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 180 L375 180" stroke="#f2f2f2" strokeWidth="1" />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#8d8e8e" fontSize="12" fontFamily="Inter, sans-serif">
            Loading chart...
          </text>
        </svg>
      </div>
    );
  }

  const paddingLeft = 8;
  const paddingRight = 8;
  const paddingTop = 16;
  const paddingBottom = 28; // room for time labels

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const closes = klines.map((k) => k.close);
  const priceMin = chartType === "candle"
    ? Math.min(...klines.map((k) => k.low))
    : Math.min(...closes);
  const priceMax = chartType === "candle"
    ? Math.max(...klines.map((k) => k.high))
    : Math.max(...closes);
  const priceRange = priceMax - priceMin || 1;

  const n = klines.length;
  const xStep = chartWidth / (n - 1 || 1);
  const candleSpacing = chartWidth / n;
  const candleW = Math.max(1, (chartWidth / n) * 0.6);

  function toY(price: number): number {
    return paddingTop + chartHeight - ((price - priceMin) / priceRange) * chartHeight;
  }

  function toX(index: number): number {
    return chartType === "candle"
      ? paddingLeft + index * candleSpacing + candleSpacing / 2
      : paddingLeft + index * xStep;
  }

  // Determine overall trend for gradient colour
  const firstClose = klines[0].close;
  const lastClose = klines[n - 1].close;
  const trendColor = lastClose >= firstClose ? "#25a764" : "#e54040";
  const gradientId = lastClose >= firstClose ? "chartGradGreen" : "chartGradRed";

  // Build line path through close prices for the gradient fill
  const closePath = klines
    .map((k, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(k.close).toFixed(1)}`)
    .join(" ");
  const fillPath = `${closePath} L${toX(n - 1).toFixed(1)},${(paddingTop + chartHeight).toFixed(1)} L${paddingLeft.toFixed(1)},${(paddingTop + chartHeight).toFixed(1)} Z`;

  // Time labels — pick ~5 evenly spaced
  const labelIndices = [0, Math.floor(n * 0.25), Math.floor(n * 0.5), Math.floor(n * 0.75), n - 1];
  function formatTime(ts: number): string {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }

  // Current price label position
  const currentY = toY(lastClose);

  return (
    <div className="relative w-full h-[274px] overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gradient fill */}
        <path d={fillPath} fill={`url(#${gradientId})`} />

        {chartType === "line" ? (
          /* Line through close prices */
          <path d={closePath} stroke={trendColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        ) : (
          /* Candlesticks */
          klines.map((k, i) => {
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

        {/* Current price dashed line */}
        <line
          x1={paddingLeft}
          y1={currentY}
          x2={width - paddingRight}
          y2={currentY}
          stroke={trendColor}
          strokeWidth="0.8"
          strokeDasharray="3 3"
          opacity="0.6"
        />

        {/* Live dot at last candle */}
        <circle cx={toX(n - 1)} cy={currentY} r="3" fill={trendColor} />
        <circle cx={toX(n - 1)} cy={currentY} r="6" fill={trendColor} fillOpacity="0.2" />

        {/* Time labels */}
        {labelIndices.map((idx) => (
          <text
            key={idx}
            x={toX(idx)}
            y={height - 6}
            textAnchor="middle"
            fill="#8d8e8e"
            fontSize="8"
            fontFamily="Inter, sans-serif"
          >
            {formatTime(klines[idx].openTime)}
          </text>
        ))}

        {/* Bottom border */}
        <line
          x1={0}
          y1={paddingTop + chartHeight}
          x2={width}
          y2={paddingTop + chartHeight}
          stroke="rgba(2,2,3,0.1)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
