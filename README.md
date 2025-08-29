# 🚀 **METSUMI Launchpad**
> Launch tokens on Meteora with a **DBC (Dynamic Bonding Curve)** pool — gated by the native **$METSUMI** token.

<p align="center">
  <img src="public/metsumi-banner.png" alt="METSUMI banner" width="720" />
</p>

<p align="center">
  <a href="https://nodejs.org/"><img alt="node" src="https://img.shields.io/badge/Node-%E2%89%A5%2018-5FA04E?logo=node.js&logoColor=white"></a>
  <a href="https://pnpm.io/"><img alt="pnpm" src="https://img.shields.io/badge/pnpm-%E2%89%A5%209-FFC700?logo=pnpm&logoColor=black"></a>
  <a href="https://nextjs.org/"><img alt="nextjs" src="https://img.shields.io/badge/Next.js-App%20Router-000?logo=next.js"></a>
  <a href="https://www.typescriptlang.org/"><img alt="ts" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white"></a>
  <a href="https://solana.com/"><img alt="solana" src="https://img.shields.io/badge/Solana-Mainnet-9945FF?logo=solana&logoColor=white"></a>
</p>

---

## ✨ What is it?
**METSUMI Launchpad** is a minimal, production-ready frontend that lets builders **create a new token and launch a DBC pool on Meteora** — but with one twist:

> **Creating a token requires paying a flat fee of `500 $METSUMI`**  
> Mint: `J3Mpjvkc31hn58z4uKN6svrPYwpNaewVTkBZCbekjupx`

- After the fee is paid, creators configure and launch a **Dynamic Bonding Curve (DBC) pool** using Meteora.
- Liquidity and trading pairs (e.g. **SOL**, **USDC**) follow Meteora’s standard flows.
- The **treasury** receiving fees is set to:  
  `Xv2hK594scUGZs9V7tqhavkfcUyEBHfUt7RNC29HHyN`

---

## 🧱 Tech Stack
- **Next.js (App Router)** + **React** + **TypeScript**
- Wallets via **@solana/wallet-adapter** (version pinned for stability)
- **Tailwind-like** bespoke CSS (no external CSS framework required)
- RPC via **Helius** or any mainnet provider
- Optional: **Meteora Invent** CLI for power-users and ops

---

## 🗺️ Project Structure
```
metsumipad/
├─ app/
│  ├─ (site)/page.tsx           # Intro page (static styles, theme toggle, links)
│  ├─ launch/page.tsx           # Launch workflow: pay 500 $METSUMI → create token → DBC
│  └─ api/                      # (optional) Server routes for secure ops
├─ components/
│  ├─ ThemeToggle.tsx
│  ├─ WalletConnect.tsx
│  └─ ui/*                      # Small UI pieces (toasts, modals, etc.)
├─ lib/
│  ├─ solana.ts                 # RPC, helpers
│  ├─ metsumi.ts                # Fee logic (500 $METSUMI)
│  └─ meteora.ts                # DBC helpers (client-side)
├─ public/
│  ├─ metsumi.gif               # Logo (used behind headline text)
│  └─ metsumi-banner.png        # README banner (optional)
├─ styles/
│  └─ globals.css               # Static site look & feel (mirrors your HTML version)
├─ .env.local.example           # Safe example of env vars
├─ package.json
└─ README.md
```

> The **intro page** mirrors your static HTML (CRT/scanline, starfield, glow counters, theme switch).  
> The **launch page** includes token metadata form, 500 $METSUMI payment, and DBC pool kick-off UI.

---

## 🔐 Environment Variables
Create `.env.local` based on the example. **Do not commit secrets.**

```
# ——— Network & RPC ———
NEXT_PUBLIC_CLUSTER=mainnet
NEXT_PUBLIC_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY

# ——— METSUMI settings ———
NEXT_PUBLIC_METSUMI_MINT=J3Mpjvkc31hn58z4uKN6svrPYwpNaewVTkBZCbekjupx
NEXT_PUBLIC_METSUMI_DECIMALS=9
NEXT_PUBLIC_LAUNCH_FEE=500

# Treasury address to receive 500 $METSUMI
NEXT_PUBLIC_TREASURY=Xv2hK594scUGZs9V7tqhavkfcUyEBHfUt7RNC29HHyN

# ——— Optional: DBC defaults (can still be changed in UI) ———
NEXT_PUBLIC_DEFAULT_DBC_CURVE=linear
NEXT_PUBLIC_DEFAULT_START_PRICE=0.0001
NEXT_PUBLIC_DEFAULT_SUPPLY=1_000_000_000
```

