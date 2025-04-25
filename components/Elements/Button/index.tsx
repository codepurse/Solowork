interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  className,
  onClick,
}: Readonly<ButtonProps>) {
  return (
    <button className={`button-component ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
