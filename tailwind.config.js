/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            boxShadow: {
                glow: '0 0 15px 2px rgba(74, 124, 89, 0.5)',
            },
        },
    },
    plugins: [],
};
