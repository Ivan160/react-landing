import { merge } from 'webpack-merge';
import { CallableOption } from 'webpack-cli';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { AppEnvCreator } from '../appEnv/AppEnvCreator';
import { ProvidedAppEnv } from '../appEnv/types';
import { getStats } from './utils';
import baseConfig from './webpack.base.config';

const devConfig: CallableOption = (env) => {
  const appEnv = new AppEnvCreator(env as ProvidedAppEnv).create();

  return merge(
    baseConfig('development', appEnv),
    {
      cache: true,
      plugins: [
        new ForkTsCheckerWebpackPlugin(),
      ],
      devtool: 'source-map',
      stats: getStats({ isDevServer: true }),
      devServer: {
        port: 5600,
        historyApiFallback: true,
        allowedHosts: 'all',
        compress: true,
        open: true,
        client: {
          overlay: {
            errors: true,
            warnings: false,
          },
        },
        // clientLogLevel: 'silent',
        // stats: getStats({ isDevServer: true }),
        proxy: {},
      },
    },
  );
};

export default devConfig;
