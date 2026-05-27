# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
See [workflow/taste.md](workflow/taste.md)
# code-style
- Add a header comment to every source file describing its purpose. Confidence: 0.70

# web3
- Generate ERC-8004 metadata URI at runtime by base64-encoding the agent metadata JSON file instead of using hardcoded IPFS fallbacks. Confidence: 0.75
- Circle API returns USDC token balances in display format (e.g., "20" = 20 USDC). Do not divide by decimals — use the amount as-is. Prefer the ERC-20 (non-native) token entry over native USDC when querying balances. Confidence: 0.85
- Use BigInt-based integer arithmetic for USDC amount comparisons (e.g., a toUsdcMicro() helper that splits on "." and multiplies by 1_000_000). Never use parseFloat for balance threshold checks — IEEE 754 floating point produces false negatives. Confidence: 0.80
- Wrap Circle SDK calls (createContractExecutionTransaction, createTransaction) in project-level helper functions (executeContractCall, executeTransferCall) to isolate type assertions. Confidence: 0.70

# typescript
- Use dotenv.config({ override: true }) for env loading instead of relying on tsx --env-file flag, which is unreliable across tsx/Node versions. Confidence: 0.60
- For multi-provider/model registries: each model config must include an apiKeyEnv field, filter the registry at startup by checking process.env for each key, exclude models whose key is missing/empty, log a warning, and if only one model remains skip strategy selection entirely. Confidence: 0.70

# vercel
- Detect production vs local environment via NEXT_PUBLIC_IS_LOCAL env var (set in .env.local, absent in Vercel). For execSync-dependent API routes that can't run serverless, return HTTP 501 with a descriptive error and degrade the UI gracefully (read-only mode, hide non-functional controls). Confidence: 0.70
- Prefer Vercel MCP tools for deployment, but when MCP returns 403 (common on headless/VPS), fall back to CLI with VERCEL_TOKEN env var (not --token flag) and npx vercel --prod --yes. Confidence: 0.55

# code-style
- Place state/data JSON files (e.g., budget-state.json) at the project root, not inside src/, and add them to .gitignore to prevent accidental commits. Confidence: 0.70

# idioms
- When orchestrating parallel streaming + async work, do not use Promise.all with infinite-loop functions — it deadlocks. Instead use sequential pattern: start stream (don't await), await main work, abort controller, then await stream result. Confidence: 0.55

# ui
- Avoid displaying the same information in multiple places on the dashboard. Before proposing a new card/widget, verify the data isn't already shown elsewhere (e.g., hero section, sidebar, other pages). Confidence: 0.70
- For dark/light theming, use CSS variables (--bg-primary, --bg-card, --border, --text-primary, etc.) in globals.css rather than refactoring components with Tailwind dark: prefixes. The toggle should just add/remove the "dark" class on <html>. Confidence: 0.70

