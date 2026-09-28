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
  Download,
  Upload,
  ArrowUpRight,
  ArrowDownLeft,
  Server,
  Zap,
  Lock,
  ChevronDown,
  Repeat,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  TrendingUp,
  Settings,
  History,
  ShieldAlert,
  SlidersHorizontal,
  Flame,
  Info,
  Terminal,
  Database,
  LockKeyhole
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  BitcoinUtxo,
  RgbAsset,
  RgbInvoice,
  RgbTransfer,
  UtexoNetwork,
  UtexoWalletState
} from './types/utexo';
import {
  generateMnemonic,
  deriveTaprootAddress,
  generateTxid,
  generateBlindedUtxo,
  createInitialWalletState,
  formatSatsToBtc,
  formatAmount
} from './utils/utexoWalletUtils';
import { RealQRCode } from './components/RealQRCode';
import { UTXOInspectorModal } from './components/UTXOInspectorModal';

export default function App() {
  // Navigation Tabs matching Tether WDK get-started guide:
  // 'assets' | 'utxos' | 'invoices' | 'transfer' | 'issue' | 'backup' | 'wdk_code'
  const [activeTab, setActiveTab] = useState<
    'assets' | 'utxos' | 'invoices' | 'transfer' | 'issue' | 'backup' | 'wdk_code'
  >('assets');

  // Tether WDK Configuration State (as in docs.wdk.tether.io)
  const [wdkConfig, setWdkConfig] = useState({
    indexerUrl: 'https://electrs.rgb.info',
    transportEndpoint: 'rpca://storm.rgb.info:50001',
    dataDir: '~/.wdk/rgb-wallet/testnet',
    transferMaxFeeSatPerVb: 24
  });

  // Modals
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [inspectedUtxo, setInspectedUtxo] = useState<BitcoinUtxo | null>(null);

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);

  // Send / Transfer Form State (WDK Pipeline: sendBegin -> signPsbt -> sendEnd)
  const [sendAssetTicker, setSendAssetTicker] = useState('USDT-RGB');
  const [sendAmount, setSendAmount] = useState('25');
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendFeeSpeed, setSendFeeSpeed] = useState<'normal' | 'fast' | 'turbo'>('fast');
  const [isSigningAndSending, setIsSigningAndSending] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<'idle' | 'sendBegin' | 'signPsbt' | 'sendEnd' | 'complete'>('idle');
  const [pipelineStatusText, setPipelineStatusText] = useState('');
  const [lastConsignmentData, setLastConsignmentData] = useState<string | null>(null);

  // Receive Form State
  const [receiveMode, setReceiveMode] = useState<'blinded' | 'witness'>('blinded');
  const [receiveAssetTicker, setReceiveAssetTicker] = useState('USDT-RGB');
  const [receiveAmount, setReceiveAmount] = useState('50');
  const [receiveExpiryHours, setReceiveExpiryHours] = useState('24');
  const [generatedInvoiceUri, setGeneratedInvoiceUri] = useState('');

  // Issue NIA Form State
  const [issueTicker, setIssueTicker] = useState('TITAN');
  const [issueName, setIssueName] = useState('Titanium RGB Reserve');
  const [issueSupply, setIssueSupply] = useState('5000000');
  const [issuePrecision, setIssuePrecision] = useState('2');

  // Backup Passphrase
  const [backupPassword, setBackupPassword] = useState('');
  const [backupJson, setBackupJson] = useState<string | null>(null);

  // Wallet State
  const [wallet, setWallet] = useState<UtexoWalletState>(() => {
    try {
      const saved = localStorage.getItem('tether_wdk_rgb_wallet_state_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    const mnemonic = generateMnemonic();
    return createInitialWalletState(mnemonic, 'testnet');
  });

  useEffect(() => {
    try {
      localStorage.setItem('tether_wdk_rgb_wallet_state_v1', JSON.stringify(wallet));
    } catch {}
  }, [wallet]);

  // Regenerate invoice URI on change
  useEffect(() => {
    const blinded = generateBlindedUtxo();
    const expiryTimestamp = Math.floor(Date.now() / 1000) + parseInt(receiveExpiryHours, 10) * 3600;
    if (receiveMode === 'blinded') {
      const uri = `rgb:invoice:${blinded}?asset=${receiveAssetTicker}&amt=${receiveAmount}&transport=${encodeURIComponent(wdkConfig.transportEndpoint)}&exp=${expiryTimestamp}`;
      setGeneratedInvoiceUri(uri);
    } else {
      const uri = `bitcoin:${wallet.taprootAddress}?amount=${(parseFloat(receiveAmount) * 0.00001).toFixed(6)}&label=WDK-Taproot-Receive`;
      setGeneratedInvoiceUri(uri);
    }
  }, [receiveMode, receiveAssetTicker, receiveAmount, receiveExpiryHours, wallet.taprootAddress, wdkConfig.transportEndpoint]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Re-seed with fresh mnemonic
  const handleCreateNewSeed = () => {
    const newMnemonic = generateMnemonic();
    const newState = createInitialWalletState(newMnemonic, wallet.network);
    setWallet(newState);
    showToast('Derived fresh BIP-39 mnemonic and BIP-86 Taproot account keys!');
  };

  // Switch network
  const handleSwitchNetwork = (net: UtexoNetwork) => {
    const newAddr = deriveTaprootAddress(wallet.mnemonic, net);
    setWallet((prev) => ({
      ...prev,
      network: net,
      taprootAddress: newAddr
    }));
    showToast(`Switched network to Bitcoin ${net.toUpperCase()}`);
  };

  // Testnet Faucet (+25,000 sats & +500 USDT-RGB)
  const handleFaucetAirdrop = () => {
    const faucetTxid = generateTxid();
    const newUtxo: BitcoinUtxo = {
      id: `${faucetTxid}:0`,
      txid: faucetTxid,
      vout: 0,
      sats: 25000,
      scriptType: 'p2tr',
      isColored: true,
      rgbAllocations: [
        {
          assetId: 'rgb:nia:3b9f8e41a27c09d854e12e7f83a54b92c431ef82a',
          ticker: 'USDT-RGB',
          amount: 500
        }
      ],
      status: 'unspent',
      timestamp: Date.now()
    };

    const updatedAssets = wallet.assets.map((a) => {
      if (a.ticker === 'USDT-RGB') {
        return { ...a, balance: a.balance + 500 };
      }
      return a;
    });

    const newTransfer: RgbTransfer = {
      id: `faucet_${Date.now()}`,
      txid: faucetTxid,
      type: 'incoming',
      assetTicker: 'USDT-RGB',
      amount: 500,
      recipientOrInvoice: wallet.taprootAddress,
      witnessTxFeeSats: 1200,
      timestamp: Date.now(),
      status: 'confirmed'
    };

    setWallet((prev) => ({
      ...prev,
      btcBalanceSats: prev.btcBalanceSats + 25000,
      assets: updatedAssets,
      utxos: [newUtxo, ...prev.utxos],
      transfers: [newTransfer, ...prev.transfers]
    }));

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#26A17B', '#00D287', '#F7931A', '#38BDF8']
      });
    } catch {}

    showToast('Tether WDK Faucet airdropped +25,000 Sats & +500 USDT-RGB!');
  };

  // Portfolio calculations
  const btcUsdRate = 96400;
  const btcValueUsd = (wallet.btcBalanceSats / 100000000) * btcUsdRate;
  const usdtAsset = wallet.assets.find((a) => a.ticker === 'USDT-RGB');
  const usdtValueUsd = usdtAsset ? usdtAsset.balance : 0;
  const buddyAsset = wallet.assets.find((a) => a.ticker === 'BUDDY');
  const buddyValueUsd = buddyAsset ? buddyAsset.balance * 0.45 : 0;
  const totalPortfolioUsd = btcValueUsd + usdtValueUsd + buddyValueUsd;

  // Execute WDK Transfer Pipeline: sendBegin -> signPsbt -> sendEnd
  const handleExecuteWdkTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(sendAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (!sendRecipient.trim()) {
      alert('Please enter recipient blinded UTXO or Taproot address.');
      return;
    }

    const currentAsset = wallet.assets.find((a) => a.ticker === sendAssetTicker);
    if (sendAssetTicker !== 'BTC' && (!currentAsset || currentAsset.balance < amt)) {
      alert(`Insufficient ${sendAssetTicker} balance!`);
      return;
    }

    setIsSigningAndSending(true);
    setPipelineStage('sendBegin');
    setPipelineStatusText('Stage 1/3: Calling wallet.sendBegin() - Allocating UTXO single-use seal & constructing AluVM state transition...');

    setTimeout(() => {
      setPipelineStage('signPsbt');
      setPipelineStatusText('Stage 2/3: Calling wallet.signPsbt() - Generating BIP-86 Taproot Schnorr witness signature...');
    }, 1000);

    setTimeout(() => {
      setPipelineStage('sendEnd');
      setPipelineStatusText('Stage 3/3: Calling wallet.sendEnd() - Exporting consignment package & broadcasting anchor witness transaction...');
    }, 2000);

    setTimeout(() => {
      const txid = generateTxid();
      const consignmentHash = `consignment_wdk_${Date.now()}`;
      const feeSats = sendFeeSpeed === 'turbo' ? 4200 : sendFeeSpeed === 'fast' ? 2400 : 1200;

      const updatedAssets = wallet.assets.map((a) => {
        if (a.ticker === sendAssetTicker) {
          return { ...a, balance: Math.max(0, a.balance - amt) };
        }
        return a;
      });

      const newTransfer: RgbTransfer = {
        id: `send_${Date.now()}`,
        txid,
        type: 'outgoing',
        assetTicker: sendAssetTicker,
        amount: amt,
        recipientOrInvoice: sendRecipient.trim(),
        witnessTxFeeSats: feeSats,
        timestamp: Date.now(),
        status: 'confirmed',
        consignmentHash
      };

      const consignmentDump = JSON.stringify(
        {
          schema: 'NIA (RGB-20)',
          contractId: currentAsset?.id || 'rgb:nia:...',
          assetTicker: sendAssetTicker,
          amountSent: amt,
          recipientBlindedSeal: sendRecipient.trim(),
          witnessTxid: txid,
          feeRateSatPerVb: feeSats / 160,
          consignmentHash,
          aluVmVersion: 'v0.11-rc2',
          exportedAt: new Date().toISOString()
        },
        null,
        2
      );

      setLastConsignmentData(consignmentDump);

      setWallet((prev) => ({
        ...prev,
        btcBalanceSats: Math.max(1000, prev.btcBalanceSats - feeSats),
        assets: updatedAssets,
        transfers: [newTransfer, ...prev.transfers]
      }));

      setIsSigningAndSending(false);
      setPipelineStage('complete');
      setIsSendModalOpen(false);
      setSendRecipient('');

      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#26A17B', '#00D287', '#FFFFFF']
        });
      } catch {}

      showToast(`WDK Pipeline finished: Sent ${amt} ${sendAssetTicker} & validated consignment!`);
    }, 3000);
  };

  // Issue NIA Smart Asset
  const handleExecuteIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTicker.trim() || !issueName.trim() || !issueSupply) {
      alert('Please fill all required fields.');
      return;
    }

    const supplyNum = parseFloat(issueSupply);
    const precisionNum = parseInt(issuePrecision, 10);
    const targetUtxo = wallet.utxos.find((u) => !u.isColored) || wallet.utxos[0];
    const contractId = `rgb:nia:c1${generateTxid().slice(0, 16)}...${issueTicker.toLowerCase()}`;
    const genesisTxid = generateTxid();

    const newAsset: RgbAsset = {
      id: contractId,
      ticker: issueTicker.toUpperCase(),
      name: issueName,
      precision: precisionNum,
      issuedSupply: supplyNum,
      balance: supplyNum,
      schema: 'NIA',
      genesisTxid,
      allocatedUtxoId: targetUtxo.id,
      description: 'Issued via @utexo/wdk-wallet-rgb WalletManager',
      createdAt: Date.now()
    };

    const updatedUtxos = wallet.utxos.map((u) => {
      if (u.id === targetUtxo.id) {
        return {
          ...u,
          isColored: true,
          rgbAllocations: [
            ...u.rgbAllocations,
            { assetId: contractId, ticker: newAsset.ticker, amount: supplyNum }
          ]
        };
      }
      return u;
    });

    const newTransfer: RgbTransfer = {
      id: `issue_${Date.now()}`,
      txid: genesisTxid,
      type: 'issuance',
      assetTicker: newAsset.ticker,
      amount: supplyNum,
      recipientOrInvoice: targetUtxo.id,
      witnessTxFeeSats: 2200,
      timestamp: Date.now(),
      status: 'confirmed'
    };

    setWallet((prev) => ({
      ...prev,
      assets: [newAsset, ...prev.assets],
      utxos: updatedUtxos,
      transfers: [newTransfer, ...prev.transfers]
    }));

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#26A17B', '#F7931A', '#38BDF8']
      });
    } catch {}

    showToast(`WDK Asset Genesis: Issued ${newAsset.ticker} (${supplyNum.toLocaleString()} supply)!`);
  };

  // Generate Encrypted Backup
  const handleGenerateBackup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupPassword.trim()) {
      alert('Please enter a secure passphrase for encryption.');
      return;
    }

    const payload = {
      version: 'wdk-wallet-rgb-v1',
      encryptedAt: new Date().toISOString(),
      network: wallet.network,
      taprootAddress: wallet.taprootAddress,
      derivationPath: wallet.derivationPath,
      mnemonicEncrypted: btoa(wallet.mnemonic), // Base64 simulated encrypted payload
      assetsCount: wallet.assets.length,
      utxosCount: wallet.utxos.length,
      checksum: generateTxid().slice(0, 16)
    };

    const jsonStr = JSON.stringify(payload, null, 2);
    setBackupJson(jsonStr);
    showToast('Generated encrypted WDK wallet backup JSON!');
  };

  const shortAddress = `${wallet.taprootAddress.slice(0, 8)}...${wallet.taprootAddress.slice(-6)}`;

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F1F5F9] relative overflow-x-hidden selection:bg-[#26A17B] selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Ambient Mesh Glow */}
      <div className="fixed top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#26A17B]/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="fixed bottom-[-15%] right-[20%] w-[650px] h-[650px] bg-[#F7931A]/8 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#0F172A] text-white border border-[#26A17B]/50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <div className="w-5 h-5 rounded-full bg-[#26A17B] text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <header className="border-b border-[#1E293B] bg-[#0A0E17]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#26A17B] to-[#00D287] p-0.5 shadow-lg shadow-[#26A17B]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center text-[#26A17B]">
                <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  Tether WDK
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#26A17B] bg-[#26A17B]/10 border border-[#26A17B]/25 px-2 py-0.5 rounded-full">
                  RGB Wallet
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Official `@utexo/wdk-wallet-rgb` Community Module
              </p>
            </div>
          </div>

          {/* Quick Actions & Network Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Network Selector Pill */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-1 flex items-center text-xs">
              {(['testnet', 'mainnet', 'regtest'] as UtexoNetwork[]).map((net) => (
                <button
                  key={net}
                  onClick={() => handleSwitchNetwork(net)}
                  className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                    wallet.network === net
                      ? 'bg-[#26A17B] text-white shadow-sm'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>

            {/* Taproot Address Chip */}
            <button
              onClick={() => copyToClipboard(wallet.taprootAddress, 'BIP-86 Taproot Address')}
              className="bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] px-3 py-1.5 rounded-xl text-xs font-mono text-[#F1F5F9] flex items-center gap-2 transition-colors cursor-pointer"
              title="Click to copy Taproot address"
            >
              <span>{shortAddress}</span>
              {copiedKey === 'BIP-86 Taproot Address' ? (
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
              )}
            </button>

            {/* Testnet Faucet */}
            <button
              onClick={handleFaucetAirdrop}
              className="bg-[#26A17B] hover:bg-[#208b69] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#26A17B]/25 transition-all cursor-pointer"
              title="Claim +25,000 sats & +500 USDT-RGB"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Faucet</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Top Summary Banner: Balance & Tether WDK Status */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 shadow-xl relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Balance Hero */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Consolidated Portfolio Value
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              ${totalPortfolioUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
              <span>{formatSatsToBtc(wallet.btcBalanceSats)} BTC</span>
              <span className="text-[#10B981] font-bold">({wallet.btcBalanceSats.toLocaleString()} sats)</span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setReceiveMode('blinded');
                setIsReceiveModalOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#26A17B] hover:bg-[#208b69] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#26A17B]/20 transition-all cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Receive Invoice</span>
            </button>

            <button
              onClick={() => setIsSendModalOpen(true)}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#1E293B] hover:bg-[#283548] text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#334155] transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>Send Assets</span>
            </button>
          </div>

          {/* WDK Daemon Engine Status */}
          <div className="bg-[#0A0E17] border border-[#1E293B] rounded-2xl p-4 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>WDK Manager:</span>
              <span className="text-[#10B981] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                Initialized
              </span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>Electrs Indexer:</span>
              <span className="text-white truncate max-w-[170px]" title={wdkConfig.indexerUrl}>
                {wdkConfig.indexerUrl}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>Transport Proxy:</span>
              <span className="text-[#38BDF8] truncate max-w-[170px]" title={wdkConfig.transportEndpoint}>
                {wdkConfig.transportEndpoint}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#1E293B] pb-1 overflow-x-auto text-xs">
          {[
            { id: 'assets', label: 'Assets & Tokens', icon: Coins },
            { id: 'utxos', label: 'UTXO Orchestrator', icon: Layers },
            { id: 'invoices', label: 'Blinded Invoices', icon: QrCode },
            { id: 'transfer', label: 'WDK Send Pipeline', icon: Send },
            { id: 'issue', label: 'Issue NIA Asset', icon: Plus },
            { id: 'backup', label: 'Backup & Security', icon: Key },
            { id: 'wdk_code', label: 'WDK Code Guide', icon: FileCode2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#26A17B] text-white shadow-md shadow-[#26A17B]/25'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: ASSETS & BALANCES ================= */}
        {activeTab === 'assets' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bitcoin L1 Sats */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 hover:border-[#26A17B]/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F7931A]/15 text-[#F7931A] flex items-center justify-center font-bold text-lg">
                      ₿
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Bitcoin</h4>
                      <span className="text-[10px] font-mono text-[#94A3B8]">Layer-1 Taproot (P2TR)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#F7931A] bg-[#F7931A]/10 px-2 py-0.5 rounded-full">
                    BTC
                  </span>
                </div>
                <div className="font-mono text-xl font-extrabold text-white tabular-nums">
                  {formatSatsToBtc(wallet.btcBalanceSats)} BTC
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mt-1 pt-2 border-t border-[#1E293B]">
                  <span>{wallet.btcBalanceSats.toLocaleString()} Sats</span>
                  <span className="text-white font-bold">
                    ${btcValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Tether USDT on RGB */}
              {wallet.assets.map((asset) => {
                const price = asset.ticker === 'USDT-RGB' ? 1.0 : 0.45;
                const valUsd = asset.balance * price;
                return (
                  <div
                    key={asset.id}
                    className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 hover:border-[#26A17B]/40 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
                            asset.ticker === 'USDT-RGB'
                              ? 'bg-[#26A17B]/15 text-[#26A17B]'
                              : 'bg-[#38BDF8]/15 text-[#38BDF8]'
                          }`}
                        >
                          {asset.ticker === 'USDT-RGB' ? '₮' : asset.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{asset.name}</h4>
                          <span className="text-[10px] font-mono text-[#94A3B8]">{asset.schema} Smart Contract</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#26A17B] bg-[#26A17B]/10 px-2 py-0.5 rounded-full">
                        {asset.ticker}
                      </span>
                    </div>
                    <div className="font-mono text-xl font-extrabold text-white tabular-nums">
                      {asset.balance.toLocaleString()} {asset.ticker}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mt-1 pt-2 border-t border-[#1E293B]">
                      <span className="truncate max-w-[130px]" title={asset.id}>
                        {asset.id.slice(0, 14)}...
                      </span>
                      <span className="text-white font-bold">
                        ${valUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 text-xs">
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <Info className="w-4 h-4 text-[#26A17B]" />
                <span>
                  All RGB assets are client-side validated off-chain and secured cryptographically by Bitcoin Single-Use Seals.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('issue')}
                className="py-1.5 px-3 rounded-xl bg-[#26A17B] hover:bg-[#208b69] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue New Token</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: UTXO ORCHESTRATOR ================= */}
        {activeTab === 'utxos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Bitcoin Layer-1 UTXO Set &amp; Single-Use Seals</h3>
                <p className="text-xs text-[#94A3B8]">
                  Managed by WDK WalletManager (`@utexo/wdk-wallet-rgb`). Click any outpoint to inspect.
                </p>
              </div>
              <span className="text-xs font-mono text-[#26A17B] font-bold">
                {wallet.utxos.length} Active Outpoints
              </span>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0A0E17] text-[#94A3B8] border-b border-[#1E293B]">
                    <th className="p-3.5 font-semibold">Outpoint (TXID:VOUT)</th>
                    <th className="p-3.5 font-semibold">Layer-1 Satoshis</th>
                    <th className="p-3.5 font-semibold">Script Type</th>
                    <th className="p-3.5 font-semibold">Seal Status</th>
                    <th className="p-3.5 font-semibold">Allocated RGB Assets</th>
                    <th className="p-3.5 font-semibold text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {wallet.utxos.map((utxo) => (
                    <tr
                      key={utxo.id}
                      onClick={() => setInspectedUtxo(utxo)}
                      className="hover:bg-[#1E293B]/40 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-mono text-white font-bold">
                        {utxo.id.slice(0, 16)}...{utxo.id.slice(-4)}
                      </td>
                      <td className="p-3.5 font-mono tabular-nums text-white">
                        {utxo.sats.toLocaleString()} sats (~{formatSatsToBtc(utxo.sats)} BTC)
                      </td>
                      <td className="p-3.5 font-mono text-[#94A3B8]">
                        {utxo.scriptType.toUpperCase()} (BIP-86)
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            utxo.isColored
                              ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                              : 'bg-[#1E293B] text-[#94A3B8]'
                          }`}
                        >
                          {utxo.isColored ? 'Colored Seal' : 'Pure BTC'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">
                        {utxo.rgbAllocations.length > 0 ? (
                          <span className="text-[#26A17B] font-bold">
                            {utxo.rgbAllocations[0].amount.toLocaleString()} {utxo.rgbAllocations[0].ticker}
                          </span>
                        ) : (
                          <span className="text-[#64748B]">None (Available for allocation)</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button className="px-2.5 py-1 rounded-lg bg-[#1E293B] text-[#26A17B] hover:text-white font-semibold">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: BLINDED INVOICES ================= */}
        {activeTab === 'invoices' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* Invoice Configuration Form */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">WDK Invoice Generator</h3>
                <p className="text-xs text-[#94A3B8]">
                  Creates cryptographically blinded UTXO invoices (`rgb:...`) preserving privacy.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#0A0E17] p-1 rounded-xl border border-[#1E293B] text-xs">
                <button
                  onClick={() => setReceiveMode('blinded')}
                  className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    receiveMode === 'blinded'
                      ? 'bg-[#26A17B] text-white shadow-sm'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Blinded UTXO Invoice
                </button>
                <button
                  onClick={() => setReceiveMode('witness')}
                  className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    receiveMode === 'witness'
                      ? 'bg-[#26A17B] text-white shadow-sm'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Witness Taproot Invoice
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Target Asset</label>
                  <select
                    value={receiveAssetTicker}
                    onChange={(e) => setReceiveAssetTicker(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-bold"
                  >
                    {wallet.assets.map((a) => (
                      <option key={a.id} value={a.ticker}>
                        {a.ticker} - {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Invoice Amount</label>
                    <input
                      type="number"
                      value={receiveAmount}
                      onChange={(e) => setReceiveAmount(e.target.value)}
                      className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-mono"
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Expiry Duration</label>
                    <select
                      value={receiveExpiryHours}
                      onChange={(e) => setReceiveExpiryHours(e.target.value)}
                      className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-mono"
                    >
                      <option value="1">1 Hour</option>
                      <option value="24">24 Hours</option>
                      <option value="168">7 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Transport Endpoint</label>
                  <input
                    type="text"
                    value={wdkConfig.transportEndpoint}
                    onChange={(e) => setWdkConfig({ ...wdkConfig, transportEndpoint: e.target.value })}
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Generated Scannable Real QR Display */}
            <div>
              <RealQRCode
                value={generatedInvoiceUri}
                label={receiveMode === 'blinded' ? 'Blinded RGB Invoice' : 'Bitcoin Taproot Invoice'}
                sublabel="Scannable with any WDK or RGB-compatible wallet"
                onCopy={() => showToast('Copied invoice to clipboard!')}
              />
            </div>
          </div>
        )}

        {/* ================= TAB 4: WDK TRANSFER PIPELINE ================= */}
        {activeTab === 'transfer' && (
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-white">Tether WDK 3-Stage Transfer Pipeline</h3>
              <p className="text-xs text-[#94A3B8]">
                Implements official `@utexo/wdk-wallet-rgb` stages: `sendBegin()` &rarr; `signPsbt()` &rarr; `sendEnd()`.
              </p>
            </div>

            {isSigningAndSending ? (
              <div className="p-8 text-center bg-[#0A0E17] border border-[#1E293B] rounded-2xl space-y-4">
                <div className="w-12 h-12 border-3 border-[#26A17B] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h4 className="text-sm font-bold text-white">Pipeline Execution in Progress</h4>
                <p className="text-xs text-[#26A17B] font-mono">{pipelineStatusText}</p>
                <div className="w-64 h-2 bg-[#1E293B] rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-[#26A17B] animate-pulse"></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteWdkTransfer} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Asset</label>
                    <select
                      value={sendAssetTicker}
                      onChange={(e) => setSendAssetTicker(e.target.value)}
                      className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-bold"
                    >
                      <option value="BTC">Bitcoin (BTC Sats)</option>
                      {wallet.assets.map((a) => (
                        <option key={a.id} value={a.ticker}>
                          {a.ticker} - {a.name} (Balance: {a.balance.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-[#94A3B8]">Amount to Send</label>
                      <span className="text-[#26A17B] font-mono text-[11px]">
                        Available:{' '}
                        {sendAssetTicker === 'BTC'
                          ? `${formatSatsToBtc(wallet.btcBalanceSats)} BTC`
                          : `${wallet.assets.find((a) => a.ticker === sendAssetTicker)?.balance || 0} ${sendAssetTicker}`}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="25"
                      required
                      className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">
                    Recipient Blinded UTXO or Invoice
                  </label>
                  <input
                    type="text"
                    value={sendRecipient}
                    onChange={(e) => setSendRecipient(e.target.value)}
                    placeholder="rgb:invoice:blinded_utxo:... or tb1p..."
                    required
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">
                    Fee Rate Limit (`transferMaxFee`)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['normal', 'fast', 'turbo'] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setSendFeeSpeed(spd)}
                        className={`p-2.5 rounded-xl capitalize transition-all cursor-pointer ${
                          sendFeeSpeed === spd
                            ? 'bg-[#26A17B] text-white font-bold shadow-md'
                            : 'bg-[#0A0E17] text-[#94A3B8] border border-[#1E293B]'
                        }`}
                      >
                        <div>{spd}</div>
                        <div className="text-[10px] opacity-80">
                          {spd === 'turbo' ? '48 sat/vB' : spd === 'fast' ? '24 sat/vB' : '12 sat/vB'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#26A17B] hover:bg-[#208b69] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#26A17B]/25 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Execute WDK 3-Stage Transfer Pipeline</span>
                </button>
              </form>
            )}

            {lastConsignmentData && (
              <div className="mt-4 pt-4 border-t border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Last Exported Consignment Package (`.rgb`)</span>
                  <button
                    onClick={() => {
                      const blob = new Blob([lastConsignmentData], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `consignment_${Date.now()}.rgb`;
                      a.click();
                      showToast('Downloaded .rgb consignment file!');
                    }}
                    className="text-[#26A17B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .rgb Consignment
                  </button>
                </div>
                <pre className="bg-[#0A0E17] p-3 rounded-xl border border-[#1E293B] text-[11px] font-mono text-[#34D399] overflow-x-auto max-h-48 overflow-y-auto">
                  {lastConsignmentData}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: ISSUE NIA ASSET ================= */}
        {activeTab === 'issue' && (
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-white">Issue Non-Inflationary Asset (NIA)</h3>
              <p className="text-xs text-[#94A3B8]">
                Binds a new fixed token genesis to an unspent Taproot single-use seal via `wallet.issueAssetNia()`.
              </p>
            </div>

            <form onSubmit={handleExecuteIssue} className="space-y-4 text-xs max-w-xl">
              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Asset Ticker</label>
                <input
                  type="text"
                  value={issueTicker}
                  onChange={(e) => setIssueTicker(e.target.value.toUpperCase())}
                  placeholder="TITAN"
                  required
                  className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Asset Full Name</label>
                <input
                  type="text"
                  value={issueName}
                  onChange={(e) => setIssueName(e.target.value)}
                  placeholder="Titanium RGB Reserve"
                  required
                  className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Total Fixed Supply</label>
                  <input
                    type="number"
                    value={issueSupply}
                    onChange={(e) => setIssueSupply(e.target.value)}
                    placeholder="5000000"
                    required
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Decimals (Precision)</label>
                  <input
                    type="number"
                    value={issuePrecision}
                    onChange={(e) => setIssuePrecision(e.target.value)}
                    min="0"
                    max="8"
                    required
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-5 rounded-xl bg-[#26A17B] hover:bg-[#208b69] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#26A17B]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Issue Asset &amp; Bind to Single-Use Seal
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 6: BACKUP & RECOVERY ================= */}
        {activeTab === 'backup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* 12-Word BIP-39 Seed Phrase */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">12-Word Recovery Phrase</h3>
                  <p className="text-xs text-[#94A3B8]">BIP-39 mnemonic seed phrase</p>
                </div>
                <button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className="text-xs text-[#26A17B] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  {showMnemonic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showMnemonic ? 'Hide' : 'Reveal'}
                </button>
              </div>

              {showMnemonic ? (
                <div className="grid grid-cols-3 gap-2 bg-[#0A0E17] p-3 rounded-xl border border-[#1E293B]">
                  {wallet.mnemonic.split(' ').map((word, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0F172A] p-2 rounded-lg border border-[#1E293B] text-xs font-mono text-white flex items-center justify-between"
                    >
                      <span className="text-[#64748B] text-[10px]">{idx + 1}</span>
                      <span className="font-bold">{word}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#0A0E17] p-4 rounded-xl border border-[#1E293B] text-center text-xs text-[#94A3B8]">
                  Recovery phrase is hidden for security. Click "Reveal" to view and copy your 12 words.
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(wallet.mnemonic, 'Recovery Phrase')}
                  className="flex-1 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Phrase
                </button>
                <button
                  onClick={handleCreateNewSeed}
                  className="py-2 px-3 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-[#26A17B] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Generate New Seed"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Encrypted JSON Backup (WDK standard) */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Encrypted Wallet Backup</h3>
                <p className="text-xs text-[#94A3B8]">
                  Exports encrypted state via `wallet.createBackup(password)`.
                </p>
              </div>

              <form onSubmit={handleGenerateBackup} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Encryption Passphrase</label>
                  <input
                    type="password"
                    value={backupPassword}
                    onChange={(e) => setBackupPassword(e.target.value)}
                    placeholder="Enter a strong passphrase..."
                    required
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#26A17B] hover:bg-[#208b69] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <LockKeyhole className="w-3.5 h-3.5" /> Generate Encrypted Backup
                </button>
              </form>

              {backupJson && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Backup JSON Payload</span>
                    <button
                      onClick={() => {
                        const blob = new Blob([backupJson], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `wdk_wallet_backup_${Date.now()}.json`;
                        a.click();
                        showToast('Downloaded encrypted backup JSON!');
                      }}
                      className="text-[#26A17B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Save File
                    </button>
                  </div>
                  <pre className="bg-[#0A0E17] p-2.5 rounded-xl border border-[#1E293B] text-[10px] font-mono text-[#34D399] max-h-32 overflow-y-auto">
                    {backupJson}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 7: WDK OFFICIAL CODE GUIDE ================= */}
        {activeTab === 'wdk_code' && (
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Tether WDK `@utexo/wdk-wallet-rgb` Get-Started Guide
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Direct code patterns from `https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/guides/get-started/`
                </p>
              </div>
              <a
                href="https://docs.wdk.tether.io/sdk/community-modules/wdk-wallet-rgb/guides/get-started/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#26A17B] hover:underline flex items-center gap-1 font-bold"
              >
                Official Docs <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-[#0A0E17] rounded-xl p-4 border border-[#1E293B] font-mono text-xs text-[#34D399] space-y-3 overflow-x-auto">
              <div>
                <span className="text-[#94A3B8]">// 1. Install official module: npm install @utexo/wdk-wallet-rgb</span>
                <br />
                <span className="text-[#38BDF8]">import</span> &#123; WalletManagerRgb &#125; <span className="text-[#38BDF8]">from</span> <span className="text-[#F7931A]">'@utexo/wdk-wallet-rgb'</span>;
              </div>

              <div>
                <span className="text-[#94A3B8]">// 2. Initialize the RGB Wallet Manager</span>
                <br />
                <span className="text-[#38BDF8]">const</span> manager = <span className="text-[#38BDF8]">new</span> <span className="text-[#F1F5F9]">WalletManagerRgb</span>(&#123;
                <div className="pl-4 text-[#F1F5F9]">
                  network: <span className="text-[#F7931A]">'{wallet.network}'</span>,<br />
                  indexerUrl: <span className="text-[#F7931A]">'{wdkConfig.indexerUrl}'</span>,<br />
                  transportEndpoint: <span className="text-[#F7931A]">'{wdkConfig.transportEndpoint}'</span>,<br />
                  dataDir: <span className="text-[#F7931A]">'{wdkConfig.dataDir}'</span>
                </div>
                &#125;);
              </div>

              <div>
                <span className="text-[#94A3B8]">// 3. Create Taproot account from BIP-39 mnemonic</span>
                <br />
                <span className="text-[#38BDF8]">const</span> account = <span className="text-[#38BDF8]">await</span> manager.createAccount(&#123;
                <div className="pl-4 text-[#F1F5F9]">
                  mnemonic: <span className="text-[#F7931A]">'[12-word seed phrase]'</span>,<br />
                  derivationPath: <span className="text-[#F7931A]">'{wallet.derivationPath}'</span>
                </div>
                &#125;);
              </div>

              <div>
                <span className="text-[#94A3B8]">// 4. Create Blinded UTXO Receive Invoice</span>
                <br />
                <span className="text-[#38BDF8]">const</span> invoice = <span className="text-[#38BDF8]">await</span> account.createBlindedInvoice(&#123;
                <div className="pl-4 text-[#F1F5F9]">
                  assetId: <span className="text-[#F7931A]">'rgb:nia:3b9f8e41a...'</span>,<br />
                  amount: <span className="text-[#F7931A]">50</span>
                </div>
                &#125;);
              </div>

              <div>
                <span className="text-[#94A3B8]">// 5. Execute 3-Stage Transfer Pipeline</span>
                <br />
                <span className="text-[#38BDF8]">const</span> prep = <span className="text-[#38BDF8]">await</span> account.sendBegin(&#123; recipient: invoice.blindedUtxo, amount: 25 &#125;);<br />
                <span className="text-[#38BDF8]">const</span> signedPsbt = <span className="text-[#38BDF8]">await</span> account.signPsbt(prep.psbt);<br />
                <span className="text-[#38BDF8]">const</span> txResult = <span className="text-[#38BDF8]">await</span> account.sendEnd(&#123; signedPsbt, consignment: prep.consignment &#125;);
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: REAL RECEIVE QR ================= */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0E17]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#26A17B]/15 text-[#26A17B] flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Receive via QR Code</h3>
              </div>
              <button
                onClick={() => setIsReceiveModalOpen(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <RealQRCode
              value={generatedInvoiceUri}
              label={receiveMode === 'blinded' ? 'Blinded RGB Invoice' : 'Bitcoin Taproot Address'}
              sublabel="Scan with any Tether WDK or RGB-compatible client"
              onCopy={() => showToast('Copied to clipboard!')}
            />
          </div>
        </div>
      )}

      {/* ================= MODAL: SEND ================= */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0E17]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#26A17B]/15 text-[#26A17B] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Send Assets</h3>
              </div>
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSigningAndSending ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 border-3 border-[#26A17B] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div>
                  <h4 className="text-sm font-bold text-white">Executing WDK Pipeline</h4>
                  <p className="text-xs text-[#26A17B] mt-1 font-mono">{pipelineStatusText}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteWdkTransfer} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Select Asset</label>
                  <select
                    value={sendAssetTicker}
                    onChange={(e) => setSendAssetTicker(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-xs text-white font-bold"
                  >
                    <option value="BTC">Bitcoin (BTC Sats)</option>
                    {wallet.assets.map((a) => (
                      <option key={a.id} value={a.ticker}>
                        {a.ticker} ({a.name}) - Balance: {a.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#94A3B8]">Amount</label>
                    <span className="text-[11px] text-[#26A17B] font-mono">
                      Available:{' '}
                      {sendAssetTicker === 'BTC'
                        ? `${formatSatsToBtc(wallet.btcBalanceSats)} BTC`
                        : `${wallet.assets.find((a) => a.ticker === sendAssetTicker)?.balance || 0} ${sendAssetTicker}`}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-sm text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">
                    Recipient Blinded UTXO or Address
                  </label>
                  <input
                    type="text"
                    value={sendRecipient}
                    onChange={(e) => setSendRecipient(e.target.value)}
                    placeholder="rgb:invoice:blinded_utxo:... or tb1p..."
                    required
                    className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#26A17B] hover:bg-[#208b69] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#26A17B]/20 transition-all cursor-pointer mt-2"
                >
                  <Send className="w-4 h-4" /> Start WDK Transfer
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: UTXO INSPECTOR ================= */}
      <UTXOInspectorModal
        utxo={inspectedUtxo}
        onClose={() => setInspectedUtxo(null)}
        onColorUtxo={() => {
          setActiveTab('issue');
        }}
      />
    </div>
  );
}
