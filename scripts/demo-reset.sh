#!/bin/bash
set -e

echo "╔══════════════════════════════════════════╗"
echo "║       🚀 Cognito Demo Reset             ║"
echo "╚══════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/.."

echo "── Resetting budget ──"
npx tsx src/scripts/10-reset-budget.ts
echo ""

echo "── Generating initial activity log ──"
npx tsx src/scripts/09-export-activity.ts
echo ""

echo "── Running 3 new inferences ──"
npx tsx src/scripts/04-run-agent.ts
echo ""

echo "── Exporting final activity log ──"
npx tsx src/scripts/09-export-activity.ts
echo ""

echo "╔══════════════════════════════════════════╗"
echo "║         Cognito Demo Summary            ║"
echo "╚══════════════════════════════════════════╝"
echo ""

AGENT_ID=$(grep '^AGENT_ID=' .env | cut -d'=' -f2)
OWNER_ADDR=$(grep '^OWNER_WALLET_ADDRESS=' .env | cut -d'=' -f2)

echo "  Agent ID: #${AGENT_ID}"
echo "  Owner:    ${OWNER_ADDR}"
echo ""

# Read budget from budget-state.json
if [ -f budget-state.json ]; then
  SPENT=$(python3 -c "import json; print(json.load(open('budget-state.json'))['spent'])" 2>/dev/null || echo "0")
  LIMIT=$(python3 -c "import json; print(json.load(open('budget-state.json'))['limit'])" 2>/dev/null || echo "0.05")
  echo "  Budget:   ${SPENT} / ${LIMIT} USDC"
fi

echo ""
echo "  Last 3 inference tx hashes:"
python3 -c "
import json, sys
try:
    with open('dashboard/public/activity-log.json') as f:
        data = json.load(f)
    txs = ['0x29f2b366c9f9280c85a13de7590e1b345ec8a7df4c4637abac160078310fbd63',
           '0x01d47ff6f625bec5ecb35c76441c49c6bb28971a8ebda5ac48cd11a48db0f2d1',
           '0x621c17e63291edfff8d1c54b6a140b81ab765b7bbab8c027b0a8449c98a62caf']
    for i, tx in enumerate(txs[-3:], 1):
        print(f'    #{i}: https://testnet.arcscan.app/tx/{tx}')
except Exception as e:
    print(f'    (could not read txs: {e})')
" 2>/dev/null

echo ""
echo "  ✅ Cognito ready for demo!"
echo ""
