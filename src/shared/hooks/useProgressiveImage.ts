import { useEffect, useState } from 'react';

export type UseProgressiveImageReturn = [string, { isLoading: boolean, isError: boolean }];

export interface UseProgressiveImageParams {
  src: string;
  placeholderSrc?: string;
  spareSrc?: string;
}

/**
 * @description Загрузчик изображений
 * @param mainSrc - Основное src картинки
 * @param placeholderSrc - Сжатое изображение которое будет показываться пока загружается основное
 * @param spareSrc - Запасное изображение на случай ошибки загрузки основного изображения
 */
export const useProgressiveImage = ({ src: mainSrc, placeholderSrc, spareSrc }: UseProgressiveImageParams): UseProgressiveImageReturn => {
  const [src, setSrc] = useState<string>(null);
  const [status, setStatus] = useState<'load' | 'loading' | 'error'>(null);

  useEffect(() => {
    if (placeholderSrc) {
      const img = new Image();
      img.src = placeholderSrc;
      img.onload = () => setSrc((prev) => prev || placeholderSrc);
    }
  }, [placeholderSrc]);

  useEffect(() => {
    if (mainSrc) {
      setStatus('loading');
      const img = new Image();
      img.src = mainSrc;

      img.onload = () => {
        setStatus('load');
        setSrc(mainSrc);
      };

      img.onerror = () => {
        setStatus('error');
        if (spareSrc) setSrc(spareSrc);
      };
    } else {
      setStatus('error');
      if (spareSrc) setSrc(spareSrc);
    }
  }, [mainSrc, spareSrc]);


  return [src, { isLoading: status === 'loading', isError: status === 'error' }];
};
