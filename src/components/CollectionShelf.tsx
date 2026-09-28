import React from 'react';
import { FUNKY_BUDDIES } from '../data/buddies';
import { FunkyBuddy, DiscoveredBuddy } from '../types';
import { PixelBuddy } from './PixelBuddy';
import { Trophy, Sparkles, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface CollectionShelfProps {
  discovered: Record<string, DiscoveredBuddy>;
  onSelectBuddy: (buddy: FunkyBuddy) => void;
  totalUnboxed: number;
}

export const CollectionShelf: React.FC<CollectionShelfProps> = ({
  discovered,
  onSelectBuddy,
  totalUnboxed,
}) => {
  const discoveredCount = Object.keys(discovered).length;
  const totalCount = FUNKY_BUDDIES.length;
  const completionPct = Math.round((discoveredCount / totalCount) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header & Progress Bar */}
      <div className="bg-[#FAF5E9] border-4 border-[#1F1B18] rounded-2xl p-5 shadow-xl text-[#1F1B18] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="font-pixel text-lg sm:text-xl font-black">
                COLLECTOR'S SHELF
              </h2>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Series 01 Blind Box Roster • Discover all 6 Funky Buddies
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-[#EFE8D8] border border-[#1F1B18]/20 px-3 py-1.5 rounded-lg text-center">
              <div className="font-bold text-sm text-[#1F1B18]">{totalUnboxed}</div>
              <div className="text-[9px] text-neutral-500 uppercase">Boxes Opened</div>
            </div>
            <div className="bg-[#EFE8D8] border border-[#1F1B18]/20 px-3 py-1.5 rounded-lg text-center">
              <div className="font-bold text-sm text-emerald-600">
                {discoveredCount} / {totalCount}
              </div>
              <div className="text-[9px] text-neutral-500 uppercase">Discovered</div>
            </div>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="w-full h-3 bg-[#1F1B18]/15 rounded-full overflow-hidden border border-[#1F1B18]/20 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Grid of Buddy Shelves */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {FUNKY_BUDDIES.map((buddy) => {
          const item = discovered[buddy.id];
          const isFound = !!item;

          return (
            <div
              key={buddy.id}
              onClick={() => {
                if (isFound) {
                  sound.playClick();
                  onSelectBuddy(buddy);
                }
              }}
              className={`relative rounded-xl border-3 transition-all duration-300 flex flex-col items-center justify-between p-3 select-none ${
                isFound
                  ? 'bg-[#FAF5E9] border-[#1F1B18] shadow-md hover:-translate-y-1 hover:shadow-xl cursor-pointer group'
                  : 'bg-[#1C1A24]/70 border-white/10 opacity-70 cursor-not-allowed'
              }`}
            >
              {/* Badge Rarity */}
              <div className="w-full flex justify-between items-center text-[8px] font-pixel mb-1">
                <span
                  className={`px-1.5 py-0.5 rounded-sm ${
                    buddy.rarity === 'secret'
                      ? 'bg-purple-600 text-white'
                      : buddy.rarity === 'epic'
                      ? 'bg-pink-600 text-white'
                      : buddy.rarity === 'rare'
                      ? 'bg-amber-500 text-neutral-900 font-bold'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {buddy.rarity.toUpperCase()}
                </span>

                {isFound && item.count > 1 && (
                  <span className="bg-amber-400 text-neutral-950 font-bold px-1.5 py-0.5 rounded-full border border-[#1F1B18] text-[9px]">
                    x{item.count}
                  </span>
                )}
              </div>

              {/* Character Avatar or Silhouette */}
              <div className="h-28 flex items-center justify-center relative w-full my-1">
                {isFound ? (
                  <PixelBuddy
                    buddy={buddy}
                    size="sm"
                    isFloating={false}
                    showAura={false}
                    className="group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/30 space-y-1">
                    <HelpCircle className="w-8 h-8 animate-pulse" />
                    <span className="font-pixel text-[9px] tracking-widest text-neutral-500">
                      LOCKED
                    </span>
                  </div>
                )}
              </div>

              {/* Name & Title */}
              <div className="w-full text-center border-t border-[#1F1B18]/15 pt-2">
                <div
                  className={`font-pixel text-xs font-bold truncate ${
                    isFound ? 'text-[#1F1B18]' : 'text-neutral-500'
                  }`}
                >
                  {isFound ? buddy.name : '???'}
                </div>
                <div className="text-[10px] text-neutral-500 truncate">
                  {isFound ? buddy.title : `${buddy.dropRate}% Drop`}
                </div>
              </div>

              {isFound && (
                <div className="absolute inset-x-2 -bottom-2 bg-amber-300 border border-[#1F1B18] text-[#1F1B18] rounded-md font-pixel text-[8px] font-bold py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                  VIEW CARD
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
