export type UtexoNetwork = 'testnet' | 'mainnet' | 'regtest';

export interface RgbAllocation {
  assetId: string;
  ticker: string;
  amount: number;
}

export interface BitcoinUtxo {
  id: string; // "txid:vout"
  txid: string;
  vout: number;
  sats: number;
  scriptType: 'p2tr' | 'p2wpkh';
  isColored: boolean; // colored single-use seal for RGB allocations
  rgbAllocations: RgbAllocation[];
  status: 'unspent' | 'spent' | 'locked';
  timestamp: number;
}

export interface RgbAsset {
  id: string; // RGB contract ID: "rgb:nia:..."
  ticker: string;
  name: string;
  precision: number;
  issuedSupply: number;
  balance: number;
  schema: 'NIA' | 'CFA' | 'UDA';
  genesisTxid: string;
  allocatedUtxoId: string;
  description: string;
  createdAt: number;
}

export interface RgbInvoice {
  invoiceString: string;
  assetId?: string;
  ticker?: string;
  amount?: number;
  blindedUtxo: string;
  transportEndpoint: string;
  expiry: number;
  createdAt: number;
  label?: string;
}

export interface RgbTransfer {
  id: string;
  txid: string;
  type: 'issuance' | 'incoming' | 'outgoing' | 'utxo_color';
  assetTicker: string;
  amount: number;
  recipientOrInvoice?: string;
  witnessTxFeeSats: number;
  timestamp: number;
  status: 'confirmed' | 'pending';
  consignmentHash?: string;
}

export interface UtexoWalletState {
  mnemonic: string;
  taprootAddress: string;
  network: UtexoNetwork;
  derivationPath: string;
  publicKey: string;
  btcBalanceSats: number;
  utxos: BitcoinUtxo[];
  assets: RgbAsset[];
  transfers: RgbTransfer[];
  invoices: RgbInvoice[];
  indexerUrl: string;
  transportEndpoint: string;
}
