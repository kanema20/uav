import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyProviderProps {
    children: ReactNode;
}

export default function PrivyProvider({ children }: PrivyProviderProps) {
    return (
        <Privy
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                loginMethods: ['email', 'wallet'],
                appearance: {
                    theme: 'dark',
                    accentColor: '#7C3AED',
                    showWalletLoginFirst: true,
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </Privy>
    );
}
