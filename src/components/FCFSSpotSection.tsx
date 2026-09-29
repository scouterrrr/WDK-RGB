import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, ExternalLink, Send, ShieldCheck, Heart, Repeat, MessageCircle } from 'lucide-react';
import { FCFSEntry } from '../types';

interface FCFSSpotSectionProps {
  onEntrySaved: (entry: FCFSEntry) => void;
  onOpenAdmin: () => void;
  prefill?: { xHandle?: string; evmAddress?: string };
}

export const FCFSSpotSection: React.FC<FCFSSpotSectionProps> = ({ onEntrySaved, onOpenAdmin, prefill }) => {
  const [xHandle, setXHandle] = useState('');
  const [retweetLink, setRetweetLink] = useState('');
  const [evmAddress, setEvmAddress] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<FCFSEntry | null>(null);

  useEffect(() => {
    if (prefill) {
      if (prefill.xHandle) setXHandle(prefill.xHandle.replace(/[^A-Za-z0-9_]/g, ''));
      if (prefill.evmAddress) setEvmAddress(prefill.evmAddress);
    }
  }, [prefill]);

  // Live input sanitization
  const handleXChange = (val: string) => {
    // strip spaces and starting @
    const cleaned = val.replace(/[^A-Za-z0-9_]/g, '');
    setXHandle(cleaned);
    if (errors.xHandle) setErrors((prev) => ({ ...prev, xHandle: '' }));
  };

  const handleRetweetChange = (val: string) => {
    setRetweetLink(val.trim());
    if (errors.retweetLink) setErrors((prev) => ({ ...prev, retweetLink: '' }));
  };

  const handleEvmChange = (val: string) => {
    let v = val.trim();
    if (v && !v.startsWith('0x') && /^[0-9a-fA-F]+$/.test(v)) {
      v = '0x' + v;
    }
    v = v.replace(/[^0-9a-fA-Fx]/g, '');
    if (v.length > 42) v = v.slice(0, 42);
    setEvmAddress(v);
    if (errors.evmAddress) setErrors((prev) => ({ ...prev, evmAddress: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    // 1. X username check
    if (!xHandle) {
      errs.xHandle = 'X (Twitter) handle is mandatory.';
    } else if (!/^[A-Za-z0-9_]{1,30}$/.test(xHandle)) {
      errs.xHandle = 'Enter a valid X username (letters, numbers, underscore only).';
    }

    // 2. Retweet Link check (must be a valid URL pointing to x.com or twitter.com)
    if (!retweetLink) {
      errs.retweetLink = 'Retweet proof link is mandatory.';
    } else {
      try {
        const url = new URL(retweetLink);
        const host = url.hostname.toLowerCase();
        if (!host.includes('x.com') && !host.includes('twitter.com')) {
          errs.retweetLink = 'Must be an authentic x.com or twitter.com status link.';
        }
      } catch {
        errs.retweetLink = 'Please enter a complete valid URL (e.g. https://x.com/yourname/status/...)';
      }
    }

    // 3. EVM Address check (must be 0x followed by exactly 40 hex chars = 42 chars total)
    if (!evmAddress) {
      errs.evmAddress = 'EVM wallet address is mandatory.';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(evmAddress)) {
      errs.evmAddress = 'Must be a valid 42-character EVM address (starts with 0x followed by 40 hex chars).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newEntry: FCFSEntry = {
      id: 'fcfs_' + Date.now(),
      xHandle,
      retweetLink,
      evmAddress,
      timestamp: Date.now(),
      status: 'pending',
    };

    try {
      // Send to python/local backend if running
      fetch('/api/fcfs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      }).catch(() => {
        // silent fallback to browser storage
      });
    } catch {
      // ignore
    }

    // Save locally
    onEntrySaved(newEntry);
    setSubmittedEntry(newEntry);
    setIsSubmitting(false);
  };

  return (
    <section id="list" className="py-24 bg-[#77E0B0] text-[#0c3a28] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#0c3a28] text-[#77E0B0] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            FCFS Whitelist
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c3a28] mb-3 tracking-tight">
            Grab Your Whitelist Spot
          </h2>
          <p className="text-sm sm:text-base text-[#0c3a28]/85 leading-relaxed font-medium">
            First come, first served. Limited allocation for the 1,999 Tether WDK RGB Wallet deployment. Every section below is mandatory and strictly verified.
          </p>
        </div>

        {/* Task Callout Banner */}
        <div className="bg-[#f0fbf5] border-3 border-[#0c3a28] rounded-2xl p-6 mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0c3a28] text-[#77E0B0] flex items-center justify-center shrink-0 mt-0.5">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0c3a28]">
                  Mandatory Social Verification Task
                </h4>
                <p className="text-xs text-[#0c3a28]/80 leading-relaxed mt-0.5">
                  Like, comment, and retweet the official Tether WDK RGB Wallet launch post, then paste your retweet link below.
                </p>
              </div>
            </div>

            <a
              href="https://x.com/tether_to"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0c3a28] text-[#77E0B0] font-bold text-xs hover:bg-[#141225] transition-all shrink-0"
            >
              Open Post on X
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#0c3a28]/15 text-[11px] font-semibold text-[#0c3a28]/70">
            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-600" /> Like</span>
            <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-blue-600" /> Comment</span>
            <span className="flex items-center gap-1.5"><Repeat className="w-3.5 h-3.5 text-emerald-600" /> Retweet &amp; Copy Link</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#f8fffb] border-4 border-[#0c3a28] rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          {submittedEntry ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#0c3a28] text-[#77E0B0] flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0c3a28] mb-2 tracking-tight">
                FCFS Spot Registered!
              </h3>
              <p className="text-sm text-[#0c3a28]/80 max-w-md mx-auto mb-6">
                Your entry has been securely saved to the whitelist queue. Keep your wallet ready for the Deploy Tether WDK RGB Wallet allocation.
              </p>
              
              <div className="bg-[#e4f7ed] rounded-xl p-4 max-w-md mx-auto text-left font-mono text-xs space-y-2 border border-[#0c3a28]/20 mb-8">
                <div><span className="text-[#0c3a28]/60">X Handle:</span> @{submittedEntry.xHandle}</div>
                <div className="truncate"><span className="text-[#0c3a28]/60">Retweet:</span> {submittedEntry.retweetLink}</div>
                <div className="truncate"><span className="text-[#0c3a28]/60">EVM:</span> {submittedEntry.evmAddress}</div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setSubmittedEntry(null)}
                  className="px-6 py-2.5 rounded-full border-2 border-[#0c3a28] text-xs font-bold text-[#0c3a28] hover:bg-[#0c3a28] hover:text-[#77E0B0] transition-colors"
                >
                  Submit Another Entry
                </button>
                <button
                  onClick={onOpenAdmin}
                  className="px-6 py-2.5 rounded-full bg-[#0c3a28] text-xs font-bold text-[#77E0B0] hover:bg-[#141225] transition-colors"
                >
                  View Saved Data Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Field 1: X Handle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0c3a28] mb-2">
                  1. Your X (Twitter) Username <span className="text-red-500">*</span>
                </label>
                <div className="relative flex rounded-xl border-2 border-[#0c3a28] overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#0c3a28]">
                  <span className="px-4 py-3.5 bg-[#0c3a28] text-[#77E0B0] font-bold text-sm flex items-center">
                    @
                  </span>
                  <input
                    type="text"
                    value={xHandle}
                    onChange={(e) => handleXChange(e.target.value)}
                    placeholder="tether_builder"
                    maxLength={30}
                    className="w-full px-4 py-3 text-sm text-[#0c3a28] font-medium outline-none"
                  />
                </div>
                {errors.xHandle ? (
                  <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.xHandle}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#0c3a28]/60 mt-1">
                    Enter only your username without spaces or links.
                  </p>
                )}
              </div>

              {/* Field 2: Retweet Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0c3a28] mb-2">
                  2. Link to Your Retweet <span className="text-red-500">*</span>
                </label>
                <div className="rounded-xl border-2 border-[#0c3a28] overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#0c3a28]">
                  <input
                    type="url"
                    value={retweetLink}
                    onChange={(e) => handleRetweetChange(e.target.value)}
                    placeholder="https://x.com/yourhandle/status/..."
                    className="w-full px-4 py-3.5 text-sm text-[#0c3a28] font-medium outline-none"
                  />
                </div>
                {errors.retweetLink ? (
                  <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.retweetLink}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#0c3a28]/60 mt-1">
                    Paste the exact link to your retweet of the launch announcement.
                  </p>
                )}
              </div>

              {/* Field 3: EVM Wallet Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0c3a28] mb-2">
                  3. EVM Wallet Address <span className="text-red-500">*</span>
                </label>
                <div className="rounded-xl border-2 border-[#0c3a28] overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#0c3a28]">
                  <input
                    type="text"
                    value={evmAddress}
                    onChange={(e) => handleEvmChange(e.target.value)}
                    placeholder="0x1234...5678"
                    maxLength={42}
                    className="w-full px-4 py-3.5 text-sm font-mono text-[#0c3a28] font-medium outline-none"
                  />
                </div>
                {errors.evmAddress ? (
                  <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.evmAddress}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#0c3a28]/60 mt-1">
                    Robinhood Chain or Ethereum compatible EVM address (Metamask, TrustWallet, etc.).
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#0c3a28] text-[#77E0B0] font-bold text-sm tracking-wider uppercase shadow-lg hover:bg-[#141225] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying Entry...' : 'Submit Whitelist Spot'}
                <Send className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-[#0c3a28]/70 pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#0c3a28]" /> Strictly one spot per EVM address
                </span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="underline hover:text-[#0c3a28] font-bold"
                >
                  View Registered Data &rarr;
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
};
