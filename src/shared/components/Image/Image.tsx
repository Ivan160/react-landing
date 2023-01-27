import React from 'react';
import { ImageProgressive, ImageProgressiveProps } from './ImageProgressive';
import { images } from './images';


export interface ImageProps extends Partial<ImageProgressiveProps> {
  image: string;
  placeholderImage?: string;
}

export const Image: React.FC<ImageProps> = (props) => {
  const { image, placeholderImage, ...rest } = props;

  return (
    <ImageProgressive
      src={images[image]}
      placeholderSrc={images[placeholderImage]}
      {...rest}
    />
  );
};
