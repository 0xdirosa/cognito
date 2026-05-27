export interface WalletInfo {
  address: string;
  balance: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  address: string;
  metadataUri: string;
  reputationScore: string | null;
  standard: string;
  network: string;
  chainId: number;
}

export interface IdentityInfo {
  tokenId: string;
  owner: string;
  contractAddress: string;
  explorerUrl: string;
}

export interface ReputationInfo {
  lastScore: string | null;
  lastTag: string | null;
  lastTxHash: string | null;
  eventCount: number;
}

export interface ValidationInfo {
  status: string;
  response: number | null;
  tag: string | null;
  validatorAddress: string | null;
  requestHash: string | null;
}

export interface BudgetInfo {
  limit: string;
  spent: string;
  remaining: string;
  isExceeded: boolean;
  resetAt: string;
}

export interface AgentNetworkEntry {
  agentId: string;
  name: string;
  capabilities: string[];
  owner: string;
  paid: boolean;
}

export interface ActivityLog {
  agent: AgentInfo;
  wallets: { owner: WalletInfo; validator: WalletInfo };
  identity: IdentityInfo;
  reputation: ReputationInfo;
  validation: ValidationInfo;
  budget: BudgetInfo;
  contracts: Record<string, string>;
  lastUpdated: string;
}

export interface Balances {
  owner: string;
  validator: string;
}
