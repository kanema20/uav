import { type GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Index() {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-900 text-white">
                <Head>
                    <title>Crypto Alpha | Advanced Trading Platform</title>
                    <meta
                        name="description"
                        content="Next-generation crypto trading platform with advanced analytics and real-time market data"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main>
                    {/* Hero Section */}
                    <section className="relative h-screen flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                Crypto Alpha
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                                Unlock the power of advanced trading analytics
                                and real-time market insights
                            </p>
                            <Link
                                href="/app"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                            >
                                Open App
                            </Link>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-20 bg-gray-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-center mb-12">
                                Key Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-6 bg-gray-700/50 rounded-xl">
                                    <div className="text-purple-400 mb-4">
                                        <svg
                                            className="w-8 h-8"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Advanced Analytics
                                    </h3>
                                    <p className="text-gray-300">
                                        Real-time market data and predictive
                                        analytics to help you make informed
                                        trading decisions.
                                    </p>
                                </div>
                                <div className="p-6 bg-gray-700/50 rounded-xl">
                                    <div className="text-blue-400 mb-4">
                                        <svg
                                            className="w-8 h-8"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Lightning Fast
                                    </h3>
                                    <p className="text-gray-300">
                                        Execute trades in milliseconds with our
                                        high-performance trading engine.
                                    </p>
                                </div>
                                <div className="p-6 bg-gray-700/50 rounded-xl">
                                    <div className="text-green-400 mb-4">
                                        <svg
                                            className="w-8 h-8"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Secure Trading
                                    </h3>
                                    <p className="text-gray-300">
                                        Bank-grade security with multi-factor
                                        authentication and cold storage options.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl font-bold mb-6">
                                Ready to Start Trading?
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Join thousands of traders who trust Crypto Alpha
                                for their trading needs.
                            </p>
                            <Link
                                href="/app"
                                className="inline-block px-8 py-4 bg-white text-gray-900 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                            >
                                Get Started Now
                            </Link>
                        </div>
                    </section>
                </main>

                <footer className="py-8 bg-gray-900 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
                        <p>© 2024 Crypto Alpha. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
    props: {
        session: await getSession(ctx),
    },
});
