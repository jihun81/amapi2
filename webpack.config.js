const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['**/*.LICENSE.txt'],
            protectWebpackAssets: false
        })
    ]
};