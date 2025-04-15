import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider, createStore } from 'jotai';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import PrivyProvider from '../components/PrivyProvider';

import logger from '../logger';
import store from '../store';
import '../styles/globals.css';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'yes') {
    if (typeof window === 'undefined') {
        import('../mocks/server')
            .then(({ server }) => {
                server.listen();
            })
            .catch(logger.error);
    } else {
        import('../mocks/browser')
            .then(async ({ browser }) => browser.start())
            .catch(logger.error);
    }
}

const queryClient = new QueryClient();
const jotaiStore = createStore();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={jotaiStore}>
            <SessionProvider session={pageProps.session}>
                <PrivyProvider>
                    <QueryClientProvider client={queryClient}>
                        <Component {...pageProps} />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </PrivyProvider>
            </SessionProvider>
        </Provider>
    );
}

export default MyApp;
