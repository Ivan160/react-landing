import { ValidatedAppEnv } from 'config/appEnv/types';


declare global {
  /**
   * Параметры сборки приложения
   */
  const ENV: ValidatedAppEnv;
}
