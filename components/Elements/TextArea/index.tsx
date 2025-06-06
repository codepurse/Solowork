interface TextProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  className?: string;
  as?: "search" | "text" | "folder";
  variant?: "sm" | "md" | "lg";
  transparent?: boolean;
  style?: React.CSSProperties;
}

export default function TextArea({
  placeholder,
  className,
  as,
  variant = "md",
  transparent,
  style,
  ...props
}: Readonly<TextProps>) {
  const styles = {
    backgroundColor: transparent ? "transparent" : "#171031",
    ...style,
  };

  return (
    <div className="input-container">
      <textarea
        placeholder={placeholder}
        className={className + " input-type"}
        {...props}
        style={styles}
      />
    </div>
  );
}
