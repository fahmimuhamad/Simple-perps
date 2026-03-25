# Usability Test Plan — Perps Order Sheet

## Study Overview

**Product:** Perpetual futures trading UI (BTC/USDT)
**Method:** Moderated think-aloud usability test
**Format:** 1-on-1, remote or in-person
**Session length:** 45–60 minutes (experienced) / 30–40 minutes (beginners)
**Participants:** 8 users total across two streams

---

## Research Goals

**All participants:**
1. Can users understand the interface without prior instruction?
2. Where do users feel uncertain, confused, or anxious?
3. Do users trust the information presented (prices, P&L, liquidation)?

**Experienced participants only:**
4. Can users successfully open and manage a leveraged position end-to-end?
5. Do interaction patterns (leverage slider, margin sheet, TP/SL) meet expectations?

**Beginner participants only:**
6. Can the interface teach basic concepts on its own, without onboarding?
7. What vocabulary or concepts create the most friction?

---

## Participant Streams

Run two separate streams. Do not mix tasks between them.

### Stream A — Experienced Users (5 participants)

Recruit participants who match **at least one**:

| Profile | Description |
|---------|-------------|
| **Crypto-native trader** | Has used Binance, Bybit, or similar. Understands leverage and perpetuals. |
| **Crypto-curious** | Owns crypto (spot), understands basic concepts, has not traded perps before. |
| **Finance-literate** | Trades stocks/options. Understands margin and leverage but not crypto-specific. |

### Stream B — Beginners (3 participants)

Recruit participants who match **all** of:

| Criteria | Description |
|----------|-------------|
| No trading experience | Has never bought stocks, crypto, or any financial instrument |
| Tech-comfortable | Uses mobile apps daily, comfortable with unfamiliar UIs |
| Curious about crypto | Has heard of Bitcoin, interested to learn — not hostile to the topic |

**Why include beginners:** To test whether the interface can stand alone without onboarding, and to surface which concepts need explanation or visual cues.

---

## Setup

- Device: iPhone (or browser at 375px mobile viewport)
- App running at `localhost:3000`
- Screen + audio recording (with consent)
- Moderator observes and takes notes; does not lead or hint

---

## Moderator Script

### Opening (5 min)

> "Thanks for joining. We're testing an early version of a crypto trading app — we're not testing you, we're testing the design. There are no wrong answers.
>
> As you go through the tasks, please think out loud — say what you're looking at, what you expect to happen, and what's surprising or confusing.
>
> I won't be able to answer questions during the tasks, but feel free to ask — I'll note them down and we can discuss at the end."

---

## Tasks — Stream A (Experienced Users)

### Task 1 — First Impressions
**Time limit:** 2 min
**No instruction given.** Let the user look at the screen freely.

> "Take a look at this screen. Tell me what you think this app does and who it might be for."

**Observe:**
- What do they notice first?
- Do they identify it as a trading app?
- Do they understand the price display? The chart?
- Do they notice the Long/Short buttons?

---

### Task 2 — Open a Long Position
**Time limit:** 5 min

> "Imagine you believe Bitcoin's price will go up. Using this app, open a long position with $100 margin at 10x leverage."

**Observe:**
- Do they find the Long button immediately?
- Do they understand the numeric keypad?
- Do they understand the leverage slider?
- Do they read the liquidation price? Do they understand it?
- Do they hesitate before confirming?
- Do they complete the task or abandon it?

**Success:** Position card appears on main screen.

---

### Task 3 — Understand the Position Card
**Time limit:** 3 min

> "You've opened a position. Walk me through what you see here — what does each number mean to you?"

**Observe:**
- Can they explain P&L and ROI?
- Do they understand the difference between entry price and current price?
- Do they notice the liquidation price? Do they understand its significance?
- Any numbers they skip over or find confusing?

---

### Task 4 — Add a Take Profit
**Time limit:** 4 min

> "Set a take profit so that your position automatically closes if Bitcoin reaches $5,000 above your entry price."

**Observe:**
- Do they find the TP/SL button?
- Do they understand the difference between Price mode and PnL mode?
- Can they calculate or approximate what price to enter?
- Do they feel confident the TP was set?

**Success:** TP value appears on Position Card.

---

### Task 5 — Adjust Leverage
**Time limit:** 3 min

> "You want to reduce your risk. Lower the leverage on your open position to 5x."

**Observe:**
- Do they find the leverage adjustment?
- Do they understand the ruler/slider?
- Do they notice the liquidation price changing as they adjust?
- Do they connect lower leverage = lower risk?

**Success:** Position card shows 5x leverage.

---

### Task 6 — Add Margin
**Time limit:** 3 min

> "Your position is getting close to liquidation. Add $50 more margin to make it safer."

**Observe:**
- Do they find the Add/Remove Margin sheet?
- Do they understand the two tabs (Add / Remove)?
- Do they see the liquidation price move when they add margin?
- Do they trust that the action worked?

**Success:** Margin value updates on Position Card.

---

### Task 7 — Interpret the Chart (Optional, if time allows)
**Time limit:** 3 min

> "Switch the chart to show the last 1 hour of price movement, then switch to a line chart."

**Observe:**
- Do they find the timeframe buttons?
- Do they find the chart type toggle?
- Do they try to interact with the chart (scroll, zoom)?

---

## Tasks — Stream B (Beginners)

