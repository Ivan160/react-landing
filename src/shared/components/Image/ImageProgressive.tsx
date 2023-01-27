import React from 'react';
import { useProgressiveImage, UseProgressiveImageParams } from 'shared/hooks';
import { PolymorphicComponentProps } from 'react-polymorphic-box';


export type ImageProgressiveProps = UseProgressiveImageParams & PolymorphicComponentProps<'img', {
  blur?: string | number;
  placeholderChildren?: React.ReactNode;
  spareChildren?: React.ReactNode;
}>

export const ImageProgressive: React.FC<ImageProgressiveProps> = (props) => {
  const {
    blur,
    placeholderChildren,
    spareChildren,

    src: mainSrc,
    placeholderSrc,
    spareSrc,

    style,
    ...rest
  } = props;

  const [src, { isLoading, isError }] = useProgressiveImage({ src: mainSrc, placeholderSrc, spareSrc });

  if (isLoading && placeholderChildren) return placeholderChildren as JSX.Element;
  if (isError && spareChildren) return spareChildren as JSX.Element;

  return (
    <img
      alt=""
      loading="lazy"
      src={src}
      style={{
        filter: isLoading ? `blur(${blur}px)` : null,
        transition: 'filter 0.3s ease-out',
        ...style,
      }}
      {...rest}
    />
  );
};

ImageProgressive.defaultProps = {
  blur: 4,
};
