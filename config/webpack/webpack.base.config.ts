import webpack, { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import { ValidatedAppEnv } from '../appEnv/types';
import { resolveFromRoot } from '../utils';
import {
  BUILD_PATH,
  SRC_PATH,
  ASSETS_PATH,
  CORE_PATH,
  SHARED_PATH,
  ICONS_ELEMENTS_PATH,
  IMAGES_ELEMENTS_PATH,
  FONTS_PATH,
  MODULES_PATH,
  API_PATH,
} from './constants';
import {
  getFilename,
  getCssLoaders,
  getSassLoaders,
  getUrlLoaders,
  getTsLoaders,
  getStats,
} from './utils';


const SASS_REGEXP = /\.(scss|sass)$/;
const SASS_COMMON_MODULES_REGEXP = /\.module\.(scss|sass)$/;
const SASS_SRC_MODULES_REGEXP = /(components|containers).*\.(sass|scss)$/;

export default (mode: Configuration['mode'], appEnv: ValidatedAppEnv): Configuration => {
  const isDevMode = mode !== 'production';

  return {
    mode,
    entry: {
      app: resolveFromRoot('src/index.tsx'),
    },
    output: {
      path: BUILD_PATH,
      filename: getFilename({ isDevMode, pathAsExt: true, path: 'js' }),
      chunkFilename: getFilename({ isDevMode, isChunk: true, pathAsExt: true, path: 'js' }),
      publicPath: appEnv.PUBLIC_PATH,
    },
    plugins: [
      // @ts-ignore
      new LoadablePlugin(),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        ENV: JSON.stringify(appEnv),
      }),
      new HtmlWebpackPlugin({
        title: 'Landing',
        template: resolveFromRoot('src/index.html'),
        favicon: 'src/assets/favicon/favicon.ico',
        environment: appEnv,
        meta: {
          'theme-color': '#ffffff',
          'msapplication-TileColor': '#ffffff',
        },
      }),
    ],
    stats: getStats(),
    optimization: {
      noEmitOnErrors: true,
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          react: {
            test: /react/,
            chunks: 'all',
            name: 'react',
            reuseExistingChunk: true,
            enforce: true,
            minChunks: 1,
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
          },
        },
      },
    },
    module: {
      rules: [
        // TYPESCRIPT
        {
          test: /\.tsx?$/,
          use: getTsLoaders({ isDevMode }),
        },
        // CSS
        {
          test: /\.css$/,
          use: getCssLoaders({ isDevMode, modules: false }),
        },
        // SASS
        {
          test: SASS_REGEXP,
          exclude: [SASS_COMMON_MODULES_REGEXP, SRC_PATH],
          use: getSassLoaders({ isDevMode, modules: false, rootPath: SRC_PATH }),
        },
        {
          test: SASS_COMMON_MODULES_REGEXP,
          exclude: SRC_PATH,
          use: getSassLoaders({ isDevMode, modules: true, rootPath: SRC_PATH }),
        },
        // SASS inside SRC_PATH
        {
          test: SASS_REGEXP,
          include: SRC_PATH,
          exclude: SASS_SRC_MODULES_REGEXP,
          use: getSassLoaders({ isDevMode, modules: false }),
        },
        {
          test: SASS_SRC_MODULES_REGEXP,
          include: SRC_PATH,
          use: getSassLoaders({ isDevMode, modules: true }),
        },
        // SVG (react elements) inside SRC_PATH
        {
          test: /\.svg$/,
          include: ICONS_ELEMENTS_PATH,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                symbolId: 'icon-[name]',
              },
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  { name: 'removeTitle' },
                ],
              },
            },
          ],
        },
        // IMAGES
        {
          test: /\.(jpe?g|gif|png|webp)$/,
          include: IMAGES_ELEMENTS_PATH,
          use: getUrlLoaders({ isDevMode, path: 'images' }),
        },
        // FONTS
        {
          test: /\.(eot|otf|ttf|woff2?)$/,
          include: FONTS_PATH,
          use: getUrlLoaders({ isDevMode, path: 'fonts' }),
        },
        // DOCUMENTS
        {
          test: /\.(xlsx|pdf)$/,
          use: getUrlLoaders({ isDevMode, path: 'docs' }),
        },
      ],
    },
    resolveLoader: {
      modules: [
        resolveFromRoot('node_modules'),
      ],
      extensions: ['.ts', '.js'],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      mainFields: ['jsnext:main', 'main'],
      modules: [
        SRC_PATH,
        resolveFromRoot('node_modules'),
      ],
      alias: {
        'config': SRC_PATH,
        'src': SRC_PATH,
        'api': API_PATH,
        'assets': ASSETS_PATH,
        'core': CORE_PATH,
        'modules': MODULES_PATH,
        'shared': SHARED_PATH,
        'ramda': 'ramda/es',
        'lodash': 'lodash-es',
        'fp-ts': '@fp-ts/es6',
        'io-ts': '@io-ts/es6',
      },
    },
  };
};
