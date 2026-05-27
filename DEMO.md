# Cognito Demo Script (5 minutes)

## Before Demo Checklist

- [ ] Dashboard live: https://cognito-dashboard.vercel.app
- [ ] `.env` configured with `CIRCLE_API_KEY`, `CIRCLE_ENTITY_SECRET`, `GROQ_API_KEY`
- [ ] Owner wallet funded (≥ 0.05 USDC on Arc Testnet)
- [ ] Agent registered: `AGENT_ID=23745` in `.env`
- [ ] Terminal ready: `cd ~/cognito`
- [ ] Run `npm run export-activity` to refresh dashboard data

---

## Minute 1 — Overview

**What to show:** Dashboard Overview page

**URL:** https://cognito-dashboard.vercel.app/dashboard

**Talking points:**
- "Cognito is an autonomous AI agent with on-chain identity on Arc Testnet."
- "It pays USDC for every inference — nanopayments, not subscriptions."
- "ERC-8004 standard gives it an identity NFT, reputation, and validation."
- "Everything you see is on-chain — traceable on ArcScan."

**Expected output:**
- Stats cards show: 6 inferences, 0.006 USDC paid, Reputation 95/100
- Budget card: 0.006 / 0.05 USDC (12% used)
- Wallet balances visible with addresses
- Sidebar dark theme with cyan accent

---

## Minute 2 — On-Chain Identity

**What to show:** Dashboard Identity page

**URL:** https://cognito-dashboard.vercel.app/dashboard/identity

**Talking points:**
- "Cognito's metadata is stored on IPFS via Pinata."
- "On-chain identity: Agent #23745, verified by ERC-8004."
- "Reputation score 95/100 recorded by an independent validator wallet."
- "Validation PASSED — two-step on-chain flow completed."

**Then open ArcScan:**
- https://testnet.arcscan.app/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=23745
- "This is the actual NFT token on ArcScan — immutable proof of identity."

**Expected output:**
- Metadata card: Cognito, ERC-8004, Arc Testnet
- IPFS URI with copy button + gateway link
- Reputation: 95/100 with 342 events on-chain
- Validation: PASSED, response 100

---

## Minute 3 — Live Inference + Payment

**What to show:** Run agent loop in terminal, show confirmed transactions

**Command:**
```bash
npm run run-agent
```

**Talking points:**
- "Cognito calls Groq's llama-3.1 model with a self-reflective prompt."
- "Before every inference it checks budget and wallet balance."
- "It pays 0.001 USDC per request — that's $0.001 for AI inference."
- "Circle Gas Station sponsors the transaction fees."
- "Every payment has a tx hash — verifiable on ArcScan."

**Expected output:**
```
── Inference #1/3 ──
  Prompt: "Describe yourself as an autonomous AI agent..."
  Paying 0.001 USDC to provider...
  Waiting for inference #1 payment. ✓
  Model: llama-3.1-8b-instant
  Response: "I exist as a digital entity..."
  Tokens: 360 | Latency: 870ms
  Payment Tx: https://testnet.arcscan.app/tx/0x...
```

**Pick one tx hash and open it in ArcScan** to show on-chain proof.

---

## Minute 4 — Public API + Documentation

**What to show:** Terminal curl + API docs page

**Command (terminal):**
```bash
curl -s -H "X-Cognito-API-Key: cog_dev_key_change_in_production" \
  https://cognito-dashboard.vercel.app/api/v1/agent | python3 -m json.tool
```

**Talking points:**
- "Cognito exposes a REST API — any external app can query agent status."
- "6 endpoints: agent info, inference history, balances, budget."
- "Auth via X-Cognito-API-Key header. Rate limited: 10 req/min."

**Then open API docs page:**
https://cognito-dashboard.vercel.app/dashboard/api

**Expected output from curl:**
```json
{
    "success": true,
    "data": {
        "id": "23745",
        "name": "Cognito",
        "standard": "ERC-8004",
        "network": "Arc Testnet",
        "owner": "0x2b33...cd2c",
        "metadataUri": "ipfs://Qm...",
        "reputationScore": "95",
        "validation": { "status": "PASSED", "response": 100 }
    }
}
```

**Scroll API docs page to show:** Vercel OK badges, curl example, POST inference endpoint (local only).

---

## Minute 5 — Agent Economy + Streaming Demo

**What to show:** Agent Network + Streaming Demo

**Scroll Identity page → Agent Network section:**
https://cognito-dashboard.vercel.app/dashboard/identity
(scroll to bottom)

**Talking points:**
- "Cognito discovers other ERC-8004 agents on Arc Testnet."
- "14 agents found. Agent #24471 was paid 0.001 USDC as a service fee."
- "This is the agent economy — autonomous agents paying each other."

**Then open ArcScan for the agent payment:**
https://testnet.arcscan.app/tx/0xe2a8f503ec44ea5e920ade4720d14409d28e3709d5736bf7e288ccfbd8b4e5fb

**Open Streaming page:**
https://cognito-dashboard.vercel.app/dashboard/streaming

**Click "Run Demo" button**

**Talking points:**
- "Streaming payments: Cognito pays per-second during inference."
- "The demo simulates 5 seconds of streaming at 0.0001 USDC/sec."
- "Balance chart updates live, micro-transactions appear in the log."
- "In production, this runs with real Circle SDK transfers."

**Wrap up:**
- "Cognito demonstrates autonomous AI agents on Web3 rails."
- "On-chain identity + reputation + nanopayments + agent commerce."
- "Source code: [github repo]. Dashboard: cognito-dashboard.vercel.app"

---

## 🆘 Troubleshooting

| Issue | Fix |
|---|---|
| Dashboard shows 0 inferences | Run `npm run export-activity` to refresh data |
| `run-agent` fails with insufficient balance | Fund owner wallet via https://faucet.circle.com |
| Gemini disabled in model registry | Set `GEMINI_API_KEY` in `.env` |
| Streaming demo not animating | Click "Run Demo" on streaming page |
| API returns 401 | Include `X-Cognito-API-Key` header |
