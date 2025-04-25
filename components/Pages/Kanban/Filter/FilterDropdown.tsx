import Checkbox from "../../../Elements/Checkbox";

export default function FilterDropdown() {
  return (
    <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
      <p className="filter-dropdown-title">Priority</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <Checkbox label="High" id="high" />
        <Checkbox label="Medium" id="medium" />
        <Checkbox label="Low" id="low" />
      </div>
    </div>
  );
}
