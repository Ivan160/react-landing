import { isLeft } from 'fp-ts/Either';
import { Errors } from 'io-ts';
import * as R from 'ramda';
import colors from 'colors';

import { resolveFromRoot } from '../utils';
import { ENV_CONFIG, ENV_TYPES_CODEC, ENV_VALUE_TRANSFORMERS } from './envConfig';
import {
  AppEnvKeys,
  BundleMode,
  EnvValueTransformers,
  ProvidedAppEnv,
  ValidatedAppEnv,
  WebpackEnv,
} from './types';

export class AppEnvCreator {
  constructor(private readonly webpackEnv: WebpackEnv) {}

  private getAppEnv(): ProvidedAppEnv {
    const finedWebpackEnv = AppEnvCreator.findWebpackEnv(this.webpackEnv);
    if (!finedWebpackEnv) {
      const errorMessage = colors.red(`webpack env can take one of these values: ${AppEnvCreator.validEnvModes.join(', ')}`);
      throw new Error(AppEnvCreator.createErrorMessage(errorMessage));
    }

    const envFile = resolveFromRoot(`environment/env.${finedWebpackEnv}.json`);

    return require(envFile) as ProvidedAppEnv;
  }

  private static validEnvModes: BundleMode[] = ['development', 'test', 'production', 'local'];

  private static findWebpackEnv(webpackEnv: WebpackEnv): BundleMode {
    return R.intersection(AppEnvCreator.validEnvModes, R.keys(webpackEnv))[0] as BundleMode;
  }

  private static validateTypes(preparedAppEnv: ProvidedAppEnv): ValidatedAppEnv {
    const unknownEnvKeys = R.without(R.keys(ENV_CONFIG), R.keys(preparedAppEnv));
    const unknownKeysErrorMessage = AppEnvCreator.getUnknownKeysErrorMessage(preparedAppEnv, unknownEnvKeys);

    const decoded = ENV_TYPES_CODEC.decode(preparedAppEnv);

    if (isLeft(decoded)) {
      const errorMessage = AppEnvCreator.getValidateTypesErrorMessage(decoded.left);
      throw new Error(AppEnvCreator.createErrorMessage(errorMessage, unknownKeysErrorMessage));
    }
    if (!R.isEmpty(unknownEnvKeys)) {
      throw new Error(AppEnvCreator.createErrorMessage(unknownKeysErrorMessage));
    }

    return decoded.right;
  }

  private static createErrorMessage(...messageBody: string[]): string {
    const messageHeader = colors.yellow('Environment variables validation errors:');
    return [messageHeader, ...messageBody].join('\n');
  }

  private static getUnknownKeysErrorMessage<T extends ProvidedAppEnv>(env: T, unknownKeys: (keyof T)[]): string {
    return unknownKeys.map((key) => {
      const value = env[key];
      return colors.red(`[Unknown property] ${String(key)}: ${String(value)}`);
    }).join('\n');
  }

  private static getValidateTypesErrorMessage(errors: Errors): string {
    return errors
      .flatMap(({ context }) => context)
      .filter(({ key }) => Object.keys(ENV_TYPES_CODEC.props).includes(key as AppEnvKeys))
      .filter(({ key }, index, array) => array.findIndex((i) => i.key === key) === index)
      .map(({ key, type, actual }) => colors.red(
        `[Invalid property] ${key}: ${JSON.stringify(actual)} .Expected: ${type.name}`,
      ))
      .join('\n');
  }

  private static transformValues<T extends ValidatedAppEnv>(validatedAppEnv: T): T {
    return Object.entries(validatedAppEnv).reduce(
      <K extends AppEnvKeys>(acc: T, [key, value]: [K, T[K]]) => {
        const transformers = ENV_VALUE_TRANSFORMERS[key] as EnvValueTransformers<T[K]>;
        acc[key] = transformers.reduce((accValue, transformerFn) => transformerFn(accValue), value);
        return acc;
      },
      {} as T,
    );
  }

  create(): ValidatedAppEnv {
    const combinedAppEnv = this.getAppEnv();
    const validatedAppEnv = AppEnvCreator.validateTypes(combinedAppEnv);
    return AppEnvCreator.transformValues(validatedAppEnv);
  }
}
