interface CheckboxProps {
  label: string;
  id: string;
}
export default function Checkbox({ label, id }: CheckboxProps) {
  return (
    <div className="checkbox-wrapper-4" onClick={(e) => e.stopPropagation()}>
      <input className="inp-cbx" id={id} type="checkbox" />
      <label className="cbx mb-0 pb-0 pt-0" htmlFor={id}>
        <span>
          <svg width="12px" height="10px">
            <use xlinkHref="#check-4"></use>
          </svg>
        </span>
        <span>{label} </span>
      </label>
      <svg className="inline-svg">
        <symbol id="check-4" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
}
