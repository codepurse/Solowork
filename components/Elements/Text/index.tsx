import { Folder, Search } from "lucide-react";

interface TextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  className?: string;
  as?: "search" | "text" | "folder";
  variant?: "sm" | "md" | "lg";
  transparent?: boolean;
}

export default function Text({
  placeholder,
  className,
  as,
  variant,
  transparent,
  ...props
}: Readonly<TextProps>) {
  const style = {
    paddingLeft: as === "search" ? "30px" : "7px",
    fontSize: variant === "sm" ? "12px" : variant === "md" ? "14px" : "16px",
    padding:
      variant === "sm"
        ? "4px 9px"
        : variant === "md"
        ? "7px 12px"
        : "10px 15px",
    backgroundColor: transparent ? "transparent" : "#252525",
  };
  return (
    <div className="input-container">
      {as === "search" && (
        <i>
          <Search size={15} color="#fff" />
        </i>
      )}
      {as === "folder" && (
        <i>
          <Folder size={15} color="#fff" />
        </i>
      )}
      <input
        placeholder={placeholder}
        type="text"
        className={className + " input-type"}
        {...props}
        style={style}
      />
    </div>
  );
}
