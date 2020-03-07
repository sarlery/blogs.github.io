const withSass = require('@zeit/next-sass');
const withCss = require("@zeit/next-css");

module.exports = {
    webpack(config, options){
        config = withCss().webpack(config, options);
        config = withSass({
            cssModules: true,
            cssLoaderOptions: {
                importLoaders: 1,
                localIdentName: "[local]___[hash:base64:5]",
            }
        }).webpack(config, options);

        return config;
    }
}