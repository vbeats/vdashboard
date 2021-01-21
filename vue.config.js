const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const resolve = dir => path.join(__dirname, dir);
const addStylusResource = rule => {
    rule
        .use("style-resouce")
        .loader("style-resources-loader")
        .options({
            patterns: [resolve("src/assets/css/variable.styl")]
        });
}

const isProd = process.env.NODE_ENV === 'production';

const assetsCDN = {
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        nprogress: 'NProgress',
        'ant-design-vue': 'Antd',
        'dayjs': 'dayjs',
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    },
    css: [
        '//cdn.jsdelivr.net/npm/ant-design-vue@2.0.0-rc.8/dist/antd.min.css'
    ],
    js: [
        '//cdn.jsdelivr.net/npm/vue@3.0.5/dist/vue.global.min.js',
        '//cdn.jsdelivr.net/npm/vue-router@4.0.3/dist/vue-router.global.min.js',
        '//cdn.jsdelivr.net/npm/vuex@4.0.0-rc.2/dist/vuex.global.min.js',
        '//cdn.jsdelivr.net/npm/axios@0.21.0/dist/axios.min.js',
        '//cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
        '//cdn.jsdelivr.net/npm/ant-design-vue@2.0.0-rc.8/dist/antd-with-locales.min.js',
        '//cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js',
        '//cdn.jsdelivr.net/npm/dayjs@1.10.3/dayjs.min.js'
    ]
}

const assetsDevCDN = {
    css: [
        '//cdn.jsdelivr.net/npm/ant-design-vue@1.6.4/dist/antd.min.css'
    ]
}

module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 80,
        disableHostCheck: true,
        open: false,
    },

    /*css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        'primary-color': '#1DA57A',
                        'link-color': '#1DA57A',
                        'border-radius-base': '2px',
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },*/

    productionSourceMap: false,

    configureWebpack: {
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new CompressionPlugin({
                test: /\.js$|\.css$|\.html$/,
                filename: '[path][name].gz[query]',
                algorithm: 'gzip',
                threshold: 10240,
                minRatio: 0.8
            })
        ],
        externals: isProd ? assetsCDN.externals : ''
    },

    chainWebpack: config => {
        config.resolve.alias
            .set('@$', resolve('src'))

        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .oneOf('inline')
            .resourceQuery(/inline/)
            .use('vue-svg-icon-loader')
            .loader('vue-svg-icon-loader')
            .end()
            .end()
            .oneOf('external')
            .use('file-loader')
            .loader('file-loader')
            .options({
                name: 'assets/[name].[hash:8].[ext]'
            })

        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach(type =>
            addStylusResource(config.module.rule("stylus").oneOf(type))
        )

        config.plugin('html').tap(args => {
            args[0].cdn = isProd ? assetsCDN : assetsDevCDN
            args[0].title = 'vdashboard'
            return args
        })

        config.optimization.splitChunks({
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 30 * 1024,
            maxSize: 124 * 1024,
            automaticNameDelimiter: '-',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `chunk.${packageName.replace('@', '')}`;
                    },
                    priority: 10
                }
            }
        })
    },
}