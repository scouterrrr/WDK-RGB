import React from 'react';
import { BUDDY_SHOWCASE } from '../data/showcase';
import { ExternalLink } from 'lucide-react';

export const ShowcaseSection: React.FC = () => {
  return (
    <section id="buddies" className="py-24 bg-[#7EC8F0] text-[#0e2f45] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-[#0e2f45] text-[#7EC8F0] text-xs font-mono font-bold tracking-widest uppercase mb-3">
            Hand-Crafted Roster
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0e2f45] mb-4 tracking-tight">
            Genesis Roster &amp; Characters
          </h2>
          <p className="text-base text-[#0e2f45]/85 leading-relaxed">
            Streetwear, cowboy sherpas, cyberpunk headsets, varsity gear and sunset vibes. Each of the 1,999 pieces is tied to unique Taproot single-use seals on Bitcoin and confidential RGB smart contracts.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUDDY_SHOWCASE.map((buddy, index) => (
            <div
              key={buddy.id}
              className="group relative bg-[#0e2f45] rounded-2xl border-4 border-[#0e2f45] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer"
              style={{
                transform: index % 2 === 0 ? 'rotate(-1.5deg)' : 'rotate(1.5deg)',
              }}
            >
              <div className="aspect-square relative overflow-hidden bg-neutral-900">
                <img
                  src={buddy.image}
                  alt={buddy.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 bg-[#141225]/85 backdrop-blur-md text-[#FFD469] font-mono font-bold text-xs px-2 py-1 rounded border border-[#FFD469]/30">
                  {buddy.tag}
                </div>
              </div>

              <div className="p-3.5 bg-[#141225] text-[#F6F2FF] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#F6F2FF]">{buddy.name}</h3>
                  <p className="text-[11px] text-[#c9c2e0]">{buddy.role}</p>
                </div>
                <div 
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: buddy.accent }}
                  title="Characteristic Color"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://x.com/tether_to"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0e2f45] text-[#7EC8F0] font-bold text-xs uppercase tracking-wider hover:bg-[#141225] transition-colors"
          >
            Preview More Drops On @tether_to
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
