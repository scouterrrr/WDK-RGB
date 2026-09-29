import React from 'react';
import {
  Wallet,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Coins,
  QrCode,
  FileCode2
} from 'lucide-react';

interface UtexoWalletSectionProps {
  onOpenWallet: () => void;
}

export function UtexoWalletSection({ onOpenWallet }: UtexoWalletSectionProps) {
  return (
    <section id="utexo-wallet" className="py-20 bg-[#100e20] border-t-2 border-[#1c1932] relative overflow-hidden">
      
      {/* Background Decorative Radial Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#77E0B0]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#9B87F5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#77E0B0]/10 border border-[#77E0B0]/30 text-[#77E0B0] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Tether WDK &bull; @utexo/wdk-wallet-rgb</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F6F2FF] tracking-tight">
              Tether WDK RGB &amp; UTXO Wallet
            </h2>
            <p className="text-sm sm:text-base text-[#c9c2e0] mt-2 max-w-2xl leading-relaxed">
              Full-featured implementation of Tether&apos;s Wallet Development Kit (WDK) and Utexo&apos;s RGB module. Manage Bitcoin UTXOs, derive Taproot accounts, allocate single-use seals, and issue confidential RGB assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWallet}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#77E0B0] via-[#9B87F5] to-[#FFD469] text-[#141225] text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Launch WDK Wallet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Key Derivation & Taproot */}
          <div className="p-6 rounded-2xl bg-[#141225] border-2 border-[#231e3d] hover:border-[#77E0B0]/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#77E0B0]/10 border border-[#77E0B0]/30 flex items-center justify-center text-[#77E0B0] mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F6F2FF] mb-2 tracking-tight">
                BIP-86 Taproot
              </h3>
              <p className="text-xs text-[#c9c2e0] leading-relaxed">
                Derives Bitcoin Taproot accounts (<code>tb1p...</code> / <code>bc1p...</code>) from standard BIP-39 12-word seed phrases via WDK core.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#231e3d] font-mono text-[11px] text-[#77E0B0]">
              Derivation: m/86&apos;/1&apos;/0&apos;/0/0
            </div>
          </div>

          {/* Card 2: UTXO Orchestration */}
          <div className="p-6 rounded-2xl bg-[#141225] border-2 border-[#231e3d] hover:border-[#FFD469]/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFD469]/10 border border-[#FFD469]/30 flex items-center justify-center text-[#FFD469] mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F6F2FF] mb-2 tracking-tight">
                Colored UTXO Seals
              </h3>
              <p className="text-xs text-[#c9c2e0] leading-relaxed">
                Orchestrates Bitcoin outputs via <code>createUtxos()</code>. Colors UTXOs as cryptographic single-use seals ready for RGB token issuance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#231e3d] font-mono text-[11px] text-[#FFD469]">
              account.createUtxos(count, sats)
            </div>
          </div>

          {/* Card 3: Asset Issuance (NIA) */}
          <div className="p-6 rounded-2xl bg-[#141225] border-2 border-[#231e3d] hover:border-[#9B87F5]/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#9B87F5]/10 border border-[#9B87F5]/30 flex items-center justify-center text-[#9B87F5] mb-4 group-hover:scale-110 transition-transform">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F6F2FF] mb-2 tracking-tight">
                NIA Asset Issuance
              </h3>
              <p className="text-xs text-[#c9c2e0] leading-relaxed">
                Mints Non-Inflatable Assets (e.g. Tether USD₮, community tokens) with custom precision, fixed supply, and metadata.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#231e3d] font-mono text-[11px] text-[#9B87F5]">
              account.issueAssetNia(&#123;...&#125;)
            </div>
          </div>

          {/* Card 4: Blinded Invoices & Consignments */}
          <div className="p-6 rounded-2xl bg-[#141225] border-2 border-[#231e3d] hover:border-[#FF9FC0]/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FF9FC0]/10 border border-[#FF9FC0]/30 flex items-center justify-center text-[#FF9FC0] mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F6F2FF] mb-2 tracking-tight">
                Blinded Invoices
              </h3>
              <p className="text-xs text-[#c9c2e0] leading-relaxed">
                Generates blinded UTXO invoices so senders never reveal receiver on-chain addresses. Transfers validate off-chain via consignments.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#231e3d] font-mono text-[11px] text-[#FF9FC0]">
              account.createInvoice() &amp; send()
            </div>
          </div>

        </div>

        {/* Live Interactive Wallet Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-[#181530] border-2 border-[#2c2650] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#77E0B0] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#77E0B0] font-bold">
                Interactive Testnet4 / Mainnet Sandbox Live
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Test UTXO Coloring &amp; RGB Smart Contracts Now
            </h4>
            <p className="text-xs sm:text-sm text-[#c9c2e0] max-w-xl">
              Includes integrated +50,000 sats testnet faucet, real-time single-use seal orchestration, invoice generator, and official TypeScript SDK scripts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenWallet}
              className="px-6 py-3.5 rounded-xl bg-[#77E0B0] hover:bg-[#86f0c3] text-[#141225] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Open WDK Wallet Modal</span>
            </button>

            <a
              href="https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/guides/get-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-[#141225] hover:bg-[#231e3d] border border-[#2b2450] text-[#c9c2e0] hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2"
            >
              <FileCode2 className="w-4 h-4 text-[#FFD469]" />
              <span>Tether WDK Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
