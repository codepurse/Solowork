interface BadgeProps {
  children: React.ReactNode;
  className: string;
}

export default function Badge({ children, className }: Readonly<BadgeProps>) {
  return <div className={`badge ${className}`}>{children}</div>;
}
