import * as dotenv from "dotenv";
dotenv.config();

// ── Token Parameters ─────────────────────────────────────────────────────────
export const TOKEN_NAME = "FreshCoin";
export const TOKEN_TICKER = "FRESH";

/**
 * Total supply: 100,000,000 FRESH
 * Cardano native tokens use integer amounts.
 * With 0 decimals on-chain (Cardano native tokens have no built-in decimals),
 * we mint the full 100_000_000 units. Decimals are purely a display convention
 * stored in the CIP-25 metadata.
 */
export const TOTAL_SUPPLY = 100_000_000;

// CIP-25 metadata for the token
export const TOKEN_METADATA = {
  name: "FreshCoin",
  description:
    "Utility token for FreshMinds IT Consultancy (freshminds.nl). " +
    "Used for client loyalty rewards, employee incentives, partner referrals, " +
    "governance, and on-chain credentials.",
  ticker: "FRESH",
  url: "https://freshminds.nl",
  decimals: 0,
  // Replace with your actual IPFS-hosted logo CID once uploaded
  // e.g. "ipfs://QmYourLogoCIDHere"
  logo: "",
};

// ── Environment ───────────────────────────────────────────────────────────────
function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

export function getConfig() {
  const network = (process.env.NETWORK ?? "preprod") as "preprod" | "mainnet";
  const blockfrostApiKey = requireEnv("BLOCKFROST_API_KEY");
  const mnemonic = process.env.WALLET_MNEMONIC;

  return { network, blockfrostApiKey, mnemonic };
}
