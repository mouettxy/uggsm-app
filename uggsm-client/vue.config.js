module.exports = {
  transpileDependencies: ['vuetify'],

  pluginOptions: {
    moment: {
      locales: ['ru', 'en'],
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
