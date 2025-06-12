// components/ListDivider.tsx
import React from "react";

export const ListDivider: React.FC<{ color: string }> = ({ color }) => {
  const encodedColor = encodeURIComponent(color);

  const beforeSVG = `url("data:image/svg+xml,%3Csvg width='100' height='3' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,1.5 Q5,0.5 10,1.5 T20,1.5 T30,1.5 T40,1.5 T50,1.5 T60,1.5 T70,1.5 T80,1.5 T90,1.5 T100,1.5' stroke='${encodedColor}' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' opacity='1'/%3E%3C/svg%3E")`;

  const afterSVG = `url("data:image/svg+xml,%3Csvg width='120' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,1 Q3,0.3 6,1 T12,1 Q15,1.7 18,1 T24,1 Q27,0.3 30,1 T36,1 Q39,1.7 42,1 T48,1 Q51,0.3 54,1 T60,1 Q63,1.7 66,1 T72,1 Q75,0.3 78,1 T84,1 Q87,1.7 90,1 T96,1 Q99,0.3 102,1 T108,1 Q111,1.7 114,1 T120,1' stroke='${encodedColor}' stroke-width='1.5' fill='none' stroke-linecap='round' opacity='0.8'/%3E%3C/svg%3E")`;

  return (
    <div
      className="list-divider"
      style={
        {
          "--before-bg": beforeSVG,
          "--after-bg": afterSVG,
        } as React.CSSProperties
      }
    />
  );
};
