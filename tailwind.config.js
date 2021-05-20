module.exports = {
    purge: {
        enable: true,
        content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
        preserveHtmlElements: false,
        options: {
            keyframes: true,
        }
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            backgroundImage: theme => ({
                'bg-img': "url('@/assets/img/background.svg')",
            }),
            display: ['hover']
        },
        backgroundPosition: {
            'bg-position': 'center 110px'
        },
        lineHeight: {
            '16': '4rem'
        },
        textColor: {}
    },
    variants: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false
    }
}
