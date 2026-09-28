import React, { useState } from 'react';
import { FunkyBuddy } from '../types';
import { PixelBuddy } from './PixelBuddy';
import { Sparkles, X, Check, Wand2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface BuddyCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onSmokeRevealCustom: (buddy: FunkyBuddy) => void;
}

export const BuddyCustomizer: React.FC<BuddyCustomizerProps> = ({
  isOpen,
  onClose,
  onSmokeRevealCustom,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('MyBuddy');
  const [skinColor, setSkinColor] = useState('#6ee7b7');
  const [headwear, setHeadwear] = useState<FunkyBuddy['headwear']>('cowboy_white');
  const [outfitType, setOutfitType] = useState<FunkyBuddy['outfitType']>('shearling_jacket');
  const [accessory, setAccessory] = useState<FunkyBuddy['accessory']>('airpod_left');
  const [expression, setExpression] = useState<FunkyBuddy['expression']>('calm');

  const skinOptions = [
    { label: 'Mint', hex: '#6ee7b7' },
    { label: 'Lavender', hex: '#a78bfa' },
    { label: 'Amber', hex: '#fbbf24' },
    { label: 'Pink', hex: '#f472b6' },
    { label: 'Sky Blue', hex: '#38bdf8' },
    { label: 'Golden', hex: '#fde047' },
    { label: 'Cosmic', hex: '#818cf8' },
  ];

  const headwearOptions = [
    { id: 'cowboy_white', label: 'Cowboy Hat (Dusty)' },
    { id: 'spiky_white_headband', label: 'Spiky Hair + Headband (Spike)' },
    { id: 'cap_black_lightning', label: 'Street Cap + Lightning (Blaze)' },
    { id: 'cap_black_crest', label: 'Hype Fitted Cap (Neon)' },
    { id: 'crown_gold', label: '24K Pixel Crown' },
    { id: 'cosmic_halo', label: 'Stellar Halo' },
  ];

  const outfitOptions = [
    { id: 'shearling_jacket', label: 'Fur Shearling Jacket' },
    { id: 'hoodie_white', label: 'Crewneck + Sling Bag' },
    { id: 'hoodie_black', label: 'Black Street Hoodie' },
    { id: 'hoodie_black_cross', label: 'Oversized Hoodie' },
    { id: 'golden_bomber', label: '24K Golden Bomber' },
    { id: 'stellar_cloak', label: 'Cosmic Cloak' },
  ];

  const accessoryOptions = [
    { id: 'airpod_left', label: 'Left AirPod' },
    { id: 'airpod_both', label: 'Dual AirPods' },
    { id: 'cross_earring_silver', label: 'Silver Cross Earring' },
    { id: 'star_orb', label: 'Star Charm' },
    { id: 'diamond_chain', label: 'Diamond Drip Chain' },
  ];

  const expressionOptions = [
    { id: 'calm', label: 'Calm' },
    { id: 'smile', label: 'Happy Smile' },
    { id: 'smirk', label: 'Street Smirk' },
    { id: 'blush', label: 'Cute Blush' },
    { id: 'cool', label: 'Chill' },
  ];

  const customBuddy: FunkyBuddy = {
    id: `custom_${Date.now()}`,
    name: name.trim() || 'MyBuddy',
    title: 'Custom Vibe Maker',
    skinColor,
    hairColor: '#0f172a',
    headwear,
    outfitColor: '#18181b',
    outfitType,
    accessory,
    expression,
    rarity: 'epic',
    dropRate: 100,
    vibeScore: 99,
    grooveLevel: 97,
    streetCred: 98,
    quote: 'Be unique. Be you. Be a buddy.',
    themeColor: skinColor,
    badge: '🎨',
    boxArtworkIndex: 0,
  };

  const handleLaunchReveal = () => {
    sound.playClick();
    onSmokeRevealCustom(customBuddy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl bg-[#FAF5E9] border-4 border-[#1F1B18] rounded-2xl shadow-2xl p-6 text-[#1F1B18] max-h-[90vh] overflow-y-auto">
        {/* Modal Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 bg-neutral-200 hover:bg-neutral-300 rounded-full border-2 border-[#1F1B18] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="w-5 h-5 text-purple-600" />
          <h2 className="font-pixel text-xl font-black">
            BUDDY CUSTOMIZER
          </h2>
        </div>
        <p className="text-xs text-neutral-600 mb-6 font-semibold">
          Design your one-of-a-kind Funky Buddy & launch an exclusive Smoke Reveal!
        </p>

        {/* Content Layout: Left Live Preview, Right Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Live Character Preview Card */}
          <div className="bg-[#1C1A24] border-3 border-[#1F1B18] rounded-xl p-4 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden shadow-inner">
            <div className="absolute top-3 left-3 bg-white/10 px-2 py-0.5 rounded text-[10px] font-pixel text-amber-300 border border-white/10">
              PREVIEW
            </div>
            <PixelBuddy buddy={customBuddy} size="lg" isFloating={true} showAura={true} />
            <div className="mt-2 text-center">
              <span className="font-pixel text-sm text-white font-bold block">{customBuddy.name}</span>
              <span className="text-[10px] text-amber-300 font-mono">Custom Edition</span>
            </div>
          </div>

          {/* Controls Form */}
          <div className="space-y-4">
            {/* Buddy Name */}
            <div>
              <label className="block font-pixel text-xs text-[#1F1B18] mb-1">
                BUDDY NAME
              </label>
              <input
                type="text"
                value={name}
                maxLength={14}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-[#1F1B18] rounded-lg font-pixel text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Name your buddy"
              />
            </div>

            {/* Skin Tone Swatches */}
            <div>
              <label className="block font-pixel text-xs text-[#1F1B18] mb-1.5">
                SKIN COLOR
              </label>
              <div className="flex flex-wrap gap-2">
                {skinOptions.map((s) => (
                  <button
                    key={s.hex}
                    onClick={() => {
                      sound.playClick();
                      setSkinColor(s.hex);
                    }}
                    className={`w-7 h-7 rounded-md border-2 transition-transform cursor-pointer relative ${
                      skinColor === s.hex ? 'border-[#1F1B18] scale-110 shadow-md ring-2 ring-amber-400' : 'border-neutral-400'
                    }`}
                    style={{ backgroundColor: s.hex }}
                    title={s.label}
                  >
                    {skinColor === s.hex && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Headwear Select */}
            <div>
              <label className="block font-pixel text-xs text-[#1F1B18] mb-1">
                HEADWEAR / HAT
              </label>
              <select
                value={headwear}
                onChange={(e) => {
                  sound.playClick();
                  setHeadwear(e.target.value as FunkyBuddy['headwear']);
                }}
                className="w-full px-3 py-2 bg-white border-2 border-[#1F1B18] rounded-lg text-xs font-semibold focus:outline-none"
              >
                {headwearOptions.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Outfit Select */}
            <div>
              <label className="block font-pixel text-xs text-[#1F1B18] mb-1">
                OUTFIT STYLE
              </label>
              <select
                value={outfitType}
                onChange={(e) => {
                  sound.playClick();
                  setOutfitType(e.target.value as FunkyBuddy['outfitType']);
                }}
                className="w-full px-3 py-2 bg-white border-2 border-[#1F1B18] rounded-lg text-xs font-semibold focus:outline-none"
              >
                {outfitOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accessory & Expression Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-pixel text-[10px] text-[#1F1B18] mb-1">
                  ACCESSORY
                </label>
                <select
                  value={accessory}
                  onChange={(e) => {
                    sound.playClick();
                    setAccessory(e.target.value as FunkyBuddy['accessory']);
                  }}
                  className="w-full px-2 py-1.5 bg-white border-2 border-[#1F1B18] rounded-lg text-xs focus:outline-none"
                >
                  {accessoryOptions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-pixel text-[10px] text-[#1F1B18] mb-1">
                  EXPRESSION
                </label>
                <select
                  value={expression}
                  onChange={(e) => {
                    sound.playClick();
                    setExpression(e.target.value as FunkyBuddy['expression']);
                  }}
                  className="w-full px-2 py-1.5 bg-white border-2 border-[#1F1B18] rounded-lg text-xs focus:outline-none"
                >
                  {expressionOptions.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t-2 border-[#1F1B18]/15 flex justify-end gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 font-pixel text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleLaunchReveal}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-pixel text-xs font-bold rounded-xl border-2 border-[#1F1B18] shadow-[0_4px_0_#1F1B18] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>PACK IN BOX & SMOKE REVEAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
