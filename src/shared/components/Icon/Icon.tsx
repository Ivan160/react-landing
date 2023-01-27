import React from 'react';
import { PolymorphicComponentProps } from 'react-polymorphic-box';


/* Icons are stored in src/assets/icons. */
const iconFiles = require.context('assets/icons', false, /.*\.svg$/);
const iconFilesKeys = iconFiles.keys();

/* Load resources */
iconFilesKeys.forEach(iconFiles);


export type IconProps = PolymorphicComponentProps<'svg', {
  icon: string;
}>

export const Icon: React.FC<IconProps> = (props) => {
  const { icon, ...rest } = props;

  return (
    <svg {...rest}>
      <use xlinkHref={`#icon-${icon}`} />
    </svg>
  );
};
