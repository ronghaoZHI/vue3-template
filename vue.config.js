const path =  require('path')

const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
	chainWebpack: config => {
    config.resolve.alias
			.set('@', resolve('src'))

		return config
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 
    } else {
      // 
    }
  },
	devServer: {
    proxy: {
      '/': {
        target: '3d.airlook.com',
        ws: true,
        changeOrigin: true
      },
    }
  }
}