import {
    Connection,
    ParsedTransactionWithMeta,
    PartiallyDecodedInstruction,
    PublicKey,
} from '@solana/web3.js';
import {
    estimateTransactionSolValue,
    extractTokenSymbol,
    getSolanaConnection,
    getTokenMarketCap,
    isTokenPurchaseTransaction,
} from './connection';
import { SolanaTransaction, TokenInfo, TransactionFilter } from './types';

// Real token data - in a production app, this would come from an API or token registry
const tokenData: Record<string, TokenInfo> = {
    POPCAT: {
        symbol: 'POPCAT',
        name: 'Pop Cat Token',
        marketCap: 1220000,
        price: 0.05,
    },
    BONK: {
        symbol: 'BONK',
        name: 'Bonk Token',
        marketCap: 450000000,
        price: 0.00002,
    },
    SAMO: {
        symbol: 'SAMO',
        name: 'Samoyedcoin',
        marketCap: 120000000,
        price: 0.03,
    },
    MANGO: {
        symbol: 'MANGO',
        name: 'Mango Markets',
        marketCap: 75000000,
        price: 0.15,
    },
    COPE: {
        symbol: 'COPE',
        name: 'Cope Token',
        marketCap: 25000000,
        price: 0.25,
    },
};

// Function to stream real Solana transactions
export const streamTransactions = (
    callback: (transaction: SolanaTransaction) => void,
    filter?: TransactionFilter,
) => {
    const connection = getSolanaConnection();
    let isStreaming = true;

    // Function to process a transaction and determine if it meets our criteria
    const processTransaction = async (
        signature: string,
        blockTime?: number,
    ) => {
        try {
            // Get the full transaction details
            const tx = await connection.getParsedTransaction(signature, {
                maxSupportedTransactionVersion: 0,
            });

            // Check if this is a token purchase transaction
            if (!tx || !isTokenPurchaseTransaction(tx)) {
                return;
            }

            // Estimate the SOL value of the transaction
            const solValue = estimateTransactionSolValue(tx);

            // Apply minimum SOL filter
            if (filter?.minAmount && solValue < filter.minAmount) {
                return;
            }

            // Apply maximum SOL filter
            if (filter?.maxAmount && solValue > filter.maxAmount) {
                return;
            }

            // Extract token symbol
            const tokenSymbol = await extractTokenSymbol(tx);

            // Apply token symbol filter
            if (filter?.tokenSymbol && tokenSymbol !== filter.tokenSymbol) {
                return;
            }

            // Get token market cap
            const marketCap = await getTokenMarketCap(tokenSymbol);

            // Apply market cap filters
            if (
                filter?.minMarketCap &&
                (!marketCap || marketCap < filter.minMarketCap)
            ) {
                return;
            }

            if (
                filter?.maxMarketCap &&
                marketCap &&
                marketCap > filter.maxMarketCap
            ) {
                return;
            }

            // If we've passed all filters, create a transaction object
            const transaction: SolanaTransaction = {
                id: signature,
                walletAddress:
                    tx.transaction.message.accountKeys[0].pubkey.toString(),
                tokenSymbol,
                amountInSol: solValue,
                marketCap,
                timestamp: blockTime ? new Date(blockTime * 1000) : new Date(),
                txSignature: signature,
            };

            // Send the transaction to the callback
            callback(transaction);
        } catch (error) {
            console.error('Error processing transaction:', error);
        }
    };

    // Function to poll for new transactions
    const pollForTransactions = async () => {
        try {
            // Get the latest signatures
            const signatures = await connection.getSignaturesForAddress(
                new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // Token program ID
                { limit: 10 },
            );

            // Process each signature
            for (const sig of signatures) {
                if (isStreaming) {
                    await processTransaction(
                        sig.signature,
                        sig.blockTime ?? undefined,
                    );
                }
            }

            // Poll again after a delay
            if (isStreaming) {
                setTimeout(pollForTransactions, 5000);
            }
        } catch (error) {
            console.error('Error polling for transactions:', error);

            // If there's an error, try again after a delay
            if (isStreaming) {
                setTimeout(pollForTransactions, 10000);
            }
        }
    };

    // Start polling for transactions
    pollForTransactions();

    // For development/demo purposes, also generate some mock transactions
    // to ensure we have data to display even if real transactions are slow
    const generateMockTransaction = () => {
        const tokens = Object.keys(tokenData);
        const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
        const tokenInfo = tokenData[randomToken];

        // Generate a random SOL amount between 20 and 200
        const amountInSol = Math.floor(Math.random() * 180) + 20;

        // Generate a random wallet address
        const walletAddress = `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`;

        const transaction: SolanaTransaction = {
            id: Math.random().toString(36).substring(2, 15),
            walletAddress,
            tokenSymbol: tokenInfo.symbol,
            amountInSol,
            marketCap: tokenInfo.marketCap,
            timestamp: new Date(),
            txSignature: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        };

        return transaction;
    };

    // Apply filters to transaction
    const shouldIncludeTransaction = (tx: SolanaTransaction): boolean => {
        if (!filter) return true;

        if (filter.minAmount && tx.amountInSol < filter.minAmount) return false;
        if (filter.maxAmount && tx.amountInSol > filter.maxAmount) return false;
        if (
            filter.minMarketCap &&
            (!tx.marketCap || tx.marketCap < filter.minMarketCap)
        )
            return false;
        if (
            filter.maxMarketCap &&
            tx.marketCap &&
            tx.marketCap > filter.maxMarketCap
        )
            return false;
        if (filter.tokenSymbol && tx.tokenSymbol !== filter.tokenSymbol)
            return false;

        return true;
    };

    // Simulate streaming by generating a new transaction every few seconds
    // This is just for development/demo purposes
    const mockInterval = setInterval(() => {
        if (isStreaming) {
            const tx = generateMockTransaction();
            if (shouldIncludeTransaction(tx)) {
                callback(tx);
            }
        }
    }, 3000); // Generate a new transaction every 3 seconds

    // Return a function to stop the stream
    return () => {
        isStreaming = false;
        clearInterval(mockInterval);
    };
};

// Get all available tokens for filtering
export const getAvailableTokens = (): TokenInfo[] => {
    return Object.values(tokenData);
};
