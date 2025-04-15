'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import { streamTransactions } from '../app/lib/solana/transactions';
import { SolanaTransaction } from '../app/lib/solana/types';
import TransactionItem from '../components/TransactionItem';

export default function UAVPage() {
    const { user, authenticated } = usePrivy();
    const router = useRouter();
    const [transactions, setTransactions] = useState<SolanaTransaction[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        minAmount: '',
        maxAmount: '',
        minMarketCap: '',
        maxMarketCap: '',
        tokenSymbol: '',
    });

    // useEffect(() => {
    //   if (!authenticated) {
    //     router.push('/');
    //   }
    // }, [authenticated, router]);

    useEffect(() => {
        const stopStreaming = streamTransactions(
            (transaction) => {
                setTransactions((prev) => [transaction, ...prev].slice(0, 100));
            },
            {
                minAmount: filters.minAmount
                    ? parseFloat(filters.minAmount)
                    : undefined,
                maxAmount: filters.maxAmount
                    ? parseFloat(filters.maxAmount)
                    : undefined,
                minMarketCap: filters.minMarketCap
                    ? parseFloat(filters.minMarketCap)
                    : undefined,
                maxMarketCap: filters.maxMarketCap
                    ? parseFloat(filters.maxMarketCap)
                    : undefined,
                tokenSymbol: filters.tokenSymbol || undefined,
            },
        );

        return () => stopStreaming();
    }, [filters]);

    const handleWalletClick = (walletAddress: string) => {
        setSelectedWallet(walletAddress);
    };

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            minAmount: '',
            maxAmount: '',
            minMarketCap: '',
            maxMarketCap: '',
            tokenSymbol: '',
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-12">
                    <h1 className="text-5xl font-bold relative text-center">
                        <span className="relative z-10 bg-gradient-to-r from-[#4A7C59] via-[#8A9A5B] to-[#556B2F] bg-clip-text text-transparent font-['Orbitron',_sans-serif] tracking-wider">
                            UAV
                            <span className="absolute -inset-1 bg-gradient-to-r from-[#4A7C59]/30 via-[#8A9A5B]/30 to-[#556B2F]/30 blur-lg"></span>
                        </span>
                        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(74,124,89,0.2)_0%,_rgba(0,0,0,0)_100%)]"></span>
                    </h1>
                    <p className="text-xl text-gray-400 mt-3 text-center">
                        Real-time trench signals
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="w-[75%] mx-auto flex justify-end gap-3 mb-6">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Filter
                    </button>
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Clear
                    </button>
                </div>

                {/* Filters */}
                {isFilterOpen && (
                    <div className="mb-6 p-6 rounded-xl bg-gray-900 border border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Min Amount (SOL)
                                </label>
                                <input
                                    type="number"
                                    name="minAmount"
                                    value={filters.minAmount}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Max Amount (SOL)
                                </label>
                                <input
                                    type="number"
                                    name="maxAmount"
                                    value={filters.maxAmount}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="1000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Min Market Cap (M)
                                </label>
                                <input
                                    type="number"
                                    name="minMarketCap"
                                    value={filters.minMarketCap}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Max Market Cap (M)
                                </label>
                                <input
                                    type="number"
                                    name="maxMarketCap"
                                    value={filters.maxMarketCap}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="1000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Token Symbol
                                </label>
                                <input
                                    type="text"
                                    name="tokenSymbol"
                                    value={filters.tokenSymbol}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., BONK"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions */}
                <div className="rounded-xl overflow-hidden border-gray-800">
                    <div className="divide-y divide-gray-800">
                        {transactions.length === 0 ? (
                            <div className="p-6 text-center text-gray-400">
                                No transactions found. Adjust your filters or
                                wait for new transactions.
                            </div>
                        ) : (
                            transactions.map((transaction) => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    onWalletClick={handleWalletClick}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
