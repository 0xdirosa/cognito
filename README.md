# Cognito — ERC-8004 AI Agent with Autonomous USDC Nanopayments

**Cognito** is an autonomous AI agent with on-chain identity (ERC-8004) on Arc Testnet.
It pays USDC per inference request, records reputation on-chain, discovers and pays
other agents, and streams everything to a production dashboard.

## 🏆 Hackathon Highlights

- **Full Web3 stack** — Arc Testnet, Circle SDK, ERC-8004
- **On-chain everything** — identity NFT, reputation events, validation two-step
- **Autonomous nanopayments** — 0.001 USDC per inference, verified on ArcScan
- **Multi-model inference** — Groq (llama-3.1) + Gemini (gemini-2.0-flash), auto-fallback
- **Agent-to-agent commerce** — discover 14 agents on-chain, pay service fees
- **Streaming demo** — real-time balance chart, micro-tx log (client-side simulation)
- **Production dashboard** — 20 routes, Next.js 14, Recharts, dark/light mode
- **11 independent scripts** — wallet creation through agent payments, all automated

## 📊 Live Demo

**Dashboard:** [cognito-dashboard.vercel.app](https://cognito-dashboard.vercel.app)

**Agent ID:** [#23745](https://testnet.arcscan.app/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=23745) on Arc Testnet

## 💡 How It Works

1. **Agent registers identity** — mints ERC-8004 NFT on Arc Testnet IdentityRegistry
2. **Agent calls AI model** — selects model by strategy (cheapest/fastest/best), sends prompt
3. **Agent pays USDC per inference** — 0.001 USDC nanopayment via Circle SDK, recorded on-chain
4. **Validator records reputation** — independent third-party gives feedback via ReputationRegistry
5. **Dashboard visualizes everything** — real-time stats, charts, agent network, budget tracking

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                   COGNITO AGENT                   │
│                                                   │
│  Inference Layer                                   │
│  ├─ Groq (llama-3.1-8b-instant)                  │
│  └─ Gemini (gemini-2.0-flash) — auto-fallback    │
│                                                   │
│  OWNER Wallet (SCA)                               │
│  ├─ ERC-8004 Identity NFT (#23745)                │
│  ├─ Pays USDC per inference request              │
│  ├─ Pays other ERC-8004 agents                   │
│  └─ Requests validation                          │
│                                                   │
│  VALIDATOR Wallet (SCA)                           │
│  ├─ Acts as inference provider                   │
│  ├─ Receives USDC payments                       │
│  ├─ Records reputation on-chain                  │
│  └─ Responds to validation requests              │
│                                                   │
│  Smart Contracts (Arc Testnet):                   │
│  ├─ IdentityRegistry 0x8004...BD9e               │
│  ├─ ReputationRegistry 0x8004...8713              │
│  └─ ValidationRegistry 0x8004...4272              │
│                                                   │
│  Supporting Systems:                               │
│  ├─ Budget Manager — daily spend limits          │
│  ├─ Webhook — event alerts (discord/slack)       │
│  └─ Dashboard — Next.js 14, Recharts, Tailwind   │
└──────────────────────────────────────────────────┘
```

## 🚀 Quick Start

```bash
# 1. Clone and install
cd ~/cognito
npm install

# 2. Configure environment
cp .env.example .env
# Fill in CIRCLE_API_KEY and CIRCLE_ENTITY_SECRET

# 3. Create wallets (fund owner wallet when prompted)
npm run create-wallets

# 4. Run full agent lifecycle
npm run register-agent     # ERC-8004 identity
npm run setup-inference    # Validate balances
npm run run-agent          # 3 AI inferences + nanopayments
npm run record-reputation  # On-chain feedback
npm run verify-status      # Final verification

# 5. Launch dashboard
cd dashboard && npm run dev
```

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run create-wallets` | Create owner + validator SCA wallets via Circle SDK |
| `npm run register-agent` | Register ERC-8004 identity NFT on-chain |
| `npm run setup-inference` | Validate wallet balances and config |
| `npm run run-agent` | Autonomous inference loop (3 cycles) |
| `npm run record-reputation` | Validator records feedback on-chain |
| `npm run verify-status` | Verify all on-chain data |
| `npm run upload-metadata` | Upload agent metadata to IPFS via Pinata |
| `npm run stream-inference` | Streaming nanopayment during inference |
| `npm run export-activity` | Generate dashboard activity-log.json |
| `npm run reset-budget` | Reset daily budget counter |
| `npm run agent-commerce` | Agent-to-agent payment demo |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22, TypeScript + ESM |
| Blockchain | Arc Testnet (chain ID: 5042002) |
| On-chain SDK | viem |
| Wallet SDK | Circle Developer-Controlled Wallets |
| AI Models | Groq (llama-3.1-8b-instant), Gemini (gemini-2.0-flash) |
| Dashboard | Next.js 14, Tailwind CSS, Recharts, Lucide icons |
| IPFS | Pinata |
| Deployment | Vercel |

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CIRCLE_API_KEY` | ✅ Yes | Circle Developer API Key (from Console) |
| `CIRCLE_ENTITY_SECRET` | ✅ Yes | Circle Entity Secret |
| `OWNER_WALLET_ID` | Auto | Generated by `create-wallets` script |
| `OWNER_WALLET_ADDRESS` | Auto | Generated by `create-wallets` script |
| `VALIDATOR_WALLET_ID` | Auto | Generated by `create-wallets` script |
| `VALIDATOR_WALLET_ADDRESS` | Auto | Generated by `create-wallets` script |
| `AGENT_ID` | Auto | Generated by `register-agent` script |
| `METADATA_URI` | Auto | IPFS URI from Pinata upload |
| `GROQ_API_KEY` | ✅ Yes | Groq API Key for AI inference |
| `GEMINI_API_KEY` | — Optional | Gemini API Key (excluded if blank) |
| `INFERENCE_PRICE_USDC` | — Optional | Price per inference in USDC (default: 0.001) |
| `INFERENCE_COUNT` | — Optional | Number of inference cycles (default: 3) |
| `DAILY_BUDGET_USDC` | — Optional | Daily spending limit (default: 0.05) |
| `MODEL_STRATEGY` | — Optional | cheapest \| fastest \| best (default: cheapest) |
| `ENABLE_STREAMING` | — Optional | Enable streaming payments (default: true) |
| `STREAMING_RATE_USDC` | — Optional | USDC per second during stream (default: 0.0001) |
| `COGNITO_API_KEY` | — Optional | API key for REST endpoints |
| `WEBHOOK_URL` | — Optional | URL for webhook event delivery |
| `PINATA_API_KEY` | — Optional | Pinata API Key for IPFS uploads |
| `PINATA_API_SECRET_KEY` | — Optional | Pinata Secret Key for IPFS uploads |

## 🔗 On-Chain Explorer Links

| Transaction | ArcScan |
|---|---|
| Agent Registration | [Register Agent #23745](https://testnet.arcscan.app/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=23745) |
| Inference #1 Payment | [View](https://testnet.arcscan.app/tx/0x29f2b366c9f9280c85a13de7590e1b345ec8a7df4c4637abac160078310fbd63) |
| Inference #2 Payment | [View](https://testnet.arcscan.app/tx/0x01d47ff6f625bec5ecb35c76441c49c6bb28971a8ebda5ac48cd11a48db0f2d1) |
| Inference #3 Payment | [View](https://testnet.arcscan.app/tx/0x621c17e63291edfff8d1c54b6a140b81ab765b7bbab8c027b0a8449c98a62caf) |
| Reputation Recorded | [View](https://testnet.arcscan.app/tx/0x93f686d61264f412d0b62f67c5ae4bdbf2240cb74844771b3a7dc91f679898f0) |
| Validation Passed | [View](https://testnet.arcscan.app/tx/0x21bfd2c8a098b54d936a795153c0704671302f7dd57e230c2434fb0f85b19ffc) |
| Agent Payment #24471 | [View](https://testnet.arcscan.app/tx/0xe2a8f503ec44ea5e920ade4720d14409d28e3709d5736bf7e288ccfbd8b4e5fb) |

## 📁 Project Structure

```
project/
├── src/
│   ├── config/          # Constants, contract addresses, model registry
│   ├── lib/             # SDK wrappers, helpers, budget, webhook, streaming
│   ├── metadata/        # ERC-8004 agent metadata JSON
│   ├── scripts/         # 11 standalone agent scripts (01-11)
│   └── index.ts         # Full workflow orchestrator
├── dashboard/
│   ├── app/             # Next.js 14 App Router (pages + API routes)
│   ├── components/      # React components (sidebar, charts, cards)
│   ├── hooks/           # Custom hooks
│   ├── providers/       # Context providers (data, theme)
│   ├── lib/             # Frontend utilities, types
│   └── public/          # activity-log.json, webhook-log.json
├── .env                 # Environment variables (gitignored)
├── .env.example         # Template
├── budget-state.json    # Daily spending state (gitignored)
├── package.json
└── README.md
```

## 📄 License

MIT
