#!/bin/bash
# Deploy Cognito Dashboard to Vercel
# Run: bash deploy-vercel.sh

set -e

# Load env from parent .env
source ../.env

echo "=== Deploying Cognito Dashboard to Vercel ==="
echo ""
echo "First, login to Vercel:"
npx vercel login
echo ""

echo "Deploying..."
npx vercel --prod \
  --build-env NEXT_PUBLIC_IS_LOCAL="false" \
  --build-env CIRCLE_API_KEY="$CIRCLE_API_KEY" \
  --build-env CIRCLE_ENTITY_SECRET="$CIRCLE_ENTITY_SECRET" \
  --build-env OWNER_WALLET_ID="$OWNER_WALLET_ID" \
  --build-env OWNER_WALLET_ADDRESS="$OWNER_WALLET_ADDRESS" \
  --build-env VALIDATOR_WALLET_ID="$VALIDATOR_WALLET_ID" \
  --build-env VALIDATOR_WALLET_ADDRESS="$VALIDATOR_WALLET_ADDRESS" \
  --build-env AGENT_ID="$AGENT_ID" \
  --build-env METADATA_URI="$METADATA_URI" \
  --build-env INFERENCE_PRICE_USDC="$INFERENCE_PRICE_USDC" \
  --build-env INFERENCE_COUNT="$INFERENCE_COUNT" \
  --build-env GROQ_API_KEY="$GROQ_API_KEY" \
  --build-env ENABLE_STREAMING="$ENABLE_STREAMING" \
  --build-env STREAMING_RATE_USDC="$STREAMING_RATE_USDC" \
  --build-env PINATA_API_KEY="$PINATA_API_KEY" \
  --build-env PINATA_API_SECRET_KEY="$PINATA_API_SECRET_KEY"

echo ""
echo "=== Deploy complete! ==="
