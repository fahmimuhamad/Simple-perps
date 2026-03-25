# Perps Order Sheet — Test & Demo Guide

## App Overview

A mobile-first (375px) crypto perpetual futures trading UI built with Next.js + React. Connects to Binance WebSocket for live BTC price data. All navigation is modal/sheet-based with no page routing.

---

## Pre-Demo Setup

1. Run the dev server: `npm run dev`
2. Open `http://localhost:3000` in a browser
3. Set browser DevTools to **iPhone 14 Pro** (390×844) or use responsive mode at **375px width**
4. Ensure internet connection — live price data requires Binance WebSocket access

---

## Feature Map

```
Main Screen
├── Price Header (live BTC price, 24h change, funding rate, long/short ratio)
├── Live Chart (candlestick / line, timeframe selector)
├── Long / Short buttons → OrderTypeSheet
│   └── Confirm → ConfirmationSheet → creates Position
├── Position Card (if open)
│   ├── Adjust Leverage → LeverageSheet
│   ├── Adjust Margin → AddRemoveMarginSheet
│   └── Edit TP/SL → TpSlSheet
├── Coachmark Tutorial (first visit)
└── Bottom Navigation (tabs)
```

---

## Test Scenarios

### Scenario 1 — Live Price Feed

**Goal:** Verify real-time data loads correctly.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Load the app | Price header shows BTC price (e.g. "70.488,5") in European format |
| 2 | Wait 2–3 seconds | Price updates automatically via WebSocket |
| 3 | Check top row | 24h change %, high, low, and volume are visible |
| 4 | Check funding rate | Shows rate (e.g. "0.0100%") and countdown to next funding |
| 5 | Check L/S bar | Shows long/short user distribution (e.g. "71.3% L") |

**Pass criteria:** All values populate within 3 seconds. Price updates without page refresh.

---

### Scenario 2 — Chart Interaction

**Goal:** Verify chart renders and responds to user input.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Observe chart on load | Candlestick chart renders with historical candles |
| 2 | Tap timeframe buttons (1m, 5m, 1h, etc.) | Chart re-fetches and redraws for selected interval |
| 3 | Toggle chart type (candle ↔ line) | Chart switches display mode instantly |
| 4 | Drag left/right on chart | Chart pans through historical data |
| 5 | Pinch/scroll to zoom | Chart zooms in/out on the time axis |
| 6 | Check live price line | A horizontal line tracks the current live price in real time |

**Pass criteria:** Chart is responsive to all gestures. Timeframe switch triggers new data fetch.

---

### Scenario 3 — Open a Long Position

**Goal:** Walk through the full order entry flow.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Tap **Long** button | OrderTypeSheet slides up from bottom |
| 2 | Tap numeric keys to enter margin (e.g. "100") | Margin field updates, estimated position size shows |
| 3 | Tap preset buttons (25% / 50% / 75% / 100%) | Margin auto-fills to corresponding wallet % |
| 4 | Adjust leverage slider | Leverage value updates (1–25x), liquidation price recalculates |
| 5 | Toggle TP/SL on | TP and SL input fields appear |
| 6 | Enter a TP price | Estimated profit in USD shows below |
| 7 | Enter an SL price | Estimated loss in USD shows below |
| 8 | Tap **Open Long** | ConfirmationSheet appears with full summary |
| 9 | Review confirmation details | Shows side, leverage, margin, entry price, liquidation price, TP/SL |
| 10 | Tap **Confirm** | Sheet closes, Position Card appears on main screen |

**Pass criteria:** Position Card is visible with correct side (LONG), leverage, margin, and prices.

---

### Scenario 4 — Open a Short Position

**Goal:** Verify short side works symmetrically.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Tap **Short** button (only if no position open) | OrderTypeSheet opens with SHORT mode |
| 2 | Enter margin and leverage | Position size and liquidation price calculate correctly |
| 3 | Confirm order | Position Card shows SHORT label |
| 4 | Compare liquidation price vs Long | Short liquidation should be ABOVE entry price |

**Pass criteria:** SHORT position card shows correct direction. Liquidation price is entry × (1 + 1/leverage).

---

### Scenario 5 — Position Card & P&L

**Goal:** Verify live P&L tracking on an open position.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open a LONG position (Scenario 3) | Position Card appears |
| 2 | Observe P&L value | Shows unrealized P&L in USD (positive if price rose) |
| 3 | Observe ROI % | ROI = P&L / margin × 100 (amplified by leverage) |
| 4 | Wait for price change | P&L and ROI update automatically |
| 5 | Check liquidation price | Shown in red; should be below entry for LONG |
| 6 | Check margin and position size | Values match what was entered |

**Pass criteria:** P&L and ROI update in real time. Values are mathematically consistent with leverage.

---

### Scenario 6 — Adjust Leverage

**Goal:** Verify leverage adjustment on an open position.

