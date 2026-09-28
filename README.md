# ⚡ Tether WDK RGB Wallet Studio (`@utexo/wdk-wallet-rgb`)

> **Official implementation based on the Tether WDK Get-Started Guide (`https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/guides/get-started/`).**
> Client-side non-custodial Bitcoin Taproot (BIP-86) & RGB Layer-2 Smart Asset wallet with single-use seals, blinded UTXO invoices, real scannable QR generation, and AluVM client-side validation.

---

## 🌟 Tether WDK Architecture & Features

1. **WDK `WalletManagerRgb` Core**:
   - Initialized with `network` (`testnet`, `mainnet`, `regtest`), `indexerUrl` (Electrs server), `transportEndpoint` (Storm/RGB proxy), and `dataDir`.
   - Derives BIP-86 Taproot accounts (`m/86'/1'/0'/0/0` on testnet, `m/86'/0'/0'/0/0` on mainnet).

2. **UTXO Orchestration & Single-Use Seals**:
   - Unspent Transaction Outputs (`txid:vout`) tracked on Bitcoin Layer-1.
   - Separation of pure uncolored BTC UTXOs from colored single-use seals containing RGB smart contract tokens (Tether USDT-RGB, BUDDY, NIA tokens).

3. **Blinded & Witness Receive Invoices**:
   - **Blinded UTXO Invoice** (`rgb:...@utxob:<blinded_seal>`): Mathematically masks your Bitcoin address for complete recipient privacy.
   - **Witness Taproot Invoice**: Direct on-chain receive.
   - Configurable asset, amount, expiry, and transport proxy.
   - Generates live, scannable QR codes with instant PNG download.

4. **WDK 3-Stage Transfer Pipeline (`sendBegin` &rarr; `signPsbt` &rarr; `sendEnd`)**:
   - `sendBegin`: Selects unspent seal and builds off-chain transition.
   - `signPsbt`: Signs the Bitcoin anchor transaction input using Schnorr Taproot key.
   - `sendEnd`: Finalizes the consignment package (`.rgb`) and broadcasts to mempool.

5. **Non-Inflationary Asset (NIA) Issuance**:
   - Creates fixed-supply smart tokens on RGB Layer-2 with customizable ticker, precision (decimals), and genesis seal anchor.

6. **Encrypted Backup & Recovery**:
   - Password-encrypted JSON backup export matching WDK security standards.
   - 12-Word BIP-39 recovery mnemonic chips with Reveal/Hide/Copy.

7. **Testnet Faucet**:
   - Instant airdrop of +25,000 Sats & +500 USDT-RGB to test all wallet features in real time.

---

## 🚀 How to Deploy to GitHub (Aap GitHub par kaise deploy karein)

### Tarika 1: GitHub Pages par Direct 1-File Deploy (Sabse Fast & Aasan)

1. Apne GitHub account par ek new repository banayein (e.g., `tether-wdk-rgb-wallet`).
2. Is repository mein **`utexo_rgb_wallet.html`** file ko upload karein aur uska naam rename karke **`index.html`** rakh dein.
3. Repository ke **Settings** tab &rarr; **Pages** par jayein.
4. **Source** mein:
   - Branch: `main` (ya `master`)
   - Folder: `/ (root)`
   - Click **Save**.
5. Kuch hi seconds mein aapka live wallet tayyar ho jayega:
   `https://<your-username>.github.io/tether-wdk-rgb-wallet/`

---

### Tarika 2: Pura Git Repository Push Karein (GitHub Actions se)

1. Terminal mein ye commands run karein:
   ```bash
   git init
   git add .\
   git commit -m "Deploy Tether WDK RGB Wallet"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Repository ki **Settings** &rarr; **Pages** mein **Source: GitHub Actions** select kar lijiye.
3. Automated build chalega aur aapka full React + Vite application deploy ho jayega!
