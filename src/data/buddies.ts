import { FunkyBuddy, SmokePreset } from '../types';

export const FUNKY_BUDDIES: FunkyBuddy[] = [
  {
    id: 'dusty',
    name: 'Dusty',
    title: 'Frontier Nomad',
    skinColor: '#6ee7b7', // Mint green from the box
    hairColor: '#1e293b',
    headwear: 'cowboy_white',
    outfitColor: '#78350f',
    outfitType: 'shearling_jacket',
    accessory: 'airpod_left',
    expression: 'calm',
    rarity: 'common',
    dropRate: 35,
    vibeScore: 92,
    grooveLevel: 88,
    streetCred: 90,
    quote: 'Good vibes only under this ten-gallon hat.',
    themeColor: '#10b981',
    badge: '🤠',
    boxArtworkIndex: 0,
  },
  {
    id: 'spike',
    name: 'Spike',
    title: 'Cyber Pulse',
    skinColor: '#a78bfa', // Lavender/periwinkle from the box
    hairColor: '#f8fafc', // Spiky white hair
    headwear: 'spiky_white_headband',
    outfitColor: '#f1f5f9', // White hoodie with cross strap
    outfitType: 'hoodie_white',
    accessory: 'airpod_both',
    expression: 'smile',
    rarity: 'common',
    dropRate: 30,
    vibeScore: 94,
    grooveLevel: 91,
    streetCred: 89,
    quote: 'Keep your earbuds in and your frequency high.',
    themeColor: '#8b5cf6',
    badge: '⚡',
    boxArtworkIndex: 1,
  },
  {
    id: 'blaze',
    name: 'Blaze',
    title: 'Street Sensei',
    skinColor: '#fbbf24', // Warm amber from the box
    hairColor: '#0f172a',
    headwear: 'cap_black_lightning',
    outfitColor: '#18181b', // Black streetwear hoodie
    outfitType: 'hoodie_black',
    accessory: 'cross_earring_silver',
    expression: 'smirk',
    rarity: 'rare',
    dropRate: 20,
    vibeScore: 96,
    grooveLevel: 95,
    streetCred: 97,
    quote: 'No static, no drama. Strictly high-fidelity groove.',
    themeColor: '#f59e0b',
    badge: '🔥',
    boxArtworkIndex: 2,
  },
  {
    id: 'neon',
    name: 'Neon',
    title: 'Hype Darling',
    skinColor: '#f472b6', // Pink from the box
    hairColor: '#0f172a',
    headwear: 'cap_black_crest',
    outfitColor: '#18181b',
    outfitType: 'hoodie_black_cross',
    accessory: 'cross_earring_double',
    expression: 'blush',
    rarity: 'epic',
    dropRate: 10,
    vibeScore: 98,
    grooveLevel: 94,
    streetCred: 96,
    quote: 'Be unique. Be you. Be a buddy.',
    themeColor: '#ec4899',
    badge: '💖',
    boxArtworkIndex: 3,
  },
  {
    id: 'phantom',
    name: 'Phantom',
    title: 'Void Drifter',
    skinColor: '#818cf8',
    hairColor: '#312e81',
    headwear: 'cosmic_halo',
    outfitColor: '#1e1b4b',
    outfitType: 'stellar_cloak',
    accessory: 'star_orb',
    expression: 'enigmatic',
    rarity: 'secret',
    dropRate: 3.5,
    vibeScore: 99,
    grooveLevel: 98,
    streetCred: 99,
    quote: 'From the deepest smoke, the secret frequencies emerge.',
    themeColor: '#6366f1',
    badge: '🌌',
    boxArtworkIndex: 4,
  },
  {
    id: 'aurum',
    name: 'Aurum',
    title: '24K Legend',
    skinColor: '#fde047',
    hairColor: '#f59e0b',
    headwear: 'crown_gold',
    outfitColor: '#eab308',
    outfitType: 'golden_bomber',
    accessory: 'diamond_chain',
    expression: 'cool',
    rarity: 'secret',
    dropRate: 1.5,
    vibeScore: 100,
    grooveLevel: 100,
    streetCred: 100,
    quote: 'Good vibes only, certified 24-karat soul.',
    themeColor: '#eab308',
    badge: '👑',
    boxArtworkIndex: 5,
  },
];

export const SMOKE_PRESETS: SmokePreset[] = [
  {
    id: 'cotton_candy',
    name: 'Pastel Dream',
    colors: ['#FDE2E4', '#E2ECE9', '#BEE1E6', '#DFE7FD', '#CDDAFD'],
    particleMode: 'cloud',
    description: 'Fluffy pastel clouds inspired by the Funky Buddies ribbon & stars',
  },
  {
    id: 'midnight_fog',
    name: 'Neon Haze',
    colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#06b6d4'],
    particleMode: 'cosmic',
    description: 'Vibrant neon smoke with floating celestial particles',
  },
  {
    id: 'pixel_puff',
    name: '8-Bit Retro Vapor',
    colors: ['#FFFFFF', '#D4D4D8', '#A1A1AA', '#71717A', '#FDE047'],
    particleMode: 'pixel',
    description: 'Chunky square pixel puffs straight out of classic arcade games',
  },
  {
    id: 'golden_glamour',
    name: 'Golden Stardust',
    colors: ['#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#FFFFFF'],
    particleMode: 'golden',
    description: 'Luxurious 24K sparkling dust cloud with glittering light',
  },
];

// Helper to pull random buddy with weighted probabilities
export function pullRandomBuddy(): FunkyBuddy {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const buddy of FUNKY_BUDDIES) {
    cumulative += buddy.dropRate;
    if (roll <= cumulative) {
      return buddy;
    }
  }
  return FUNKY_BUDDIES[0];
}
