import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { UtexoWalletSection } from './components/UtexoWalletSection';
import { UtexoWalletModal } from './components/UtexoWalletModal';
import { Cpu, Wallet, Layers, ExternalLink, ShieldCheck, Code2, BookOpen, Sparkles } from 'lucide-react';

export default function App() {
  const [isUtexoWalletOpen, setIsUtexoWalletOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#141225] text-[#F6F2FF] font-sans antialiased selection:bg-[#77E0B0] selection:text-[#141225]">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#141225]/90 backdrop-blur-md border-b-2 border-[#1c1932]">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#top" className="flex items-center gap-3 group text-decoration-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#009393] via-[#77E0B0] to-[#FFD469] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform text-[#141225]">
              <Cpu className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-base text-[#F6F2FF] tracking-tight">
              Deploy Tether WDK RGB Wallet
            </span>
          </a>

          {/* Nav Links - Pure Wallet Focus */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#c9c2e0]">
            <button
              onClick={() => setIsUtexoWalletOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#77E0B0]/15 hover:bg-[#77E0B0]/25 text-[#77E0B0] border border-[#77E0B0]/40 flex items-center gap-1.5 transition-all font-bold cursor-pointer shadow-sm hover:scale-105"
            >
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>⚡ WDK RGB Wallet</span>
            </button>
            <a href="#architecture" className="hover:text-[#77E0B0] transition-colors">
              Architecture
            </a>
            <a href="#utexo-wallet" className="hover:text-[#77E0B0] transition-colors">
              UTXO &amp; Seals
            </a>
            <a 
              href="https://docs.wdk.tether.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#FFD469] transition-colors flex items-center gap-1"
            >
              <span>WDK Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Actions: Direct Wallet Launch Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUtexoWalletOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#77E0B0] to-[#FFD469] text-[#141225] font-bold text-xs hover:scale-105 active:scale-100 transition-all shadow-md cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Launch Wallet</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection 
          onOpenWallet={() => setIsUtexoWalletOpen(true)} 
          onExploreArchitecture={() => scrollToSection('architecture')} 
        />

        {/* The Basics Architecture Summary Bar */}
        <section id="architecture" className="bg-[#141225] border-y-2 border-[#1c1932] py-16">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#77E0B0] font-bold">
                Architecture &amp; Protocol Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F6F2FF] mt-2 mb-4 tracking-tight">
                Tether WDK + RGB &bull; Non-Custodial Scalability
              </h2>
              <p className="text-sm sm:text-base text-[#c9c2e0] leading-relaxed mb-4">
                The Wallet Development Kit (WDK) by Tether enables modular, non-custodial smart wallet deployments across Bitcoin UTXOs, Taproot outputs, and RGB client-side validated state transitions.
              </p>
              <p className="text-sm text-[#c9c2e0] leading-relaxed">
                Issue confidential assets, execute off-chain Lightning-speed transfers, bind single-use seals with cryptographic certainty, and deploy unified multisig infrastructure effortlessly.
              </p>
            </div>

            <div className="bg-[#1c1932] border-2 border-[#2c2650] rounded-2xl p-6 divide-y divide-[#2c2650]">
              <div className="flex justify-between items-center py-3.5">
                <span className="text-xs font-semibold text-[#c9c2e0]">Protocol Stack</span>
                <span className="text-base font-bold text-[#FFD469]">Tether WDK + RGB v0.11</span>
              </div>
              <div className="flex justify-between items-center py-3.5">
                <span className="text-xs font-semibold text-[#c9c2e0]">Settlement Layer</span>
                <span className="text-base font-bold text-[#77E0B0]">Bitcoin Taproot (BIP-86)</span>
              </div>
              <div className="flex justify-between items-center py-3.5">
                <span className="text-xs font-semibold text-[#c9c2e0]">Asset Standards</span>
                <span className="text-base font-bold text-[#FF9FC0]">RGB20 (Fungible USD₮) &amp; RGB21</span>
              </div>
              <div className="flex justify-between items-center py-3.5">
                <span className="text-xs font-semibold text-[#c9c2e0]">State Model</span>
                <span className="text-xs font-semibold text-[#7EC8F0] px-2.5 py-1 rounded bg-[#7EC8F0]/10 border border-[#7EC8F0]/30 font-mono">
                  Client-Side Validation &bull; Single-Use Seals
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tether WDK Utexo RGB & UTXO Wallet Showcase Section */}
        <UtexoWalletSection onOpenWallet={() => setIsUtexoWalletOpen(true)} />
      </main>

      {/* Footer - Pure Wallet Focus */}
      <footer className="bg-[#0e0c1a] border-t-2 border-[#1c1932] py-14 text-xs text-[#c9c2e0]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#009393] to-[#77E0B0] flex items-center justify-center text-[#141225]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-[#F6F2FF]">Deploy Tether WDK RGB Wallet</span>
            <span className="text-[#c9c2e0]/60">&bull; Bitcoin &amp; RGB Client-Side Infrastructure</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <button
              onClick={() => setIsUtexoWalletOpen(true)}
              className="text-[#77E0B0] hover:underline flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Launch RGB Wallet</span>
            </button>
            <a 
              href="https://docs.wdk.tether.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FFD469]" />
              <span>Tether WDK Docs</span>
            </a>
            <a 
              href="https://github.com/tetherto" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5 text-[#77E0B0]" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Utexo RGB & UTXO Wallet Studio Modal */}
      <UtexoWalletModal
        isOpen={isUtexoWalletOpen}
        onClose={() => setIsUtexoWalletOpen(false)}
      />

    </div>
  );
}
