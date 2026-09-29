import React, { useState, useRef } from 'react';
import { FunkyBuddy } from '../types';
import { PixelBuddy } from './PixelBuddy';
import { Sparkles, Trophy, Share2, Heart, Award, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface HoloCardProps {
  buddy: FunkyBuddy;
  serialNumber?: string;
  onClose?: () => void;
  onOpenAnother?: () => void;
}

export const HoloCard: React.FC<HoloCardProps> = ({
  buddy,
  serialNumber = '#042/500',
  onOpenAnother,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isCopied, setIsCopied] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -14;
    const rY = ((x - centerX) / centerX) * 14;

    setRotateX(rX);
    setRotateY(rY);
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const getRarityBadge = () => {
    switch (buddy.rarity) {
      case 'secret':
        return {
          label: 'SECRET CHASE',
          bg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-white font-black',
          border: 'border-amber-300',
        };
      case 'epic':
        return {
          label: 'EPIC BUDDY',
          bg: 'bg-pink-500 text-white',
          border: 'border-pink-300',
        };
      case 'rare':
        return {
          label: 'RARE GROOVE',
          bg: 'bg-amber-400 text-neutral-900',
          border: 'border-amber-500',
        };
      default:
        return {
          label: 'COMMON BUDDY',
          bg: 'bg-emerald-400 text-neutral-900',
          border: 'border-emerald-500',
        };
    }
  };

  const badge = getRarityBadge();

  const handleShare = () => {
    sound.playClick();
    const text = `🎉 I just unboxed ${buddy.name} (${buddy.title}) in Deploy Tether WDK RGB Wallet Reveal! Rarity: ${buddy.rarity.toUpperCase()} | Vibe: ${buddy.vibeScore}/100 💖`;
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4 z-40 max-w-sm sm:max-w-md w-full px-4 animate-[fadeIn_0.5s_ease-out]">
      {/* 3D Perspective Card Wrapper */}
      <div
        style={{ perspective: 1000 }}
        className="w-full flex justify-center"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="relative w-full max-w-sm rounded-2xl bg-[#FAF5E9] border-4 border-[#1F1B18] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          {/* Holographic Sheen Layer */}
          <div
            className="absolute inset-0 pointer-events-none holo-shimmer opacity-40 mix-blend-color-dodge z-30"
            style={{
              backgroundPosition: `${glowPos.x}% ${glowPos.y}%`,
            }}
          />

          {/* Glare Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 180px at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.45), transparent 70%)`,
            }}
          />

          {/* Card Header */}
          <div className="p-3.5 border-b-2 border-[#1F1B18] bg-[#F3ECE0] flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-[#1F1B18] font-bold tracking-tight">
                TETHER WDK RGB
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                SERIES 01
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className={`font-mono font-bold text-[9px] px-2 py-0.5 rounded-full border shadow-xs ${badge.bg} ${badge.border}`}
              >
                {badge.label}
              </span>
            </div>
          </div>

          {/* Artwork Stage Area */}
          <div className="relative h-60 bg-gradient-to-b from-[#1C1A24] via-[#24212D] to-[#16141D] flex flex-col items-center justify-center overflow-hidden border-b-2 border-[#1F1B18]">
            {/* Background Checkered Grid Accent */}
            <div className="absolute inset-0 bg-checkered opacity-30 pointer-events-none" />

            {/* Radiant Spotlight Circle */}
            <div
              className="absolute w-44 h-44 rounded-full blur-2xl pointer-events-none opacity-40"
              style={{ backgroundColor: buddy.themeColor }}
            />

            {/* Center Pixel Art Character */}
            <PixelBuddy
              buddy={buddy}
              size="lg"
              isFloating={true}
              showAura={true}
            />

            {/* Corner Badges */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md border border-white/10 text-white font-mono text-[10px]">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>#{buddy.boxArtworkIndex + 1}</span>
            </div>

            <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded-md border border-white/10 text-amber-300 font-mono text-[10px]">
              {buddy.dropRate}% PULL
            </div>

            {/* Serial Number Ribbon */}
            <div className="absolute bottom-2 inset-x-4 flex justify-between items-center text-[10px] font-mono text-white/80 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
              <span>MINT ID:</span>
              <span className="text-amber-300 font-bold">{serialNumber}</span>
            </div>
          </div>

          {/* Card Body & Info */}
          <div className="p-4 bg-[#FAF5E9] space-y-3 relative z-10 text-[#1F1B18]">
            {/* Name & Title */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-pixel text-xl text-[#1F1B18] font-black tracking-wide leading-tight">
                  {buddy.name}
                </h3>
                <p className="text-xs text-neutral-600 font-semibold tracking-wide">
                  "{buddy.title}"
                </p>
              </div>
              <div className="text-2xl">{buddy.badge}</div>
            </div>

            {/* Character Quote Banner */}
            <div className="bg-white border border-[#1F1B18]/30 rounded-lg p-2.5 shadow-xs text-xs italic text-neutral-800 flex items-center gap-2">
              <span className="text-pink-500 font-bold not-italic text-sm">“</span>
              <span>{buddy.quote}</span>
              <span className="text-pink-500 font-bold not-italic text-sm">”</span>
            </div>

            {/* Stats Triplets */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-[#EFE8D8] border border-[#1F1B18]/20 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center text-amber-500 mb-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="font-pixel text-xs font-bold">{buddy.vibeScore}</div>
                <div className="text-[9px] text-neutral-500 uppercase font-semibold">Vibe</div>
              </div>

              <div className="bg-[#EFE8D8] border border-[#1F1B18]/20 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center text-purple-500 mb-0.5">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div className="font-pixel text-xs font-bold">{buddy.grooveLevel}</div>
                <div className="text-[9px] text-neutral-500 uppercase font-semibold">Groove</div>
              </div>

              <div className="bg-[#EFE8D8] border border-[#1F1B18]/20 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center text-emerald-500 mb-0.5">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="font-pixel text-xs font-bold">{buddy.streetCred}</div>
                <div className="text-[9px] text-neutral-500 uppercase font-semibold">Street</div>
              </div>
            </div>

            {/* Bottom Footer Callout */}
            <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-[#1F1B18]/15">
              <span>AUTHENTIC RETRO PIXEL ART</span>
              <span className="font-pixel text-[#1F1B18]">GOOD VIBES ONLY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Under Card */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5 w-full">
        {onOpenAnother && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenAnother();
            }}
            className="flex-1 min-w-[140px] px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-pixel text-xs font-bold rounded-xl border-2 border-[#1F1B18] shadow-[0_4px_0_#1F1B18] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>UNBOX NEXT</span>
          </button>
        )}

        <button
          onClick={handleShare}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-pixel text-xs font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isCopied ? 'COPIED!' : 'SHARE'}</span>
        </button>
      </div>
    </div>
  );
};
