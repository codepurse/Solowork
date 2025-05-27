import { Folder, Search } from "lucide-react";

interface TextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  className?: string;
  as?: "search" | "text" | "folder";
  variant?: "sm" | "md" | "lg";
  transparent?: boolean;
  ref?: React.RefObject<HTMLInputElement>;
}

export default function Text({
  placeholder,
  className,
  as,
  variant,
  transparent,
  ref,
  ...props
}: Readonly<TextProps>) {
  const style = {
    fontSize: variant === "sm" ? "12px" : variant === "md" ? "14px" : "16px",
    padding:
      variant === "sm"
        ? "4px 9px"
        : variant === "md"
        ? "7px 12px"
        : "10px 15px",
    paddingLeft: as === "search" || as === "folder" ? "30px" : "7px",
    backgroundColor: transparent ? "transparent" : "#171031",
  };

  const sizeIcon = () => {
    if (variant === "sm") {
      return 12;
    } else if (variant === "md") {
      return 14;
    } else if (variant === "lg") {
      return 16;
    }
  };

  const positionIcon = () => {
    if (variant === "sm") {
      return { top: "50%" };
    } else if (variant === "md") {
      return { top: "45%" };
    } else if (variant === "lg") {
      return { top: "50%" };
    }
  };
  return (
    <div className="input-container">
      {as === "search" && (
        <i style={{ ...positionIcon(), position: "absolute" }}>
          <Search size={sizeIcon()} color="#fff" />
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
        ref={ref}
      />
    </div>
  );
}
