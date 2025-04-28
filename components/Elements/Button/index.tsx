interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
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
}: Readonly<ButtonProps>) {
  return (
    <button
      className={`button-component ${className} ${
        loading ? "btn-loading" : ""
      }`}
      onClick={onClick}
    >
      {loading ? <Loader /> : children}
    </button>
  );
}
