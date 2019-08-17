const webpack = require('webpack');

const MinifyProcessedAssetsPlugin = require('./tools/minify-processed-assets-plugin');
const { default: config } = require('./config.json');

const { env } = process;
const isProd = env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.CI_ENV': JSON.stringify(env.ENV || ''),
      'process.env.API_URL': JSON.stringify(env.API_URL || ''),
      'process.env.PAYMENT_ASIA_BANKS': JSON.stringify(config.billing.payment_asia.banks),
      'process.env.CAPTCHA_PUB_KEY': JSON.stringify(config.captcha_pub_key),
      'process.env.DEPLOY_URL': JSON.stringify(env.DEPLOY_URL ? `/${env.DEPLOY_URL}/` : '/'),
      'process.env.STACK_NAME': JSON.stringify(env.STACK_NAME),
    }),
    isProd && new MinifyProcessedAssetsPlugin({
      patterns: /\.(svg|json|jpe?g|png)$/,
      exclude: /dist\/trading/,
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ['sass-loader'],
      },
      // {
      //   test: /\.pug$/,
      //   use: ['raw-loader', 'pug-html-loader'],
      // },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff2?$|\.ttf$/,
        exclude: /node_modules\/vision-chart/,
        use: ['file-loader'],
      },
      {
        test: /\.csv$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]',
          },
        },
      }
    ],
  },
};
