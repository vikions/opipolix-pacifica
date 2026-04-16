# Opipolix Pacifica

**Opipolix Pacifica** is a cross-market intelligence dashboard that connects **Polymarket event repricing** with **real Pacifica perpetual market data**.

The product is built for a simple but important workflow: when prediction-market odds move, traders need to quickly understand whether that move maps to a real perp opportunity, whether market conditions support action, and what kind of hedge makes sense.

Instead of showing isolated feeds, Opipolix Pacifica turns them into a single analytics surface for **signal discovery, market context, and hedge framing**.

---

## Design direction

Opipolix Pacifica is styled with a **Peaky Blinders-inspired visual identity**.

The interface treats the dashboard like a late-night trading desk: dark cinematic tones, gold accents, sharp typography, and a room-based structure that feels more like entering different strategic spaces than browsing generic panels.

This direction is not just cosmetic. It supports the product’s core mood:
- fast judgment under pressure
- disciplined signal reading
- high-conviction decisions in volatile markets

The result is a cross-market analytics experience that feels closer to a strategist’s control room than to a standard data terminal.


## What Opipolix Pacifica does

Opipolix Pacifica combines two live market layers:

- **Polymarket** for probability shifts, market momentum, volume, and liquidity
- **Pacifica** for perp market structure, including mark price, open interest, spread, and volume

The backend maps crypto-related prediction markets to Pacifica perp symbols and produces a clean dashboard experience designed around interpretation rather than raw feed browsing.

---

## Core product experience

### Open Contracts
A live Pacifica market view showing:

- symbol
- mark price
- 24h move
- open interest
- spread in bps

This panel gives users the execution-side context needed to understand whether a signal is actually tradable.

### Intelligence Reports
A Polymarket analytics layer focused on crypto-linked markets.

Each report surfaces:

- market question
- probability
- recent repricing
- 24h volume
- liquidity
- linked asset

This makes it easier to spot meaningful event drift and emerging sentiment shifts tied to Pacifica-relevant assets.

### The Bet
The main decision layer of the app.

This panel converts cross-market inputs into a primary hedge suggestion with:

- direction (`long` / `short`)
- Pacifica symbol
- urgency
- rationale
- suggested notional size
- signal type
- confidence

The goal is not just to display data, but to turn it into a fast, readable hedge idea.

### Activity Board
A ranked view of the most active Pacifica markets by live volume.

This panel acts as a quick relative-activity surface, helping users identify which Pacifica books currently dominate the tape.

---

## Why it matters

Prediction markets often move before broader market narratives fully settle.

At the same time, perp traders do not just need “a signal” — they need context:

- where liquidity is
- how wide the spread is
- whether open interest is elevated
- whether market conditions justify reacting

Opipolix Pacifica bridges that gap by turning scattered event and perp data into one cross-market workflow.

---

## Why Pacifica is core to the product

Pacifica is not used as a decorative integration.

It is the execution-side intelligence layer of the app.

Live Pacifica market data powers:

- perp market snapshots
- spread-aware contract views
- open interest and volume context
- activity ranking across books
- hedge framing tied to Pacifica symbols

This means the dashboard is built around real Pacifica market structure, not around static mock data or disconnected visualizations.

---

## Architecture

### Frontend
- React
- TypeScript
- Vite

### Backend
- FastAPI
- Pacifica market data client
- Polymarket market data client
- signal engine for market mapping and hedge suggestions

---

## Data flow

The backend fetches:

- Pacifica perpetual market snapshots
- Pacifica pricing and market context
- Polymarket crypto-linked event markets

Then it:

1. normalizes both feeds  
2. maps Polymarket markets to Pacifica assets  
3. builds dashboard summaries  
4. generates hedge-oriented signal output for the frontend  

---

## Current product focus

The current version is optimized for:

- live market visibility
- fast cross-market interpretation
- simple hedge suggestion UX
- readable analytics over execution complexity

---

## Next steps

Planned extensions include:

- multiple hedge suggestions instead of a single primary hedge
- stronger signal ranking and filtering
- alerts and monitoring flows
- user-specific watchlists
- deeper execution workflows on top of Pacifica market context

---
