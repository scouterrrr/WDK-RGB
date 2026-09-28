export type BuddyRarity = 'common' | 'rare' | 'epic' | 'secret';

export interface FunkyBuddy {
  id: string;
  name: string;
  title: string;
  skinColor: string;
  hairColor: string;
  headwear: 'cowboy_white' | 'spiky_white_headband' | 'cap_black_lightning' | 'cap_black_crest' | 'cosmic_halo' | 'crown_gold';
  outfitColor: string;
  outfitType: 'shearling_jacket' | 'hoodie_white' | 'hoodie_black' | 'hoodie_black_cross' | 'stellar_cloak' | 'golden_bomber';
  accessory: 'airpod_left' | 'airpod_both' | 'cross_earring_silver' | 'cross_earring_double' | 'star_orb' | 'diamond_chain';
  expression: 'calm' | 'smile' | 'smirk' | 'blush' | 'enigmatic' | 'cool';
  rarity: BuddyRarity;
  dropRate: number; // percentage
  vibeScore: number;
  grooveLevel: number;
  streetCred: number;
  quote: string;
  themeColor: string;
  badge: string;
  boxArtworkIndex: number;
}

export interface DiscoveredBuddy {
  buddy: FunkyBuddy;
  unboxedAt: number;
  count: number;
}

export interface SmokePreset {
  id: string;
  name: string;
  colors: string[];
  particleMode: 'cloud' | 'pixel' | 'cosmic' | 'golden';
  description: string;
}

export type BoxPhase = 
  | 'idle'           // Sealed box waiting with ribbon
  | 'untying'        // Ribbon being untied animation
  | 'cracked'        // Box opened, ready for smoke reveal
  | 'smoking'        // Smoke pouring out, user wiping / fanning
  | 'revealed';      // Character popped out, holo card active

export interface FCFSEntry {
  id: string;
  xHandle: string;
  retweetLink: string;
  evmAddress: string;
  timestamp: number;
  status: 'pending' | 'verified' | 'selected';
}

export interface BuddyShowcaseItem {
  id: string;
  name: string;
  tag: string;
  role: string;
  image: string;
  color: string;
  accent: string;
}
