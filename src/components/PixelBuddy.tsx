import React from 'react';
import { FunkyBuddy } from '../types';

interface PixelBuddyProps {
  buddy: FunkyBuddy;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isRevealing?: boolean;
  isFloating?: boolean;
  className?: string;
  showAura?: boolean;
}

export const PixelBuddy: React.FC<PixelBuddyProps> = ({
  buddy,
  size = 'md',
  isRevealing = false,
  isFloating = true,
  className = '',
  showAura = true,
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  const getAuraColor = () => {
    switch (buddy.rarity) {
      case 'secret':
        return 'from-amber-400/40 via-purple-500/30 to-pink-500/40';
      case 'epic':
        return 'from-pink-500/30 via-purple-500/20 to-indigo-500/30';
      case 'rare':
        return 'from-amber-500/30 via-orange-500/20 to-yellow-500/30';
      default:
        return 'from-emerald-400/25 via-teal-500/15 to-cyan-500/25';
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className} ${
        isFloating ? 'animate-[bounce_3s_ease-in-out_infinite]' : ''
      }`}
    >
      {/* Background radial glow */}
      {showAura && (
        <div
          className={`absolute -inset-4 rounded-full bg-gradient-to-tr ${getAuraColor()} blur-2xl pointer-events-none transition-all duration-700 ${
            isRevealing ? 'scale-125 opacity-90' : 'scale-100 opacity-60'
          }`}
        />
      )}

      {/* SVG Pixel Art Character */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)] image-pixelated"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <defs>
          <filter id={`pixel-shadow-${buddy.id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Body & Torso / Outfit */}
        <g id="body-layer">
          {/* Base Torso Silhouette (Thick Black Border) */}
          <path
            d="M26 62 H74 V100 H26 Z"
            fill="#121214"
          />

          {/* Outfit Specifics */}
          {buddy.outfitType === 'shearling_jacket' && (
            <>
              {/* Brown leather jacket */}
              <rect x="28" y="64" width="44" height="36" fill="#854d0e" />
              {/* Shearling fluffy fur lapels & collar */}
              <path
                d="M34 62 L44 82 L48 82 L42 62 Z M66 62 L56 82 L52 82 L58 62 Z"
                fill="#fef08a"
              />
              <rect x="36" y="62" width="28" height="6" fill="#fef08a" />
              {/* Inner dark t-shirt */}
              <rect x="44" y="68" width="12" height="32" fill="#18181b" />
              {/* Silver pendant necklace */}
              <circle cx="50" cy="74" r="2" fill="#e2e8f0" />
              <path d="M47 68 L50 74 L53 68" stroke="#cbd5e1" strokeWidth="1" fill="none" />
            </>
          )}

          {buddy.outfitType === 'hoodie_white' && (
            <>
              {/* White relaxed crewneck/hoodie */}
              <rect x="28" y="64" width="44" height="36" fill="#f1f5f9" />
              {/* Shadow folds */}
              <rect x="28" y="88" width="44" height="12" fill="#e2e8f0" />
              {/* Black tactical crossbody sling strap */}
              <path d="M30 65 L68 98 L72 94 L34 61 Z" fill="#0f172a" />
              {/* Chest pouch badge with "XX" pixel patch */}
              <rect x="46" y="78" width="14" height="12" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
              {/* Smiley icon on bag */}
              <rect x="49" y="81" width="2" height="2" fill="#0f172a" />
              <rect x="55" y="81" width="2" height="2" fill="#0f172a" />
              <path d="M49 86 Q53 89 57 86" stroke="#0f172a" strokeWidth="1" fill="none" />
            </>
          )}

          {(buddy.outfitType === 'hoodie_black' || buddy.outfitType === 'hoodie_black_cross') && (
            <>
              {/* Black streetwear hoodie */}
              <rect x="28" y="64" width="44" height="36" fill="#1e1e24" />
              {/* Collar shadow */}
              <path d="M42 64 L50 72 L58 64 Z" fill="#0d0d11" />
              {/* White drawstrings */}
              <rect x="46" y="68" width="1.5" height="12" fill="#f8fafc" />
              <rect x="52.5" y="68" width="1.5" height="10" fill="#f8fafc" />
              {/* Subtle seam shading */}
              <rect x="28" y="86" width="44" height="14" fill="#141418" />
              {/* Pocket seam */}
              <path d="M36 82 H64 V96 H36 Z" stroke="#2d2d38" strokeWidth="1" fill="none" />
            </>
          )}

          {buddy.outfitType === 'stellar_cloak' && (
            <>
              {/* Deep midnight velvet cloak */}
              <rect x="28" y="64" width="44" height="36" fill="#1e1b4b" />
              {/* Glowing nebula constellations */}
              <circle cx="36" cy="74" r="1.5" fill="#a5b4fc" />
              <circle cx="62" cy="82" r="2" fill="#818cf8" />
              <circle cx="48" cy="90" r="1.5" fill="#c7d2fe" />
              {/* Gold star clasp */}
              <polygon points="50,66 52,70 56,70 53,72 54,76 50,73 46,76 47,72 44,70 48,70" fill="#fbbf24" />
            </>
          )}

          {buddy.outfitType === 'golden_bomber' && (
            <>
              {/* Golden 24K bomber */}
              <rect x="28" y="64" width="44" height="36" fill="#eab308" />
              <rect x="30" y="66" width="40" height="32" fill="#facc15" />
              {/* Diamond drip chain */}
              <path d="M42 64 Q50 78 58 64" stroke="#ffffff" strokeWidth="2" fill="none" />
              <rect x="48" y="74" width="4" height="4" fill="#38bdf8" />
            </>
          )}
        </g>

        {/* 2. Neck & Head Base */}
        <g id="head-layer">
          {/* Neck */}
          <rect x="44" y="54" width="12" height="12" fill="#121214" />
          <rect x="45" y="54" width="10" height="10" fill={buddy.skinColor} />
          {/* Neck shadow */}
          <rect x="45" y="54" width="10" height="3" fill="#000000" fillOpacity="0.2" />

          {/* Head Shape (Black Pixel Outline) */}
          <rect x="30" y="24" width="40" height="34" rx="4" fill="#121214" />
          {/* Head Skin Tone */}
          <rect x="32" y="26" width="36" height="30" rx="2" fill={buddy.skinColor} />

          {/* Ears */}
          <rect x="28" y="38" width="4" height="8" fill="#121214" />
          <rect x="29" y="39" width="3" height="6" fill={buddy.skinColor} />
          <rect x="68" y="38" width="4" height="8" fill="#121214" />
          <rect x="68" y="39" width="3" height="6" fill={buddy.skinColor} />

          {/* Accessories: AirPods & Earrings */}
          {buddy.accessory === 'airpod_left' && (
            <g id="airpod-left">
              <rect x="28" y="40" width="3" height="4" fill="#ffffff" stroke="#121214" strokeWidth="0.8" />
              <rect x="29" y="44" width="1.5" height="4" fill="#ffffff" />
            </g>
          )}

          {buddy.accessory === 'airpod_both' && (
            <g id="airpod-both">
              <rect x="28" y="40" width="3" height="4" fill="#ffffff" stroke="#121214" strokeWidth="0.8" />
              <rect x="29" y="44" width="1.5" height="4" fill="#ffffff" />
              <rect x="69" y="40" width="3" height="4" fill="#ffffff" stroke="#121214" strokeWidth="0.8" />
              <rect x="69" y="44" width="1.5" height="4" fill="#ffffff" />
            </g>
          )}

          {(buddy.accessory === 'cross_earring_silver' || buddy.accessory === 'cross_earring_double') && (
            <g id="cross-earring">
              <rect x="69" y="44" width="2" height="2" fill="#cbd5e1" />
              <rect x="69.5" y="46" width="1" height="6" fill="#cbd5e1" />
              <rect x="67.5" y="48" width="5" height="1" fill="#cbd5e1" />
            </g>
          )}

          {/* Facial Features: Eyes & Expression */}
          <g id="face-features">
            {/* Left Eye */}
            <rect x="40" y="38" width="3" height="5" fill="#121214" />
            <rect x="40" y="38" width="1.5" height="2" fill="#ffffff" />

            {/* Right Eye */}
            <rect x="57" y="38" width="3" height="5" fill="#121214" />
            <rect x="57" y="38" width="1.5" height="2" fill="#ffffff" />

            {/* Eyebrows */}
            <rect x="39" y="34" width="5" height="1.5" fill="#121214" />
            <rect x="56" y="34" width="5" height="1.5" fill="#121214" />

            {/* Blushes for Neon */}
            {buddy.expression === 'blush' && (
              <>
                <rect x="37" y="43" width="5" height="2" fill="#fb7185" fillOpacity="0.7" />
                <rect x="58" y="43" width="5" height="2" fill="#fb7185" fillOpacity="0.7" />
              </>
            )}

            {/* Mouth */}
            {buddy.expression === 'smile' && (
              <path d="M47 48 Q50 51 53 48" stroke="#121214" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}
            {buddy.expression === 'smirk' && (
              <path d="M48 49 L54 47" stroke="#121214" strokeWidth="1.5" strokeLinecap="round" />
            )}
            {buddy.expression === 'calm' && (
              <rect x="48" y="48" width="4" height="1.5" fill="#121214" />
            )}
            {buddy.expression === 'blush' && (
              <path d="M48 48 Q50 49 52 48" stroke="#121214" strokeWidth="1.2" fill="none" />
            )}
            {buddy.expression === 'enigmatic' && (
              <rect x="48" y="48" width="4" height="1" fill="#4338ca" />
            )}
            {buddy.expression === 'cool' && (
              <path d="M47 47 L53 47" stroke="#121214" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
        </g>

        {/* 3. Hats & Hair (Rendered on Top of Head) */}
        <g id="headwear-layer">
          {/* Cowboy Hat (Dusty) */}
          {buddy.headwear === 'cowboy_white' && (
            <g id="cowboy-hat">
              {/* Wide Brim Base Border */}
              <ellipse cx="50" cy="26" rx="32" ry="9" fill="#121214" />
              {/* White Felt Brim */}
              <ellipse cx="50" cy="25" rx="30" ry="7.5" fill="#f8fafc" />
              <ellipse cx="50" cy="24" rx="28" ry="6.5" fill="#e2e8f0" />
              {/* Crown Border */}
              <path d="M34 24 L36 10 Q50 6 64 10 L66 24 Z" fill="#121214" />
              {/* White Felt Crown with center crease */}
              <path d="M36 23 L38 12 Q50 8 62 12 L64 23 Z" fill="#ffffff" />
              <path d="M48 10 L50 20 L52 10" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
              {/* Hat Band with Star Badge */}
              <rect x="36" y="21" width="28" height="3" fill="#0f172a" />
              {/* Pixel Star Badge */}
              <polygon points="50,19 51,21 53,21 51.5,22.5 52,24.5 50,23 48,24.5 48.5,22.5 47,21 49,21" fill="#fbbf24" stroke="#121214" strokeWidth="0.5" />
            </g>
          )}

          {/* Spiky Hair with Athletic Headband (Spike) */}
          {buddy.headwear === 'spiky_white_headband' && (
            <g id="spiky-hair">
              {/* Spikes Outline */}
              <path
                d="M28 28 L24 16 L32 20 L36 10 L44 18 L50 8 L56 18 L64 10 L68 20 L76 16 L72 28 Z"
                fill="#121214"
              />
              {/* Spikes White Hair Fill */}
              <path
                d="M30 27 L26 18 L33 21 L37 13 L44 19 L50 11 L56 19 L63 13 L67 21 L74 18 L70 27 Z"
                fill="#f8fafc"
              />
              {/* Headband Base */}
              <rect x="30" y="25" width="40" height="7" fill="#0f172a" stroke="#121214" strokeWidth="1" />
              {/* Headband Center Cross Motif ("✕") */}
              <line x1="47.5" y1="26.5" x2="52.5" y2="30.5" stroke="#f8fafc" strokeWidth="1.8" />
              <line x1="52.5" y1="26.5" x2="47.5" y2="30.5" stroke="#f8fafc" strokeWidth="1.8" />
            </g>
          )}

          {/* Black Fitted Cap with Lightning (Blaze) */}
          {buddy.headwear === 'cap_black_lightning' && (
            <g id="cap-lightning">
              {/* Hair peeking out under cap */}
              <rect x="32" y="26" width="36" height="5" fill="#0f172a" />
              {/* Cap Dome */}
              <path d="M30 25 Q50 12 70 25 Z" fill="#121214" />
              <path d="M32 24 Q50 14 68 24 Z" fill="#1f1f26" />
              {/* Cap Visor (Black flat visor) */}
              <ellipse cx="50" cy="27" rx="24" ry="4.5" fill="#121214" />
              <ellipse cx="50" cy="26" rx="22" ry="3.5" fill="#2a2a34" />
              {/* White Pixel Lightning Bolt Motif */}
              <polygon points="51,15 47,20 50,20 48,24 53,19 50,19" fill="#f8fafc" />
            </g>
          )}

          {/* Black Fitted Cap with Crest (Neon) */}
          {buddy.headwear === 'cap_black_crest' && (
            <g id="cap-crest">
              {/* Cap Dome */}
              <path d="M30 25 Q50 12 70 25 Z" fill="#121214" />
              <path d="M32 24 Q50 14 68 24 Z" fill="#18181b" />
              {/* Cap Visor */}
              <ellipse cx="50" cy="27" rx="24" ry="4.5" fill="#121214" />
              <ellipse cx="50" cy="26" rx="22" ry="3.5" fill="#27272a" />
              {/* Pixel Block / Kanji Crest (Like "中" on the box cap) */}
              <rect x="47" y="16" width="6" height="5" fill="#ffffff" stroke="#121214" strokeWidth="0.8" />
              <line x1="50" y1="14.5" x2="50" y2="22.5" stroke="#ffffff" strokeWidth="1.2" />
            </g>
          )}

          {/* Cosmic Star Halo (Phantom) */}
          {buddy.headwear === 'cosmic_halo' && (
            <g id="cosmic-halo">
              <ellipse cx="50" cy="14" rx="22" ry="6" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="4 2" />
              <polygon points="50,6 52,10 56,10 53,12 54,16 50,13 46,16 47,12 44,10 48,10" fill="#a5b4fc" />
            </g>
          )}

          {/* 24K Golden Crown (Aurum) */}
          {buddy.headwear === 'crown_gold' && (
            <g id="crown-gold">
              <path d="M32 22 L32 10 L41 16 L50 6 L59 16 L68 10 L68 22 Z" fill="#121214" />
              <path d="M34 21 L34 12 L42 17 L50 9 L58 17 L66 12 L66 21 Z" fill="#facc15" />
              {/* Ruby Gems */}
              <circle cx="50" cy="15" r="2" fill="#ef4444" stroke="#121214" strokeWidth="0.5" />
              <circle cx="41" cy="17" r="1.5" fill="#3b82f6" stroke="#121214" strokeWidth="0.5" />
              <circle cx="59" cy="17" r="1.5" fill="#3b82f6" stroke="#121214" strokeWidth="0.5" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
