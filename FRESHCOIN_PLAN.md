# FreshCoin (FRESH) — Token Plan for FreshMinds IT Consultancy

**Company:** FreshMinds (FreshMinds.nl)
**Blockchain:** Cardano (Cardano Native Token)
**Ticker:** FRESH
**Token Standard:** Cardano Native Token (no smart contract required for basic issuance)
**Date:** March 2026

---

## 1. Overview

FreshCoin (FRESH) is a utility token issued on the Cardano blockchain by FreshMinds, a Dutch IT consultancy firm. It is designed to align the interests of clients, employees, and partners by creating a shared value ecosystem around FreshMinds' services.

Cardano is chosen for its:
- Low transaction fees (< €0.20 per tx)
- Energy efficiency (Proof-of-Stake)
- Native token support (no EVM/smart contract risk for issuance)
- Strong regulatory-friendliness in the EU/Netherlands context
- Ability to attach metadata to transactions (useful for credentials, milestones)

---

## 2. Token Parameters

| Parameter          | Value                                        |
|--------------------|----------------------------------------------|
| Token Name         | FreshCoin                                    |
| Ticker             | FRESH                                        |
| Total Supply       | 100,000,000 FRESH (100 million)              |
| Decimals           | 6                                            |
| Blockchain         | Cardano Mainnet                              |
| Standard           | Cardano Native Token (CIP-25 metadata)       |
| Policy             | Time-locked minting policy (mint window)     |
| Initial Mint       | 100,000,000 FRESH (one-time mint)            |

### Supply Allocation

| Bucket                        | % of Supply | Amount (FRESH)  | Purpose                                              |
|-------------------------------|-------------|-----------------|------------------------------------------------------|
| Client Rewards Pool           | 30%         | 30,000,000      | Loyalty rewards for clients                          |
| Employee & Partner Incentives | 25%         | 25,000,000      | Staff bonuses, partner referrals                     |
| Treasury / Operations         | 20%         | 20,000,000      | Company-controlled reserve for future programs       |
| Ecosystem & Grants            | 15%         | 15,000,000      | Open source contributions, community programs        |
| Team & Founders               | 10%         | 10,000,000      | Founding team, vesting over 3 years                  |

---

## 3. Use Cases

### 3.1 Client Loyalty & Rewards Program
Clients earn FRESH tokens for:
- Signing or renewing a service contract (e.g., 500 FRESH per €1,000 contracted)
- Providing referrals that convert to new clients (bonus FRESH reward)
- Paying invoices early (e.g., 2% of invoice value in FRESH)
- Participating in case studies or testimonials

Earned FRESH can be redeemed for:
- Discounts on future invoices (e.g., 1,000 FRESH = €10 off)
- Priority support or faster SLA response
- Access to exclusive FreshMinds workshops or training sessions
- Branded merchandise or FreshMinds swag

### 3.2 Employee Incentives & Recognition
FRESH serves as an internal recognition and bonus system:
- Project delivery bonuses paid partly in FRESH
- Peer-to-peer recognition ("tip" a colleague FRESH for great work)
- Performance review bonuses denominated in FRESH
- Long-tenure milestone rewards (1yr, 3yr, 5yr service rewards)

Employees can use FRESH for:
- Redeemable company benefits (extra leave, training budget top-up)
- Participation in profit-sharing or governance votes

### 3.3 Partner & Referral Network
FreshMinds' ecosystem of freelancers, subcontractors, and tech partners earn FRESH by:
- Successfully referring new clients (tiered reward: 1,000–5,000 FRESH per deal size)
- Completing joint projects on time and within budget
- Co-authoring thought leadership content (blog posts, whitepapers)

### 3.4 Governance & Company Decisions
Token holders (employees, long-term clients, partners) can participate in governance:
- Vote on company policies (e.g., open source strategy, charity initiatives)
- Propose and vote on new service offerings
- Vote on ecosystem grant allocations

Each FRESH = 1 vote. Voting is conducted via on-chain transaction metadata or a lightweight off-chain voting tool (e.g., Snapshot-style, adapted for Cardano).

### 3.5 On-Chain Credentials & Certifications
Using Cardano transaction metadata (CIP-25/CIP-68):
- Issue verifiable on-chain certificates to employees who complete training
- Issue project completion badges to clients (proof of delivery)
- Partner certifications ("FreshMinds Certified Partner") stored on-chain

These credentials are permanently verifiable by third parties without needing FreshMinds as an intermediary.

### 3.6 Knowledge Sharing & Community
FreshMinds operates a knowledge community (internal wiki, blog, meetups):
- Employees earn FRESH for contributing internal documentation
- Blog post authors receive FRESH for published articles
- Hosting or presenting at a FreshMinds meetup earns FRESH
- Open source contributors receive FRESH for merged pull requests to FreshMinds repos

