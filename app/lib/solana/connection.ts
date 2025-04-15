import { Connection, PublicKey, ParsedTransactionWithMeta, ConfirmedSignatureInfo, TransactionSignature } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenInfo } from '@solana/spl-token-registry';

// Initialize Solana connection
export const getSolanaConnection = () => {
  const rpcUrl = "https://mainnet.helius-rpc.com/?api-key=1536e743-4498-496e-beab-9f7ca88233d0";
  if (!rpcUrl) {
    throw new Error('RPC_URL is not defined in the environment variables');
  }
  return new Connection(rpcUrl);
};

// Function to get recent transactions for a wallet
export const getWalletTransactions = async (walletAddress: string, limit: number = 10) => {
  try {
    const connection = getSolanaConnection();
    const pubKey = new PublicKey(walletAddress);
    
    // Get signatures for confirmed transactions
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit });
    
    // Get transaction details
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 });
        return {
          signature: sig.signature,
          timestamp: sig.blockTime ? new Date(sig.blockTime * 1000) : new Date(),
          details: tx
        };
      })
    );
    
    return transactions;
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    return [];
  }
};

// Function to format wallet address for display
export function formatWalletAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// Generate Solscan URL for a transaction or account
export function getSolscanUrl(identifier: string, type: 'account' | 'tx'): string {
    const baseUrl = 'https://solscan.io';
    return type === 'account' 
        ? `${baseUrl}/account/${identifier}`
        : `${baseUrl}/tx/${identifier}`;
}

// Function to check if a transaction is a token purchase
export const isTokenPurchaseTransaction = (transaction: ParsedTransactionWithMeta | null): boolean => {
  if (!transaction || !transaction.meta || !transaction.transaction.message.instructions) {
    return false;
  }

  // Check if transaction involves the SPL Token program
  return transaction.transaction.message.instructions.some(
    instruction => {
      if ('programId' in instruction) {
        return instruction.programId.toString() === TOKEN_PROGRAM_ID.toString();
      }
      return false;
    }
  );
};

// Function to estimate SOL value of a transaction
export const estimateTransactionSolValue = (transaction: ParsedTransactionWithMeta | null): number => {
  if (!transaction || !transaction.meta) {
    return 0;
  }

  // For simplicity, we'll use the pre-balance and post-balance difference as an estimate
  // In a real implementation, you would need more sophisticated logic to determine the actual SOL value
  const preBalances = transaction.meta.preBalances || [];
  const postBalances = transaction.meta.postBalances || [];
  
  if (preBalances.length > 0 && postBalances.length > 0) {
    // Calculate the total SOL difference across all accounts in the transaction
    let totalDifference = 0;
    for (let i = 0; i < Math.min(preBalances.length, postBalances.length); i++) {
      const difference = Math.abs(preBalances[i] - postBalances[i]);
      totalDifference += difference;
    }
    
    // Convert from lamports to SOL (1 SOL = 1,000,000,000 lamports)
    return totalDifference / 1_000_000_000;
  }
  
  return 0;
};

// Function to extract token symbol from a transaction
export const extractTokenSymbol = async (transaction: ParsedTransactionWithMeta | null): Promise<string> => {
  if (!transaction) {
    return 'UNKNOWN';
  }
  
  try {
    // In a real implementation, you would extract the token mint address from the transaction
    // and then look up the token symbol using the SPL Token Registry
    // This is a simplified implementation
    
    // For demonstration, we'll return a random token symbol
    const tokens = ['SOL', 'BONK', 'SAMO', 'POPCAT', 'MANGO', 'COPE'];
    return tokens[Math.floor(Math.random() * tokens.length)];
  } catch (error) {
    console.error('Error extracting token symbol:', error);
    return 'UNKNOWN';
  }
};

// Function to get token market cap
export const getTokenMarketCap = async (tokenSymbol: string): Promise<number | undefined> => {
  // In a real implementation, you would fetch the market cap from a price API
  // For demonstration, we'll return mock market caps
  const marketCaps: Record<string, number> = {
    'POPCAT': 1220000,
    'BONK': 450000000,
    'SAMO': 120000000,
    'MANGO': 75000000,
    'COPE': 25000000,
    'SOL': 20000000000,
  };
  
  return marketCaps[tokenSymbol];
};
