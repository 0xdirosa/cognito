"use client";

import { useData } from "@/providers/data-provider";
import { formatAddress, truncateTx } from "@/lib/utils";
import { Copy, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function AgentIdentity() {
  const { activity, loading, error } = useData();

  if (loading) {
    return <div className="text-[var(--text-secondary)] py-20 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-[var(--text-secondary)] py-20 text-center">
        <p className="text-lg font-medium mb-2">Error loading data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-[var(--text-secondary)] py-20 text-center">
        <p className="text-lg font-medium mb-2">No identity data</p>
        <p className="text-sm">Run export-activity to generate data.</p>
      </div>
    );
  }

  const { agent, identity, reputation, validation, contracts } = activity;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Agent Identity</h1>

      {/* Metadata Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Metadata</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[var(--text-muted)] mb-1">Name</p>
            <p className="text-[var(--text-primary)] font-medium">{agent.name}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Standard</p>
            <p className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium inline-block">
              {agent.standard}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Network</p>
            <p className="text-[var(--text-primary)]">{agent.network}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Chain ID</p>
            <p className="font-mono text-[var(--text-primary)]">{agent.chainId}</p>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-[var(--text-muted)] text-sm mb-2">Capabilities</p>
          <div className="flex flex-wrap gap-2">
            {["inference", "nanopayments", "autonomous-execution", "on-chain-identity"].map(
              (cap) => (
                <span
                  key={cap}
                  className="px-2.5 py-1 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] text-xs"
                >
                  {cap}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* IPFS Metadata */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">IPFS Metadata</h2>
        <div className="flex items-center gap-3">
          <code className="font-mono text-sm text-accent bg-[var(--bg-surface)] px-3 py-2 rounded flex-1 truncate">
            {agent.metadataUri}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(agent.metadataUri)}
            className="p-2 hover:bg-[var(--bg-surface)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            title="Copy URI"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {agent.metadataUri.startsWith("ipfs://") && (
          <a
            href={`https://gateway.pinata.cloud/ipfs/${agent.metadataUri.replace("ipfs://", "")}`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1 text-xs text-accent hover:underline mt-2"
          >
            View on IPFS Gateway <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* On-Chain Identity */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">On-Chain Identity</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[var(--text-muted)] mb-1">Token ID</p>
            <p className="font-mono text-[var(--text-primary)]">#{identity.tokenId}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Owner Address</p>
            <p className="font-mono text-[var(--text-primary)]">{formatAddress(identity.owner)}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Contract Address</p>
            <p className="font-mono text-[var(--text-primary)]">{formatAddress(identity.contractAddress)}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Explorer</p>
            <a
              href={identity.explorerUrl}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1 text-xs text-accent hover:underline font-mono"
            >
              ArcScan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Reputation */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Reputation</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-[var(--text-muted)] mb-1">Score</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
              {agent.reputationScore ?? reputation.lastScore ?? "—"}
              <span className="text-sm text-[var(--text-muted)]">/100</span>
            </p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Events on-chain</p>
            <p className="font-mono text-[var(--text-primary)]">{reputation.eventCount}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Last Tag</p>
            <p className="text-[var(--text-primary)]">{reputation.lastTag ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Validation */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Validation</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-[var(--text-muted)] mb-1">Status</p>
            <p className="text-emerald-400 font-medium">{validation.status}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Response</p>
            <p className="font-mono text-[var(--text-primary)]">{validation.response}/100</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Tag</p>
            <p className="text-[var(--text-primary)]">{validation.tag ?? "—"}</p>
          </div>
        </div>
        {validation.validatorAddress && (
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-sm">
            <p className="text-[var(--text-muted)] mb-1">Validator</p>
            <p className="font-mono text-[var(--text-primary)]">
              {formatAddress(validation.validatorAddress)}
            </p>
          </div>
        )}
      </div>

      {/* Agent Network */}
      <AgentNetworkCard />

    </div>
  );
}

function AgentNetworkCard() {
  const [expanded, setExpanded] = useState(false);

  const agents = [
    { agentId: "24471", name: "arc-agent.example.com", capabilities: [], owner: "0x58E688E56d048D4C7BA41d66bBC50A64C12B0B66", paid: true },
    { agentId: "24472", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24473", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24474", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24475", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24476", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24477", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24478", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24479", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24480", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24481", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24482", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24483", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
    { agentId: "24484", name: "arc-agent.example.com", capabilities: [], owner: "0x...", paid: false },
  ];

  const visible = expanded ? agents : agents.slice(0, 5);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Agent Network</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{agents.length} agents registered on Arc Testnet</p>
        </div>
        {agents.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {expanded ? <>Show less <ChevronUp className="w-3 h-3" /></> : <>Show all {agents.length} <ChevronDown className="w-3 h-3" /></>}
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-800/50 text-sm">
        {visible.map((a) => (
          <div key={a.agentId} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <a
                href={`https://testnet.arcscan.app/token/0x8004A818BFB912233c491871b3d84c89A494BD9e?a=${a.agentId}`}
                target="_blank"
                rel="noopener"
                className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
              >
                #{a.agentId}
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[var(--text-muted)] text-xs max-w-[120px] truncate">{a.name.slice(0, 30)}</span>
            </div>
            <div className="flex items-center gap-3">
              {a.capabilities.length > 0 ? (
                <span className="text-xs text-[var(--text-secondary)]">{a.capabilities.join(", ")}</span>
              ) : (
                <span className="text-xs text-slate-600">—</span>
              )}
              <span className="font-mono text-xs text-[var(--text-muted)]">{formatAddress(a.owner)}</span>
              {a.paid && (
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-400/10 text-emerald-400 font-medium">
                  ✅ Paid
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Agent payment highlight */}
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)] mb-2">
          ✨ Agent-to-agent payment demonstrated
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-accent font-mono">Agent #24471</span>
          <span className="text-slate-600">•</span>
          <span className="text-accent font-mono">0.001 USDC</span>
          <span className="text-slate-600">→</span>
          <span className="font-mono text-[var(--text-muted)]">{formatAddress("0x58E688E56d048D4C7BA41d66bBC50A64C12B0B66")}</span>
        </div>
        <a
          href="https://testnet.arcscan.app/tx/0xe2a8f503ec44ea5e920ade4720d14409d28e3709d5736bf7e288ccfbd8b4e5fb"
          target="_blank"
          rel="noopener"
          className="font-mono text-xs text-accent hover:underline flex items-center gap-1 mt-1"
        >
          {truncateTx("0xe2a8f503ec44ea5e920ade4720d14409d28e3709d5736bf7e288ccfbd8b4e5fb")}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
