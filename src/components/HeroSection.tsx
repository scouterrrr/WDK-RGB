import React, { useState, useRef } from 'react';
import { Sparkles, ArrowDown, ExternalLink } from 'lucide-react';

interface HeroSectionProps {
  onGrabSpot: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGrabSpot }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -(y * 16), y: x * 16 });
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
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1d1440] text-[#FFD469] text-xs font-bold font-mono uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#77E0B0]" />
            Official Collection &bull; Robinhood Chain
          </div>

          {/* Heading with 3D physical movement & shiny gradient */}
          <div className="perspective-1000 mb-6">
            <h1 
              style={{
                transform: `rotateX(${rotate.x * 0.75}deg) rotateY(${rotate.y * 0.75}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out',
              }}
              className="font-['Silkscreen'] text-3xl sm:text-4xl md:text-5xl lg:text-[46px] leading-[1.2] tracking-tight text-[#1d1440] drop-shadow-sm select-none"
            >
              Hand-built misfits,<br />
              <span className="bg-gradient-to-r from-[#1d1440] via-[#5939bd] to-[#FFD469] bg-clip-text text-transparent animate-pulse">
                minted for the timeline.
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#1d1440]/90 max-w-xl mb-8 font-medium">
            FUNky Buddies is a capped, 1,999-piece character collection living natively on Robinhood Chain. No two buddies wear the same fit twice. Built with a hard floor-defense buyback &amp; burn covenant.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onGrabSpot}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1d1440] text-[#FFD469] font-bold text-sm tracking-wide shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border-2 border-[#1d1440]"
            >
              Grab an FCFS spot
              <ArrowDown className="w-4 h-4" />
            </button>

            <a
              href="https://x.com/funkybuddies"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white/40 text-[#1d1440] font-bold text-sm border-2 border-[#1d1440] hover:bg-white/70 hover:-translate-y-0.5 transition-all"
            >
              Follow @funkybuddies on X
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Stats Pill */}
          <div className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t-2 border-[#1d1440]/15 max-w-md">
            <div>
              <div className="font-['Silkscreen'] text-xl font-bold text-[#1d1440]">1,999</div>
              <div className="text-xs text-[#1d1440]/75 font-semibold">Total Supply</div>
            </div>
            <div>
              <div className="font-['Silkscreen'] text-xl font-bold text-[#1d1440]">Robinhood</div>
              <div className="text-xs text-[#1d1440]/75 font-semibold">Chain Network</div>
            </div>
            <div>
              <div className="font-['Silkscreen'] text-xl font-bold text-[#1d1440]">07 Sep</div>
              <div className="text-xs text-[#1d1440]/75 font-semibold">Mint Date</div>
            </div>
          </div>
        </div>

        {/* 3D Floating Collage Cards */}
        <div className="lg:col-span-5 relative h-[380px] sm:h-[420px] perspective-1000 flex items-center justify-center">
          <div
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.12s ease-out',
            }}
            className="relative w-full h-full"
          >
            {/* Main Center Card */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-48 sm:h-56 rounded-2xl bg-[#FFD469] border-4 border-[#1d1440] shadow-[8px_8px_0px_#1d1440] overflow-hidden rotate-[-4deg] hover:rotate-0 transition-transform duration-300 z-20">
              <img
                src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80"
                alt="FUNky Buddy Lone Star"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-[#1d1440] text-[#FFD469] font-['Silkscreen'] text-[11px] px-2 py-1 rounded text-center">
                Lone Star #014
              </div>
            </div>

            {/* Floating Top Right Card */}
            <div className="absolute -top-4 right-4 sm:right-8 w-36 h-36 rounded-xl bg-[#77E0B0] border-4 border-[#1d1440] shadow-[6px_6px_0px_#1d1440] overflow-hidden rotate-[12deg] z-10">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80"
                alt="FUNky Buddy Good Vibes"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Bottom Left Card */}
            <div className="absolute bottom-4 left-4 sm:left-6 w-40 h-40 rounded-xl bg-[#FF9FC0] border-4 border-[#1d1440] shadow-[6px_6px_0px_#1d1440] overflow-hidden rotate-[-12deg] z-10">
              <img
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=500&q=80"
                alt="FUNky Buddy Campus Kid"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
