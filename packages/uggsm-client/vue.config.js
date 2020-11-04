/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */

const SizePlugin = require('size-plugin')
const zlib = require('zlib')
const CompressionPlugin = require('compression-webpack-plugin')
const isProductionEnvFlag = process.env.NODE_ENV === 'production'
const TerserPlugin = require('terser-webpack-plugin')
var DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

let production = {}

if (isProductionEnvFlag) {
  production.chainWebpack = (config) => {
    config.resolve.symlinks(false)

    const splitOptions = config.optimization.get('splitChunks')
    config.optimization.splitChunks(
      Object.assign({}, splitOptions, {
        maxAsyncRequests: 16,
        maxInitialRequests: 16,
        minChunks: 1,
        minSize: 30000,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          default: false,
          common: {
            name: `chunk-common`,
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
          vuetify: {
            name: 'vuetify',
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            chunks: 'initial',
            priority: -30,
          },
        },
      })
    )

    if (process.env.npm_config_report) {
      config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  }

  production.configureWebpack = {
    plugins: [
      isProductionEnvFlag ? new SizePlugin() : () => {},
      isProductionEnvFlag ? new DuplicatePackageCheckerPlugin() : () => {},
      isProductionEnvFlag
        ? new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
          })
        : () => {},
      isProductionEnvFlag
        ? new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
              },
            },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          })
        : () => {},
    ],
    optimization: {
      minimize: true,
      minimizer: [
        isProductionEnvFlag
          ? new TerserPlugin({
              terserOptions: {
                format: {
                  comments: false,
                },
              },
              parallel: 4,
              extractComments: false,
            })
          : () => {},
      ],
    },
  }
}

module.exports = {
  ...production,

  devServer: {
    progress: false,
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
      chunkNamePrefix: 'page-',
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
