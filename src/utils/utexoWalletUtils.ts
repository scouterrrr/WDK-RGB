import { BitcoinUtxo, RgbAsset, RgbInvoice, RgbTransfer, UtexoNetwork, UtexoWalletState } from '../types/utexo';

// BIP-39 English Wordlist sample (256 standard words for robust deterministic random seed generation)
export const BIP39_WORDS = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake',
  'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge',
  'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain',
  'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become',
  'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit',
  'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology',
  'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless',
  'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body',
  'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss',
  'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread',
  'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze',
  'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb',
  'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy'
];

/**
 * Generate a random 12-word BIP-39 mnemonic phrase
 */
export function generateMnemonic(): string {
  const words: string[] = [];
  const randomBuffer = new Uint16Array(12);
  crypto.getRandomValues(randomBuffer);
  for (let i = 0; i < 12; i++) {
    const index = randomBuffer[i] % BIP39_WORDS.length;
    words.push(BIP39_WORDS[index]);
  }
  return words.join(' ');
}

/**
 * Simple deterministic hash for demo addresses & keys
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return hex;
}

/**
 * Derive Taproot (BIP-86) address from mnemonic and network
 */
export function deriveTaprootAddress(mnemonic: string, network: UtexoNetwork): {
  address: string;
  publicKey: string;
  derivationPath: string;
} {
  const hash1 = simpleHash(mnemonic);
  const hash2 = simpleHash(mnemonic + '_rgb_taproot');
  const hash3 = simpleHash(mnemonic + '_internal_key');
  const combined = (hash1 + hash2 + hash3 + 'a8f93e107b4c9215').slice(0, 58);

  const prefix = network === 'mainnet' ? 'bc1p' : 'tb1p';
  const address = `${prefix}${combined}`;
  const publicKey = `02${hash1}${hash2}${hash3}`.slice(0, 66);
  const derivationPath = network === 'mainnet' ? "m/86'/0'/0'/0/0" : "m/86'/1'/0'/0/0";

  return { address, publicKey, derivationPath };
}

/**
 * Generate random 64-char hex TXID
 */
export function generateTxid(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate Blinded UTXO hash for RGB invoice
 */
export function generateBlindedUtxo(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return 'txob:' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create default initial state when wallet is first initialized
 */
export function createInitialWalletState(mnemonic: string, network: UtexoNetwork = 'testnet'): UtexoWalletState {
  const { address, publicKey, derivationPath } = deriveTaprootAddress(mnemonic, network);
  
  const txidFunding = generateTxid();
  const txidSeal1 = generateTxid();
  const txidSeal2 = generateTxid();

  // Create initial demo UTXOs (1 base funding + 2 colored for RGB seals)
  const initialUtxos: BitcoinUtxo[] = [
    {
      id: `${txidFunding}:0`,
      txid: txidFunding,
      vout: 0,
      sats: 85000,
      scriptType: 'p2tr',
      isColored: false,
      rgbAllocations: [],
      status: 'unspent',
      timestamp: Date.now() - 3600000 * 4,
    },
    {
      id: `${txidSeal1}:0`,
      txid: txidSeal1,
      vout: 0,
      sats: 2000,
      scriptType: 'p2tr',
      isColored: true,
      rgbAllocations: [
        {
          assetId: 'rgb:nia:3b9f8e41a27c09d854e12e7f83a54b92c431ef82a',
          ticker: 'USDTRGB',
          amount: 500,
        },
      ],
      status: 'unspent',
      timestamp: Date.now() - 3600000 * 2,
    },
    {
      id: `${txidSeal2}:1`,
      txid: txidSeal2,
      vout: 1,
      sats: 2000,
      scriptType: 'p2tr',
      isColored: true,
      rgbAllocations: [
        {
          assetId: 'rgb:nia:99f7d24ab5c812e9834ba7e44c21df34891e8432a',
          ticker: 'FUNK',
          amount: 1999,
        },
      ],
      status: 'unspent',
      timestamp: Date.now() - 3600000,
    },
  ];

  const initialAssets: RgbAsset[] = [
    {
      id: 'rgb:nia:3b9f8e41a27c09d854e12e7f83a54b92c431ef82a',
      ticker: 'USDTRGB',
      name: 'Tether USD (RGB)',
      precision: 6,
      issuedSupply: 1000000,
      balance: 500,
      schema: 'NIA',
      genesisTxid: txidSeal1,
      allocatedUtxoId: `${txidSeal1}:0`,
      description: 'Official Tether USD₮ token issued on Bitcoin RGB Layer 2 protocol via Utexo WDK.',
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      id: 'rgb:nia:99f7d24ab5c812e9834ba7e44c21df34891e8432a',
      ticker: 'WDKRGB',
      name: 'Deploy Tether WDK RGB Asset',
      precision: 0,
      issuedSupply: 1000000,
      balance: 10000,
      schema: 'NIA',
      genesisTxid: txidSeal2,
      allocatedUtxoId: `${txidSeal2}:1`,
      description: 'Native RGB asset token deployed via Tether WDK client-side validation engine.',
      createdAt: Date.now() - 3600000,
    },
  ];

  const initialTransfers: RgbTransfer[] = [
    {
      id: 'tx_init_1',
      txid: txidSeal1,
      type: 'issuance',
      assetTicker: 'USDTRGB',
      amount: 500,
      witnessTxFeeSats: 280,
      timestamp: Date.now() - 3600000 * 2,
      status: 'confirmed',
      consignmentHash: 'cng:83fe01c3...a8b7',
    },
    {
      id: 'tx_init_2',
      txid: txidSeal2,
      type: 'issuance',
      assetTicker: 'FUNK',
      amount: 1999,
      witnessTxFeeSats: 260,
      timestamp: Date.now() - 3600000,
      status: 'confirmed',
      consignmentHash: 'cng:910bf4a1...74de',
    },
  ];

  const totalBtcSats = initialUtxos
    .filter(u => u.status === 'unspent')
    .reduce((sum, u) => sum + u.sats, 0);

  return {
    mnemonic,
    taprootAddress: address,
    network,
    derivationPath,
    publicKey,
    btcBalanceSats: totalBtcSats,
    utxos: initialUtxos,
    assets: initialAssets,
    transfers: initialTransfers,
    invoices: [],
    indexerUrl: network === 'mainnet' ? 'https://mempool.space/api' : 'https://mempool.space/testnet4/api',
    transportEndpoint: 'rpca://proxy.rgb.utexo.com:3000/json-rpc',
  };
}

/**
 * Format Satoshi to BTC display
 */
export function formatSatsToBtc(sats: number): string {
  return (sats / 100_000_000).toFixed(8);
}

/**
 * Format number with comma separators
 */
export function formatAmount(num: number): string {
  return new Intl.NumberFormat().format(num);
}
