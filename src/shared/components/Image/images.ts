/**
 * Получение изображений из папки /assets/images
 */
const imageFiles: __WebpackModuleApi.RequireContext = require.context('assets/images', false, /\.(|png|jpe?g)$/);

/**
 * Формирование объекта
 * ключ - наименование изображения (без расширения)
 * значение - путь к изображению
 */
export const images = imageFiles.keys().reduce((acc: Record<string, string>, item) => ({
  ...acc,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  [item.replace('./', '').replace(/\.(|png|jpe?g)$/, '')]: imageFiles(item).default,
}), {});
