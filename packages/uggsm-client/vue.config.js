/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */

const IgnoreNotFoundExportPlugin = require('./webpack/plugins/ignore-not-found-export-plugin')
const SizePlugin = require('size-plugin')
const zlib = require('zlib')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
var DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

const isProductionEnvFlag = process.env.NODE_ENV === 'production'

let production = {}
let developement = {}

if (isProductionEnvFlag) {
  // production.chainWebpack = (config) => {
  // const splitOptions = config.optimization.get('splitChunks')
  // config.optimization.splitChunks(
  //   Object.assign({}, splitOptions, {
  //     maxAsyncRequests: 16,
  //     maxInitialRequests: 16,
  //     minChunks: 1,
  //     minSize: 30000,
  //     automaticNameDelimiter: '~',
  //     name: true,
  //     cacheGroups: {
  //       default: false,
  //       common: {
  //         name: `chunk-common`,
  //         minChunks: 2,
  //         priority: -20,
  //         chunks: 'initial',
  //         reuseExistingChunk: true,
  //       },
  //       vuetify: {
  //         name: 'vuetify',
  //         test: /[\\/]node_modules[\\/]vuetify[\\/]/,
  //         chunks: 'initial',
  //         priority: -30,
  //       },
  //     },
  //   })
  // )
  //   if (process.env.npm_config_report) {
  //     config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  //   }
  // }
  // production.configureWebpack = {
  //   plugins: [
  //     isProductionEnvFlag ? new SizePlugin() : () => {},
  //     isProductionEnvFlag ? new DuplicatePackageCheckerPlugin() : () => {},
  //     isProductionEnvFlag
  //       ? new CompressionPlugin({
  //           filename: '[path][base].gz',
  //           algorithm: 'gzip',
  //           test: /\.js$|\.css$|\.html$/,
  //           threshold: 10240,
  //           minRatio: 0.8,
  //         })
  //       : () => {},
  //     isProductionEnvFlag
  //       ? new CompressionPlugin({
  //           filename: '[path][base].br',
  //           algorithm: 'brotliCompress',
  //           test: /\.(js|css|html|svg)$/,
  //           compressionOptions: {
  //             params: {
  //               [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
  //             },
  //           },
  //           threshold: 10240,
  //           minRatio: 0.8,
  //           deleteOriginalAssets: false,
  //         })
  //       : () => {},
  //   ],
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     isProductionEnvFlag
  //       ? new TerserPlugin({
  //           terserOptions: {
  //             format: {
  //               comments: false,
  //             },
  //           },
  //           parallel: 4,
  //           extractComments: false,
  //         })
  //       : () => {},
  //   ],
  // },
  //}
} else {
  developement.configureWebpack = {
    devtool: 'source-map',
  }
  developement.chainWebpack = (config) => {
    config.plugin('IgnoreNotFoundExportPlugin').before('friendly-errors').use(IgnoreNotFoundExportPlugin)
  }
}

module.exports = {
  ...production,
  ...developement,

  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
  },

  devServer: {
    progress: false,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true,
    },
  },

  transpileDependencies: ['vuetify'],

  productionSourceMap: false,

  parallel: 2,

  pluginOptions: {
    moment: {
      locales: ['ru'],
    },
    autoRouting: {
      dynamicImport: false,
    },
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/sass/variables.sass"',
      },
    },
  },
}
