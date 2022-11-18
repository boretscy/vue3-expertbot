module.exports = {
  configureWebpack: {
      optimization: {
          splitChunks: false
      }
  },

  publicPath: '',

  css: {
    extract: false
  }
}