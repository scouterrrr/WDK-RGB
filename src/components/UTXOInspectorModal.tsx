import React from 'react';
import {
  Layers,
  X,
  Copy,
  Check,
  Coins
} from 'lucide-react';
import { BitcoinUtxo } from '../types/utexo';
import { formatSatsToBtc } from '../utils/utexoWalletUtils';

interface UTXOInspectorModalProps {
  utxo: BitcoinUtxo | null;
  onClose: () => void;
  onColorUtxo?: (utxo: BitcoinUtxo) => void;
}

export function UTXOInspectorModal({
  utxo,
  onClose,
  onColorUtxo
}: UTXOInspectorModalProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  if (!utxo) return null;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0E17]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#26A17B]/15 border border-[#26A17B]/30 flex items-center justify-center text-[#26A17B]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">UTXO Outpoint Inspector</h3>
              <p className="text-[11px] text-[#94A3B8]">Single-Use Seal on Bitcoin Layer-1 (Tether WDK)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Outpoint Identifier Box */}
        <div className="bg-[#0A0E17] p-3.5 rounded-xl border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] font-medium">Outpoint Identifier (TXID:VOUT)</span>
            <button
              onClick={() => copy(utxo.id, 'outpoint')}
              className="text-[#26A17B] hover:underline flex items-center gap-1 font-mono text-[11px] cursor-pointer"
            >
              {copiedKey === 'outpoint' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'outpoint' ? 'Copied' : 'Copy Outpoint'}
            </button>
          </div>
          <code className="text-xs font-mono text-[#F8FAFC] break-all block leading-relaxed select-all">
            {utxo.id}
          </code>
        </div>

        {/* Satoshis & Seal Status */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#0A0E17] p-3 rounded-xl border border-[#1E293B]">
            <span className="text-[#94A3B8] block mb-1">Layer-1 Satoshis</span>
            <div className="font-mono text-base font-bold text-white tabular-nums">
              {utxo.sats.toLocaleString()} <span className="text-xs text-[#94A3B8] font-normal">sats</span>
            </div>
            <div className="text-[11px] font-mono text-[#F7931A] mt-0.5">
              ~{formatSatsToBtc(utxo.sats)} BTC
            </div>
          </div>

          <div className="bg-[#0A0E17] p-3 rounded-xl border border-[#1E293B]">
            <span className="text-[#94A3B8] block mb-1">RGB Seal State</span>
            <div className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
              {utxo.isColored ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span className="text-[#10B981] font-bold">Colored Single-Use Seal</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#64748B]"></span>
                  <span className="text-[#94A3B8]">Pure Bitcoin (Uncolored)</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1 font-mono">
              Script: {utxo.scriptType.toUpperCase()} (BIP-86 Taproot)
            </div>
          </div>
        </div>

        {/* Script & Taproot Tree commitments */}
        <div className="space-y-2 text-xs">
          <div className="text-[#94A3B8] font-semibold flex items-center justify-between">
            <span>Taproot Script Details</span>
            <span className="font-mono text-[10px] text-[#64748B]">BIP-341 / BIP-342</span>
          </div>
          <div className="bg-[#0A0E17] p-3 rounded-xl border border-[#1E293B] space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">ScriptPubKey:</span>
              <span className="text-[#38BDF8]">OP_1 &lt;32-byte-x-only-pubkey&gt;</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Witness Version:</span>
              <span className="text-white">v1 (Taproot)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">RGB Commitment Anchor:</span>
              <span className="text-[#10B981]">Deterministic Tapret / Opret</span>
            </div>
          </div>
        </div>

        {/* Allocated RGB Assets */}
        <div className="space-y-2 text-xs">
          <div className="text-[#94A3B8] font-semibold">Allocated RGB Smart Assets</div>
          {utxo.rgbAllocations && utxo.rgbAllocations.length > 0 ? (
            <div className="space-y-2">
              {utxo.rgbAllocations.map((alloc) => (
                <div
                  key={alloc.assetId}
                  className="bg-[#0A0E17] p-3 rounded-xl border border-[#1E293B] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#26A17B]/15 text-[#26A17B] flex items-center justify-center font-bold font-mono text-xs">
                      {alloc.ticker.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{alloc.ticker}</div>
                      <div className="font-mono text-[10px] text-[#64748B] truncate max-w-[220px]">
                        {alloc.assetId}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#26A17B] tabular-nums">
                    {alloc.amount.toLocaleString()} {alloc.ticker}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0A0E17] p-3.5 rounded-xl border border-[#1E293B] text-center text-[#64748B] text-xs">
              No off-chain RGB tokens bound to this seal. This is an uncolored pure Bitcoin output available for new NIA smart asset issuance.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
          {!utxo.isColored && onColorUtxo && (
            <button
              onClick={() => {
                onColorUtxo(utxo);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#26A17B] hover:bg-[#208b69] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5" /> Allocate New Asset
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