### 3.7 Service Payment (Optional Future Phase)
In a later phase, clients may optionally pay a portion of invoices in FRESH at a discount:
- e.g., Pay 10% of invoice in FRESH → receive 5% additional discount
- This creates organic demand for FRESH and reduces payment friction for crypto-native clients

---

## 4. Technical Architecture

### 4.1 Token Issuance
- Use `cardano-cli` or Lucid/Mesh SDK to create a **time-locked native token policy**
- Minting policy locks after initial mint (prevents future inflation)
- Policy script uses a `before` slot lock — no new FRESH can be minted after the mint window closes
- Metadata registered via CIP-25 on-chain

### 4.2 Wallet Infrastructure
- Company treasury wallet: hardware wallet (Ledger) with multi-sig (2-of-3 signatories)
- Distribution wallets: hot wallets for automated reward distribution
- Employees/clients use Nami, Eternl, or Lace wallets to receive and hold FRESH

### 4.3 Distribution Automation
- A lightweight Node.js / TypeScript backend using the **Mesh SDK** (`@meshsdk/core`)
  to automate reward distributions triggered by business events
- Integration with FreshMinds' CRM/invoicing system (e.g., webhook on invoice paid →
  trigger FRESH reward transaction)
- Blockfrost API for Cardano blockchain queries

### 4.4 Metadata & Credentials
- CIP-25 for token metadata (name, ticker, logo, description)
- CIP-68 for NFT-based credential badges
- Transaction metadata label `674` for human-readable memos on reward transactions

---

## 5. Tokenomics & Value Preservation

To preserve token value and prevent dilution:
- **Fixed supply** — no additional minting after policy locks
- **Burn mechanism** — optionally burn FRESH when redeemed for discounts (reduces supply over time)
- **Vesting schedule** — team allocation unlocks over 36 months (1/36 per month)
- **Transparency** — all treasury wallet addresses published publicly; movements visible on-chain

### Simple Token Value Model
```
FRESH redemption rate: 1,000 FRESH = €10 discount
Implied token floor value: €0.01 per FRESH
```
This rate can be reviewed annually by the FreshMinds board and adjusted via governance vote.

---

## 6. Legal & Compliance (Netherlands / EU)

- FRESH is a **utility token**, not a security or investment product
- No promise of profit, dividends, or financial return
- Subject to MiCA (Markets in Crypto-Assets) regulation from 2024 onwards —
  FreshMinds should consult a Dutch crypto-law specialist before public distribution
- Internal employee distribution may be treated as **benefit in kind** for tax purposes;
  consult a Dutch tax advisor (belastingdienst.nl rules apply)
- AML/KYC not required for internal/loyalty programs; required if tokens are traded
  on a public exchange

---

## 7. Roadmap

### Phase 1 — Foundation (Month 1–2)
- [ ] Finalize token parameters and legal review
- [ ] Create Cardano wallet infrastructure (treasury + distribution)
- [ ] Mint FRESH tokens with time-locked policy
- [ ] Register CIP-25 metadata on-chain
- [ ] Internal launch: employee reward pilot

### Phase 2 — Client Program (Month 3–4)
- [ ] Launch client loyalty program
- [ ] Integrate with invoicing system for automatic rewards
- [ ] Build simple client portal to view FRESH balance and redeem
- [ ] Partner referral program launch

### Phase 3 — Credentials & Governance (Month 5–6)
- [ ] Issue first on-chain certifications/badges (CIP-68 NFTs)
- [ ] Launch governance voting for internal proposals
- [ ] Knowledge sharing rewards program goes live

### Phase 4 — Ecosystem Expansion (Month 7–12)
- [ ] Ecosystem grants program open for applications
- [ ] Explore DEX listing on Cardano (Minswap, SundaeSwap) for price discovery
- [ ] Optional: service payment in FRESH pilot with select clients
- [ ] Annual tokenomics review and governance vote on parameters

---

## 8. Key Tools & Technologies

| Tool / Service     | Purpose                                        |
|--------------------|------------------------------------------------|
| `cardano-cli`      | Token minting, policy scripts                  |
| Mesh SDK           | TypeScript SDK for Cardano dApp development    |
| Blockfrost API     | Cardano blockchain data queries                |
| Eternl / Lace      | Employee & client wallets                      |
| Ledger Hardware    | Secure treasury wallet                         |
| IPFS               | Store token logo for CIP-25 metadata           |
| Node.js / TS       | Reward distribution backend                    |

---

## 9. Summary

FreshCoin (FRESH) transforms FreshMinds from a traditional IT consultancy into a token-powered ecosystem where clients, employees, and partners all share in the company's success. By building on Cardano, FreshMinds benefits from low fees, regulatory alignment in the EU, and a robust, proven blockchain infrastructure.

The token creates tangible utility without speculative intent — it is a loyalty and coordination mechanism that makes FreshMinds' relationships stickier, more rewarding, and more transparent.

---

*Document version: 1.0 | Created: March 2026 | Author: FreshMinds / Claude Code*
