import React, { useMemo } from "react";

type DividerVariant = 'wave' | 'zigzag' | 'curve' | 'mountains';

interface ListDividerProps {
  color: string;
  variant?: DividerVariant;
  index?: number;
}

const variants: DividerVariant[] = ['wave', 'zigzag', 'curve', 'mountains'];

export const ListDivider: React.FC<ListDividerProps> = ({ color, variant, index = 0 }) => {
  const encodedColor = encodeURIComponent(color);

  // Use useMemo to keep the variant consistent for this instance
  const actualVariant = useMemo(() => {
    if (variant) return variant;
    // Use index to determine variant, making it consistent for each divider
    return variants[index % variants.length];
  }, [variant, index]);

  const getSVGPath = (variant: DividerVariant) => {
    switch (variant) {
      case 'wave':
        return {
          width: 120,
          height: 4,
          path: 'M0,2 C20,1 20,3 40,2 C60,1 60,3 80,2 C100,1 100,3 120,2',
          strokeWidth: 1.5,
          opacity: 0.9
        };
      case 'zigzag':
        return {
          width: 100,
          height: 6,
          path: 'M0,3 L20,1 L40,5 L60,1 L80,5 L100,3',
          strokeWidth: 1.5,
          opacity: 0.9
        };
      case 'curve':
        return {
          width: 120,
          height: 6,
          path: 'M0,3 C30,1 30,5 60,3 C90,1 90,5 120,3',
          strokeWidth: 1.5,
          opacity: 0.9
        };
      case 'mountains':
        return {
          width: 100,
          height: 8,
          path: 'M0,6 C10,6 15,1 25,6 C35,6 40,2 50,6 C60,6 65,1 75,6 C85,6 90,2 100,6',
          strokeWidth: 1.5,
          opacity: 0.85
        };
    }
  };

  const createSVGUrl = (variant: DividerVariant) => {
    const { width, height, path, strokeWidth, opacity } = getSVGPath(variant);
    return `url("data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${path}' stroke='${encodedColor}' stroke-width='${strokeWidth}' fill='none' stroke-linecap='round' stroke-linejoin='round' opacity='${opacity}'/%3E%3C/svg%3E")`;
  };

  const dividerSVG = createSVGUrl(actualVariant);

  return (
    <div
      className={`list-divider list-divider-${actualVariant}`}
      style={
        {
          "--divider-bg": dividerSVG,
        } as React.CSSProperties
      }
    />
  );
};
