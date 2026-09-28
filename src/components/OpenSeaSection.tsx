import React from 'react';
import { ExternalLink, ShoppingBag, ArrowUpRight, Shield } from 'lucide-react';

export const OpenSeaSection: React.FC = () => {
  return (
    <section id="opensea" className="py-20 bg-[#0e2f45] text-[#F6F2FF] border-t-2 border-[#1c3e55] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-[#143d59] to-[#0e2f45] border-2 border-[#2081E2] rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 max-w-2xl">
            {/* OpenSea Logo Badge */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2081E2] to-[#1868B7] flex items-center justify-center p-4 shadow-lg shrink-0 border border-white/20">
              <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="45" cy="45" r="45" fill="#2081E2"/>
                <path d="M22 46.7 22.35 46.15 34.75 27 34.95 26.7C35.15 26.4 35.55 26.45 35.7 26.8 37.75 31.85 39.55 38.1 38.7 42 38.35 43.55 37.3 45.65 36.1 47.4 35.95 47.65 35.8 47.9 35.6 48.1 35.5 48.25 35.35 48.3 35.2 48.3H22.4C22.05 48.3 21.85 47.9 22 47.6L22 46.7Z" fill="white"/>
                <path d="M67.85 51.4V54.6C67.85 54.8 67.75 54.95 67.6 55.05 66.65 55.6 63.55 57.55 62.25 59.85 61.9 60.45 61.35 60.75 60.65 60.75H48.4C48.15 60.75 47.95 60.55 47.95 60.3V56C47.95 55.75 48.15 55.55 48.4 55.5 49.85 55.3 51.15 54.5 51.65 53.35 51.75 53.1 52 52.95 52.25 52.95H67.4C67.65 52.95 67.85 53.15 67.85 53.4V51.4Z" fill="white"/>
                <path d="M22.4 51.55H33.9C34.25 51.55 34.45 51.95 34.25 52.25 32.85 54.35 28.9 60.05 25 60.05 21.75 60.05 22.05 55.9 22.35 53.85 22.4 53.5 22.45 53.15 22.5 52.9 22.55 52.65 22.6 52.4 22.65 52.15 22.75 51.8 22.05 51.55 22.4 51.55Z" fill="white"/>
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7EC8F0]">
                  Official Secondary Marketplace
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] bg-[#2081E2]/30 text-[#7EC8F0] px-2 py-0.5 rounded border border-[#2081E2]/40">
                  <Shield className="w-3 h-3" /> Verified Smart Contract
                </span>
              </div>
              <h3 className="font-['Silkscreen'] text-2xl lg:text-3xl text-white mb-3">
                Trade on OpenSea
              </h3>
              <p className="text-sm text-[#c9c2e0] leading-relaxed">
                Immediately post-mint, secondary trading unlocks on OpenSea across Robinhood Chain. Real-time volume indexing, rarity trait breakdown, and floor orderbook liquidity are synchronized.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            <a
              href="https://opensea.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#2081E2] text-white font-bold text-sm tracking-wide shadow-lg hover:bg-[#1868B7] hover:-translate-y-0.5 transition-all border-2 border-[#2081E2]"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore on OpenSea
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
