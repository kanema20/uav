import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FiExternalLink, FiX } from 'react-icons/fi';
import {
    formatWalletAddress,
    getSolscanUrl,
} from '../app/lib/solana/connection';
import { SolanaTransaction } from '../app/lib/solana/types';

interface TransactionItemProps {
    transaction: SolanaTransaction;
    onWalletClick: (walletAddress: string) => void;
}

export default function TransactionItem({
    transaction,
    onWalletClick,
}: TransactionItemProps) {
    const { walletAddress, tokenSymbol, amountInSol, timestamp, txSignature } =
        transaction;
    const [showWalletDetails, setShowWalletDetails] = useState(false);
    const [showGlow, setShowGlow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowGlow(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleWalletClick = () => {
        onWalletClick(walletAddress);
    };

    return (
        <>
            <div
                key={`${txSignature}-${timestamp.getTime()}`}
                className={`group p-2.5 bg-gray-900 rounded-2xl hover:bg-gray-800/50 transition-all duration-2000 mb-3 w-[75%] mx-auto ${
                    showGlow
                        ? 'border border-green-500/40 shadow-[0_0_25px_rgba(74,124,89,0.5)]'
                        : ''
                }`}
            >
                <div className="flex items-start justify-between gap-2.5">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <button
                                onClick={handleWalletClick}
                                className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                                title={walletAddress}
                            >
                                {formatWalletAddress(walletAddress)}
                            </button>
                            <span className="text-gray-400 text-xs">
                                bought
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-semibold text-white">
                                {amountInSol} SOL
                            </span>
                            <span className="text-gray-400 text-sm">of</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                                ${tokenSymbol}
                            </span>
                            {transaction.marketCap && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-gray-500/10 text-gray-400 text-xs">
                                    {(transaction.marketCap / 1000000).toFixed(
                                        1,
                                    )}
                                    M
                                </span>
                            )}
                        </div>

                        <div className="mt-1.5 text-[10px] text-gray-500">
                            {format(timestamp, 'MMM d, yyyy HH:mm:ss')}
                        </div>
                    </div>

                    <a
                        href={getSolscanUrl(txSignature, 'tx')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        title="View transaction on Solscan"
                    >
                        <FiExternalLink size={14} />
                    </a>
                </div>
            </div>

            {showWalletDetails && (
                <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-800 shadow-lg overflow-y-auto z-50 transition-transform duration-300">
                    <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-white">
                                Wallet Details
                            </h3>
                            <button
                                onClick={() => setShowWalletDetails(false)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                aria-label="Close"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs text-gray-400 truncate">
                                {walletAddress}
                            </p>
                            <a
                                href={getSolscanUrl(walletAddress, 'account')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300"
                                title="View on Solscan"
                            >
                                <FiExternalLink size={14} />
                            </a>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="mb-6">
                            <h4 className="text-sm font-medium mb-3 text-gray-300">
                                Balance
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-white">
                                    0.00
                                </span>
                                <span className="text-gray-400">SOL</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-sm font-medium mb-3 text-gray-300">
                                Tokens
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">SOL</span>
                                    <span className="text-gray-400">0.00</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">USDC</span>
                                    <span className="text-gray-400">0.00</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium mb-3 text-gray-300">
                                Recent Transactions
                            </h4>
                            <div className="space-y-3">
                                <div className="py-2 border-b border-gray-800 last:border-0">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                                                ${tokenSymbol}
                                            </span>
                                            <span className="text-gray-300 ml-2 text-sm">
                                                {amountInSol} SOL
                                            </span>
                                        </div>
                                        <a
                                            href={getSolscanUrl(
                                                txSignature,
                                                'tx',
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                            title="View transaction on Solscan"
                                        >
                                            <FiExternalLink size={14} />
                                        </a>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {format(
                                            timestamp,
                                            'MMM d, yyyy HH:mm:ss',
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
