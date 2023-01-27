import { merge } from 'webpack-merge';
import { CallableOption } from 'webpack-cli';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssoWebpackPlugin from 'csso-webpack-plugin';
import { AppEnvCreator } from '../appEnv/AppEnvCreator';
import { ProvidedAppEnv } from '../appEnv/types';
import { getFilename } from './utils';
import baseConfig from './webpack.base.config';


const prodConfig: CallableOption = (env) => {
  const appEnv = new AppEnvCreator(env as ProvidedAppEnv).create();

  return merge(
    baseConfig('production', appEnv),
    {
      plugins: [
        new MiniCssExtractPlugin({
          filename: getFilename({ isDevMode: false, pathAsExt: true, path: 'css' }),
          chunkFilename: getFilename({ isDevMode: false, isChunk: true, pathAsExt: true, path: 'css' }),
        }),
        new CssoWebpackPlugin(),
      ],
    },
  );
};

export default prodConfig;
