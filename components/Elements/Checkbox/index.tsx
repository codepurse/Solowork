interface CheckboxProps {
  label?: string;
  id: string;
  ellipsis?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export default function Checkbox({
  label,
  id,
  ellipsis,
  checked,
  onChange,
  style,
}: Readonly<CheckboxProps>) {
  return (
    <div className="modern-checkbox" style={style}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>
        <span className="checkbox-icon"></span>
        <span className={`checkbox-text ${ellipsis ? "ellipsis" : ""}`}>
          {label}
        </span>
      </label>
    </div>
  );
}
