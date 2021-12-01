const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const addStylusResource = (rule) => {
  rule
    .use('style-resouce')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, 'src/assets/css/variable.styl')],
    })
}

const isProd = process.env.NODE_ENV === 'production'

console.log(isProd ? 'build production..... ' : 'build dev....')

const assetsCDN = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    'ant-design-vue': 'Antd',
    dayjs: 'dayjs',
    lodash: '_',
  },
  css: ['//cdn.jsdelivr.net/npm/ant-design-vue@3.0.0-alpha.13/dist/antd.min.css'],
  js: [
    '//cdn.jsdelivr.net/npm/vue@3.2.23/dist/vue.global.prod.js',
    '//cdn.jsdelivr.net/npm/vue-router@4.0.12/dist/vue-router.global.min.js',
    '//cdn.jsdelivr.net/npm/vuex@4.0.2/dist/vuex.global.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js',
    '//cdn.jsdelivr.net/npm/ant-design-vue@3.0.0-alpha.13/dist/antd-with-locales.min.js',
    '//cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
    '//cdn.jsdelivr.net/npm/dayjs@1.10.7/dayjs.min.js',
  ],
}

const assetsDevCDN = {
  css: ['//cdn.jsdelivr.net/npm/ant-design-vue@3.0.0-alpha.13/dist/antd.min.css'],
}

const plugins = isProd
  ? [
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        filename: '[path][name].gz[query]',
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8,
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled', // server
        analyzerHost: '127.0.0.1',
        analyzerPort: 10086,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: true,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info',
      }),
    ]
  : []

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 80,
    disableHostCheck: true,
    open: false,
  },

  /* css: {
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
  }, */

  productionSourceMap: false,

  configureWebpack: {
    plugins,
    externals: isProd ? assetsCDN.externals : '',
  },

  chainWebpack: (config) => {
    config.resolve.alias.set('@$', path.resolve(__dirname, 'src'))

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
        name: 'assets/[name].[hash:8].[ext]',
      })

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach((type) => addStylusResource(config.module.rule('stylus').oneOf(type)))

    config.plugin('html').tap((args) => {
      args[0].cdn = isProd ? assetsCDN : assetsDevCDN
      args[0].title = 'v dashboard'
      return args
    })

    if (isProd) {
      config.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 128 * 1024,
        maxSize: 500 * 1024,
        automaticNameDelimiter: '-',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `chunk.${packageName.replace('@', '')}`
            },
            priority: 10,
          },
        },
      })
    }
  },
}
