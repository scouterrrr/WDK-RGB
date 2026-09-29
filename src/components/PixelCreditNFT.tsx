import React, { useState, useRef, useId } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Download, 
  Copy, 
  Check, 
  Code, 
  Layers, 
  Zap, 
  Wallet, 
  CreditCard, 
  ChevronRight,
  Shield,
  Palette
} from 'lucide-react';

export interface PixelCreditCardConfig {
  id: string;
  tokenId: number;
  cardholder: string;
  evmAddress: string;
  tier: 'obsidian' | 'gold' | 'holo' | 'neon' | 'diamond';
  creditLimit: string;
  expiry: string;
  buddySkin: string;
  buddyHair: string;
  buddyEyes: string;
  buddyOutfit: string;
  buddyAccessory: string;
  bgPattern: 'grid' | 'dots' | 'circuit' | 'carbon';
}

const THEMES = {
  obsidian: {
    name: 'Obsidian Black',
    badge: 'BLACK VIP',
    bg: '#121118',
    gradient: 'from-[#1c1926] via-[#121118] to-[#09080d]',
    border: '#3b3254',
    accent: '#9B87F5',
    textMain: '#F6F2FF',
    textMuted: '#9B87F5',
    chipColor: '#FFD469',
    chipHighlight: '#FFF2A8',
    holoSheen: 'rgba(155, 135, 245, 0.25)',
  },
  gold: {
    name: '24K Cyber Gold',
    badge: 'ROYAL GOLD',
    bg: '#241a05',
    gradient: 'from-[#3b2a09] via-[#211703] to-[#120c02]',
    border: '#d4af37',
    accent: '#FFD469',
    textMain: '#FFF8DB',
    textMuted: '#e8c15a',
    chipColor: '#FFF2A8',
    chipHighlight: '#FFFFFF',
    holoSheen: 'rgba(255, 212, 105, 0.35)',
  },
  holo: {
    name: 'Aurora Holo Prism',
    badge: 'HOLO PRISM',
    bg: '#16142e',
    gradient: 'from-[#251e4a] via-[#1a2347] to-[#142e3b]',
    border: '#FF9FC0',
    accent: '#77E0B0',
    textMain: '#FFFFFF',
    textMuted: '#FF9FC0',
    chipColor: '#77E0B0',
    chipHighlight: '#D2FBF1',
    holoSheen: 'rgba(119, 224, 176, 0.35)',
  },
  neon: {
    name: 'Neon Glitch 80s',
    badge: 'CYBER GLITCH',
    bg: '#1e0c29',
    gradient: 'from-[#360d40] via-[#1d0826] to-[#0d1b38]',
    border: '#00f0ff',
    accent: '#ff007f',
    textMain: '#F6F2FF',
    textMuted: '#00f0ff',
    chipColor: '#00f0ff',
    chipHighlight: '#e0ffff',
    holoSheen: 'rgba(255, 0, 127, 0.3)',
  },
  diamond: {
    name: 'Diamond Ice Platinum',
    badge: 'ICE PLATINUM',
    bg: '#0c1d29',
    gradient: 'from-[#143147] via-[#0d2233] to-[#07131d]',
    border: '#7EC8F0',
    accent: '#A5E4F9',
    textMain: '#FFFFFF',
    textMuted: '#7EC8F0',
    chipColor: '#A5E4F9',
    chipHighlight: '#FFFFFF',
    holoSheen: 'rgba(126, 200, 240, 0.35)',
  },
};

const SKINS = [
  { id: 'honey', name: 'Golden Honey', hex: '#E5A967', shadow: '#B57C3E' },
  { id: 'fair', name: 'Pastel Rose', hex: '#FAD2B8', shadow: '#D8A386' },
  { id: 'cocoa', name: 'Deep Cocoa', hex: '#87532B', shadow: '#5B3314' },
  { id: 'cyber', name: 'Cyber Teal', hex: '#58D6C7', shadow: '#2AA294' },
  { id: 'ghost', name: 'Phantom Violet', hex: '#B5A5EC', shadow: '#7A64C7' },
];

const HAIRSTYLES = [
  { id: 'crown', name: '24K Crown' },
  { id: 'cowboy', name: 'Sherpa Cowboy' },
  { id: 'cap', name: 'Snapback Cap' },
  { id: 'visor', name: 'Cyber Visor' },
  { id: 'spiky', name: 'Spiky Headband' },
  { id: 'halo', name: 'Angelic Halo' },
];

const EYES = [
  { id: 'shades', name: '8-Bit Thug Shades' },
  { id: 'laser', name: 'Red Laser Glare' },
  { id: 'vr', name: 'Cyber Neon Goggles' },
  { id: 'classic', name: 'Cool Calm Gaze' },
  { id: 'star', name: 'Hyped Star Eyes' },
];

const OUTFITS = [
  { id: 'jacket', name: 'Sherling Leather' },
  { id: 'hoodie', name: 'Black Street Hoodie' },
  { id: 'bomber', name: 'Gold Bomber Jacket' },
  { id: 'spacesuit', name: 'Web3 Neon Suit' },
  { id: 'tux', name: 'VIP Obsidian Tux' },
];

const ACCESSORIES = [
  { id: 'airpod', name: 'Pixel AirPods' },
  { id: 'goldchain', name: 'Heavy Gold Cuban' },
  { id: 'earring', name: 'Silver Cross Drop' },
  { id: 'bubblegum', name: 'Pink Bubblegum' },
  { id: 'none', name: 'Clean / No Accessory' },
];

