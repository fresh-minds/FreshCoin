/**
 * check-balance.ts
 *
 * Checks the ADA and FRESH token balance of the minting wallet.
 * Run: npm run check-balance
 */

import { BlockfrostProvider, MeshWallet } from "@meshsdk/core";
import { getConfig, TOKEN_TICKER } from "./config";

async function main() {
  const { network, blockfrostApiKey, mnemonic } = getConfig();

  if (!mnemonic) {
    console.error(
      "❌  WALLET_MNEMONIC not set in .env\n" +
        "   Run `npm run generate-wallet` first."
    );
    process.exit(1);
  }

  const provider = new BlockfrostProvider(blockfrostApiKey);

  const wallet = new MeshWallet({
    networkId: network === "mainnet" ? 1 : 0,
    fetcher: provider,
    key: {
      type: "mnemonic",
      words: mnemonic.split(" "),
    },
  });

  const [address] = await wallet.getUsedAddresses();
  const unusedAddresses = await wallet.getUnusedAddresses();
  const walletAddress = address ?? unusedAddresses[0];

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  FreshCoin — Wallet Balance");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`  Network  : ${network}`);
  console.log(`  Address  : ${walletAddress}\n`);

  const balance = await wallet.getBalance();

  const lovelace = balance.find((b) => b.unit === "lovelace");
  const ada = lovelace ? (Number(lovelace.quantity) / 1_000_000).toFixed(6) : "0";
  console.log(`  ADA      : ${ada} ADA`);

  const freshTokens = balance.filter(
    (b) =>
      b.unit !== "lovelace" &&
      b.assetName?.toUpperCase().includes(TOKEN_TICKER)
  );

  if (freshTokens.length > 0) {
    freshTokens.forEach((t) => {
      console.log(`  FRESH    : ${t.quantity} (policy: ${t.unit.slice(0, 56)})`);
    });
  } else {
    console.log(`  FRESH    : 0 (not minted yet)`);
  }

  console.log();

  if (!lovelace || Number(lovelace.quantity) < 3_000_000) {
    console.log(
      "⚠️   Balance is below 3 ADA. Please fund your wallet before minting.\n" +
        "    Faucet: https://docs.cardano.org/cardano-testnets/tools/faucet\n" +
        `    Address: ${walletAddress}`
    );
  } else {
    console.log("✅  Wallet has sufficient ADA for minting.");
    console.log("    Run `npm run mint` to mint your FRESH tokens.\n");
  }
}

main().catch((err) => {
  console.error("Error:", err.message ?? err);
  process.exit(1);
});
