import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import Space from "../../../space";

export default function SortDropdown() {
  return (
    <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
      <p className="filter-dropdown-title">Sort</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div>
          <Space gap={10}>
            <i className="icon">
              <ArrowDownAZ size={15} />
            </i>
            <p className="filter-label">Low to High</p>
          </Space>
        </div>
        <div>
          <Space gap={10}>
            <i className="icon">
              <ArrowUpAZ size={15} />
            </i>
            <p className="filter-label">High to Low</p>
          </Space>
        </div>
      </div>
    </div>
  );
}
