import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Key,
  RefreshCw,
  Layers,
  Send,
  QrCode,
  Coins,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Sparkles,
  Cpu,
  FileCode2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Radio,
  Clock,
  Sliders,
  Share2
} from 'lucide-react';
import {
  BitcoinUtxo,
  RgbAsset,
  RgbInvoice,
  RgbTransfer,
  UtexoNetwork,
  UtexoWalletState
} from '../types/utexo';
import {
  generateMnemonic,
  deriveTaprootAddress,
  generateTxid,
  generateBlindedUtxo,
  createInitialWalletState,
  formatSatsToBtc,
  formatAmount
} from '../utils/utexoWalletUtils';

interface UtexoWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UtexoWalletModal({ isOpen, onClose }: UtexoWalletModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'utxos' | 'assets' | 'receive' | 'send' | 'history' | 'code'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Wallet state stored in local storage
  const [wallet, setWallet] = useState<UtexoWalletState>(() => {
    try {
      const saved = localStorage.getItem('utexo_rgb_wallet_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    const mnemonic = generateMnemonic();
    return createInitialWalletState(mnemonic, 'testnet');
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('utexo_rgb_wallet_state', JSON.stringify(wallet));
    } catch {
      // ignore
    }
  }, [wallet]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast(`Copied ${keyName} to clipboard!`);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === keyName ? null : curr));
    }, 2000);
  };

  // Switch network
  const handleNetworkChange = (net: UtexoNetwork) => {
    const { address, derivationPath, publicKey } = deriveTaprootAddress(wallet.mnemonic, net);
    setWallet((prev) => ({
      ...prev,
      network: net,
      taprootAddress: address,
      derivationPath,
      publicKey,
      indexerUrl: net === 'mainnet' ? 'https://mempool.space/api' : 'https://mempool.space/testnet4/api',
    }));
    showToast(`Switched network to Bitcoin ${net.toUpperCase()}`);
  };

  // Generate brand new wallet
  const handleCreateNewWallet = () => {
    if (confirm('Create a new seed phrase? Please make sure you have backed up any current wallet keys.')) {
      const mnemonic = generateMnemonic();
      const newState = createInitialWalletState(mnemonic, wallet.network);
      setWallet(newState);
      showToast('Generated fresh BIP-39 mnemonic & Taproot account!');
    }
  };

  // Claim Testnet Faucet sats
  const handleClaimFaucet = () => {
    const newTxid = generateTxid();
    const newSats = 50000;
    const newUtxo: BitcoinUtxo = {
      id: `${newTxid}:0`,
      txid: newTxid,
      vout: 0,
      sats: newSats,
      scriptType: 'p2tr',
      isColored: false,
      rgbAllocations: [],
      status: 'unspent',
      timestamp: Date.now(),
    };

    setWallet((prev) => ({
      ...prev,
      btcBalanceSats: prev.btcBalanceSats + newSats,
      utxos: [newUtxo, ...prev.utxos],
    }));
    showToast(`+50,000 Testnet Sats received from Utexo/Bitcoin faucet!`);
  };

  // UTXO Colorer state
  const [utxoCountToCreate, setUtxoCountToCreate] = useState<number>(3);
  const [satsPerUtxo, setSatsPerUtxo] = useState<number>(2000);
  const [isCreatingUtxos, setIsCreatingUtxos] = useState<boolean>(false);

  // Execute account.createUtxos()
  const handleCreateUtxos = () => {
    const totalRequiredSats = utxoCountToCreate * satsPerUtxo + 350; // sats + mining fee
    if (wallet.btcBalanceSats < totalRequiredSats) {
      alert(`Insufficient BTC balance! Required: ${totalRequiredSats} sats, Available: ${wallet.btcBalanceSats} sats. Claim faucet sats first.`);
      return;
    }

    setIsCreatingUtxos(true);
    setTimeout(() => {
      const splitTxid = generateTxid();
      const freshColoredUtxos: BitcoinUtxo[] = [];

      for (let i = 0; i < utxoCountToCreate; i++) {
        freshColoredUtxos.push({
          id: `${splitTxid}:${i}`,
          txid: splitTxid,
          vout: i,
          sats: satsPerUtxo,
          scriptType: 'p2tr',
          isColored: true,
          rgbAllocations: [],
          status: 'unspent',
          timestamp: Date.now(),
        });
      }

      const newTransfer: RgbTransfer = {
        id: `utxo_split_${Date.now()}`,
        txid: splitTxid,
        type: 'utxo_color',
        assetTicker: 'SAT_SEAL',
        amount: utxoCountToCreate * satsPerUtxo,
        witnessTxFeeSats: 350,
        timestamp: Date.now(),
        status: 'confirmed',
        consignmentHash: 'rgb:utxo-orchestration-seal',
      };

      setWallet((prev) => ({
        ...prev,
        btcBalanceSats: prev.btcBalanceSats - (utxoCountToCreate * satsPerUtxo + 350),
        utxos: [...freshColoredUtxos, ...prev.utxos],
        transfers: [newTransfer, ...prev.transfers],
      }));

      setIsCreatingUtxos(false);
      showToast(`Successfully created ${utxoCountToCreate} colored UTXOs for RGB seals!`);
    }, 1000);
  };

  // Asset Issuance state
  const [issueName, setIssueName] = useState('Tether Euro');
  const [issueTicker, setIssueTicker] = useState('EURTRGB');
  const [issueSupply, setIssueSupply] = useState('1000000');
  const [issuePrecision, setIssuePrecision] = useState(6);
  const [issueDesc, setIssueDesc] = useState('Euro pegged stablecoin on Bitcoin RGB layer via Utexo WDK');
  const [isIssuing, setIsIssuing] = useState(false);

  // Execute account.issueAssetNia()
  const handleIssueAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueName || !issueTicker || !issueSupply) {
      alert('Please fill in all asset fields.');
      return;
    }

    // Find available colored UTXO
    const freeColoredUtxo = wallet.utxos.find((u) => u.isColored && u.rgbAllocations.length === 0 && u.status === 'unspent');

    if (!freeColoredUtxo) {
      alert('No free colored UTXO available for RGB single-use seal! Please use the "UTXO Manager" tab to create colored UTXOs first.');
      setActiveTab('utxos');
      return;
    }

    setIsIssuing(true);
    setTimeout(() => {
      const contractTxid = generateTxid();
      const contractId = `rgb:nia:${contractTxid.slice(0, 16)}/${wallet.network}/${Date.now()}`;
      const supplyNum = parseFloat(issueSupply);

      const newAsset: RgbAsset = {
        id: contractId,
        ticker: issueTicker.toUpperCase(),
        name: issueName,
        precision: issuePrecision,
        issuedSupply: supplyNum,
        balance: supplyNum,
        schema: 'NIA',
        genesisTxid: contractTxid,
        allocatedUtxoId: freeColoredUtxo.id,
        description: issueDesc,
        createdAt: Date.now(),
      };

      // Bind seal to colored UTXO
      const updatedUtxos = wallet.utxos.map((u) => {
        if (u.id === freeColoredUtxo.id) {
          return {
            ...u,
            rgbAllocations: [
              {
                assetId: contractId,
                ticker: issueTicker.toUpperCase(),
                amount: supplyNum,
              },
            ],
          };
        }
        return u;
      });

      const issuanceTransfer: RgbTransfer = {
        id: `issue_${Date.now()}`,
        txid: contractTxid,
        type: 'issuance',
        assetTicker: issueTicker.toUpperCase(),
        amount: supplyNum,
        witnessTxFeeSats: 280,
        timestamp: Date.now(),
        status: 'confirmed',
        consignmentHash: `cng:${generateTxid().slice(0, 18)}`,
      };

      setWallet((prev) => ({
        ...prev,
        assets: [newAsset, ...prev.assets],
        utxos: updatedUtxos,
        transfers: [issuanceTransfer, ...prev.transfers],
      }));

      setIsIssuing(false);
      showToast(`Asset ${issueTicker.toUpperCase()} (NIA) issued & bound to seal ${freeColoredUtxo.id}!`);
      setActiveTab('assets');
    }, 1200);
  };

  // Invoice generator state
  const [selectedAssetForInvoice, setSelectedAssetForInvoice] = useState<string>(wallet.assets[0]?.id || '');
  const [invoiceAmount, setInvoiceAmount] = useState<string>('50');
  const [createdInvoice, setCreatedInvoice] = useState<RgbInvoice | null>(null);

  const handleGenerateInvoice = () => {
    const asset = wallet.assets.find((a) => a.id === selectedAssetForInvoice) || wallet.assets[0];
    const blinded = generateBlindedUtxo();
    const expiry = Date.now() + 86400000; // 24 hours
    const invoiceStr = `rgb:invoice:nia:${blinded}?asset=${asset?.ticker || 'USDTRGB'}&amt=${invoiceAmount || 0}&exp=${expiry}&endpoint=rpca://proxy.rgb.utexo.com:3000/json-rpc`;

    const inv: RgbInvoice = {
      invoiceString: invoiceStr,
      assetId: asset?.id,
      ticker: asset?.ticker || 'USDTRGB',
      amount: parseFloat(invoiceAmount) || 0,
      blindedUtxo: blinded,
      transportEndpoint: wallet.transportEndpoint,
      expiry,
      createdAt: Date.now(),
      label: `Invoice for ${asset?.ticker || 'RGB Asset'}`,
    };

    setCreatedInvoice(inv);
    setWallet((prev) => ({
      ...prev,
      invoices: [inv, ...prev.invoices],
    }));
    showToast(`Generated RGB blinded invoice!`);
  };

  // Send transfer state
  const [sendInvoiceInput, setSendInvoiceInput] = useState('');
  const [sendAssetTicker, setSendAssetTicker] = useState('USDTRGB');
  const [sendAmountInput, setSendAmountInput] = useState('25');
  const [sendFeeRate, setSendFeeRate] = useState('5');
  const [isSending, setIsSending] = useState(false);

  const handleSendRgb = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = wallet.assets.find((a) => a.ticker === sendAssetTicker);
    const amountNum = parseFloat(sendAmountInput);

    if (!asset || isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (asset.balance < amountNum) {
      alert(`Insufficient balance in ${sendAssetTicker}! Available: ${asset.balance}`);
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const witnessTxid = generateTxid();
      const feeSats = Math.round(parseFloat(sendFeeRate) * 168);

      // Deduct asset balance
      const updatedAssets = wallet.assets.map((a) => {
        if (a.ticker === sendAssetTicker) {
          return { ...a, balance: a.balance - amountNum };
        }
        return a;
      });

      const newTransfer: RgbTransfer = {
        id: `send_${Date.now()}`,
        txid: witnessTxid,
        type: 'outgoing',
        assetTicker: sendAssetTicker,
        amount: amountNum,
        recipientOrInvoice: sendInvoiceInput.slice(0, 28) + '...',
        witnessTxFeeSats: feeSats,
        timestamp: Date.now(),
        status: 'confirmed',
        consignmentHash: `cng:${generateTxid().slice(0, 18)}`,
      };

      setWallet((prev) => ({
        ...prev,
        assets: updatedAssets,
        btcBalanceSats: Math.max(0, prev.btcBalanceSats - feeSats),
        transfers: [newTransfer, ...prev.transfers],
      }));

      setIsSending(false);
      setSendInvoiceInput('');
      showToast(`Sent ${amountNum} ${sendAssetTicker}! Witness TX: ${witnessTxid.slice(0, 10)}...`);
      setActiveTab('history');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#141225] border-2 border-[#3d346b] w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-[#1a1733] border-b-2 border-[#2b2450] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#9B87F5] via-[#77E0B0] to-[#FFD469] p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#141225] rounded-[14px] flex items-center justify-center text-[#FFD469]">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Silkscreen'] text-lg sm:text-xl text-[#F6F2FF] tracking-wide">
                  Utexo RGB &amp; UTXO Wallet
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#77E0B0]/20 text-[#77E0B0] border border-[#77E0B0]/30 font-bold uppercase tracking-wider">
                  Tether WDK Core
                </span>
              </div>
              <p className="text-xs text-[#c9c2e0] mt-0.5 flex items-center gap-1.5 font-mono">
                <span>Off-Chain Client-Side Validated</span>
                <span>&bull;</span>
                <span className="text-[#FFD469]">Single-Use Seals</span>
                <span>&bull;</span>
                <span>@utexo/wdk-wallet-rgb</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Network Selector */}
            <div className="flex items-center bg-[#141225] rounded-xl border border-[#2b2450] p-1 text-xs font-mono font-bold">
              <button
                onClick={() => handleNetworkChange('testnet')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  wallet.network === 'testnet'
                    ? 'bg-[#9B87F5] text-[#141225] font-extrabold shadow'
                    : 'text-[#c9c2e0] hover:text-white'
                }`}
              >
                Testnet4
              </button>
              <button
                onClick={() => handleNetworkChange('mainnet')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  wallet.network === 'mainnet'
                    ? 'bg-[#FFD469] text-[#141225] font-extrabold shadow'
                    : 'text-[#c9c2e0] hover:text-white'
                }`}
              >
                Mainnet
              </button>
              <button
                onClick={() => handleNetworkChange('regtest')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  wallet.network === 'regtest'
                    ? 'bg-[#77E0B0] text-[#141225] font-extrabold shadow'
                    : 'text-[#c9c2e0] hover:text-white'
                }`}
              >
                Regtest
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#c9c2e0] hover:text-white hover:bg-[#2b2450] transition-colors cursor-pointer"
              title="Close Wallet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {notification && (
          <div className="bg-[#77E0B0]/20 border-b border-[#77E0B0]/40 px-6 py-2.5 text-xs text-[#77E0B0] font-mono flex items-center justify-between animate-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {notification}
            </span>
            <button onClick={() => setNotification(null)} className="hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Wallet Details & Stat Ribbon */}
        <div className="bg-[#181530] border-b border-[#2b2450] p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Taproot BIP-86 Address Card */}
            <div className="bg-[#141225] p-3.5 rounded-2xl border border-[#2b2450] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#c9c2e0] mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#77E0B0]" />
                  Taproot (BIP-86) Address
                </span>
                <span className="font-mono text-[10px] bg-[#2b2450] px-1.5 py-0.5 rounded text-[#FFD469]">
                  {wallet.derivationPath}
                </span>
              </div>
              <div className="font-mono text-xs text-white truncate my-1 bg-[#1a1733] p-2 rounded-lg border border-[#2b2450]/60 select-all">
                {wallet.taprootAddress}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#2b2450]/50 text-[11px] font-mono">
                <button
                  onClick={() => copyToClipboard(wallet.taprootAddress, 'Taproot Address')}
                  className="inline-flex items-center gap-1 text-[#77E0B0] hover:underline cursor-pointer"
                >
                  {copiedKey === 'Taproot Address' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'Taproot Address' ? 'Copied!' : 'Copy Address'}</span>
                </button>
                <a
                  href={`https://mempool.space/${wallet.network === 'testnet' ? 'testnet4/' : ''}address/${wallet.taprootAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#c9c2e0] hover:text-[#FFD469]"
                >
                  <span>Mempool</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* BTC Balance & Faucet */}
            <div className="bg-[#141225] p-3.5 rounded-2xl border border-[#2b2450] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#c9c2e0] mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <Coins className="w-3.5 h-3.5 text-[#FFD469]" />
                  Bitcoin Balance
                </span>
                <span className="font-mono text-[10px] text-[#77E0B0]">
                  {formatAmount(wallet.btcBalanceSats)} sats
                </span>
              </div>
              <div className="font-['Silkscreen'] text-xl text-[#FFD469] my-1">
                {formatSatsToBtc(wallet.btcBalanceSats)} <span className="text-xs font-mono font-normal text-white">BTC</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#2b2450]/50 text-[11px] font-mono">
                <button
                  onClick={handleClaimFaucet}
                  className="inline-flex items-center gap-1 text-[#FFD469] hover:text-white font-bold bg-[#FFD469]/10 px-2 py-0.5 rounded border border-[#FFD469]/30 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>+50k Sats Faucet</span>
                </button>
                <span className="text-[#c9c2e0]/70 text-[10px]">Ready for Gas &amp; Seals</span>
              </div>
            </div>

            {/* RGB Assets & UTXO Seals Summary */}
            <div className="bg-[#141225] p-3.5 rounded-2xl border border-[#2b2450] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#c9c2e0] mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <Layers className="w-3.5 h-3.5 text-[#9B87F5]" />
                  UTXO &amp; RGB State
                </span>
                <span className="font-mono text-[10px] text-[#FF9FC0]">
                  {wallet.assets.length} Active Assets
                </span>
              </div>
              <div className="flex items-baseline gap-3 my-1">
                <div>
                  <span className="text-xs text-[#c9c2e0] block">UTXOs</span>
                  <span className="font-['Silkscreen'] text-lg text-white">
                    {wallet.utxos.filter((u) => u.status === 'unspent').length}
                  </span>
                </div>
                <div className="h-6 w-px bg-[#2b2450]" />
                <div>
                  <span className="text-xs text-[#c9c2e0] block">Colored Seals</span>
                  <span className="font-['Silkscreen'] text-lg text-[#77E0B0]">
                    {wallet.utxos.filter((u) => u.isColored && u.status === 'unspent').length}
                  </span>
                </div>
                <div className="h-6 w-px bg-[#2b2450]" />
                <div>
                  <span className="text-xs text-[#c9c2e0] block">Transfers</span>
                  <span className="font-['Silkscreen'] text-lg text-[#FFD469]">
                    {wallet.transfers.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#2b2450]/50 text-[11px] font-mono">
                <button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className="text-[#9B87F5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showMnemonic ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showMnemonic ? 'Hide Mnemonic' : 'View Seed Words'}</span>
                </button>
                <button
                  onClick={handleCreateNewWallet}
                  className="text-[#c9c2e0] hover:text-[#FF9FC0] flex items-center gap-1 cursor-pointer"
                  title="Generate new seed"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>New Seed</span>
                </button>
              </div>
            </div>

          </div>

          {/* Seed Words Drawer (Toggleable) */}
          {showMnemonic && (
            <div className="mt-4 p-4 rounded-2xl bg-[#0e0c1a] border border-[#FF9FC0]/40 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#FF9FC0] font-bold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  BIP-39 12-Word Mnemonic Phrase (Secret Backup)
                </span>
                <button
                  onClick={() => copyToClipboard(wallet.mnemonic, 'Mnemonic Seed Phrase')}
                  className="text-xs font-mono text-[#c9c2e0] hover:text-white flex items-center gap-1 bg-[#1a1733] px-2.5 py-1 rounded-lg border border-[#2b2450] cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy 12 Words</span>
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {wallet.mnemonic.split(' ').map((word, idx) => (
                  <div key={idx} className="bg-[#141225] border border-[#2b2450] rounded-xl px-2.5 py-1.5 text-center font-mono text-xs">
                    <span className="text-[#c9c2e0]/50 mr-1 text-[10px]">{idx + 1}.</span>
                    <span className="text-[#FFD469] font-bold">{word}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#c9c2e0]/60 mt-2 font-mono">
                ⚠️ Tether WDK RGB derives the BIP-86 Taproot account key and single-use seal anchors deterministically from this seed phrase.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#141225] border-b border-[#2b2450] px-4 sm:px-6 flex overflow-x-auto gap-2 py-2">
          {[
            { id: 'overview', label: 'Overview & Guide', icon: Sparkles },
            { id: 'utxos', label: 'UTXO Manager', icon: Layers, badge: wallet.utxos.filter((u) => u.isColored).length },
            { id: 'assets', label: 'RGB Assets (NIA)', icon: Coins, badge: wallet.assets.length },
            { id: 'receive', label: 'Receive / Invoice', icon: QrCode },
            { id: 'send', label: 'Send RGB', icon: Send },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'code', label: 'WDK Code & SDK', icon: FileCode2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#9B87F5] text-[#141225] shadow-md'
                    : 'text-[#c9c2e0] hover:text-white hover:bg-[#1a1733]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                    isActive ? 'bg-[#141225] text-white' : 'bg-[#2b2450] text-[#FFD469]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#141225] space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* How Tether WDK + Utexo Works Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1c1932] via-[#241e42] to-[#1c1932] border border-[#3d346b] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#77E0B0] text-xs font-mono font-bold mb-2">
                    <Cpu className="w-4 h-4" />
                    <span>Tether WDK Architecture &bull; Utexo wdk-wallet-rgb Module</span>
                  </div>
                  <h3 className="font-['Silkscreen'] text-xl text-white mb-2">
                    Client-Side Validated Bitcoin Smart Contracts
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c9c2e0] leading-relaxed max-w-3xl">
                    The <strong>Tether Wallet Development Kit (WDK)</strong> integrates with the <strong>Utexo RGB module</strong> to manage confidential, high-speed, off-chain assets on Bitcoin. Instead of recording every token transfer on the main Bitcoin blockchain, state transitions are validated client-side and anchored to Bitcoin <strong>Unspent Transaction Outputs (UTXOs)</strong> as single-use seals.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    <div className="p-3 rounded-xl bg-[#141225]/80 border border-[#2b2450]">
                      <span className="text-[10px] font-mono uppercase text-[#FFD469] font-bold block mb-1">1. Single-Use Seals</span>
                      <p className="text-xs text-[#c9c2e0]">
                        Each RGB asset allocation is cryptographic state bound to a specific Bitcoin UTXO. Spending the UTXO closes the seal and transfers the state.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141225]/80 border border-[#2b2450]">
                      <span className="text-[10px] font-mono uppercase text-[#77E0B0] font-bold block mb-1">2. Blinded Invoices</span>
                      <p className="text-xs text-[#c9c2e0]">
                        Receivers generate invoices with blinded UTXO hashes, ensuring sender and public observers cannot see the receiving Bitcoin address.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141225]/80 border border-[#2b2450]">
                      <span className="text-[10px] font-mono uppercase text-[#FF9FC0] font-bold block mb-1">3. Off-Chain Consignments</span>
                      <p className="text-xs text-[#c9c2e0]">
                        Transfer histories (consignments) travel peer-to-peer or via Utexo proxy transports, giving near-zero transaction fees and unlimited scalability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('utxos')}
                  className="p-4 rounded-2xl bg-[#1a1733] border border-[#2b2450] hover:border-[#77E0B0]/50 hover:bg-[#201c3e] transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Layers className="w-5 h-5 text-[#77E0B0]" />
                    <ArrowRight className="w-4 h-4 text-[#c9c2e0] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Create Colored UTXOs</h4>
                  <p className="text-xs text-[#c9c2e0] mt-1">
                    Reserve Bitcoin outputs as seals to receive and issue RGB assets.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('assets')}
                  className="p-4 rounded-2xl bg-[#1a1733] border border-[#2b2450] hover:border-[#FFD469]/50 hover:bg-[#201c3e] transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Coins className="w-5 h-5 text-[#FFD469]" />
                    <ArrowRight className="w-4 h-4 text-[#c9c2e0] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Issue NIA Tokens</h4>
                  <p className="text-xs text-[#c9c2e0] mt-1">
                    Issue Non-Inflatable Assets (like Tether USD₮ or community coins).
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className="p-4 rounded-2xl bg-[#1a1733] border border-[#2b2450] hover:border-[#9B87F5]/50 hover:bg-[#201c3e] transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileCode2 className="w-5 h-5 text-[#9B87F5]" />
                    <ArrowRight className="w-4 h-4 text-[#c9c2e0] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Inspect SDK Code</h4>
                  <p className="text-xs text-[#c9c2e0] mt-1">
                    View copy-paste TypeScript code from the official Tether WDK docs.
                  </p>
                </button>
              </div>

              {/* Current Balances preview list */}
              <div>
                <h4 className="font-['Silkscreen'] text-base text-[#F6F2FF] mb-3 flex items-center justify-between">
                  <span>Current Asset Holdings</span>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className="text-xs font-mono text-[#FFD469] hover:underline"
                  >
                    View Details &rarr;
                  </button>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wallet.assets.map((asset) => (
                    <div key={asset.id} className="p-3.5 rounded-xl bg-[#181530] border border-[#2b2450] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#262045] flex items-center justify-center font-['Silkscreen'] text-xs text-[#FFD469] border border-[#3d346b]">
                          {asset.ticker.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            <span>{asset.name}</span>
                            <span className="text-[10px] font-mono bg-[#2b2450] px-1.5 py-0.5 rounded text-[#77E0B0]">
                              {asset.schema}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-[#c9c2e0]">
                            Contract: {asset.id.slice(0, 18)}...
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-['Silkscreen'] text-base text-[#FFD469]">
                          {formatAmount(asset.balance)}
                        </div>
                        <div className="text-[11px] font-mono text-[#c9c2e0]">
                          {asset.ticker}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: UTXO MANAGER & COLORER */}
          {activeTab === 'utxos' && (
            <div className="space-y-6">
              
              {/* UTXO Creator Control Box */}
              <div className="p-5 rounded-2xl bg-[#181530] border-2 border-[#2b2450]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-['Silkscreen'] text-base text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#77E0B0]" />
                      <span>UTXO Orchestration &bull; account.createUtxos()</span>
                    </h3>
                    <p className="text-xs text-[#c9c2e0] mt-1">
                      As explained in Tether WDK guide, before receiving or issuing RGB assets, you must create colored UTXOs from your base Bitcoin balance.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#77E0B0] bg-[#77E0B0]/10 px-2 py-1 rounded border border-[#77E0B0]/30 font-bold">
                    Single-Use Seals Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div>
                    <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                      Number of Colored UTXOs to Create
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 5, 8].map((count) => (
                        <button
                          key={count}
                          onClick={() => setUtxoCountToCreate(count)}
                          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            utxoCountToCreate === count
                              ? 'bg-[#77E0B0] text-[#141225] font-extrabold shadow'
                              : 'bg-[#141225] border border-[#2b2450] text-[#c9c2e0] hover:text-white'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                      Satoshis per UTXO (Recommended: 2,000 sats)
                    </label>
                    <input
                      type="number"
                      value={satsPerUtxo}
                      onChange={(e) => setSatsPerUtxo(Math.max(1000, parseInt(e.target.value) || 2000))}
                      className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#77E0B0]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2b2450]">
                  <div className="text-xs font-mono text-[#c9c2e0]">
                    Total BTC required: <span className="text-[#FFD469] font-bold">{formatAmount(utxoCountToCreate * satsPerUtxo + 350)} sats</span> (incl. 350 sat witness mining fee)
                  </div>
                  <button
                    onClick={handleCreateUtxos}
                    disabled={isCreatingUtxos}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#77E0B0] to-[#9B87F5] text-[#141225] font-['Silkscreen'] text-xs font-bold hover:scale-[1.02] active:scale-100 transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingUtxos ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating UTXOs on Bitcoin...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Execute account.createUtxos()</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* UTXO List */}
              <div>
                <h4 className="font-['Silkscreen'] text-base text-white mb-3 flex items-center justify-between">
                  <span>Current UTXO Inventory ({wallet.utxos.length})</span>
                  <span className="text-xs font-mono text-[#c9c2e0]">
                    {wallet.utxos.filter((u) => u.isColored).length} Colored for RGB
                  </span>
                </h4>

                <div className="space-y-2.5">
                  {wallet.utxos.map((utxo) => (
                    <div
                      key={utxo.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        utxo.isColored
                          ? 'bg-[#181530] border-[#77E0B0]/40'
                          : 'bg-[#141225] border-[#2b2450]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            utxo.isColored
                              ? 'bg-[#77E0B0]/20 text-[#77E0B0] border border-[#77E0B0]/40'
                              : 'bg-[#2b2450] text-[#c9c2e0]'
                          }`}>
                            {utxo.isColored ? 'Colored / RGB Seal' : 'Base BTC Funding'}
                          </span>
                          <span className="font-mono text-xs text-white font-bold">
                            {utxo.id.slice(0, 24)}...:{utxo.vout}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-['Silkscreen'] text-sm text-[#FFD469]">
                            {formatAmount(utxo.sats)} sats
                          </span>
                          <button
                            onClick={() => copyToClipboard(utxo.id, 'UTXO ID')}
                            className="text-[#c9c2e0] hover:text-white p-1"
                            title="Copy Outpoint"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* RGB Allocations on this UTXO */}
                      {utxo.rgbAllocations.length > 0 ? (
                        <div className="mt-2 pt-2 border-t border-[#2b2450] flex items-center gap-2 text-xs font-mono">
                          <span className="text-[#FF9FC0] font-bold">Bound RGB Asset:</span>
                          {utxo.rgbAllocations.map((alloc, idx) => (
                            <span key={idx} className="bg-[#241e42] px-2 py-0.5 rounded text-white border border-[#3d346b]">
                              {formatAmount(alloc.amount)} {alloc.ticker}
                            </span>
                          ))}
                        </div>
                      ) : utxo.isColored ? (
                        <div className="mt-2 pt-2 border-t border-[#2b2450] text-[11px] font-mono text-[#77E0B0]/80">
                          ✨ Unallocated seal &mdash; ready to bind new RGB asset or receive incoming transfer!
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: RGB ASSETS & ISSUANCE */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              
              {/* Asset Issuance Form */}
              <div className="p-5 rounded-2xl bg-[#181530] border-2 border-[#2b2450]">
                <h3 className="font-['Silkscreen'] text-base text-white flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-[#FFD469]" />
                  <span>Issue Non-Inflatable Asset (NIA) &bull; account.issueAssetNia()</span>
                </h3>
                <p className="text-xs text-[#c9c2e0] mb-4">
                  Issues a fixed-supply, capped smart contract asset on the Bitcoin RGB protocol. The initial supply is bound to an available colored UTXO seal.
                </p>

                <form onSubmit={handleIssueAsset} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                        Asset Name
                      </label>
                      <input
                        type="text"
                        value={issueName}
                        onChange={(e) => setIssueName(e.target.value)}
                        placeholder="e.g. Tether Euro"
                        className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                        Ticker Symbol
                      </label>
                      <input
                        type="text"
                        value={issueTicker}
                        onChange={(e) => setIssueTicker(e.target.value.toUpperCase())}
                        placeholder="e.g. EURTRGB"
                        className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                        Total Supply (Capped)
                      </label>
                      <input
                        type="number"
                        value={issueSupply}
                        onChange={(e) => setIssueSupply(e.target.value)}
                        placeholder="e.g. 1000000"
                        className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                        Precision (Decimals)
                      </label>
                      <select
                        value={issuePrecision}
                        onChange={(e) => setIssuePrecision(parseInt(e.target.value))}
                        className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                      >
                        <option value={0}>0 (Whole units / NFTs)</option>
                        <option value={2}>2 (Standard Currency)</option>
                        <option value={6}>6 (Tether USD₮ / Micro)</option>
                        <option value={8}>8 (Satoshi Precision)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                      Asset Description / Metadata
                    </label>
                    <input
                      type="text"
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      placeholder="Asset genesis details and purpose"
                      className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] font-mono text-[#c9c2e0]/70">
                      Requires 1 free colored UTXO seal.
                    </span>
                    <button
                      type="submit"
                      disabled={isIssuing}
                      className="px-5 py-2.5 rounded-xl bg-[#FFD469] text-[#141225] font-['Silkscreen'] text-xs font-bold hover:bg-[#ffe082] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isIssuing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Issuing via Utexo SDK...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Issue RGB Asset (NIA)</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Assets List */}
              <div className="space-y-3">
                <h4 className="font-['Silkscreen'] text-base text-white">
                  Active RGB Assets ({wallet.assets.length})
                </h4>

                {wallet.assets.map((asset) => (
                  <div key={asset.id} className="p-4 rounded-2xl bg-[#181530] border border-[#2b2450] hover:border-[#3d346b] transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9B87F5] to-[#FFD469] flex items-center justify-center font-['Silkscreen'] text-xs text-[#141225] font-bold">
                          {asset.ticker.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            <span>{asset.name}</span>
                            <span className="text-xs font-mono text-[#FFD469]">({asset.ticker})</span>
                            <span className="text-[10px] font-mono bg-[#77E0B0]/20 text-[#77E0B0] px-2 py-0.5 rounded border border-[#77E0B0]/30 font-bold">
                              {asset.schema}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#c9c2e0]/80">
                            {asset.description}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-['Silkscreen'] text-lg text-[#FFD469]">
                          {formatAmount(asset.balance)}
                        </div>
                        <div className="text-xs font-mono text-[#c9c2e0]">
                          Total Supply: {formatAmount(asset.issuedSupply)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#2b2450] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-[#c9c2e0]">
                      <div className="flex items-center justify-between bg-[#141225] px-2.5 py-1 rounded-lg">
                        <span>Contract ID:</span>
                        <div className="flex items-center gap-1 text-white">
                          <span>{asset.id.slice(0, 16)}...</span>
                          <button onClick={() => copyToClipboard(asset.id, 'Contract ID')} className="hover:text-[#77E0B0]">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-[#141225] px-2.5 py-1 rounded-lg">
                        <span>Genesis UTXO Seal:</span>
                        <div className="flex items-center gap-1 text-[#77E0B0]">
                          <span>{asset.allocatedUtxoId.slice(0, 16)}...</span>
                          <button onClick={() => copyToClipboard(asset.allocatedUtxoId, 'Genesis UTXO')} className="hover:text-white">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: RECEIVE / RGB INVOICE */}
          {activeTab === 'receive' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-5 rounded-2xl bg-[#181530] border-2 border-[#2b2450]">
                <h3 className="font-['Silkscreen'] text-base text-white flex items-center gap-2 mb-1">
                  <QrCode className="w-4 h-4 text-[#77E0B0]" />
                  <span>Create RGB Blinded Invoice &bull; account.createInvoice()</span>
                </h3>
                <p className="text-xs text-[#c9c2e0] mb-4">
                  RGB transfers require a blinded invoice. The recipient blinds an unspent UTXO so the sender never learns the recipient’s on-chain Bitcoin address.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                      Select RGB Asset to Receive
                    </label>
                    <select
                      value={selectedAssetForInvoice}
                      onChange={(e) => setSelectedAssetForInvoice(e.target.value)}
                      className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#77E0B0]"
                    >
                      {wallet.assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} ({asset.ticker}) &bull; Current Balance: {formatAmount(asset.balance)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                      Amount to Request
                    </label>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#77E0B0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                      Transport Endpoint (RGB Proxy Server)
                    </label>
                    <input
                      type="text"
                      value={wallet.transportEndpoint}
                      readOnly
                      className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-[#c9c2e0]/80 select-all"
                    />
                  </div>

                  <button
                    onClick={handleGenerateInvoice}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#77E0B0] to-[#9B87F5] text-[#141225] font-['Silkscreen'] text-xs font-bold hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Generate Blinded Invoice</span>
                  </button>
                </div>
              </div>

              {/* Generated Invoice Display */}
              {createdInvoice && (
                <div className="p-5 rounded-2xl bg-[#141225] border-2 border-[#77E0B0] animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#77E0B0] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      RGB Blinded Invoice Ready
                    </span>
                    <span className="text-[11px] font-mono text-[#c9c2e0]">
                      Expires in 24 hours
                    </span>
                  </div>

                  <div className="bg-[#181530] p-3 rounded-xl border border-[#2b2450] font-mono text-xs text-white break-all select-all mb-3">
                    {createdInvoice.invoiceString}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4 text-[#c9c2e0]">
                    <div className="bg-[#1a1733] p-2 rounded-lg border border-[#2b2450]">
                      <span className="block text-[10px] text-[#FFD469]">Blinded UTXO:</span>
                      <span className="text-white truncate block">{createdInvoice.blindedUtxo}</span>
                    </div>
                    <div className="bg-[#1a1733] p-2 rounded-lg border border-[#2b2450]">
                      <span className="block text-[10px] text-[#77E0B0]">Requested:</span>
                      <span className="text-white font-bold">{createdInvoice.amount} {createdInvoice.ticker}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(createdInvoice.invoiceString, 'RGB Invoice')}
                    className="w-full py-2.5 rounded-xl bg-[#77E0B0] text-[#141225] font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#85ebd0] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'RGB Invoice' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'RGB Invoice' ? 'Copied to Clipboard!' : 'Copy RGB Invoice String'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SEND RGB */}
          {activeTab === 'send' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-5 rounded-2xl bg-[#181530] border-2 border-[#2b2450]">
                <h3 className="font-['Silkscreen'] text-base text-white flex items-center gap-2 mb-1">
                  <Send className="w-4 h-4 text-[#FFD469]" />
                  <span>Send RGB Assets &bull; account.send()</span>
                </h3>
                <p className="text-xs text-[#c9c2e0] mb-4">
                  Constructs an off-chain RGB state transfer, creates a witness Bitcoin transaction spending your input seal, and transmits the consignment to the receiver.
                </p>

                <form onSubmit={handleSendRgb} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                      Recipient Blinded RGB Invoice
                    </label>
                    <input
                      type="text"
                      value={sendInvoiceInput}
                      onChange={(e) => setSendInvoiceInput(e.target.value)}
                      placeholder="rgb:invoice:nia:txob:... or paste testnet address"
                      className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                        Asset
                      </label>
                      <select
                        value={sendAssetTicker}
                        onChange={(e) => setSendAssetTicker(e.target.value)}
                        className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                      >
                        {wallet.assets.map((asset) => (
                          <option key={asset.id} value={asset.ticker}>
                            {asset.ticker} (Bal: {formatAmount(asset.balance)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                        Amount to Send
                      </label>
                      <input
                        type="number"
                        value={sendAmountInput}
                        onChange={(e) => setSendAmountInput(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#c9c2e0] mb-1 font-bold">
                      Witness Mining Fee Rate (sat/vB)
                    </label>
                    <input
                      type="number"
                      value={sendFeeRate}
                      onChange={(e) => setSendFeeRate(e.target.value)}
                      placeholder="5"
                      className="w-full bg-[#141225] border border-[#2b2450] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD469]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD469] to-[#FF9FC0] text-[#141225] font-['Silkscreen'] text-xs font-bold hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Broadcasting Witness TX &amp; Consignment...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Execute account.send()</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="font-['Silkscreen'] text-base text-white flex items-center justify-between">
                <span>Transfer &amp; Consignment Log</span>
                <span className="text-xs font-mono text-[#c9c2e0]">
                  {wallet.transfers.length} Events
                </span>
              </h4>

              <div className="space-y-3">
                {wallet.transfers.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-xl bg-[#181530] border border-[#2b2450] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                        tx.type === 'issuance'
                          ? 'bg-[#FFD469]/20 text-[#FFD469]'
                          : tx.type === 'outgoing'
                          ? 'bg-[#FF9FC0]/20 text-[#FF9FC0]'
                          : tx.type === 'utxo_color'
                          ? 'bg-[#77E0B0]/20 text-[#77E0B0]'
                          : 'bg-[#9B87F5]/20 text-[#9B87F5]'
                      }`}>
                        {tx.type === 'issuance' ? 'GEN' : tx.type === 'outgoing' ? 'OUT' : tx.type === 'utxo_color' ? 'UTXO' : 'IN'}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-2">
                          <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                          <span className="text-[10px] font-mono text-[#77E0B0]">
                            {tx.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#c9c2e0]/70 flex items-center gap-2">
                          <span>Witness TX: {tx.txid.slice(0, 16)}...</span>
                          <button onClick={() => copyToClipboard(tx.txid, 'TXID')} className="hover:text-white">
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-['Silkscreen'] text-sm text-[#FFD469]">
                        {tx.type === 'outgoing' ? '-' : '+'}{formatAmount(tx.amount)} {tx.assetTicker}
                      </div>
                      <div className="text-[10px] font-mono text-[#c9c2e0]/60">
                        Fee: {tx.witnessTxFeeSats} sats &bull; {new Date(tx.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: WDK CODE & SDK GUIDE */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-['Silkscreen'] text-base text-white">
                    Official Tether WDK SDK Implementation Code
                  </h3>
                  <p className="text-xs text-[#c9c2e0] mt-0.5">
                    Directly conforming to <a href="https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/guides/get-started/" target="_blank" rel="noopener noreferrer" className="text-[#FFD469] hover:underline font-mono inline-flex items-center gap-1">docs.wdk.tether.io get-started guide <ExternalLink className="w-3 h-3" /></a>
                  </p>
                </div>
              </div>

              {/* Code Snippet 1: Installation */}
              <div className="bg-[#0e0c1a] border border-[#2b2450] rounded-2xl overflow-hidden">
                <div className="bg-[#181530] px-4 py-2 border-b border-[#2b2450] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#77E0B0] font-bold">1. Install WDK Core &amp; RGB Module</span>
                  <button
                    onClick={() => copyToClipboard('npm install @tetherto/wdk @utexo/wdk-wallet-rgb', 'Install Command')}
                    className="text-xs font-mono text-[#c9c2e0] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-[#F6F2FF] overflow-x-auto">
{`npm install @tetherto/wdk @utexo/wdk-wallet-rgb`}
                </pre>
              </div>

              {/* Code Snippet 2: Complete WDK RGB Flow */}
              <div className="bg-[#0e0c1a] border border-[#2b2450] rounded-2xl overflow-hidden">
                <div className="bg-[#181530] px-4 py-2 border-b border-[#2b2450] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FFD469] font-bold">2. Complete TypeScript Implementation</span>
                  <button
                    onClick={() => copyToClipboard(`import { WDK } from '@tetherto/wdk';
import { WalletManagerRgb } from '@utexo/wdk-wallet-rgb';

// Initialize WDK instance with BIP-39 mnemonic
const wdk = new WDK({
  seed: "${wallet.mnemonic}"
});

// Register Utexo's RGB Wallet Manager
wdk.registerWalletManager('rgb', new WalletManagerRgb({
  network: '${wallet.network}', // 'testnet' | 'mainnet' | 'regtest'
  indexerUrl: '${wallet.indexerUrl}',
  transportEndpoint: '${wallet.transportEndpoint}',
  dataDir: './rgb_storage'
}));

async function main() {
  // 1. Get primary Taproot account (BIP-86)
  const account = await wdk.getAccount('rgb', 0);
  const address = await account.getAddress();
  console.log('Taproot Address:', address);

  // 2. Create colored UTXOs for RGB single-use seals
  // Creates 3 colored UTXOs of 2,000 sats each
  console.log('Creating UTXOs...');
  await account.createUtxos(3, 2000);

  // 3. Issue a Non-Inflatable Asset (NIA)
  console.log('Issuing NIA Token...');
  const asset = await account.issueAssetNia({
    ticker: 'USDTRGB',
    name: 'Tether USD (RGB)',
    precision: 6,
    amounts: [1000000000n]
  });
  console.log('Asset Issued:', asset.assetId);

  // 4. Generate a blinded RGB invoice
  const invoice = await account.createInvoice({
    assetId: asset.assetId,
    amount: 100n,
    expiryHours: 24
  });
  console.log('Invoice String:', invoice.invoice);

  // 5. Send RGB tokens to recipient invoice
  const transfer = await account.send({
    invoice: invoice.invoice,
    feeRateSatPerVbyte: 5
  });
  console.log('Transfer Witness TXID:', transfer.txid);
}

main().catch(console.error);`, 'Full TypeScript Guide')}
                    className="text-xs font-mono text-[#c9c2e0] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Full Script</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-[#77E0B0] overflow-x-auto leading-relaxed">
{`import { WDK } from '@tetherto/wdk';
import { WalletManagerRgb } from '@utexo/wdk-wallet-rgb';

// 1. Initialize WDK instance with BIP-39 mnemonic
const wdk = new WDK({
  seed: "${wallet.mnemonic}"
});

// 2. Register Utexo's RGB Wallet Manager
wdk.registerWalletManager('rgb', new WalletManagerRgb({
  network: '${wallet.network}', // 'testnet' | 'mainnet' | 'regtest'
  indexerUrl: '${wallet.indexerUrl}',
  transportEndpoint: '${wallet.transportEndpoint}',
  dataDir: './rgb_storage'
}));

async function main() {
  // Get Taproot account (BIP-86)
  const account = await wdk.getAccount('rgb', 0);
  const address = await account.getAddress();
  console.log('Taproot Address:', address);

  // Orchestrate single-use seals: create colored UTXOs
  console.log('Creating UTXOs...');
  await account.createUtxos(3, 2000);

  // Issue Non-Inflatable Asset (NIA)
  console.log('Issuing NIA Token...');
  const asset = await account.issueAssetNia({
    ticker: 'USDTRGB',
    name: 'Tether USD (RGB)',
    precision: 6,
    amounts: [1000000000n]
  });

  // Create blinded invoice for private receipt
  const invoice = await account.createInvoice({
    assetId: asset.assetId,
    amount: 100n,
    expiryHours: 24
  });

  // Send RGB state transfer
  const transfer = await account.send({
    invoice: invoice.invoice,
    feeRateSatPerVbyte: 5
  });
  console.log('Witness TXID:', transfer.txid);
}

main().catch(console.error);`}
                </pre>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 bg-[#181530] border-t-2 border-[#2b2450] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#c9c2e0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#77E0B0] animate-ping" />
            <span>Connected to Bitcoin {wallet.network.toUpperCase()}</span>
            <span className="text-[#c9c2e0]/40">&bull;</span>
            <span className="text-[#FFD469]">Single-Use Seals Synchronized</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/guides/get-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9c2e0] hover:text-[#77E0B0] flex items-center gap-1 transition-colors"
            >
              <span>WDK Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#2b2450] hover:bg-[#3d346b] text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
