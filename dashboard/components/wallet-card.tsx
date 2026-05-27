"use client";

import { formatAddress, formatUsdc, copyToClipboard } from "@/lib/utils";
import { Copy, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface WalletCardProps {
  label: string;
  address: string;
  balance: string;
  showQr: boolean;
}

export function WalletCard({ label, address, balance, showQr }: WalletCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">{label}</h2>
      <div className="flex items-center gap-2 text-sm mb-2">
        <span className="font-mono text-[var(--text-primary)]" title={address}>
          {formatAddress(address)}
        </span>
        <button
          onClick={() => copyToClipboard(address)}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          title="Copy address"
        >
          <Copy className="w-3 h-3" />
        </button>
        <a
          href={`https://testnet.arcscan.app/address/${address}`}
          target="_blank"
          rel="noopener"
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          title="View on ArcScan"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
        {formatUsdc(balance)} <span className="text-sm text-[var(--text-secondary)]">USDC</span>
      </p>
      {Number(balance) < 0.05 && (
        <p className="text-xs text-amber-400 mt-2">⚠ Low balance — top up recommended</p>
      )}
      {showQr && (
        <div className="mt-4 p-3 bg-white rounded-lg inline-block">
          <QRCodeSVG value={address} size={120} level="M" />
        </div>
      )}
    </div>
  );
}
