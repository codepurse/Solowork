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
    border: "none",
    boxShadow: "none",
  }),
  menuPortal: (base, state) => ({
    ...base,
    zIndex: 999999,
    background: "#252525",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    padding: "5px 10px",
    outline: "none",
    background: "#2d292f",
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
