import React from 'react';
import { useProgressiveImage, UseProgressiveImageParams } from 'shared/hooks/useProgressiveImage';
import { PolymorphicComponentProps } from 'react-polymorphic-box';


export type SourceProgressiveProps = UseProgressiveImageParams & PolymorphicComponentProps<'source', {
  blur?: string | number;
  placeholderChildren?: React.ReactNode;
  spareChildren?: React.ReactNode;
}>

export const SourceProgressive: React.FC<SourceProgressiveProps> = (props) => {
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
    <source
      srcSet={src}
      style={{
        filter: isLoading ? `blur(${blur}px)` : null,
        transition: 'filter 0.3s ease-out',
        ...style,
      }}
      {...rest}
    />
  );
};

SourceProgressive.defaultProps = {
  blur: 4,
};
