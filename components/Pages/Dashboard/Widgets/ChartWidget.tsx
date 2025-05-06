import React from "react";

interface ChartWidgetProps {
  label: string;
  subLabel?: string;
  children: React.ReactNode;
}

export default function ChartWidget({
  label,
  subLabel,
  children,
}: ChartWidgetProps) {
  return <div>{children}</div>;
}
