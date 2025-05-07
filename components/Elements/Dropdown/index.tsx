import Select from "react-select";

interface DropdownProps {
  options: any[];
  onChange: (value: any) => void;
  value: any;
}

export const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#171031",
    minHeight: 35,
    zIndex: 99,
    color: "#fff",
    borderRadius: "4px",
    fontWeight: "500",
    fontSize: "13px",
    width: "100%",
    textAlign: "left",
    marginTop: "5px",
    marginBottom: "0px",
    outline: "none",
    boxShadow: "none",
    border: state.menuIsOpen
      ? "1px solid #6c63ff !important"
      : "1px solid transparent !important",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 999999,
    background: "#252525",
    color: "#fff",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    padding: "5px",
    outline: "none",
    background: "#2d292f",
    fontSize: "13px",
    color: "#fff",
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: "4px",
    backgroundColor: state.isFocused
      ? "#3a3a3a !important"
      : "#2d292f !important",
    color: "#fff",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
    fontWeight: "300",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#3a3a3a",
    color: "#fff",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#fff",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#fff",
    ":hover": {
      backgroundColor: "#555",
      color: "#fff",
    },
  }),
};

export default function Dropdown({
  options,
  onChange,
  value,
}: Readonly<DropdownProps>) {
  return (
    <Select
      options={options}
      onChange={onChange}
      value={value}
      styles={customStyles}
    />
  );
}
