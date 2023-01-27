import * as t from 'io-ts';

import { AppEnvValue, EnvValueTransformers, IEnvConfigItem } from 'config/appEnv/types';


export function optional <T extends t.Mixed>(ioTsMixed: T): t.UnionC<[T, t.UndefinedC]> {
  return t.union([ioTsMixed, t.undefined]);
}

export function envItem <T extends t.Type<V>, V extends AppEnvValue = t.TypeOf<T>>(
  type: T,
  valueTransformers: EnvValueTransformers<V> = [],
): IEnvConfigItem<T> {
  return {
    type,
    valueTransformers,
  };
}
