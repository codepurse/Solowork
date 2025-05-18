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
    <div
      className="checkbox-wrapper-4"
      onClick={(e) => e.stopPropagation()}
      style={style}
    >
      <input
        className="inp-cbx"
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className="cbx mb-0 pb-0 pt-0" htmlFor={id}>
        <span>
          <svg width="12px" height="10px">
            <use xlinkHref="#check-4"></use>
          </svg>
        </span>
        <span className={ellipsis ? "ellipsis" : ""}>{label} </span>
      </label>
      <svg className="inline-svg">
        <symbol id="check-4" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
}
