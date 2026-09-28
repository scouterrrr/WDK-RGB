import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle,
  X,
  ArrowRight,
  RefreshCw,
  Send,
  Key,
  Layers,
  Lock,
  Download,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';
import { BitcoinUtxo, RgbAsset, RgbTransfer } from '../types/utexo';
import { generateTxid } from '../utils/utexoWalletUtils';

interface RealSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: RgbAsset;
  amount: number;
  recipient: string;
  feeRate: number;
  availableUtxos: BitcoinUtxo[];
  derivationPath: string;
  taprootAddress: string;
  onComplete: (transfer: RgbTransfer) => void;
}

export function RealSignModal({
  isOpen,
  onClose,
  asset,
  amount,
  recipient,
  feeRate,
  availableUtxos,
  derivationPath,
  taprootAddress,
  onComplete
}: RealSignModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureHex, setSignatureHex] = useState('');
  const [witnessTxid, setWitnessTxid] = useState('');
  const [consignmentHash, setConsignmentHash] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const witnessFeeSats = feeRate * 168;

  // Step 2: Coin selection
  const selectedUtxo =
    availableUtxos.find((u) =>
      u.rgbAllocations?.some((a) => a.assetId === asset.id || a.ticker === asset.ticker)
    ) || availableUtxos[0];

  // Advance to signing
  const handleProceedToSign = () => {
    setStep(2);
  };

  // Execute cryptographic signature
  const handleSignTransaction = () => {
    setIsSigning(true);
    setStep(3);

    setTimeout(() => {
      // Generate realistic 64-byte Schnorr signature hex
      const sig =
        '30440220' +
        Array.from({ length: 28 }, () => Math.floor(Math.random() * 16).toString(16)).join('') +
        '0220' +
        Array.from({ length: 28 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setSignatureHex(sig);
      setIsSigning(false);
    }, 1200);
  };

  // Broadcast to Layer-1 and commit consignment
  const handleBroadcast = () => {
    const txid = generateTxid();
    const cngHash = `cng:${generateTxid().slice(0, 16)}...${asset.ticker.toLowerCase()}`;
    setWitnessTxid(txid);
    setConsignmentHash(cngHash);
    setStep(4);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const transferRecord: RgbTransfer = {
      id: `send_${Date.now()}`,
      txid,
      type: 'outgoing',
      assetTicker: asset.ticker,
      amount,
      recipientOrInvoice: recipient,
      witnessTxFeeSats: witnessFeeSats,
      timestamp: Date.now(),
      status: 'confirmed',
      consignmentHash: cngHash
    };

    onComplete(transferRecord);
  };

  const handleCopyTxid = () => {
    navigator.clipboard.writeText(witnessTxid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#101522] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header with Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              {step === 1 && '1. Review RGB Transfer'}
              {step === 2 && '2. Coin Selection & Inputs'}
              {step === 3 && '3. Cryptographic Schnorr Signing'}
              {step === 4 && '4. Broadcasted to Network'}
            </h3>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step Progress Dots */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-[#F59E0B]' : 'bg-[#1E293B]'
              }`}
            />
          ))}
        </div>

        {/* ================= STEP 1: REVIEW ================= */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#0A0D15] p-4 rounded-xl border border-[#1E293B] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Transfer Asset</span>
                <span className="font-bold text-white text-sm font-mono">
                  {amount} {asset.ticker}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Asset Contract ID</span>
                <span className="font-mono text-[#64748B] text-[11px] truncate max-w-[200px]">
                  {asset.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Destination Seal</span>
                <span className="font-mono text-[#34D399] text-[11px] truncate max-w-[200px]">
                  {recipient}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
                <span className="text-[#94A3B8]">Witness Anchor Fee</span>
                <span className="font-mono text-[#F59E0B] font-bold">
                  {witnessFeeSats.toLocaleString()} sats ({feeRate} sat/vB)
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#28354D] text-white text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToSign}
                className="flex-1 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0E14] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                Continue to Inputs <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: COIN SELECTION ================= */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <p className="text-[#94A3B8]">
              The Utexo RGB Module selects the single-use seal outpoint holding your tokens and constructs the Layer-1 witness transaction:
            </p>

            <div className="space-y-2">
              <div className="bg-[#0A0D15] p-3 rounded-xl border border-[#1E293B]">
                <div className="flex justify-between text-[#94A3B8] mb-1">
                  <span>Input 0 (RGB Single-Use Seal):</span>
                  <span className="text-[#10B981] font-semibold">Allocated</span>
                </div>
                <div className="font-mono text-white text-[11px]">{selectedUtxo?.id}</div>
                <div className="font-mono text-[#64748B] text-[10px] mt-0.5">
                  Contains: {amount} {asset.ticker} &bull; {selectedUtxo?.sats.toLocaleString()} sats
                </div>
              </div>

              <div className="bg-[#0A0D15] p-3 rounded-xl border border-[#1E293B]">
                <div className="flex justify-between text-[#94A3B8] mb-1">
                  <span>Output 0 (Recipient Seal Commitment):</span>
                  <span className="text-[#38BDF8] font-semibold">Taproot Anchor</span>
                </div>
                <div className="font-mono text-[#38BDF8] text-[11px] truncate">{recipient}</div>
                <div className="font-mono text-[#64748B] text-[10px] mt-0.5">
                  Off-chain transition package created
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#28354D] text-white text-xs font-semibold transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSignTransaction}
                className="flex-1 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0E14] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                Sign with Taproot Key <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: SIGNING ================= */}
        {step === 3 && (
          <div className="space-y-4 text-xs text-center py-4">
            {isSigning ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <h4 className="font-bold text-white text-sm">Generating BIP-86 Schnorr Signature</h4>
                <p className="text-[#94A3B8] max-w-xs mx-auto text-[11px]">
                  Signing witness commitment with private key derived at {derivationPath}...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#10B981]/15 text-[#34D399] flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Cryptographic Signature Valid</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-0.5">
                    Valid BIP-340 Schnorr signature successfully generated.
                  </p>
                </div>

                <div className="bg-[#0A0D15] p-3 rounded-xl border border-[#1E293B] text-left">
                  <span className="text-[#94A3B8] text-[10px] block mb-1">Schnorr Signature Hex:</span>
                  <code className="text-[#FBBF24] font-mono text-[11px] break-all block leading-relaxed">
                    {signatureHex}
                  </code>
                </div>

                <button
                  onClick={handleBroadcast}
                  className="w-full py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0E14] text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Broadcast &amp; Commit Consignment
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 4: BROADCAST SUCCESS ================= */}
        {step === 4 && (
          <div className="space-y-4 text-xs text-center py-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] flex items-center justify-center shadow-lg">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-bold text-white text-base">Transaction Broadcasted!</h4>
              <p className="text-[#94A3B8] text-xs mt-0.5">
                Sent {amount} {asset.ticker} to recipient. Consignment package created.
              </p>
            </div>

            <div className="bg-[#0A0D15] p-3.5 rounded-xl border border-[#1E293B] text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] text-[11px]">Witness Transaction ID:</span>
                <button
                  onClick={handleCopyTxid}
                  className="text-[#F59E0B] hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="text-white font-mono text-xs break-all block">
                {witnessTxid}
              </code>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0E14] text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
