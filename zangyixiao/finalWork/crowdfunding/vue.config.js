module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: "http://47.103.30.42:15154/",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "/"
                }
            },
            "/data": {
                target: "http://47.103.30.42:15156/",
                changeOrigin: true,
                pathRewrite: {
                    "^/data": "/"
                }
            }
        }
    }
}