| Step | Action | Expected |
|------|--------|----------|
| 1 | With a position open, tap **Adjust Leverage** | LeverageSheet slides up |
| 2 | Drag the leverage ruler left/right | Leverage value changes smoothly |
| 3 | Observe liquidation price update | Recalculates as leverage changes |
| 4 | Observe position size update | Larger leverage = larger position for same margin |
| 5 | Tap **Confirm** | Sheet closes, Position Card reflects new leverage |

**Pass criteria:** Leverage updates reflected in Position Card immediately.

---

### Scenario 7 — Add / Remove Margin

**Goal:** Verify margin management sheet.

| Step | Action | Expected |
|------|--------|----------|
| 1 | With a position open, tap **Margin** button | AddRemoveMarginSheet slides up |
| 2 | Switch to **Add** tab | Shows input and slider to add margin |
| 3 | Drag slider or enter amount | Liquidation price shifts away from current price |
| 4 | Tap **Max** | Fills maximum available amount |
| 5 | Switch to **Remove** tab | Shows input for removing margin |
| 6 | Enter remove amount | Liquidation price moves closer to current price |
| 7 | Confirm change | Position Card updates with new margin and liquidation price |

**Pass criteria:** Liquidation price responds correctly in both directions. Add margin = safer, Remove margin = riskier.

---

### Scenario 8 — Take Profit / Stop Loss

**Goal:** Verify TP/SL editor.

| Step | Action | Expected |
|------|--------|----------|
| 1 | With a position open, tap **TP/SL** button | TpSlSheet slides up |
| 2 | Toggle TP checkbox on | TP price input becomes active |
| 3 | Enter a TP price above current | Estimated profit in USD calculates |
| 4 | Switch to **PnL mode** | Input switches from price to P&L value |
| 5 | Enter a P&L target | Price field auto-converts |
| 6 | Toggle SL checkbox on | SL price input becomes active |
| 7 | Enter SL price below entry | Estimated loss in USD shows |
| 8 | Tap **Confirm** | TP/SL values appear on Position Card |

**Pass criteria:** Bidirectional conversion between price and PnL modes works. Values save to Position Card.

---

### Scenario 9 — Confirmation Sheet (Skip/Remember)

**Goal:** Verify "Don't show again" flow.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open an order and tap Confirm | ConfirmationSheet appears |
| 2 | Check **"Don't show again"** checkbox | Checkbox toggles on |
| 3 | Tap Confirm | Position opens; sheet noted preference |
| 4 | Open a second order | ConfirmationSheet should be skipped |

**Pass criteria:** Second order skips confirmation sheet when preference is set.

---

### Scenario 10 — Coachmark Tutorial

**Goal:** Verify onboarding tutorial flow.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open app with a position already created (or trigger tutorial) | Coachmark overlay appears |
| 2 | Spotlight focuses on P&L section | Tooltip explains unrealized P&L |
| 3 | Tap **Next** | Spotlight moves to next element |
| 4 | Step through all coachmark steps | Each step highlights the correct element |
| 5 | Tap **Done** on final step | Overlay dismisses |
| 6 | Reload app | Tutorial does not re-appear (stored in state/localStorage) |

**Pass criteria:** All coachmark steps highlight correct UI elements. Tutorial only shows once.

---

## Edge Cases to Verify

| # | Case | How to Test | Expected |
|---|------|-------------|----------|
| E1 | No internet | Disable network, reload | App loads but price shows "--" or last known value |
| E2 | Zero margin input | Leave margin at 0, try to open | Button should be disabled or show validation error |
| E3 | Max leverage | Set leverage to 25x | Liquidation price very close to entry price |
| E4 | TP below entry (Long) | Set TP lower than entry for a LONG | UI should warn or prevent |
| E5 | SL above entry (Long) | Set SL above entry for a LONG | UI should warn or prevent |
| E6 | Remove more than margin | Try to remove > available margin | Input capped or error shown |
| E7 | Rapid timeframe switching | Tap timeframes quickly | No duplicate chart renders or crashes |
| E8 | Open position, then close app | Reopen — position is gone | Position is not persisted (no backend) |

---

## Demo Script (5-Minute Walkthrough)

**Minute 1 — Live data**
> "The app connects to Binance in real time. You can see the BTC price updating live, the funding rate, and the ratio of long vs short positions."

**Minute 2 — Chart**
> "The chart shows candlestick data. You can switch timeframes, toggle to a line chart, and pan or zoom through history."

**Minute 3 — Opening a trade**
> "Tap Long. Enter a margin amount using the numeric pad. Adjust leverage with the slider — notice how the liquidation price updates. Add a take profit. Confirm."

**Minute 4 — Managing the position**
> "The Position Card shows your live P&L and ROI. You can adjust leverage mid-trade, add or remove margin to move the liquidation price, and edit TP/SL at any time."

**Minute 5 — Onboarding**
> "For first-time users, a coachmark tutorial walks through the key parts of the interface with highlighted spotlights."

---

## Known Limitations

- No backend or wallet integration — trades are simulated in local state
- Position resets on page refresh
- Only BTC/USDT perpetual is supported
- Designed for mobile (375px) — desktop layout not optimized