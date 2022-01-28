const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProd = process.env.NODE_ENV === 'production'

console.log(isProd ? 'build production..... ' : 'build dev....')

const assetsCDN = {
  externals: {},
  css: ['//mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.css'],
  js: [
    '//api.map.baidu.com/api?type=webgl&v=1.0&ak=你自己的ak',
    '//mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.js',
    '//webapi.amap.com/maps?v=2.0&key=你自己的key',
    '//webapi.amap.com/ui/1.1/main.js',
  ],
}

const assetsDevCDN = {
  css: ['//mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.css'],
  js: [
    '//api.map.baidu.com/api?type=webgl&v=1.0&ak=你自己的ak',
    '//mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.js',
    '//webapi.amap.com/maps?v=2.0&key=你自己的key',
    '//webapi.amap.com/ui/1.1/main.js',
  ],
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

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1890ff',
            'link-color': '#1890ff',
          },
          javascriptEnabled: true,
        },
      },
    },
  },

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
