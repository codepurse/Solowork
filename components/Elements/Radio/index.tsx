import React from "react";

interface RadioProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  disabled?: boolean;
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className={`radio-wrapper ${disabled ? "disabled" : ""}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="radio-input"
      />
      <label htmlFor={id} className="radio-label">
        <span className="radio-circle"></span>
        <span className="radio-text">{label}</span>
      </label>
    </div>
  );
};

export default Radio;
