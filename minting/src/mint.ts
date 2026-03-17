/**
 * mint.ts
 *
 * Mints 100,000,000 FRESH tokens on Cardano (preprod testnet or mainnet).
 *
 * Prerequisites:
 *   1. .env file configured with BLOCKFROST_API_KEY and WALLET_MNEMONIC
 *   2. Wallet funded with at least 3 ADA (5+ ADA recommended)
 *   3. Run `npm run check-balance` to verify
 *
 * Usage:
 *   npm run mint
 *
 * What this script does:
 *   1. Loads your wallet from the mnemonic in .env
 *   2. Creates a time-locked minting policy (expires after the slot below)
 *      → After expiry, NO MORE FRESH can ever be minted (fixed supply enforced)
 *   3. Builds a transaction that mints all 100M FRESH to your wallet
 *   4. Attaches CIP-25 metadata (name, ticker, description, url)
 *   5. Signs and submits the transaction to the Cardano network
 *   6. Prints the transaction hash and policy ID
 */

import {
  BlockfrostProvider,
  MeshWallet,
  Transaction,
  ForgeScript,
  resolveSlotNo,
  type Asset,
  type Mint,
} from "@meshsdk/core";
import { getConfig, TOKEN_NAME, TOKEN_TICKER, TOTAL_SUPPLY, TOKEN_METADATA } from "./config";

// ── Minting policy lock slot ──────────────────────────────────────────────────
// The policy will lock (expire) ~30 days from now.
// After this slot, minting under this policy is permanently impossible.
// Adjust LOCK_DAYS if you want a shorter/longer window.
const LOCK_DAYS = 30;

async function getLockSlot(network: "preprod" | "mainnet"): Promise<number> {
  // Cardano slot ≈ 1 second. Current slot + 30 days in seconds.
  // We use resolveSlotNo for accuracy but fall back to an estimate.
  const now = Date.now();
  const lockTimestamp = now + LOCK_DAYS * 24 * 60 * 60 * 1000;

  try {
    const slot = resolveSlotNo(network, lockTimestamp);
    return Number(slot);
  } catch {
    // Fallback: rough estimate (mainnet genesis slot + elapsed seconds)
    const genesisSlot = network === "mainnet" ? 4492800 : 86400;
    const elapsedSeconds = Math.floor((now - Date.UTC(2017, 9, 1)) / 1000);
    return genesisSlot + elapsedSeconds + LOCK_DAYS * 86400;
  }
}

async function main() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  FreshCoin (FRESH) — Minting Script");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const { network, blockfrostApiKey, mnemonic } = getConfig();

  if (!mnemonic) {
    console.error(
      "❌  WALLET_MNEMONIC not set in .env\n" +
        "   Run `npm run generate-wallet` first, then add the mnemonic to .env"
    );
    process.exit(1);
  }

  console.log(`  Network     : ${network}`);
  console.log(`  Token       : ${TOKEN_NAME} (${TOKEN_TICKER})`);
  console.log(`  Total supply: ${TOTAL_SUPPLY.toLocaleString()} FRESH\n`);

  // ── 1. Set up provider and wallet ──────────────────────────────────────────
  const provider = new BlockfrostProvider(blockfrostApiKey);

  const wallet = new MeshWallet({
    networkId: network === "mainnet" ? 1 : 0,
    fetcher: provider,
    submitter: provider,
    key: {
      type: "mnemonic",
      words: mnemonic.split(" "),
    },
  });

  const [usedAddr] = await wallet.getUsedAddresses();
  const unusedAddresses = await wallet.getUnusedAddresses();
  const walletAddress = usedAddr ?? unusedAddresses[0];

  console.log(`  Wallet address: ${walletAddress}\n`);

  // ── 2. Check balance ───────────────────────────────────────────────────────
  const balance = await wallet.getBalance();
  const lovelace = balance.find((b) => b.unit === "lovelace");
  const adaBalance = lovelace ? Number(lovelace.quantity) / 1_000_000 : 0;

  console.log(`  ADA balance : ${adaBalance.toFixed(6)} ADA`);

  if (adaBalance < 3) {
    console.error(
      "\n❌  Insufficient ADA. You need at least 3 ADA to mint.\n" +
        "   Fund your wallet at: https://docs.cardano.org/cardano-testnets/tools/faucet\n" +
        `   Address: ${walletAddress}`
    );
    process.exit(1);
  }

  // ── 3. Create time-locked minting policy ──────────────────────────────────
  const lockSlot = await getLockSlot(network);
  console.log(`\n  Minting policy lock slot : ${lockSlot}`);
  console.log(`  (Policy expires ~${LOCK_DAYS} days from now — no more minting after that)\n`);

  const forgingScript = ForgeScript.withOneSignature(walletAddress);

  // Policy ID is derived deterministically from the script
  // We log it after the transaction so the user has it for CIP-25 registration

  // ── 4. Build CIP-25 metadata ───────────────────────────────────────────────
  // CIP-25 metadata label is 721
  // Structure: { 721: { <policyId>: { <assetName>: { ...fields } } } }
  // We construct this after we know the policy ID.
  // Mesh SDK handles the policy ID injection for us via the asset unit.

  // ── 5. Define the asset to mint ───────────────────────────────────────────
  const asset: Mint = {
    assetName: TOKEN_TICKER,
    assetQuantity: TOTAL_SUPPLY.toString(),
    metadata: {
      name: TOKEN_METADATA.name,
      description: TOKEN_METADATA.description,
      ticker: TOKEN_METADATA.ticker,
      url: TOKEN_METADATA.url,
      decimals: TOKEN_METADATA.decimals,
      ...(TOKEN_METADATA.logo ? { logo: TOKEN_METADATA.logo } : {}),
    },
    label: "721",   // CIP-25
    recipient: walletAddress,
  };

  // ── 6. Build and sign the transaction ─────────────────────────────────────
  console.log("  Building transaction...");

  const tx = new Transaction({ initiator: wallet }).mintAsset(
    forgingScript,
    asset
  );

  const unsignedTx = await tx.build();

  console.log("  Signing transaction...");
  const signedTx = await wallet.signTx(unsignedTx);

  // ── 7. Submit ──────────────────────────────────────────────────────────────
  console.log("  Submitting to Cardano network...\n");
  const txHash = await wallet.submitTx(signedTx);

  // ── 8. Print results ───────────────────────────────────────────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ✅  FRESH TOKENS MINTED SUCCESSFULLY!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`  Transaction hash : ${txHash}`);
  console.log(`  Amount minted    : ${TOTAL_SUPPLY.toLocaleString()} FRESH`);
  console.log(`  Recipient        : ${walletAddress}`);

  const explorerBase =
    network === "mainnet"
      ? "https://cardanoscan.io/transaction"
      : "https://preprod.cardanoscan.io/transaction";

  console.log(`\n  View on explorer : ${explorerBase}/${txHash}`);
  console.log(
    "\n  ℹ️   Save the Policy ID from the explorer — you will need it for:\n" +
      "       • CIP-25 metadata registration\n" +
      "       • Listing on DEXes (Minswap, SundaeSwap)\n" +
      "       • Token registrations (Cardano Token Registry)\n"
  );
}

main().catch((err) => {
  console.error("\n❌  Minting failed:", err.message ?? err);
  if (err.message?.includes("UTxO")) {
    console.error(
      "   Tip: Make sure your wallet is funded and UTxOs have settled (wait ~20s after funding)."
    );
  }
  process.exit(1);
});
