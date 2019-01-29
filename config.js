module.exports = {
    component: true, //是否组件模式
    // framework: 'vue', //项目使用的框架，可选vue , angular or react
    // webpack server 配置
    devServer: {
        host: 'localhost',
        proxy: {
            '/dev': {
                target: 'http://xxx/',
                changeOrigin: true,
                pathRewrite: {
                    '^/dev': ''
                }
            }
        }
    }
}