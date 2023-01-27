import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

export type Configuration = WebpackConfiguration & WebpackDevServerConfiguration;

export interface IBundleConfig {
  isDevMode: boolean,
}

export type Falsy = false | '' | 0 | null | undefined;

export interface IGetFilenameParams extends IBundleConfig {
  path: string,
  pathAsExt?: boolean,
  isChunk?: boolean,
}

export interface IGetStatsParams {
  isDevServer?: boolean,
}

export interface IGetCssLoadersParams extends IBundleConfig {
  modules: boolean,
}

export interface IGetSassLoadersParams extends IGetCssLoadersParams {
  rootPath?: string,
  sassResources?: string[],
}

export interface IGetUrlLoadersParams extends IBundleConfig {
  path: string,
}
