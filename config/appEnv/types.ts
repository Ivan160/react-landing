import * as t from 'io-ts';
import { ENV_CONFIG, ENV_TYPES_CODEC } from './envConfig';

export type Optional<T> = T | undefined;

export type BundleMode = 'local' | 'development' | 'test' | 'production';

export type AppEnvKeys = keyof typeof ENV_CONFIG;
export type AppEnvValue = Optional<boolean | number | string>;

export type ProvidedAppEnv = Record<string, AppEnvValue>;
export type ValidatedAppEnv = t.TypeOf<typeof ENV_TYPES_CODEC>;

export type WebpackEnvItem = string | ProvidedAppEnv;
export type WebpackEnv = Optional<WebpackEnvItem | WebpackEnvItem[]>;

export type EnvValueTransformers<T extends AppEnvValue> = Array<(value: T) => T>;

export interface IEnvConfigItem<T extends t.Mixed> {
  type: T,
  valueTransformers: EnvValueTransformers<t.TypeOf<T>>,
}
