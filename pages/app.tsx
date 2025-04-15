import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function LoginPage() {
    const { login, authenticated, user } = usePrivy();
    const router = useRouter();

    useEffect(() => {
        if (authenticated && user) {
            // Sync user data with our database
            fetch('/api/auth/privy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    privyId: user.id,
                    email: user.email?.address,
                    walletAddress: user.linkedAccounts?.find(
                        (account) => account.type === 'wallet',
                    )?.address,
                }),
            })
                .then((res) => res.json())
                .then(() => {
                    void router.push('/dashboard');
                })
                .catch((error) => {
                    console.error('Error syncing user data:', error);
                });
        }
    }, [authenticated, user, router]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Welcome to UAV
                    </h2>
                    <p className="text-gray-400">
                        Connect your wallet or sign in with email to get started
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <button
                        onClick={() => void login()}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    >
                        Connect Wallet or Sign In
                    </button>
                    <div className="text-center text-sm text-gray-400">
                        By connecting, you agree to our Terms of Service and
                        Privacy Policy
                    </div>
                </div>
            </div>
        </div>
    );
}
