# Invariant Wallet (v1) — Public Roadmap

## Goal

Ship a lightweight, multi-chain wallet surface focused on Invariant user flows:
**Balances → Send/Receive → Confirmations → History**, plus protocol-scoped activity.

---

## v1 Milestone 1 — Core Wallet Actions

- [x] Connect wallet
- [x] Network switcher (multi-chain)
- [x] Token balances table
- [x] Send token drawer (native + ERC20)
- [x] Receive sheet (address + QR)
- [x] USD estimate for send amount
- [x] “Max” button + balance validation

---

## v1 Milestone 2 — Transaction Lifecycle (Now)

### 2.1 Pending → Confirmed UX

- [ ] Add `TxSuccessSheet` for:
  - Pending state (confirmations)
  - Success state (receipt)
  - Failed state (reason if available)
- [ ] Repeat send CTA
- [ ] Explorer deep link + copy hash

### 2.2 Transaction History Table

- [ ] Tx History table on Wallet page
- [ ] Filters: All / Sent / Received / Pending
- [ ] Status badges + relative timestamps
- [ ] Row actions: view on explorer, copy hash, copy counterparty

### 2.3 Activity Feed (Invariant-scoped)

- [ ] Show protocol-only actions:
  - Strategy deploys
  - Hook executions
  - Rebalances
  - Signed intents
- [ ] Keep generic wallet spam out of the feed

---

## v1 Milestone 3 — Trust & Safety

- [ ] Wrong network guardrails
- [ ] Address validation (0x checksum / length)
- [ ] “Insufficient balance” & “gas too low” friendly errors
- [ ] Clear gas/fee estimate before sending

---

## v1 Milestone 4 — Quality & Polish

- [ ] Skeleton loaders (balances + history)
- [ ] Empty states (no txs / no tokens)
- [ ] Persist recent txs locally (per wallet + chain)
- [ ] Better receipt layout (share/copy)

---

## Nice-to-haves (Post v1)

- [ ] Address book (saved recipients)
- [ ] Approval manager (view & revoke ERC20 allowances)
- [ ] Watch-only mode (paste any address)
- [ ] Export receipt (image/PDF)
