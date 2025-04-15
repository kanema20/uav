import { User } from '@prisma/client';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { authenticated, user, logout } = usePrivy();
    const router = useRouter();
    const [dbUser, setDbUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authenticated) {
            void router.push('/app');
        }
    }, [authenticated, router]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(
                        `/api/user?privyId=${user.id}`,
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setDbUser(data);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        void fetchUserData();
    }, [user?.id]);

    if (!authenticated || !user) {
        return null;
    }

    const wallet = user.linkedAccounts?.find(
        (account) => account.type === 'wallet',
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <button
                        onClick={() => void logout()}
                        className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Disconnect
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Wallet Information
                        </h2>
                        {wallet ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400">
                                        Wallet Address
                                    </p>
                                    <p className="font-mono text-sm break-all">
                                        {wallet.address}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Wallet Type</p>
                                    <p className="text-sm capitalize">
                                        {wallet.type}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">No wallet connected</p>
                        )}
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Account Information
                        </h2>
                        <div className="space-y-4">
                            {user.email?.address && (
                                <div>
                                    <p className="text-gray-400">Email</p>
                                    <p className="text-sm">
                                        {user.email.address}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-gray-400">Privy ID</p>
                                <p className="text-sm">{user.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Database Information
                        </h2>
                        {loading ? (
                            <p className="text-gray-400">Loading...</p>
                        ) : dbUser ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400">Created At</p>
                                    <p className="text-sm">
                                        {new Date(
                                            dbUser.createdAt,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Updated At</p>
                                    <p className="text-sm">
                                        {new Date(
                                            dbUser.updatedAt,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                {dbUser.name && (
                                    <div>
                                        <p className="text-gray-400">Name</p>
                                        <p className="text-sm">{dbUser.name}</p>
                                    </div>
                                )}
                                {dbUser.walletAddress && (
                                    <div>
                                        <p className="text-gray-400">
                                            Wallet Address
                                        </p>
                                        <p className="font-mono text-sm break-all">
                                            {dbUser.walletAddress}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400">
                                No database record found
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
