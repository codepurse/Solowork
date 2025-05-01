import { Search } from "lucide-react";

interface TextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  as?: "search" | "text";
}

export default function Text({
  placeholder,
  value,
  onChange,
  className,
  as,
  ...props
}: Readonly<TextProps>) {
  const style = { paddingLeft: as === "search" ? "30px" : "7px" };
  return (
    <div className="input-container">
      {as === "search" && (
        <i>
          <Search size={15} color="#fff" />
        </i>
      )}
      <input
        placeholder={placeholder}
        type="text"
        className={className + " input-text"}
        {...props}
        style={style}
      />
    </div>
  );
}
