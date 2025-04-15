import Link from 'next/link';

interface NavBarProps {
    links?: Array<{
        title: string;
        url: string;
    }>;
}

export default function NavBar({ links = [] }: NavBarProps) {
    return (
        <header className="bg-gray-900 border-b border-gray-800">
            <div className="container flex items-center justify-between p-4 mx-auto">
                <Link
                    passHref={true}
                    href="/"
                    className="flex items-center font-medium text-white"
                >
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        UAV
                    </span>
                </Link>
                <nav className="flex items-center space-x-8">
                    {links.map((link) => (
                        <Link
                            key={link.url}
                            href={link.url}
                            className="text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            {link.title}
                        </Link>
                    ))}
                    <Link
                        href="/app"
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                        Open App
                    </Link>
                </nav>
            </div>
        </header>
    );
}
