import { RuleSetUseItem } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createLoadableComponentsTransformer } from 'typescript-loadable-components-plugin';
import { resolveFromRoot, booleanFilter } from 'config/utils';
import {
  IBundleConfig,
  IGetCssLoadersParams,
  IGetSassLoadersParams,
  IGetFilenameParams,
  IGetStatsParams,
  IGetUrlLoadersParams,
  Configuration,
} from 'config/webpack/types';


export function getFilename({ isDevMode, isChunk, path, pathAsExt }: IGetFilenameParams): string {
  const hash = isChunk ? 'chunkhash' : 'contenthash';
  const name = isDevMode ? '[name]' : `[name].[${hash}:5]`;
  const extension = pathAsExt ? path.replace(/\./, '') : '[ext]';
  return `${path}/${name}.${extension}`;
}

export function getStats({ isDevServer }: IGetStatsParams = {}): Configuration['stats'] {
  const commonStats = {
    children: false,
    warningsFilter: [/was not found in/i, /conflicting order/i],
  };
  return isDevServer ? {
    ...commonStats,
    assets: false,
    chunks: false,
    modules: false,
    entrypoints: false,
  } : commonStats;
}

// replaces named imports with default imports in bundle for libs with commonjs exports
export function getBabelImportTransformer(libraryName: string, libraryDirectory = ''): [string, Record<string, unknown>, string] {
  return [
    'import',
    {
      libraryName,
      libraryDirectory,
      camel2DashComponentName: false,
    },
    libraryName,
  ];
}

export function getUrlLoaders({ isDevMode, path }: IGetUrlLoadersParams): RuleSetUseItem[] {
  return [
    {
      loader: 'url-loader',
      options: {
        limit: 1024 * 4,
        name: getFilename({ isDevMode, path }),
      },
    },
  ];
}

export function getTsLoaders({ isDevMode }: IBundleConfig): RuleSetUseItem[] {
  return [
    {
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-transform-runtime',
          '@loadable/babel-plugin',
          getBabelImportTransformer('date-fns'),
          getBabelImportTransformer('@tinymce/tinymce-react', 'lib/cjs/main/ts/components'),
        ],
      },
    },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        configFile: resolveFromRoot('config/webpack/tsconfig.json'),
        /* typescript loadable/components */
        getCustomTransformers: (program) => ({
          before: [createLoadableComponentsTransformer(program, {})],
        }),
      },
    },
  ].filter(booleanFilter);
}

export const getCssLoaders = ({ isDevMode, modules }: IGetCssLoadersParams): RuleSetUseItem[] => [
  isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      sourceMap: isDevMode,
      ...modules && {
        modules: {
          localIdentName: isDevMode ? '[folder]__[local]--[hash:base64:5]' : '[hash:base64]',
        },
      },
    },
  },
  !isDevMode && ({
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: ['cssnano', 'autoprefixer'],
      },
    },
  }),
].filter(booleanFilter);

export const getSassLoaders = ({ isDevMode, modules, rootPath, sassResources }: IGetSassLoadersParams): RuleSetUseItem[] => [
  ...getCssLoaders({ isDevMode, modules }),
  rootPath && ({
    loader: 'resolve-url-loader',
    options: {
      sourceMap: isDevMode,
      root: rootPath,
    },
  }),
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  },
  sassResources && ({
    loader: 'sass-resources-loader',
    options: {
      resources: sassResources,
    },
  }),
].filter(booleanFilter);
