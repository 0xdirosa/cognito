/**
 * constants.ts — Network configuration and smart contract addresses for Cognito on Arc Testnet.
 */

// ERC-8004 Contract Addresses
export const IDENTITY_REGISTRY = "0x8004A818BFB912233c491871b3d84c89A494BD9e";
export const REPUTATION_REGISTRY = "0x8004B663056A597Dffe9eCcC1965A193B7388713";
export const VALIDATION_REGISTRY = "0x8004Cb1BF31DAf7788923b405b754f57acEB4272";

// Arc Testnet Network
export const ARC_CHAIN_ID = 5042002;
export const ARC_RPC_URL = "https://rpc.testnet.arc.network";
export const ARC_EXPLORER = "https://testnet.arcscan.app";

// USDC Token on Arc Testnet
export const USDC_CONTRACT = "0x3600000000000000000000000000000000000000";

// Inference Configuration
export const INFERENCE_PRICE_USDC = "0.001";
export const INFERENCE_COUNT = 3;

// Blockchain identifier for Circle SDK
export const CIRCLE_BLOCKCHAIN = "ARC-TESTNET";

// Polling
export const TX_POLL_INTERVAL_MS = 2000;
export const TX_POLL_MAX_ATTEMPTS = 30;

// Streaming Payments
export const STREAMING_MIN_AMOUNT_USDC = "0.000001";
export const STREAMING_RATE_USDC = "0.0001";
export const STREAMING_INTERVAL_MS = 1000;
