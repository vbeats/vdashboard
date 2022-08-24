/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    ...(process.env.NODE_ENV === 'production' ? {cssnano: {}} : {}),
    theme: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
}
