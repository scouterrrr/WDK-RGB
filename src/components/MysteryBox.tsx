import React from 'react';
import { BoxPhase } from '../types';
import { Sparkles, ArrowUp } from 'lucide-react';
import { sound } from '../utils/audio';

interface MysteryBoxProps {
  phase: BoxPhase;
  onUntie: () => void;
  onCrackOpen: () => void;
  boxArtworkIndices?: number[];
}

export const MysteryBox: React.FC<MysteryBoxProps> = ({
  phase,
  onUntie,
  onCrackOpen,
}) => {
  const isUntied = phase !== 'idle';
  const isOpen = phase === 'cracked' || phase === 'smoking' || phase === 'revealed';

  const handleBoxClick = () => {
    if (phase === 'idle') {
      sound.playRibbonUntie();
      onUntie();
    } else if (phase === 'untying') {
      sound.playBoxCrack();
      onCrackOpen();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none cursor-pointer group">
      {/* 3D Isometric / Front perspective Blind Box Container */}
      <div
        onClick={handleBoxClick}
        className={`relative w-80 sm:w-96 transition-all duration-700 transform ${
          phase === 'smoking'
            ? 'scale-90 translate-y-24 opacity-40 blur-xs'
            : phase === 'revealed'
            ? 'scale-75 translate-y-36 opacity-30'
            : 'scale-100 hover:scale-[1.02]'
        }`}
      >
        {/* Ambient Box Shadow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/60 rounded-full blur-xl pointer-events-none" />

        {/* 1. Box Lid / Top Facet */}
        <div
          className={`relative z-20 transition-all duration-700 origin-top transform ${
            isOpen ? '-translate-y-16 -rotate-6' : 'translate-y-0'
          }`}
        >
          {/* Lid Slant Top Surface */}
          <div className="relative bg-[#FAF5E9] border-4 border-[#1F1B18] rounded-t-xl p-4 shadow-xl overflow-hidden">
            {/* Top Stars & Sparkles Pattern */}
            <div className="flex justify-between items-center mb-1 text-xs text-[#1F1B18]/70">
              <span className="font-pixel text-[10px]">✨ SERIES 01</span>
              <span className="font-pixel text-[10px]">LIMITED BLIND BOX ✨</span>
            </div>

            {/* Header: "FUNKY BUDDIES" in 3D chunky pixel lettering */}
            <div className="text-center my-1 relative">
              <div className="inline-block relative">
                <span
                  className="font-pixel text-2xl sm:text-3xl font-extrabold tracking-wider text-[#C4B5FD] drop-shadow-[2px_2px_0px_#1F1B18] select-none block"
                  style={{
                    textShadow: '3px 3px 0 #1F1B18, -1px -1px 0 #1F1B18, 1px -1px 0 #1F1B18, -1px 1px 0 #1F1B18',
                  }}
                >
                  FUNKY
                </span>
                <span
                  className="font-pixel text-2xl sm:text-3xl font-extrabold tracking-wider text-[#FCD34D] drop-shadow-[2px_2px_0px_#1F1B18] select-none block -mt-1"
                  style={{
                    textShadow: '3px 3px 0 #1F1B18, -1px -1px 0 #1F1B18, 1px -1px 0 #1F1B18, -1px 1px 0 #1F1B18',
                  }}
                >
                  BUDDIES
                </span>
              </div>
            </div>

            {/* Lid Character Lineup (Faithful to the photo!) */}
            <div className="flex justify-around items-end pt-2 pb-1 border-b-2 border-[#1F1B18]/20">
              {/* Mint Cowboy */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#6ee7b7] rounded-md border-2 border-[#1F1B18] flex items-center justify-center relative shadow-sm">
                  {/* Mini Cowboy Hat */}
                  <div className="absolute -top-3 w-14 h-4 bg-white border border-[#1F1B18] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-2 bg-[#1F1B18] rounded-xs" />
                    <div className="w-1.5 h-2 bg-[#1F1B18] rounded-xs" />
                  </div>
                </div>
                <span className="font-pixel text-[8px] text-[#1F1B18] font-bold mt-1">DUSTY</span>
              </div>

              {/* Spike Lavender */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#a78bfa] rounded-md border-2 border-[#1F1B18] flex items-center justify-center relative shadow-sm">
                  {/* Spikes */}
                  <div className="absolute -top-2 text-white text-[10px] font-bold tracking-tighter">▲▲▲</div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-2 bg-[#1F1B18] rounded-xs" />
                    <div className="w-1.5 h-2 bg-[#1F1B18] rounded-xs" />
                  </div>
                </div>
                <span className="font-pixel text-[8px] text-[#1F1B18] font-bold mt-1">SPIKE</span>
              </div>

              {/* Blaze Amber */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#fbbf24] rounded-md border-2 border-[#1F1B18] flex items-center justify-center relative shadow-sm">
                  {/* Cap */}
                  <div className="absolute -top-1.5 w-10 h-3 bg-[#1F1B18] rounded-t-sm flex items-center justify-center">
                    <span className="text-[7px] text-amber-300 font-bold">⚡</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-2 bg-[#1F1B18] rounded-xs" />
                    <div className="w-1.5 h-2 bg-[#1F1B18] rounded-xs" />
                  </div>
                </div>
                <span className="font-pixel text-[8px] text-[#1F1B18] font-bold mt-1">BLAZE</span>
              </div>

              {/* Neon Pink */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#f472b6] rounded-md border-2 border-[#1F1B18] flex items-center justify-center relative shadow-sm">
                  {/* Cap */}
                  <div className="absolute -top-1.5 w-10 h-3 bg-[#1F1B18] rounded-t-sm flex items-center justify-center">
                    <div className="w-2 h-1.5 bg-white rounded-xs" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-2 bg-[#1F1B18] rounded-xs" />
                    <div className="w-1.5 h-2 bg-[#1F1B18] rounded-xs" />
                  </div>
                </div>
                <span className="font-pixel text-[8px] text-[#1F1B18] font-bold mt-1">NEON</span>
              </div>
            </div>

            {/* Checkered Lip Trim */}
            <div className="h-3 w-full bg-gradient-to-r from-amber-200 via-pink-200 to-purple-200 border-t-2 border-[#1F1B18] flex items-center justify-around px-1 overflow-hidden mt-2">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 ${i % 2 === 0 ? 'bg-[#1F1B18]' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Main Box Body */}
        <div className="relative z-10 -mt-2 bg-[#FAF5E9] border-4 border-[#1F1B18] rounded-b-xl p-5 shadow-2xl overflow-hidden min-h-[200px] flex flex-col justify-between">
          {/* Subtle box texture & corner pixel stars */}
          <div className="absolute top-3 right-3 text-amber-400 font-pixel text-sm">⭐</div>
          <div className="absolute top-10 left-3 text-purple-400 font-pixel text-xs">✨</div>
          <div className="absolute bottom-12 right-6 text-pink-400 font-pixel text-xs">💖</div>

          {/* Front Badges & Typography */}
          <div className="grid grid-cols-2 gap-2 relative z-10">
            {/* Tagline Left */}
            <div className="flex flex-col justify-center space-y-1">
              <div className="inline-flex items-center gap-1 font-pixel text-xs font-bold text-[#1F1B18]">
                <span>💖</span> BE UNIQUE.
              </div>
              <div className="inline-flex items-center gap-1 font-pixel text-xs font-bold text-[#1F1B18]">
                <span>✨</span> BE YOU.
              </div>
              <div className="inline-flex items-center gap-1 font-pixel text-xs font-bold text-[#1F1B18]">
                <span>💜</span> BE A BUDDY.
              </div>
            </div>

            {/* Right Graphic: Pixel Smiley & "GOOD VIBES ONLY" */}
            <div className="flex flex-col items-end justify-center space-y-2">
              {/* Green Pixel Smiley */}
              <div className="w-9 h-9 rounded-full bg-[#6ee7b7] border-2 border-[#1F1B18] flex items-center justify-center shadow-xs">
                <div className="flex flex-col items-center">
                  <div className="flex gap-2">
                    <div className="w-1 h-1.5 bg-[#1F1B18] rounded-xs" />
                    <div className="w-1 h-1.5 bg-[#1F1B18] rounded-xs" />
                  </div>
                  <div className="w-3.5 h-1 border-b-2 border-[#1F1B18] rounded-full mt-0.5" />
                </div>
              </div>

              {/* Good Vibes Badge */}
              <div className="border-2 border-[#1F1B18] rounded-lg px-2 py-1 bg-white shadow-xs text-center">
                <p className="font-pixel text-[9px] font-bold text-[#1F1B18] leading-tight">GOOD VIBES</p>
                <p className="font-pixel text-[9px] font-bold text-[#1F1B18] leading-tight">ONLY 💖</p>
              </div>
            </div>
          </div>

          {/* Bottom Checkered Mosaic Border with Colorful Pixel Pennants */}
          <div className="mt-4 pt-3 border-t-2 border-[#1F1B18]">
            <div className="flex justify-between items-center h-4 px-1 bg-[#1F1B18]">
              {['#6ee7b7', '#f472b6', '#fbbf24', '#a78bfa', '#38bdf8', '#fb7185', '#34d399', '#fde047'].map((col, idx) => (
                <div
                  key={idx}
                  className="w-2.5 h-2.5 rounded-xs transform rotate-45"
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Golden Interior Light Leak when cracked */}
          {isOpen && (
            <div className="absolute inset-x-0 -top-8 h-20 bg-gradient-to-b from-amber-300 via-amber-200/50 to-transparent blur-md pointer-events-none animate-pulse" />
          )}
        </div>

        {/* 3. Satin Ribbon & Bow Overlay (untied on click) */}
        {!isUntied && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            {/* Horizontal Satin Ribbon Band */}
            <div className="absolute inset-x-0 h-9 bg-gradient-to-r from-[#F7EACD] via-[#FFF8EB] to-[#F3E3C0] border-y-2 border-[#D4AF37] shadow-md flex items-center justify-center">
              <div className="w-full h-0.5 border-b border-dashed border-[#B89327]/60" />
            </div>

            {/* Central Silk Bow */}
            <div className="relative z-40 transform hover:scale-105 transition-transform duration-300">
              <div className="relative flex items-center justify-center">
                {/* Bow Left Loop */}
                <div className="w-12 h-10 bg-gradient-to-br from-[#FFF5DC] to-[#EBD29F] border-2 border-[#D4AF37] rounded-full transform -rotate-25 shadow-lg -mr-2" />
                {/* Central Knot */}
                <div className="relative z-10 w-9 h-9 bg-[#F8E7C4] border-2 border-[#D4AF37] rounded-lg shadow-md flex items-center justify-center">
                  {/* Dangling Star Charm */}
                  <span className="text-amber-500 font-pixel text-xs">⭐</span>
                </div>
                {/* Bow Right Loop */}
                <div className="w-12 h-10 bg-gradient-to-bl from-[#FFF5DC] to-[#EBD29F] border-2 border-[#D4AF37] rounded-full transform rotate-25 shadow-lg -ml-2" />
              </div>

              {/* Hanging Ribbon Tails */}
              <div className="flex justify-center -mt-1 space-x-3">
                <div className="w-4 h-12 bg-gradient-to-b from-[#FFF5DC] to-[#E5CB97] border-x-2 border-b-2 border-[#D4AF37] transform -rotate-12 rounded-b-sm" />
                <div className="w-4 h-12 bg-gradient-to-b from-[#FFF5DC] to-[#E5CB97] border-x-2 border-b-2 border-[#D4AF37] transform rotate-12 rounded-b-sm" />
              </div>
            </div>

            {/* Interactive Callout Badge */}
            <div className="absolute -bottom-6 bg-amber-400 text-[#1F1B18] px-4 py-1.5 rounded-full font-pixel text-xs font-bold shadow-lg border-2 border-[#1F1B18] animate-bounce flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TAP RIBBON TO UNTIE</span>
            </div>
          </div>
        )}

        {/* Ready to Open Prompt */}
        {phase === 'untying' && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-30 bg-emerald-400 text-[#1F1B18] px-5 py-2 rounded-full font-pixel text-xs font-bold shadow-xl border-2 border-[#1F1B18] animate-pulse flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            <span>CLICK TO POP LID & SMOKE REVEAL</span>
          </div>
        )}
      </div>
    </div>
  );
};
