import Select from "react-select";

interface DropdownProps {
  options: any[];
  onChange: (value: any) => void;
  value: any;
}

export const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#252525",
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
      : "1px solid transparent !important", // change border color when open
  }),
  menuPortal: (base, state) => ({
    ...base,
    zIndex: 999999,
    background: "#252525",
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
      ? "#3a3a3a !important" // hover color
      : "#2d292f !important", // default option background
    color: "#fff",
    cursor: "pointer",
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