> Before starting tasks, give a 60-second plain-language briefing:
> "Perpetual futures is a way to bet on whether Bitcoin's price will go up or down — without actually buying Bitcoin. You put in a small amount of money (called margin), and the app amplifies your gains or losses using leverage. I'll explain more as we go."

### Task B1 — First Impressions
**Time limit:** 3 min
**No instruction given.** Let the user look at the screen freely.

> "Take a look at this screen. Tell me what you think this app is for and what kind of person would use it."

**Observe:**
- What's the first thing they react to?
- Do they feel intimidated or curious?
- Do they recognize the chart as a price chart?
- Do they read any of the numbers? Which ones?
- Do they notice or understand "Long" and "Short"?

---

### Task B2 — Understand the Price
**Time limit:** 3 min

> "Can you find the current price of Bitcoin on this screen? How has it changed today?"

**Observe:**
- Do they find the price in the header?
- Can they read the number (European format with commas)?
- Do they find the 24h change percentage?
- Do they understand what "24h" means?

---

### Task B3 — Open a Long (with explanation allowed)
**Time limit:** 8 min

> "We're going to try placing a trade together. Tap the green 'Long' button — this means you're betting Bitcoin's price will go up."

Allow the moderator to explain **what** to do but **not why** each UI element exists. Observe whether the interface itself communicates the meaning.

| Step | Moderator says | Observe |
|------|---------------|---------|
| Margin input | "Enter 100 as your margin — that's how much money you're putting in" | Do they understand the keypad? Do they ask what margin means? |
| Leverage | "Now adjust the leverage to 10x" | Do they find the slider? Do they ask what leverage does? |
| Liquidation price | Say nothing — just pause | Do they notice it? Do they ask about it? Do they look concerned? |
| Confirm | "Tap the confirm button" | Do they hesitate? Do they re-read anything before confirming? |

---

### Task B4 — Read the Position Card
**Time limit:** 4 min

> "A trade is now open. Look at this card and tell me: are you making money or losing money right now? How do you know?"

**Observe:**
- Do they find the P&L number?
- Do they understand positive = profit, negative = loss?
- Do they ask what "ROI" means?
- Do they notice the liquidation price? Do they ask about it unprompted?
- Do they feel like they understand enough to act?

---

### Task B5 — React to Risk
**Time limit:** 4 min

> "Imagine the liquidation price is getting very close to the current price. What would you do? Is there anything in this app that could help?"

**Observe:**
- Do they explore the interface looking for options?
- Do they find Add Margin on their own?
- Do they understand that adding margin = more safety?
- Do they feel in control, or helpless?

---

## Post-Task Interview — Stream B (Beginners)

### Comprehension
- "In your own words, what does 'leverage' mean after using this app?"
- "What do you think would happen if Bitcoin dropped to the liquidation price?"
- "Were there any words or numbers you didn't understand at all?"

### Emotional Response
- "How did you feel while using this? Excited, nervous, confused, overwhelmed?"
- "Was there any moment you felt like you might make a mistake that loses money?"
- "Would you feel comfortable using this on your own without someone guiding you?"

### Onboarding Needs
- "What's the one thing you wish the app had explained to you upfront?"
- "What would you need to see or read before you felt ready to place a real trade?"

---

## Post-Task Interview — Stream A (Experienced Users)

### Comprehension
- "In your own words, what is a liquidation price?"
- "What would happen to your money if Bitcoin dropped to that price?"
- "Did any number or label feel confusing or unfamiliar?"

### Trust & Confidence
- "How confident did you feel making decisions in this app?"
- "Was there any moment where you weren't sure if you'd done the right thing?"
- "What would make you more confident before placing a real trade?"

### Overall Experience
- "What was the most confusing part of the experience?"
- "What felt natural or easy?"
- "If you could change one thing, what would it be?"
- "Would you use this app? Why or why not?"

---

## Metrics to Track

| Metric | How to Measure |
|--------|---------------|
| Task completion rate | Did they finish each task without help? |
| Time on task | How long per task |
| Error count | How many wrong taps/actions before success |
| Hesitation moments | Where did they pause or say "hmm"? |
| Confusion points | Unprompted questions or misreads |
| Emotional tone | Confident, anxious, frustrated, delighted |

---

## Key Observations to Note

**Both streams:**
- **Liquidation price** — do users understand this is where they lose everything?
- **Confirmation sheet** — does it build trust or feel like friction?
- **European number format** (e.g. "70.488,5") — does it cause confusion?

**Stream A focus:**
- **Leverage slider** — is the risk relationship intuitive for experienced users?
- **P&L vs ROI** — are both numbers understood and trusted?
- **TP/SL price vs PnL mode** — is the toggle confusing?

**Stream B focus:**
- **"Long" / "Short" labels** — do beginners understand the direction without explanation?
- **Margin vs position size** — is the distinction clear?
- **Any concept that stops them cold** — vocabulary, numbers, or flows that cause abandonment

---

## What to Do With Findings

| Severity | Criteria | Action |
|----------|----------|--------|
| **Critical** | User cannot complete task or makes a damaging error | Fix before launch |
| **Major** | User completes task but with significant confusion or wrong path | Fix in next iteration |
| **Minor** | User notices but self-corrects quickly | Add to backlog |
| **Polish** | Preference or aesthetic feedback | Nice to have |

---

## Consent & Recording Note

Before starting, confirm:
- [ ] Participant consents to screen + audio recording
- [ ] Participant understands this is a test of the product, not them
- [ ] Participant knows they can stop at any time
