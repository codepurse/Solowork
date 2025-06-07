import classNames from "classnames";
import React from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: "x-small" | "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  size = "medium",
  disabled = false,
  className,
}) => {
  return (
    <div
      className={classNames("switch-wrapper", className)}
      onClick={() => !disabled && onChange(!checked)}
    >
      <div
        className={classNames("switch-component", {
          "switch-checked": checked,
          "switch-disabled": disabled,
          [`switch-${size}`]: size,
        })}
      >
        <div className="switch-toggle" />
      </div>
      {label && (
        <span
          className={classNames("switch-label", {
            "switch-label-disabled": disabled,
          })}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Switch;
