module.exports = {
    entry: './js/precomp.js',
    output: {
        filename: 'js/bundle.js'
    },
    watch: true,
    module: {
        loaders:
        [
            {
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};