interface PixelCreditNFTProps {
  onUseForWhitelist?: (handle: string, address: string) => void;
}

export const PixelCreditNFT: React.FC<PixelCreditNFTProps> = ({ onUseForWhitelist }) => {
  const cardSvgRef = useRef<SVGSVGElement>(null);
  const cardBackSvgRef = useRef<SVGSVGElement>(null);
  const filterId = useId().replace(/:/g, '');

  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const [config, setConfig] = useState<PixelCreditCardConfig>({
    id: 'fbc-card-042',
    tokenId: 42,
    cardholder: 'BABU PASWAN',
    evmAddress: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    tier: 'obsidian',
    creditLimit: '1,999 $FUNK',
    expiry: '09/27',
    buddySkin: 'honey',
    buddyHair: 'crown',
    buddyEyes: 'shades',
    buddyOutfit: 'jacket',
    buddyAccessory: 'goldchain',
    bgPattern: 'circuit',
  });

  const activeTheme = THEMES[config.tier];
  const activeSkin = SKINS.find((s) => s.id === config.buddySkin) || SKINS[0];

  // 3D Card Tilt handling
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -12;
    const tiltY = ((x - centerX) / centerX) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Randomize all traits
  const randomize = () => {
    const tiers: ('obsidian' | 'gold' | 'holo' | 'neon' | 'diamond')[] = [
      'obsidian',
      'gold',
      'holo',
      'neon',
      'diamond',
    ];
    const randTier = tiers[Math.floor(Math.random() * tiers.length)];
    const randSkin = SKINS[Math.floor(Math.random() * SKINS.length)].id;
    const randHair = HAIRSTYLES[Math.floor(Math.random() * HAIRSTYLES.length)].id;
    const randEyes = EYES[Math.floor(Math.random() * EYES.length)].id;
    const randOutfit = OUTFITS[Math.floor(Math.random() * OUTFITS.length)].id;
    const randAcc = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id;
    const randToken = Math.floor(Math.random() * 1999) + 1;
    const patterns: ('grid' | 'dots' | 'circuit' | 'carbon')[] = ['grid', 'dots', 'circuit', 'carbon'];
    const randPattern = patterns[Math.floor(Math.random() * patterns.length)];

    setConfig((prev) => ({
      ...prev,
      tokenId: randToken,
      tier: randTier,
      buddySkin: randSkin,
      buddyHair: randHair,
      buddyEyes: randEyes,
      buddyOutfit: randOutfit,
      buddyAccessory: randAcc,
      bgPattern: randPattern,
    }));
  };

  // Export high-res PNG
  const downloadPNG = () => {
    const targetSvg = isFlipped ? cardBackSvgRef.current : cardSvgRef.current;
    if (!targetSvg) return;

    const svgData = new XMLSerializer().serializeToString(targetSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = window.URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 756;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, 0, 0, width, height);
        const pngURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Deploy-Tether-WDK-RGB-Pass-${config.tokenId}-${isFlipped ? 'BACK' : 'FRONT'}.png`;
        link.href = pngURL;
        link.click();
      }
      window.URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  // Copy SVG Code
  const copySvgCode = () => {
    const targetSvg = isFlipped ? cardBackSvgRef.current : cardSvgRef.current;
    if (!targetSvg) return;
    const svgData = new XMLSerializer().serializeToString(targetSvg);
    navigator.clipboard.writeText(svgData);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // OpenSea / ERC-721 Metadata JSON
  const metadataJson = {
    name: `Deploy Tether WDK RGB Pass #${config.tokenId}`,
    description: `Official on-chain pure code Pixel Credit Card NFT for Deploy Tether WDK RGB Wallet. Grants VIP allocation privileges, 1,999 $WDKRGB credits loyalty allotment, and floor protection guarantee.`,
    image: `data:image/svg+xml;utf8,...`,
    external_url: "https://x.com/tether_to",
    attributes: [
      { trait_type: "Card Material", value: activeTheme.name },
      { trait_type: "Card Tier", value: activeTheme.badge },
      { trait_type: "Credit Allotment", value: config.creditLimit },
      { trait_type: "Expiry / Launch", value: config.expiry },
      { trait_type: "Buddy Headwear", value: HAIRSTYLES.find((h) => h.id === config.buddyHair)?.name },
      { trait_type: "Buddy Eyewear", value: EYES.find((e) => e.id === config.buddyEyes)?.name },
      { trait_type: "Buddy Outfit", value: OUTFITS.find((o) => o.id === config.buddyOutfit)?.name },
      { trait_type: "Buddy Accessory", value: ACCESSORIES.find((a) => a.id === config.buddyAccessory)?.name },
      { trait_type: "Background Matrix", value: config.bgPattern.toUpperCase() },
      { trait_type: "Blockchain", value: "Robinhood Chain & Bitcoin Taproot" },
      { trait_type: "Total Supply", value: "1,999 Capped" },
    ],
  };

  const copyMetadata = () => {
    navigator.clipboard.writeText(JSON.stringify(metadataJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Helper to format 16-digit card number with token id
  const formattedToken = String(config.tokenId).padStart(4, '0');
  const cardNumberDisplay = `4991  7029  8831  ${formattedToken}`;
  const truncatedEvm = `${config.evmAddress.slice(0, 6)}...${config.evmAddress.slice(-4)}`;

  return (
    <section id="credit-nft" className="py-24 bg-[#0e0c1a] border-y-2 border-[#1c1932] relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, ${activeTheme.accent} 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1932] border border-[#2c2650] text-[#FFD469] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Code className="w-3.5 h-3.5 text-[#77E0B0]" />
              <span>100% Pure Code &bull; On-Chain SVG Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F6F2FF] tracking-tight">
              Tether WDK RGB Credit Pass NFT
            </h2>
            <p className="text-sm sm:text-base text-[#c9c2e0] max-w-2xl mt-2 leading-relaxed">
              Generate, customize, and export your personal <strong>VIP Credit Pass NFT</strong> created entirely through code. Complete with a cryptographic EMV chip, contactless antenna, holographic security seal, and your custom character avatar!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={randomize}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1932] border border-[#2c2650] hover:border-[#FFD469] text-[#F6F2FF] font-mono text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Roll randomized combination"
            >
              <RotateCw className="w-4 h-4 text-[#FFD469]" />
              <span>Randomize</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1932] border border-[#2c2650] hover:border-[#77E0B0] text-[#77E0B0] font-mono text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isFlipped ? 'View Front' : 'Flip to Back'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Card 3D Preview (Left) + Customizer / Studio Controls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: 3D Interactive Card Viewport (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div 
              className="w-full max-w-[540px] aspect-[1.586/1] relative select-none cursor-grab active:cursor-grabbing perspective-[1200px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsFlipped(!isFlipped)}
              title="Click to Flip Card &bull; Move mouse for 3D holographic tilt"
            >
              {/* Animated 3D Holder */}
              <div 
                className="w-full h-full duration-200 transition-transform ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
                }}
              >
                
                {/* ================= FRONT OF CREDIT CARD ================= */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border-2 transition-all duration-300"
                  style={{
                    backfaceVisibility: 'hidden',
                    borderColor: activeTheme.border,
                  }}
                >
                  {/* PURE SVG CARD ENGINE - FRONT */}
                  <svg
                    ref={cardSvgRef}
                    viewBox="0 0 428 270"
                    className="w-full h-full image-pixelated"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="crispEdges"
                  >
                    <defs>
                      <linearGradient id={`grad-card-${filterId}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={activeTheme.bg} />
                        <stop offset="50%" stopColor="#121118" />
                        <stop offset="100%" stopColor={activeTheme.bg} />
                      </linearGradient>

                      {/* Foil shimmer overlay */}
                      <linearGradient id={`holo-sheen-${filterId}`} x1="0" y1="0" x2="1" y2="0.8">
                        <stop offset="0%" stopColor={activeTheme.accent} stopOpacity="0.15" />
                        <stop offset="35%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="55%" stopColor={activeTheme.border} stopOpacity="0.25" />
                        <stop offset="85%" stopColor={activeTheme.accent} stopOpacity="0.15" />
                      </linearGradient>

                      {/* Pixel Chip Texture */}
                      <pattern id={`circuit-pattern-${filterId}`} width="12" height="12" patternUnits="userSpaceOnUse">
                        <rect width="1" height="1" fill={activeTheme.border} fillOpacity="0.2" />
                        <rect x="6" y="6" width="1" height="1" fill={activeTheme.accent} fillOpacity="0.25" />
                      </pattern>
                    </defs>

                    {/* Card Base Layer */}
                    <rect width="428" height="270" rx="14" fill={`url(#grad-card-${filterId})`} />
                    <rect width="428" height="270" rx="14" fill={`url(#circuit-pattern-${filterId})`} />

                    {/* Micro Pixel Grid Background Mesh */}
                    {config.bgPattern === 'grid' && (
                      <g opacity="0.15">
                        {Array.from({ length: 27 }).map((_, i) => (
                          <line key={`h-${i}`} x1="0" y1={i * 10} x2="428" y2={i * 10} stroke={activeTheme.accent} strokeWidth="1" />
                        ))}
                        {Array.from({ length: 43 }).map((_, i) => (
                          <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="270" stroke={activeTheme.accent} strokeWidth="1" />
                        ))}
                      </g>
                    )}

                    {config.bgPattern === 'dots' && (
                      <g opacity="0.2">
                        {Array.from({ length: 14 }).map((_, r) =>
                          Array.from({ length: 22 }).map((_, c) => (
                            <rect
                              key={`dot-${r}-${c}`}
                              x={c * 20 + 8}
                              y={r * 20 + 8}
                              width="2"
                              height="2"
                              fill={activeTheme.accent}
                            />
                          ))
                        )}
                      </g>
                    )}

                    {config.bgPattern === 'circuit' && (
                      <g opacity="0.22" stroke={activeTheme.accent} strokeWidth="1.5" fill="none">
                        <path d="M 20 60 H 80 V 120 H 130" />
                        <path d="M 280 20 V 50 H 360 V 90" />
                        <path d="M 320 220 H 260 V 180 H 200" />
                        <rect x="128" y="118" width="4" height="4" fill={activeTheme.accent} />
                        <rect x="358" y="88" width="4" height="4" fill={activeTheme.accent} />
                        <rect x="198" y="178" width="4" height="4" fill={activeTheme.accent} />
                      </g>
                    )}

                    {/* Holographic / Light Sheen Layer */}
                    <rect width="428" height="270" rx="14" fill={`url(#holo-sheen-${filterId})`} />

                    {/* Outer Pixel Accent Border */}
                    <rect x="2" y="2" width="424" height="266" rx="12" fill="none" stroke={activeTheme.border} strokeWidth="2" strokeDasharray="8 4" opacity="0.75" />

                    {/* TOP HEADER: Brand Logo & Tier Tag */}
                    <g transform="translate(24, 22)">
                      {/* 4-Color Brand Square Mark */}
                      <g>
                        <rect x="0" y="0" width="8" height="8" fill="#9B87F5" />
                        <rect x="8" y="0" width="8" height="8" fill="#77E0B0" />
                        <rect x="0" y="8" width="8" height="8" fill="#FFD469" />
                        <rect x="8" y="8" width="8" height="8" fill="#FF9FC0" />
                      </g>
                      
                      {/* Brand Title */}
                      <text x="24" y="10" fill={activeTheme.textMain} fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700" letterSpacing="1">
                        TETHER WDK RGB
                      </text>
                      <text x="24" y="20" fill={activeTheme.textMuted} fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="8" fontWeight="600" letterSpacing="1.2">
                        CREDITS PASS &bull; BITCOIN TAPROOT
                      </text>
                    </g>

                    {/* Top Right: Tier Badge */}
                    <g transform="translate(320, 20)">
                      <rect x="0" y="0" width="84" height="18" rx="4" fill={activeTheme.accent} fillOpacity="0.2" stroke={activeTheme.accent} strokeWidth="1" />
                      <text x="42" y="12" fill={activeTheme.accent} fontFamily="'JetBrains Mono', monospace" fontSize="8" textAnchor="middle" fontWeight="bold">
                        {activeTheme.badge}
                      </text>
                    </g>

                    {/* ================= PIXEL EMV CHIP & CONTACTLESS ================= */}
                    <g transform="translate(28, 68)">
                      {/* Gold Chip Housing */}
                      <rect x="0" y="0" width="46" height="36" rx="6" fill={activeTheme.chipColor} stroke="#2b2005" strokeWidth="1.5" />
                      {/* Chip Internal Circuit Pads */}
                      <rect x="3" y="3" width="18" height="13" rx="2" fill={activeTheme.chipHighlight} fillOpacity="0.4" />
                      <rect x="25" y="3" width="18" height="13" rx="2" fill={activeTheme.chipHighlight} fillOpacity="0.4" />
                      <rect x="3" y="20" width="18" height="13" rx="2" fill={activeTheme.chipHighlight} fillOpacity="0.4" />
                      <rect x="25" y="20" width="18" height="13" rx="2" fill={activeTheme.chipHighlight} fillOpacity="0.4" />
                      <line x1="23" y1="2" x2="23" y2="34" stroke="#4a3608" strokeWidth="1.5" />
                      <line x1="2" y1="18" x2="44" y2="18" stroke="#4a3608" strokeWidth="1.5" />
                      <circle cx="23" cy="18" r="4" fill={activeTheme.chipColor} stroke="#4a3608" strokeWidth="1.5" />

                      {/* Contactless / NFC Waves */}
                      <g transform="translate(56, 10)" stroke={activeTheme.accent} strokeWidth="1.8" fill="none" strokeLinecap="round">
                        <path d="M 0 4 A 6 6 0 0 1 0 16" />
                        <path d="M 4 1 A 10 10 0 0 1 4 19" />
                        <path d="M 8 -2 A 14 14 0 0 1 8 22" />
                      </g>
                    </g>

                    {/* ================= PIXEL BUDDY AVATAR FRAME (Top Right) ================= */}
                    <g transform="translate(294, 60)">
                      {/* Outer Neon Glow Border */}
                      <rect x="-4" y="-4" width="112" height="112" rx="10" fill="#000000" fillOpacity="0.6" stroke={activeTheme.border} strokeWidth="2" />
                      <rect x="0" y="0" width="104" height="104" rx="8" fill="#141225" />
                      
                      {/* Inner Pixel Grid Canvas for Character */}
                      <g transform="translate(12, 10)">
                        {/* Shadow underneath */}
                        <ellipse cx="40" cy="74" rx="28" ry="6" fill="#000000" fillOpacity="0.5" />

                        {/* --- BODY / OUTFIT --- */}
                        {config.buddyOutfit === 'jacket' && (
                          <g>
                            <rect x="22" y="44" width="36" height="28" fill="#5A3A22" />
                            <rect x="20" y="46" width="6" height="24" fill="#3D2513" />
                            <rect x="54" y="46" width="6" height="24" fill="#3D2513" />
                            <rect x="36" y="44" width="8" height="28" fill="#FFF1D0" />
                          </g>
                        )}
                        {config.buddyOutfit === 'hoodie' && (
                          <g>
                            <rect x="20" y="44" width="40" height="28" fill="#181820" />
                            <rect x="28" y="48" width="24" height="18" fill="#252532" />
                            <line x1="34" y1="50" x2="34" y2="64" stroke="#FFF" strokeWidth="1.5" />
                            <line x1="46" y1="50" x2="46" y2="64" stroke="#FFF" strokeWidth="1.5" />
                          </g>
                        )}
                        {config.buddyOutfit === 'bomber' && (
                          <g>
                            <rect x="20" y="44" width="40" height="28" fill="#D4AF37" />
                            <rect x="36" y="44" width="8" height="28" fill="#FFD469" />
                            <rect x="20" y="46" width="6" height="24" fill="#AA8417" />
                            <rect x="54" y="46" width="6" height="24" fill="#AA8417" />
                          </g>
                        )}
                        {config.buddyOutfit === 'spacesuit' && (
                          <g>
                            <rect x="20" y="44" width="40" height="28" fill="#00f0ff" />
                            <rect x="34" y="48" width="12" height="12" fill="#ff007f" />
                            <circle cx="40" cy="54" r="3" fill="#FFF" />
                          </g>
                        )}
                        {config.buddyOutfit === 'tux' && (
                          <g>
                            <rect x="20" y="44" width="40" height="28" fill="#0A0A0E" />
                            <polygon points="34,44 40,58 46,44" fill="#FFF" />
                            <polygon points="37,47 43,47 40,51" fill="#FF0044" />
                          </g>
                        )}

                        {/* --- HEAD / SKIN --- */}
                        <rect x="24" y="18" width="32" height="28" rx="2" fill={activeSkin.hex} />
                        <rect x="24" y="38" width="32" height="8" fill={activeSkin.shadow} />

                        {/* --- EARS --- */}
                        <rect x="20" y="26" width="4" height="8" fill={activeSkin.hex} />
                        <rect x="56" y="26" width="4" height="8" fill={activeSkin.hex} />

                        {/* --- HAIR / HEADWEAR --- */}
                        {config.buddyHair === 'crown' && (
                          <g>
                            <polygon points="22,18 26,6 32,14 40,4 48,14 54,6 58,18" fill="#FFD469" stroke="#9E7600" strokeWidth="1" />
                            <circle cx="26" cy="7" r="1.5" fill="#FF4444" />
                            <circle cx="40" cy="5" r="1.5" fill="#00f0ff" />
                            <circle cx="54" cy="7" r="1.5" fill="#77E0B0" />
                          </g>
                        )}
                        {config.buddyHair === 'cowboy' && (
                          <g>
                            <rect x="14" y="16" width="52" height="5" rx="2" fill="#E8DCC4" />
                            <rect x="22" y="4" width="36" height="14" rx="4" fill="#C5B18D" />
                            <rect x="22" y="14" width="36" height="3" fill="#7A4E1D" />
                          </g>
                        )}
                        {config.buddyHair === 'cap' && (
                          <g>
                            <rect x="20" y="12" width="40" height="9" fill="#111" />
                            <rect x="36" y="16" width="28" height="4" fill="#333" />
                            <rect x="28" y="14" width="6" height="4" fill="#FFD469" />
                          </g>
                        )}
                        {config.buddyHair === 'visor' && (
                          <g>
                            <rect x="20" y="14" width="40" height="6" fill="#1a1a2e" />
                            <rect x="22" y="16" width="36" height="4" fill="#00f0ff" />
                          </g>
                        )}
                        {config.buddyHair === 'spiky' && (
                          <g>
                            <polygon points="22,18 26,8 30,18 36,6 42,18 48,8 54,18" fill="#FFFFFF" />
                            <rect x="22" y="16" width="36" height="4" fill="#FF0055" />
                          </g>
                        )}
                        {config.buddyHair === 'halo' && (
                          <ellipse cx="40" cy="8" rx="18" ry="4" fill="none" stroke="#FFD469" strokeWidth="2.5" />
                        )}

                        {/* --- EYES / EYEWEAR --- */}
                        {config.buddyEyes === 'shades' && (
                          <g>
                            <rect x="24" y="24" width="32" height="7" fill="#000000" />
                            <rect x="25" y="25" width="13" height="5" fill="#141414" />
                            <rect x="42" y="25" width="13" height="5" fill="#141414" />
                            <line x1="26" y1="26" x2="30" y2="26" stroke="#FFFFFF" strokeWidth="1" />
                            <line x1="43" y1="26" x2="47" y2="26" stroke="#FFFFFF" strokeWidth="1" />
                          </g>
                        )}
                        {config.buddyEyes === 'laser' && (
                          <g>
                            <rect x="26" y="25" width="10" height="4" fill="#FF0044" />
                            <rect x="44" y="25" width="10" height="4" fill="#FF0044" />
                            <rect x="28" y="26" width="6" height="2" fill="#FFFFFF" />
                            <rect x="46" y="26" width="6" height="2" fill="#FFFFFF" />
                          </g>
                        )}
                        {config.buddyEyes === 'vr' && (
                          <g>
                            <rect x="22" y="23" width="36" height="9" rx="2" fill="#00f0ff" />
                            <rect x="24" y="25" width="14" height="5" fill="#05141e" />
                            <rect x="42" y="25" width="14" height="5" fill="#05141e" />
                            <circle cx="31" cy="27" r="1.5" fill="#00f0ff" />
                            <circle cx="49" cy="27" r="1.5" fill="#00f0ff" />
                          </g>
                        )}
                        {config.buddyEyes === 'classic' && (
                          <g>
                            <rect x="28" y="25" width="6" height="5" fill="#FFFFFF" />
                            <rect x="46" y="25" width="6" height="5" fill="#FFFFFF" />
                            <rect x="31" y="26" width="3" height="4" fill="#000000" />
                            <rect x="49" y="26" width="3" height="4" fill="#000000" />
                          </g>
                        )}
                        {config.buddyEyes === 'star' && (
                          <g>
                            <polygon points="31,23 33,28 38,28 34,31 36,36 31,33 26,36 28,31 24,28 29,28" fill="#FFD469" />
                            <polygon points="49,23 51,28 56,28 52,31 54,36 49,33 44,36 46,31 42,28 47,28" fill="#FFD469" />
                          </g>
                        )}

                        {/* --- MOUTH --- */}
                        <rect x="36" y="36" width="8" height="2" fill="#693B1F" />

                        {/* --- ACCESSORIES --- */}
                        {config.buddyAccessory === 'airpod' && (
                          <g>
                            <rect x="18" y="28" width="3" height="8" fill="#FFFFFF" rx="1" />
                            <circle cx="19" cy="28" r="2" fill="#FFFFFF" />
                          </g>
                        )}
                        {config.buddyAccessory === 'goldchain' && (
                          <g>
                            <path d="M 28 46 Q 40 56 52 46" stroke="#FFD469" strokeWidth="2.5" fill="none" />
                            <rect x="38" y="52" width="4" height="4" fill="#FFD469" />
                          </g>
                        )}
                        {config.buddyAccessory === 'earring' && (
                          <g>
                            <line x1="21" y1="32" x2="21" y2="38" stroke="#D1D5DB" strokeWidth="1.5" />
                            <line x1="19" y1="34" x2="23" y2="34" stroke="#D1D5DB" strokeWidth="1.5" />
                          </g>
                        )}
                        {config.buddyAccessory === 'bubblegum' && (
                          <circle cx="44" cy="38" r="6" fill="#FF69B4" opacity="0.9" />
                        )}
                      </g>

                      {/* Token Tag under Avatar */}
                      <text x="52" y="96" fill={activeTheme.accent} fontFamily="'JetBrains Mono', monospace" fontSize="8" textAnchor="middle" fontWeight="bold">
                        #{formattedToken} / 1999
                      </text>
                    </g>

                    {/* ================= CARD NUMBER (EMBOSSED PIXEL) ================= */}
                    <g transform="translate(28, 142)">
                      {/* Shadow for embossed effect */}
                      <text x="1" y="1" fill="#000000" fillOpacity="0.75" fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="700" letterSpacing="3.5">
                        {cardNumberDisplay}
                      </text>
                      {/* Main text */}
                      <text x="0" y="0" fill={activeTheme.textMain} fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="700" letterSpacing="3.5">
                        {cardNumberDisplay}
                      </text>
                    </g>

                    {/* ================= VALID THRU & LIMIT ================= */}
                    <g transform="translate(28, 180)">
                      <text x="0" y="0" fill={activeTheme.textMuted} fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" fontWeight="bold" letterSpacing="1">
                        VALID THRU
                      </text>
                      <text x="64" y="0" fill={activeTheme.textMain} fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="bold">
                        {config.expiry}
                      </text>

                      <text x="140" y="0" fill={activeTheme.textMuted} fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" fontWeight="bold" letterSpacing="1">
                        CREDIT LIMIT
                      </text>
                      <text x="210" y="0" fill="#77E0B0" fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="bold">
                        {config.creditLimit}
                      </text>
                    </g>

                    {/* ================= CARDHOLDER & EVM ADDRESS ================= */}
                    <g transform="translate(28, 226)">
                      {/* Cardholder name */}
                      <text x="0" y="0" fill={activeTheme.textMain} fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="12" fontWeight="bold" letterSpacing="1">
                        {config.cardholder.toUpperCase()}
                      </text>
                      {/* EVM Address Tag */}
                      <text x="0" y="16" fill={activeTheme.textMuted} fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="600">
                        EVM: {truncatedEvm}
                      </text>
                    </g>

                    {/* Hologram Diamond Seal (Bottom Right) */}
                    <g transform="translate(378, 224)">
                      <circle cx="16" cy="16" r="16" fill={activeTheme.accent} fillOpacity="0.25" stroke={activeTheme.border} strokeWidth="1.5" />
                      <polygon points="16,4 26,16 16,28 6,16" fill={activeTheme.accent} opacity="0.8" />
                      <polygon points="16,8 22,16 16,24 10,16" fill="#FFFFFF" opacity="0.6" />
                    </g>

                  </svg>
                </div>


                {/* ================= BACK OF CREDIT CARD ================= */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border-2 transition-all duration-300"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderColor: activeTheme.border,
                  }}
                >
                  {/* PURE SVG CARD ENGINE - BACK */}
                  <svg
                    ref={cardBackSvgRef}
                    viewBox="0 0 428 270"
                    className="w-full h-full image-pixelated"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="crispEdges"
                  >
                    {/* Dark Card Base */}
                    <rect width="428" height="270" rx="14" fill="#0c0b12" />

                    {/* Magnetic Stripe */}
                    <rect x="0" y="28" width="428" height="46" fill="#1a1824" stroke="#2c283d" strokeWidth="1" />
                    {Array.from({ length: 18 }).map((_, i) => (
                      <line key={`mag-${i}`} x1="0" y1={30 + i * 2.5} x2="428" y2={30 + i * 2.5} stroke="#110f17" strokeWidth="1" />
                    ))}

                    {/* Signature Strip */}
                    <g transform="translate(24, 96)">
                      {/* White textured signature rectangle */}
                      <rect x="0" y="0" width="280" height="38" rx="3" fill="#e6e1f2" />
                      {/* Hash security pattern */}
                      {Array.from({ length: 14 }).map((_, i) => (
                        <line key={`sig-hash-${i}`} x1={i * 20} y1="0" x2={i * 20 + 15} y2="38" stroke="#ccc5e0" strokeWidth="1" />
                      ))}
                      {/* Cursive style pixel signature */}
                      <path 
                        d="M 20 24 Q 40 10 60 26 T 100 20 T 140 28 T 190 18" 
                        fill="none" 
                        stroke="#1a1438" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />
                      <text x="210" y="24" fill="#7d7599" fontFamily="'JetBrains Mono', monospace" fontSize="8">
                        AUTH SIG
                      </text>

                      {/* 3-Digit CVV Box */}
                      <rect x="292" y="0" width="80" height="38" rx="3" fill="#201c33" stroke={activeTheme.border} strokeWidth="1.5" />
                      <text x="332" y="14" fill={activeTheme.textMuted} fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" textAnchor="middle" fontWeight="bold">
                        SECURITY CVV
                      </text>
                      <text x="332" y="29" fill="#FFD469" fontFamily="'JetBrains Mono', monospace" fontSize="12" textAnchor="middle" fontWeight="bold">
                        999
                      </text>
                    </g>

                    {/* Pixel Barcode / QR Simulation */}
                    <g transform="translate(24, 150)">
                      {Array.from({ length: 42 }).map((_, i) => (
                        <rect
                          key={`bar-${i}`}
                          x={i * 5}
                          y="0"
                          width={i % 3 === 0 ? 3 : 1.5}
                          height="24"
                          fill={activeTheme.accent}
                          opacity={i % 5 === 0 ? 0.4 : 0.85}
                        />
                      ))}
                      <text x="0" y="36" fill={activeTheme.textMuted} fontFamily="'JetBrains Mono', monospace" fontSize="7">
                        AUTH HASH: {config.evmAddress}
                      </text>
                    </g>

                    {/* Legal / Smart Contract Microprint */}
                    <g transform="translate(24, 204)">
                      <text x="0" y="0" fill="#7d7599" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" width="380">
                        This digital pass confers verified membership to Deploy Tether WDK RGB Wallet.
                      </text>
                      <text x="0" y="10" fill="#7d7599" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7">
                        1,999 Total Supply &bull; Taproot Single-Use Seals &bull; Floor Protection Guarantee.
                      </text>
                      <text x="0" y="20" fill={activeTheme.accent} fontFamily="'JetBrains Mono', monospace" fontSize="8" fontWeight="bold">
                        OFFICIAL CONTRACT &bull; https://x.com/tether_to
                      </text>
                    </g>

                    {/* Holographic Chip on Back */}
                    <g transform="translate(346, 194)">
                      <rect x="0" y="0" width="50" height="42" rx="6" fill={activeTheme.accent} fillOpacity="0.2" stroke={activeTheme.border} strokeWidth="1" />
                      <circle cx="25" cy="21" r="12" fill="none" stroke={activeTheme.accent} strokeWidth="1.5" strokeDasharray="3 2" />
                      <text x="25" y="24" fill={activeTheme.accent} fontFamily="'JetBrains Mono', monospace" fontSize="7" textAnchor="middle">
                        VIP OK
                      </text>
                    </g>

                  </svg>
                </div>

              </div>
            </div>

            {/* Helper Hint */}
            <div className="flex items-center gap-4 mt-6 text-xs text-[#c9c2e0]/80">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD469]" />
                Move mouse for 3D holographic sheen
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#77E0B0]" />
                Click card to flip front/back
              </span>
            </div>

            {/* Quick Action Button Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <button
                onClick={downloadPNG}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#77E0B0] text-[#0e2f45] font-bold text-xs hover:bg-[#9BF8CF] transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Crisp PNG</span>
              </button>

              <button
                onClick={copySvgCode}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1932] border border-[#2c2650] text-[#c9c2e0] hover:text-white font-mono text-xs hover:border-[#FFD469]/50 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-[#77E0B0]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'SVG Copied!' : 'Copy Raw SVG Code'}</span>
              </button>

              <button
                onClick={() => setShowJsonModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1932] border border-[#2c2650] text-[#c9c2e0] hover:text-white font-mono text-xs hover:border-[#FF9FC0]/50 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#FF9FC0]" />
                <span>OpenSea JSON Metadata</span>
              </button>

              {onUseForWhitelist && (
                <button
                  onClick={() => onUseForWhitelist(config.cardholder.toLowerCase().replace(/\s+/g, ''), config.evmAddress)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD469] text-[#141225] font-bold text-xs hover:bg-[#FFE394] transition-colors shadow-sm cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#141225]" />
                  <span>Use in FCFS Whitelist</span>
                </button>
              )}
            </div>

          </div>


          {/* RIGHT: Interactive Customizer Studio (5 Cols) */}
          <div className="lg:col-span-5 bg-[#141225] border-2 border-[#1c1932] rounded-2xl p-6 shadow-xl">
            
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1c1932]">
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-[#FFD469]" />
                <h3 className="text-base font-bold text-[#F6F2FF] tracking-tight">
                  Card Studio Controls
                </h3>
              </div>
              <span className="font-mono text-xs text-[#77E0B0] bg-[#77E0B0]/10 px-2 py-0.5 rounded border border-[#77E0B0]/30 font-bold">
                Pass #{formattedToken}
              </span>
            </div>

            <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
              
              {/* 1. Card Tier / Material */}
              <div>
                <label className="block text-xs font-bold text-[#c9c2e0] uppercase tracking-wider mb-2">
                  Card Tier Material
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((tierKey) => {
                    const t = THEMES[tierKey];
                    const isSelected = config.tier === tierKey;
                    return (
                      <button
                        key={tierKey}
                        onClick={() => setConfig({ ...config, tier: tierKey })}
                        className={`px-2.5 py-2 rounded-lg text-left text-xs font-mono font-bold transition-all border ${
                          isSelected
                            ? 'bg-[#1c1932] border-[#FFD469] text-white shadow-md'
                            : 'bg-[#161426] border-[#25213b] text-[#c9c2e0]/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: t.accent }}
                          />
                          <span className="truncate">{t.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Cardholder Name & EVM Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#c9c2e0] uppercase tracking-wider mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={config.cardholder}
                    onChange={(e) => setConfig({ ...config, cardholder: e.target.value.toUpperCase().slice(0, 18) })}
                    maxLength={18}
                    className="w-full bg-[#1c1932] border border-[#2c2650] focus:border-[#FFD469] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                    placeholder="E.g. VIP HOLDER"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#c9c2e0] uppercase tracking-wider mb-1">
                    Token ID (1 - 1999)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1999}
                    value={config.tokenId}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setConfig({ ...config, tokenId: isNaN(val) ? 1 : Math.max(1, Math.min(1999, val)) });
                    }}
                    className="w-full bg-[#1c1932] border border-[#2c2650] focus:border-[#77E0B0] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c9c2e0] uppercase tracking-wider mb-1">
                  EVM Wallet Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.evmAddress}
                    onChange={(e) => setConfig({ ...config, evmAddress: e.target.value })}
                    className="w-full bg-[#1c1932] border border-[#2c2650] focus:border-[#77E0B0] rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-white outline-none"
                    placeholder="0x..."
                  />
                  <Wallet className="w-3.5 h-3.5 text-[#c9c2e0]/60 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* 3. Pixel Buddy Traits */}
              <div className="pt-2 border-t border-[#1c1932]">
                <span className="block text-xs font-bold text-[#FFD469] uppercase tracking-wider mb-2">
                  Buddy Avatar Customization
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {/* Skin */}
                  <div>
                    <label className="block text-[11px] text-[#c9c2e0] mb-1">Skin Tone</label>
                    <select
                      value={config.buddySkin}
                      onChange={(e) => setConfig({ ...config, buddySkin: e.target.value })}
                      className="w-full bg-[#1c1932] border border-[#2c2650] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                    >
                      {SKINS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hair / Headwear */}
                  <div>
                    <label className="block text-[11px] text-[#c9c2e0] mb-1">Headpiece</label>
                    <select
                      value={config.buddyHair}
                      onChange={(e) => setConfig({ ...config, buddyHair: e.target.value })}
                      className="w-full bg-[#1c1932] border border-[#2c2650] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                    >
                      {HAIRSTYLES.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Eyes */}
                  <div>
                    <label className="block text-[11px] text-[#c9c2e0] mb-1">Eyewear / Shades</label>
                    <select
                      value={config.buddyEyes}
                      onChange={(e) => setConfig({ ...config, buddyEyes: e.target.value })}
                      className="w-full bg-[#1c1932] border border-[#2c2650] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                    >
                      {EYES.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Outfit */}
                  <div>
                    <label className="block text-[11px] text-[#c9c2e0] mb-1">Wardrobe Outfit</label>
                    <select
                      value={config.buddyOutfit}
                      onChange={(e) => setConfig({ ...config, buddyOutfit: e.target.value })}
                      className="w-full bg-[#1c1932] border border-[#2c2650] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                    >
                      {OUTFITS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Accessory */}
                  <div className="col-span-2">
                    <label className="block text-[11px] text-[#c9c2e0] mb-1">Special Accessory</label>
                    <select
                      value={config.buddyAccessory}
                      onChange={(e) => setConfig({ ...config, buddyAccessory: e.target.value })}
                      className="w-full bg-[#1c1932] border border-[#2c2650] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                    >
                      {ACCESSORIES.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Background Matrix Pattern */}
              <div className="pt-2 border-t border-[#1c1932]">
                <label className="block text-xs font-bold text-[#c9c2e0] uppercase tracking-wider mb-2">
                  Security Hologram Matrix
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['circuit', 'grid', 'dots', 'carbon'] as const).map((pat) => (
                    <button
                      key={pat}
                      onClick={() => setConfig({ ...config, bgPattern: pat })}
                      className={`py-1.5 px-2 rounded text-[11px] font-mono capitalize transition-all border ${
                        config.bgPattern === pat
                          ? 'bg-[#1c1932] border-[#77E0B0] text-[#77E0B0]'
                          : 'bg-[#161426] border-[#25213b] text-[#c9c2e0]/60 hover:text-white'
                      }`}
                    >
                      {pat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Summary Pill */}
            <div className="mt-4 pt-4 border-t border-[#1c1932] flex items-center justify-between text-xs text-[#c9c2e0]/80">
              <span className="flex items-center gap-1.5 font-mono">
                <Shield className="w-3.5 h-3.5 text-[#77E0B0]" />
                100% Vector &bull; Crisp Pixel Scale
              </span>
              <span className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                ROBINHOOD &bull; TAPROOT
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL: OpenSea JSON Metadata */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141225] border-2 border-[#2c2650] rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2c2650]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF9FC0]" />
                <h4 className="text-base font-bold text-white tracking-tight">
                  ERC-721 Metadata JSON
                </h4>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-[#c9c2e0] hover:text-white font-mono text-sm px-2 py-1 rounded bg-[#1c1932]"
              >
                &times; Close
              </button>
            </div>

            <p className="text-xs text-[#c9c2e0] mb-3">
              Standard OpenSea / IPFS compliant token metadata for your generated Pixel Credit Card NFT:
            </p>

            <pre className="bg-[#0b0a14] border border-[#25213b] rounded-xl p-4 text-[11px] font-mono text-[#77E0B0] overflow-x-auto max-h-80 select-all">
              {JSON.stringify(metadataJson, null, 2)}
            </pre>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={copyMetadata}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD469] text-[#141225] font-bold text-xs hover:bg-[#FFE394] transition-colors cursor-pointer"
              >
                {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedJson ? 'Metadata Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
