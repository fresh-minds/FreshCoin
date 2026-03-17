# FreshCoin (FRESH) — Minting Guide

This guide walks you through minting **100,000,000 FRESH** tokens on the
**Cardano Preprod Testnet** (and later mainnet).

---

## Prerequisites

- Node.js ≥ 18 installed (`node --version`)
- A free Blockfrost account (see Step 1)

---

## Step 1 — Get a Free Blockfrost API Key

1. Go to **[https://blockfrost.io](https://blockfrost.io)** and sign up (free)
2. Click **"Add new project"**
3. Choose network: **Cardano Preprod** (for testnet)
4. Copy the **Project ID** — it starts with `preprod...`

You'll need this in Step 3.

---

## Step 2 — Install Dependencies

```bash
cd minting
npm install
```

---

## Step 3 — Configure Environment

```bash
cp .env.example .env
```

Open `.env` and set your Blockfrost key:

```env
BLOCKFROST_API_KEY=preprodYourKeyHere
NETWORK=preprod
```

Leave `WALLET_MNEMONIC` empty for now — Step 4 generates it.

---

## Step 4 — Generate Your Minting Wallet

```bash
npm run generate-wallet
```

This outputs:
- A **24-word mnemonic** — your wallet's private key backup
- Your **wallet address** on preprod

**⚠️ Save the mnemonic securely.** It is the only way to recover your wallet.
Never share it or commit it to git.

Add the mnemonic to your `.env`:

```env
WALLET_MNEMONIC="word1 word2 word3 ... word24"
```

---

## Step 5 — Fund Your Wallet with Test ADA

1. Go to the **Cardano Testnet Faucet**:
   **[https://docs.cardano.org/cardano-testnets/tools/faucet](https://docs.cardano.org/cardano-testnets/tools/faucet)**
2. Select **"Preprod"** environment
3. Paste your wallet address (from Step 4)
4. Request ADA (you'll receive 10,000 tADA)
5. Wait ~60 seconds for confirmation

Verify your balance:

```bash
npm run check-balance
```

You should see `ADA: 10000.000000 ADA` (or similar).

---

## Step 6 — Mint Your FRESH Tokens

```bash
npm run mint
```

The script will:
1. Create a **time-locked minting policy** (locks after 30 days → fixed supply forever)
2. Mint **100,000,000 FRESH** to your wallet
3. Attach **CIP-25 metadata** (name, ticker, description, URL)
4. Submit the transaction to Cardano

Output example:
```
✅  FRESH TOKENS MINTED SUCCESSFULLY!

  Transaction hash : abc123...
  Amount minted    : 100,000,000 FRESH
  Recipient        : addr_test1...

  View on explorer : https://preprod.cardanoscan.io/transaction/abc123...
```

---

## Step 7 — Verify on the Explorer

Visit the link printed by the mint script. On the explorer you can see:
- The **Policy ID** (save this — you'll need it for registration)
- The 100M FRESH in your wallet
- The CIP-25 metadata attached to the token

---

## Step 8 — After Testnet, Mint on Mainnet

1. Create a new Blockfrost project with **Cardano Mainnet** selected
2. Update `.env`:
   ```env
   BLOCKFROST_API_KEY=mainnetYourKeyHere
   NETWORK=mainnet
   ```
3. Fund your wallet with **real ADA** (minimum ~3 ADA, recommend 5+)
4. Run `npm run mint` again

> **Important:** On mainnet, use a **hardware wallet** (Ledger) for the treasury.
> The minting wallet is only needed once for the mint transaction.
> After minting, move all FRESH to your secure treasury wallet.

---

## Token Registry (Optional but Recommended)

After minting on mainnet, register your token in the
**Cardano Token Registry** so wallets display the correct name, ticker, and logo:

- **[https://github.com/cardano-foundation/cardano-token-registry](https://github.com/cardano-foundation/cardano-token-registry)**
- Submit a PR with your token's metadata JSON (instructions in their README)

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/config.ts` | Token parameters (name, supply, metadata) |
| `src/generate-wallet.ts` | Generate a new Cardano wallet |
| `src/check-balance.ts` | Check ADA + FRESH balance |
| `src/mint.ts` | Mint the FRESH tokens |
| `.env.example` | Environment variable template |
| `.gitignore` | Prevents `.env` and keys from being committed |

---

## Security Checklist

- [ ] `.env` is in `.gitignore` — never committed ✓
- [ ] Mnemonic stored offline (password manager or written down in a safe place)
- [ ] After mainnet mint: treasury wallet is a hardware wallet (Ledger)
- [ ] Minting policy locked (time-lock) so supply cannot be inflated
