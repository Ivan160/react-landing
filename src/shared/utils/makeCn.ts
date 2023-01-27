import { withNaming, ClassNameFormatter } from '@bem-react/classname';


declare type IStyles = Record<string, string>;

const makeClassNameMaker = withNaming({ e: '-', m: '--', v: '_' });

export const makeCn = (scopeName: string, styles: IStyles): ClassNameFormatter => {
  const makeClassName: ClassNameFormatter = makeClassNameMaker(scopeName);

  return ((elemNameOrBlockMods, elemModsOrBlockMix, elemMix) => {
    const classNames = makeClassName(elemNameOrBlockMods, elemModsOrBlockMix, elemMix).split(' ');

    return classNames.reduce((acc: string, className) => {
      const scopedClassName = styles[className];
      return scopedClassName ? `${acc} ${scopedClassName}` : acc;
    }, '');
  }) as ClassNameFormatter;
};
