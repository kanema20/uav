export interface SolanaTransaction {
    id: string;
    walletAddress: string;
    tokenSymbol: string;
    amountInSol: number;
    marketCap?: number;
    timestamp: Date;
    txSignature: string;
  }
  
  export interface TransactionFilter {
    minAmount?: number;
    maxAmount?: number;
    minMarketCap?: number;
    maxMarketCap?: number;
    tokenSymbol?: string;
  }
  
  export interface TokenInfo {
    symbol: string;
    name: string;
    marketCap?: number;
    price?: number;
  }
  
  export interface WalletInfo {
    address: string;
    recentTransactions: SolanaTransaction[];
  }
  