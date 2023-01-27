import React from 'react';
import { ImageName } from 'shared/models/image.model';
import { MediaBreak } from 'shared/models/media';
import { Image, ImageProps } from './Image';
import { SourceProgressive } from './SourceProgressive';
import { images } from './images';


export interface PictureProps extends ImageProps {
  imageLG?: ImageName;
  imageMD?: ImageName;
  imageSM?: ImageName;
  imageXS?: ImageName;
  imageES?: ImageName;
}

export const Picture: React.FC<PictureProps> = (props) => {
  const {
    className,
    image,
    imageLG,
    imageMD,
    imageSM,
    imageXS,
    imageES,
    placeholderImage,
    ...rest
  } = props;

  return (
    <picture className={className}>
      {imageES && <SourceProgressive src={images[imageES]} media={`(max-width: ${MediaBreak.ES}px)`} placeholderSrc={images[placeholderImage]} />}
      {imageXS && <SourceProgressive src={images[imageXS]} media={`(max-width: ${MediaBreak.XS}px)`} placeholderSrc={images[placeholderImage]} />}
      {imageSM && <SourceProgressive src={images[imageSM]} media={`(max-width: ${MediaBreak.SM}px)`} placeholderSrc={images[placeholderImage]} />}
      {imageMD && <SourceProgressive src={images[imageMD]} media={`(max-width: ${MediaBreak.MD}px)`} placeholderSrc={images[placeholderImage]} />}
      {imageLG && <SourceProgressive src={images[imageLG]} media={`(max-width: ${MediaBreak.LG}px)`} placeholderSrc={images[placeholderImage]} />}
      {/* eslint-disable-next-line max-len */}
      {/* {image && <SourceProgressive src={images[image]} media={`(min-width: ${MediaOverseer.XL}px)`} placeholderSrc={images[placeholderImage]} />} */}
      {/* eslint-disable-next-line max-len */}
      {/* {image && <SourceProgressive src={images[image]} media={`(max-width: ${MediaOverseer.XL}px)`} placeholderSrc={images[placeholderImage]} />} */}
      <Image className={className} image={image} placeholderSrc={placeholderImage} {...rest} />
    </picture>
  );
};
