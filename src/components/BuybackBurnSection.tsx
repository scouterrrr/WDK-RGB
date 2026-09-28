import React, { useState } from 'react';
import { Flame, ShieldCheck, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const BuybackBurnSection: React.FC = () => {
  const [testPrice, setTestPrice] = useState<number>(18);
  const mintPrice = 40; // in USD or equivalent token
  const triggerPrice = mintPrice * 0.5; // 50% = 20
  const isTriggered = testPrice <= triggerPrice;

  return (
    <section id="burn" className="py-24 bg-[#141225] text-[#F6F2FF] relative overflow-hidden border-t-2 border-[#1c1932]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b1928] text-[#FF9FC0] text-xs font-mono font-bold tracking-widest uppercase mb-4 border border-[#FF9FC0]/30">
            <Flame className="w-3.5 h-3.5 text-[#FF9FC0] animate-bounce" />
            Guaranteed Floor Protection Covenant
          </div>
          <h2 className="font-['Silkscreen'] text-2xl sm:text-3xl lg:text-4xl text-[#FFD469] mb-4">
            Floor Protection: 50% Buyback &amp; Burn
          </h2>
          <p className="text-base sm:text-lg text-[#c9c2e0] leading-relaxed">
            We respect our holders’ capital. If the secondary market floor price drops by <strong>50% or more below the original mint price</strong>, the FUNky Buddies treasury protocol triggers an automatic floor sweep: buying Buddies directly off secondary marketplaces and burning them permanently.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#1c1932] border-2 border-[#2c2650] rounded-2xl p-6 hover:border-[#9B87F5] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#9B87F5]/20 flex items-center justify-center text-[#9B87F5] mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-['Silkscreen'] text-base text-[#FFD469] mb-2">50% Hard Floor Stop</h3>
            <p className="text-sm text-[#c9c2e0] leading-relaxed">
              If mint price is $40 and secondary listings slide to $20 or less, the buyback engine activates without exception.
            </p>
          </div>

          <div className="bg-[#1c1932] border-2 border-[#2c2650] rounded-2xl p-6 hover:border-[#FF9FC0] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF9FC0]/20 flex items-center justify-center text-[#FF9FC0] mb-5">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-['Silkscreen'] text-base text-[#FFD469] mb-2">Provable Burn Address</h3>
            <p className="text-sm text-[#c9c2e0] leading-relaxed">
              Swept NFTs are sent directly to the Robinhood Chain burn address (0x000...dead). They are destroyed forever.
            </p>
          </div>

          <div className="bg-[#1c1932] border-2 border-[#2c2650] rounded-2xl p-6 hover:border-[#77E0B0] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#77E0B0]/20 flex items-center justify-center text-[#77E0B0] mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-['Silkscreen'] text-base text-[#FFD469] mb-2">Permanent Supply Reduction</h3>
            <p className="text-sm text-[#c9c2e0] leading-relaxed">
              Total supply drops below 1,999 with every burn cycle, mathematically tightening scarcity for long-term holders.
            </p>
          </div>
        </div>

        {/* Concrete Real Example Walkthrough */}
        <div className="bg-gradient-to-br from-[#1c1932] to-[#241f42] border-2 border-[#9B87F5] rounded-3xl p-8 lg:p-10 mb-16 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#2c2650] mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#9B87F5] font-bold">Concrete Worked Example</span>
              <h3 className="font-['Silkscreen'] text-xl sm:text-2xl text-[#FFD469] mt-1">
                How the Buyback &amp; Burn Executes in Real Life
              </h3>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#141225] border border-[#FFD469]/30 text-xs font-mono text-[#FFD469]">
              Mint Price: $40.00 &bull; Trigger: &le; $20.00
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-[#141225]/80 border border-[#2c2650]">
              <div className="w-7 h-7 rounded-full bg-[#9B87F5] text-[#141225] font-['Silkscreen'] text-xs flex items-center justify-center mb-3">1</div>
              <h4 className="font-bold text-sm text-[#F6F2FF] mb-1">Minting Phase</h4>
              <p className="text-xs text-[#c9c2e0] leading-relaxed">
                Collection mints at $40.00. 30% of mint proceeds are locked into the verifiable Protocol Defense Treasury contract.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#141225]/80 border border-[#2c2650]">
              <div className="w-7 h-7 rounded-full bg-[#9B87F5] text-[#141225] font-['Silkscreen'] text-xs flex items-center justify-center mb-3">2</div>
              <h4 className="font-bold text-sm text-[#F6F2FF] mb-1">Market Dips &ge; 50%</h4>
              <p className="text-xs text-[#c9c2e0] leading-relaxed">
                Paper hands list on secondary down to $19.00 (more than 50% below mint fee). The automated trigger fires.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#141225]/80 border border-[#2c2650]">
              <div className="w-7 h-7 rounded-full bg-[#9B87F5] text-[#141225] font-['Silkscreen'] text-xs flex items-center justify-center mb-3">3</div>
              <h4 className="font-bold text-sm text-[#F6F2FF] mb-1">Treasury Sweeps Floor</h4>
              <p className="text-xs text-[#c9c2e0] leading-relaxed">
                Treasury immediately purchases the cheapest 85 Buddies across OpenSea, instantly clearing out distressed sellers.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#141225]/80 border border-[#2c2650]">
              <div className="w-7 h-7 rounded-full bg-[#77E0B0] text-[#141225] font-['Silkscreen'] text-xs flex items-center justify-center mb-3">4</div>
              <h4 className="font-bold text-sm text-[#77E0B0] mb-1">Tokens Burned</h4>
              <p className="text-xs text-[#c9c2e0] leading-relaxed">
                All 85 swept Buddies are burned. Total supply falls from 1,999 to 1,914, resetting the floor above the mint benchmark.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Simulator Widget */}
        <div className="bg-[#1c1932] border-2 border-[#2c2650] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="font-['Silkscreen'] text-base text-[#FFD469]">
                Interactive Floor Price Simulator
              </h4>
              <p className="text-xs text-[#c9c2e0]">
                Slide the hypothetical secondary floor price to see if the Buyback &amp; Burn trigger fires.
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-[#c9c2e0]">Hypothetical Floor: </span>
              <span className="text-lg font-bold text-[#FFD469]">${testPrice.toFixed(2)}</span>
            </div>
          </div>

          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={testPrice}
            onChange={(e) => setTestPrice(Number(e.target.value))}
            className="w-full h-2 bg-[#2c2650] rounded-lg appearance-none cursor-pointer accent-[#9B87F5] mb-6"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#141225]">
            <div className="flex items-center gap-3">
              {isTriggered ? (
                <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-[#F6F2FF]">
                  {isTriggered ? 'BUYBACK & BURN ACTIVE' : 'HEALTHY FLOOR REGIME'}
                </div>
                <div className="text-xs text-[#c9c2e0]">
                  {isTriggered
                    ? `Floor is $${testPrice} (>= 50% below $40 mint). Treasury sweeps floor and burns NFTs!`
                    : `Floor is $${testPrice} (above the $20.00 stop-trigger). Organic trading continues.`}
                </div>
              </div>
            </div>

            <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-full border border-white/10 shrink-0">
              Trigger Threshold: &le; $20.00
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
