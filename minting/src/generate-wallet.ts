/**
 * generate-wallet.ts
 *
 * Generates a new Cardano wallet (mnemonic + derived address).
 * Run once before minting:
 *   npm run generate-wallet
 *
 * OUTPUT: Prints the mnemonic phrase and wallet address.
 * ⚠️  SAVE THE MNEMONIC SECURELY — it is your only backup.
 *     Add it to your .env file as WALLET_MNEMONIC.
 *     Never share or commit it.
 */

import { MeshWallet } from "@meshsdk/core";

async function main() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  FreshCoin — Wallet Generator");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const mnemonic = MeshWallet.brew() as string[];

  console.log("✅  New wallet generated!\n");
  console.log("🔑  MNEMONIC (24 words) — SAVE THIS SECURELY:");
  console.log("─────────────────────────────────────────────────");
  console.log(mnemonic.join(" "));
  console.log("─────────────────────────────────────────────────\n");

  // Derive the first address (index 0) for preprod network
  const wallet = new MeshWallet({
    networkId: 0, // 0 = testnet/preprod, 1 = mainnet
    fetcher: undefined as any,
    key: {
      type: "mnemonic",
      words: mnemonic,
    },
  });

  const [address] = await wallet.getUsedAddresses();
  const unusedAddresses = await wallet.getUnusedAddresses();
  const walletAddress = address ?? unusedAddresses[0];

  console.log("📬  Wallet address (preprod testnet):");
  console.log("─────────────────────────────────────────────────");
  console.log(walletAddress);
  console.log("─────────────────────────────────────────────────\n");

  console.log("📋  Next steps:");
  console.log("  1. Copy the mnemonic above into your .env file:");
  console.log('     WALLET_MNEMONIC="word1 word2 ... word24"');
  console.log("  2. Fund your preprod wallet with free test ADA:");
  console.log("     https://docs.cardano.org/cardano-testnets/tools/faucet");
  console.log("     (Paste your address above into the faucet — get 10,000 tADA)");
  console.log("  3. Run `npm run check-balance` to confirm funds arrived");
  console.log("  4. Run `npm run mint` to mint your FRESH tokens\n");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
