import path from 'path';
import { Falsy } from './webpack/types';

export const resolveFromRoot = path.resolve.bind(null, process.cwd()) as typeof path.resolve;

export function booleanFilter<T>(value: T | Falsy): value is T {
  return Boolean(value);
}

export function cutSlashFromTheEnd(path = ''): string {
  return path.replace(/\/$/, '');
}

export function addSlashToTheEnd(path = ''): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export function pickRecordInnerProp<
  O extends object,
  T extends Record<string, O>,
  R extends { [K in keyof T]: T[K][keyof O] },
  >(
  record: T,
  innerProp: keyof O,
): R {
  return Object.entries(record).reduce(
    <K extends keyof T>(acc, [key, item]: [K, T[K]]) => {
      acc[key] = item[innerProp];
      return acc;
    },
    {} as R,
  );
}
