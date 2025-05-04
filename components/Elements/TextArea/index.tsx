interface TextProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  className?: string;
  as?: "search" | "text" | "folder";
  variant?: "sm" | "md" | "lg";
  transparent?: boolean;
}

export default function TextArea({
  placeholder,
  className,
  as,
  variant = "md",
  transparent,
  ...props
}: Readonly<TextProps>) {
  const style = {
    backgroundColor: transparent ? "transparent" : "#252525",
  };
  
  return (
    <div className="input-container">
      <textarea
        placeholder={placeholder}
        className={className + " input-type"}
        {...props}
        style={style}
      />
    </div>
  );
}
