import { Trash } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  style?: React.CSSProperties;
  variant?: "delete" | "default";
}

const Loader = () => {
  return (
    <svg className="circular-loader" viewBox="25 25 50 50">
      <circle
        className="loader-path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
      />
    </svg>
  );
};

export default function Button({
  children,
  className,
  onClick,
  loading,
  style,
  variant = "default",
}: Readonly<ButtonProps>) {
  return (
    <button
      className={`button-component ${className} ${
        loading ? "btn-loading" : ""
      } ${variant === "delete" ? "btn-delete" : ""}`}
      onClick={onClick}
      style={style}
    >
      {variant === "delete" && !loading ? (
        <i>
          <Trash size={16} />
        </i>
      ) : (
        ""
      )}
      {loading ? <Loader /> : <div>{children}</div>}
    </button>
  );
}
