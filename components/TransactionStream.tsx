import { useEffect, useState } from 'react';
import { getWalletTransactions } from '../app/lib/solana/connection';
import {
    getAvailableTokens,
    streamTransactions,
} from '../app/lib/solana/transactions';
import {
    SolanaTransaction,
    TokenInfo,
    TransactionFilter,
} from '../app/lib/solana/types';
import TransactionItem from './TransactionItem';

export default function TransactionStream() {
    const [transactions, setTransactions] = useState<SolanaTransaction[]>([]);
    const [filter, setFilter] = useState<TransactionFilter>({
        minAmount: 20,
        minMarketCap: 300000, // 300K default min market cap
        maxMarketCap: 5000000, // 5M default max market cap
    });
    const [tokens, setTokens] = useState<TokenInfo[]>([]);

    // Load available tokens for filtering
    useEffect(() => {
        setTokens(getAvailableTokens());
    }, []);

    // Set up transaction stream
    useEffect(() => {
        const stopStream = streamTransactions((transaction) => {
            setTransactions((prev) => [transaction, ...prev.slice(0, 99)]); // Keep max 100 transactions
        }, filter);

        // Clean up on unmount
        return () => stopStream();
    }, [filter]);

    // Handle filter changes
    const handleFilterChange = (newFilter: Partial<TransactionFilter>) => {
        setFilter((prev) => ({ ...prev, ...newFilter }));
    };

    return (
        <div className="app-container">
            <div className="app-header">
                <h1 className="app-title">Solana Transaction Stream</h1>
            </div>

            <div className="mb-6">
                <h2 className="section-title mb-4">Filters</h2>
                <div className="filter-grid">
                    <div>
                        <label className="filter-label block">
                            Min Amount (SOL)
                        </label>
                        <input
                            type="number"
                            value={filter.minAmount || ''}
                            onChange={(e) =>
                                handleFilterChange({
                                    minAmount: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                            className="filter-input"
                            placeholder="Min SOL"
                        />
                    </div>
                    <div>
                        <label className="filter-label block">
                            Max Amount (SOL)
                        </label>
                        <input
                            type="number"
                            value={filter.maxAmount || ''}
                            onChange={(e) =>
                                handleFilterChange({
                                    maxAmount: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                            className="filter-input"
                            placeholder="Max SOL"
                        />
                    </div>
                    <div>
                        <label className="filter-label block">Token</label>
                        <select
                            value={filter.tokenSymbol || ''}
                            onChange={(e) =>
                                handleFilterChange({
                                    tokenSymbol: e.target.value || undefined,
                                })
                            }
                            className="filter-input"
                        >
                            <option value="">All Tokens</option>
                            {tokens.map((token) => (
                                <option key={token.symbol} value={token.symbol}>
                                    ${token.symbol}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="filter-label block">
                            Min Market Cap (K)
                        </label>
                        <input
                            type="number"
                            value={
                                filter.minMarketCap
                                    ? filter.minMarketCap / 1000
                                    : ''
                            }
                            onChange={(e) =>
                                handleFilterChange({
                                    minMarketCap: e.target.value
                                        ? Number(e.target.value) * 1000
                                        : undefined,
                                })
                            }
                            className="filter-input"
                            placeholder="Min Market Cap (K)"
                        />
                    </div>
                    <div>
                        <label className="filter-label block">
                            Max Market Cap (M)
                        </label>
                        <input
                            type="number"
                            value={
                                filter.maxMarketCap
                                    ? filter.maxMarketCap / 1000000
                                    : ''
                            }
                            onChange={(e) =>
                                handleFilterChange({
                                    maxMarketCap: e.target.value
                                        ? Number(e.target.value) * 1000000
                                        : undefined,
                                })
                            }
                            className="filter-input"
                            placeholder="Max Market Cap (M)"
                        />
                    </div>
                </div>
            </div>

            <div className="relative">
                <div
                    className={`transactions-container transition-all duration-300`}
                >
                    <div className="transactions-header">
                        <h2 className="section-title mb-0">
                            Live Solana Transactions
                        </h2>
                        <p className="section-subtitle mb-0 mt-1">
                            Showing SPL token purchases of at least{' '}
                            {filter.minAmount || 20} SOL
                            {filter.minMarketCap &&
                                ` with market cap ≥ ${(filter.minMarketCap / 1000).toFixed(0)}K`}
                            {filter.maxMarketCap &&
                                ` and ≤ ${(filter.maxMarketCap / 1000000).toFixed(1)}M`}
                        </p>
                    </div>

                    <div className="space-y-3 w-3/4 mx-auto">
                        {transactions.length === 0 ? (
                            <div className="py-8 text-center text-gray-500 text-sm">
                                Waiting for transactions...
                            </div>
                        ) : (
                            transactions.map((transaction) => (
                                <TransactionItem
                                    key={transaction.txSignature}
                                    transaction={transaction}
                                    onWalletClick={() => {}}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
