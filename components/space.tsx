import React, { Fragment, useMemo } from "react";

type Direction = "row" | "column";
type Align =
  | "end"
  | "center"
  | "start"
  | "between"
  | "evenly"
  | "space-around"
  | "space-between";

type SpaceProps = {
  direction?: Direction;
  gap?: number;
  align?: Align;
  fill?: boolean;
  alignItems?: string;
  overlap?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
};

const spaceAlign = (value: Align) => {
  switch (value) {
    case "end":
      return "flex-end";
    case "start":
      return "flex-start";
    case "center":
      return "center";
    case "between":
      return "center";
    case "evenly":
      return "space-between";
    case "space-around":
      return "space-around";
    default:
      return "flex-start";
  }
};

export default function Space({
  direction,
  gap = 0,
  align = "start",
  fill = false,
  alignItems,
  children,
  style,
  className,
  overlap,
  ...props
}: Readonly<SpaceProps>) {
  const propsStyle: React.CSSProperties = useMemo(
    () => ({
      flexDirection: direction,
      justifyContent: spaceAlign(align),
      display: "flex",
      gap: `${gap}px`,
      width: fill ? "100%" : "",
      alignItems: alignItems || "center",
      position: "relative",
      ...style,
    }),
    [direction, align, gap, fill, alignItems]
  );

  const overlapStyle: React.CSSProperties = useMemo(
    () => ({
      marginRight: overlap ? `-8px` : `0px`,
    }),
    [overlap]
  );

  return (
    <div style={propsStyle} {...props} className={`${className}`}>
      {React.Children.map(children, (child: React.ReactNode) => (
        <Fragment>
          {overlap ? <div style={overlapStyle}>{child}</div> : child}
        </Fragment>
      ))}
    </div>
  );
}