> **No private keys** are used in the client. Creators sign transactions with their own wallets.

---

## 🧪 Quick Start (Local)

> If Corepack acts up on Windows, use the **Plan B** below.

### Plan A (recommended)
```bash
# Node 18 or 20 recommended
corepack enable
corepack prepare pnpm@9 --activate

pnpm install
pnpm dev
```

### Plan B (Windows fallback)
```bash
npm i -g pnpm@9
pnpm install
pnpm dev
```

Now open **http://localhost:3000**.  
Connect a wallet, open **/launch**, and follow the flow.

---

## ☁️ Deploy on Render
1. **Create > Web Service** → point to your GitHub repo.
2. **Runtime**: Node `20.x`
3. **Build Command**  
   ```bash
   corepack enable && corepack prepare pnpm@9 --activate && pnpm i --frozen-lockfile=false && pnpm build
   ```
   _If Corepack fails on Render, use:_  
   ```bash
   npm i -g pnpm@9 && pnpm i --frozen-lockfile=false && pnpm build
   ```
4. **Start Command**
   ```bash
   pnpm start
   ```
5. **Environment**: Add all vars from `.env.local.example`.

> Render sometimes blocks unknown RPCs. Use a reputable provider (Helius/QuickNode/Triton) and confirm the URL is accessible from Render.

---

## 💸 Launch Flow (How it works)
1. **Connect wallet** on `/launch`.
2. Fill **Token Name**, **Symbol**, **Decimals**, **Logo URL**, and initial DBC parameters.
3. Click **Pay & Mint** → app checks your **$METSUMI balance**.
4. App requests a **transfer of 500 $METSUMI** to the **treasury**.
5. On confirmation:
   - The UI shows:  
     ```
     ✅ Paid · view
     confirmation of SPL mint has been done
     500 $METSUMI charged for this
     you confirm you are in $METSUMI [REDACTED]
     
     $METSUMI is building the NATIVE $METSUMI token for its launchpad;
     come back again at 7.9.2025.
     
     Check our GitHub at the bottom of the page — BIG THINGS are coming!
     ```
   - Continue to **DBC pool creation** using your parameters.
6. After deployment, you can migrate or add liquidity exactly as per Meteora docs.

> **Pad Status**: the intro chips show **“LIFTOFF / 23:30 UTC — Status: READY”** (no moving countdown).

---

## 🔗 Useful Links
- **Meteora Invent Repo**: https://github.com/MeteoraAg/meteora-invent
- **DBC Actions Docs**: https://docs.meteora.ag/developer-guide/invent/actions
- **METSUMI Launchpad (this repo)**: https://github.com/LaunchMETSUMI

---

## 🧰 CLI (Optional, Power Users)
You can mirror UI actions via **Meteora Invent**:
```bash
git clone https://github.com/MeteoraAg/meteora-invent.git
cd meteora-invent
pnpm install

# Configure env
cp studio/.env.example studio/.env

# Start local validator (optional)
pnpm studio start-test-validator

# Generate keypair (devnet or localnet)
pnpm studio generate-keypair --network devnet
# or
pnpm studio generate-keypair --network localnet

# Create DBC config/pool with your JSON
pnpm studio dbc-create-config --config ./studio/config/dbc_config.jsonc
pnpm studio dbc-create-pool   --config ./studio/config/dbc_config.jsonc
```

---

## 🩹 Troubleshooting
- **Hydration mismatch** in Next.js: ensure components with dynamic DOM (icons/toggles) are marked **`'use client'`**, and avoid rendering *different* HTML on server vs client.
- **Wallet adapter version error**: we pin to `@solana/wallet-adapter-react@^0.15.39` to avoid registry issues.
- **403 from RPC**: your provider might block requests from Render; use a paid endpoint and allowlist your Origin if needed.
- **Corepack error on Windows**: use the **Plan B** install flow above.

---

## 📝 License
MIT — see `LICENSE` if present.  
© METSUMI

---

## 🙏 Credits
- **Meteora** for the DBC + tooling.
- **Solana** ecosystem for the infra.
- You, the degens and builders 💜
