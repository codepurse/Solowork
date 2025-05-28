interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  key?: string;
  index?: number;
  randomColor?: boolean;
}

const colorClassNames = [
  "badge-red",
  "badge-green",
  "badge-blue",
  "badge-yellow",
  "badge-purple",
];

export default function Badge({
  children,
  className,
  key,
  index = 0,
  randomColor = false,
}: Readonly<BadgeProps>) {
  // Get color based on index, wrapping around if index exceeds array length
  const getColor = () => {
    return colorClassNames[index % colorClassNames.length];
  };

  return (
    <div
      className={`badge ${className} ${
        randomColor ? getColor() : ""
      }`}
      key={key}
    >
      {children}
    </div>
  );
}
