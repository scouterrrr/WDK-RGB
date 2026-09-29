import React, { useState, useRef } from 'react';
import { Sparkles, Wallet, ArrowRight, Cpu, ShieldCheck, Layers, Coins, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenWallet: () => void;
  onExploreArchitecture: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenWallet, onExploreArchitecture }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -(y * 14), y: x * 14 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section 
      id="top" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-[#9B87F5] text-[#1d1440] py-20 lg:py-28 transition-colors duration-300"
    >
      {/* Dynamic background ambient particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FFD469] blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#77E0B0] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Brief & Action */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1d1440] text-[#FFD469] text-xs font-bold font-mono uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#77E0B0]" />
            Official Protocol &bull; Tether WDK + RGB
          </div>

          {/* Heading with 3D physical movement & shiny gradient */}
          <div className="perspective-1000 mb-6">
            <h1 
              style={{
                transform: `rotateX(${rotate.x * 0.75}deg) rotateY(${rotate.y * 0.75}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out',
              }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.12] tracking-tight text-[#1d1440] drop-shadow-sm select-none"
            >
              Deploy Tether WDK<br />
              <span className="bg-gradient-to-r from-[#1d1440] via-[#5939bd] to-[#251052] bg-clip-text text-transparent">
                RGB &amp; UTXO Wallet.
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#1d1440]/90 max-w-xl mb-8 font-medium">
            Production-grade deployment portal for Tether&apos;s Wallet Development Kit (WDK) and client-side RGB smart contracts. Derive Taproot accounts, manage Bitcoin UTXOs, allocate cryptographic single-use seals, and issue confidential digital assets.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenWallet}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1d1440] text-[#FFD469] font-bold text-sm tracking-wide shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-2 border-[#1d1440]"
            >
              <Wallet className="w-4 h-4 text-[#77E0B0]" />
              Launch WDK RGB Wallet
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreArchitecture}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white/40 text-[#1d1440] font-bold text-sm border-2 border-[#1d1440] hover:bg-white/70 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              Explore Architecture
            </button>
          </div>

          {/* Wallet Protocol Stats Pill - No NFT supply */}
          <div className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t-2 border-[#1d1440]/15 max-w-md">
            <div>
              <div className="text-2xl font-extrabold text-[#1d1440]">BIP-86</div>
              <div className="text-xs text-[#1d1440]/80 font-semibold">Taproot Engine</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#1d1440]">RGB v0.11</div>
              <div className="text-xs text-[#1d1440]/80 font-semibold">Client-Side State</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#1d1440]">UTXO</div>
              <div className="text-xs text-[#1d1440]/80 font-semibold">Single-Use Seals</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive WDK Wallet Card Preview */}
        <div className="lg:col-span-5 relative perspective-1000 flex items-center justify-center">
          <div
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.12s ease-out',
            }}
            className="w-full max-w-md bg-[#141225] border-4 border-[#1d1440] rounded-3xl p-6 shadow-2xl text-[#F6F2FF] relative overflow-hidden"
          >
            {/* Top header status */}
            <div className="flex items-center justify-between border-b border-[#2c2650] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#77E0B0] animate-pulse" />
                <span className="font-mono text-xs font-bold text-[#77E0B0]">TETHER WDK ACTIVE</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#77E0B0]/15 text-[#77E0B0] font-mono text-[10px] font-bold border border-[#77E0B0]/30">
                Taproot BIP-86
              </span>
            </div>

            {/* Address & Network pill */}
            <div className="bg-[#1c1932] rounded-xl p-3 mb-4 border border-[#2c2650]">
              <div className="flex justify-between items-center text-[11px] text-[#c9c2e0] mb-1 font-mono">
                <span>Account Address</span>
                <span className="text-[#FFD469]">m/86&apos;/1&apos;/0&apos;/0/0</span>
              </div>
              <div className="font-mono text-xs text-white font-bold truncate">
                tb1p7w4k...89z3q4u5x
              </div>
            </div>

            {/* Balance */}
            <div className="mb-5">
              <div className="text-[11px] text-[#c9c2e0] uppercase font-bold tracking-wider mb-1">
                Bitcoin Balance
              </div>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-3xl font-extrabold text-[#FFD469]">0.00050000</span>
                <span className="text-sm font-bold text-white">BTC</span>
                <span className="text-xs text-[#77E0B0] font-semibold">(50,000 sats)</span>
              </div>
            </div>

            {/* Seals & Assets mini table */}
            <div className="space-y-2 mb-5">
              <div className="text-[11px] text-[#c9c2e0] uppercase font-bold tracking-wider flex items-center justify-between">
                <span>Allocated RGB Assets</span>
                <span className="text-[#77E0B0] font-mono text-[10px]">3 Seals Colored</span>
              </div>

              <div className="bg-[#181530] rounded-xl p-2.5 flex items-center justify-between border border-[#2c2650]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#009393]/20 text-[#009393] flex items-center justify-center font-bold text-xs">
                    ₮
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">Tether USD₮</div>
                    <div className="text-[10px] font-mono text-[#c9c2e0]">RGB20 &bull; NIA</div>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-xs text-[#77E0B0]">
                  2,500.00 USD₮
                </div>
              </div>

              <div className="bg-[#181530] rounded-xl p-2.5 flex items-center justify-between border border-[#2c2650]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#77E0B0]/20 text-[#77E0B0] flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">WDK RGB Token</div>
                    <div className="text-[10px] font-mono text-[#c9c2e0]">RGB20 Protocol</div>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-xs text-[#FFD469]">
                  1,000,000 WDK
                </div>
              </div>
            </div>

            {/* Open Studio Action Button */}
            <button
              onClick={onOpenWallet}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#77E0B0] to-[#FFD469] text-[#141225] font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100 transition-all cursor-pointer shadow-md"
            >
              <Wallet className="w-4 h-4" />
              <span>Open Interactive Wallet Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
