import * as t from 'io-ts';
import { envItem } from './utils';
import { addSlashToTheEnd, cutSlashFromTheEnd, pickRecordInnerProp } from '../utils';


export const ENV_CONFIG = {
  MODE: envItem(t.union([t.literal('DEV'), t.literal('TEST'), t.literal('PROD'), t.literal('LOCAL')])),
  PUBLIC_PATH: envItem(t.string, [addSlashToTheEnd]),
  API_URL: envItem(t.string, [cutSlashFromTheEnd]),
};

export const ENV_TYPES_CODEC = t.type(pickRecordInnerProp(ENV_CONFIG, 'type'));

export const ENV_VALUE_TRANSFORMERS = pickRecordInnerProp(ENV_CONFIG, 'valueTransformers');
