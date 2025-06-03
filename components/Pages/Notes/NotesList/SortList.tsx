import { Check, X } from "lucide-react";
import { useStore } from "../../../../store/store";
import Space from "../../../space";

type SortListProps = {
  onClose: (e?: React.MouseEvent) => void;
};

export default function SortList({ onClose }: SortListProps) {
  const { useStoreNotes } = useStore();
  const { setSortBy, sortBy } = useStoreNotes();

  const handleSortBy = (sort: string) => {
    setSortBy(sort);
    onClose();
  };

  return (
    <div className="sort-list" onClick={(e) => e.stopPropagation()}>
      <div className="header">
        <Space gap={5} align="evenly">
          <p>Sort by</p>
          <i
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={18} />
          </i>
        </Space>
        <hr className="not-faded-line" style={{ margin: "8px" }} />
      </div>
      <div className="sort-list-items">
        <Space
          align="evenly"
          className="mb-2"
          onClick={() => handleSortBy("newest")}
        >
          <p>Newest</p>
          {sortBy === "newest" && (
            <i>
              <Check size={18} />
            </i>
          )}
        </Space>
        <Space
          align="evenly"
          className="mb-2"
          onClick={() => handleSortBy("oldest")}
        >
          <p>Oldest</p>
          {sortBy === "oldest" && (
            <i>
              <Check size={18} />
            </i>
          )}
        </Space>
        <Space
          align="evenly"
          className="mb-2"
          onClick={() => handleSortBy("a-z")}
        >
          <p>A-Z</p>
          {sortBy === "a-z" && (
            <i>
              <Check size={18} />
            </i>
          )}
        </Space>
        <Space
          align="evenly"
          className="mb-1"
          onClick={() => handleSortBy("z-a")}
        >
          <p>Z-A</p>
          {sortBy === "z-a" && (
            <i>
              <Check size={18} />
            </i>
          )}
        </Space>
      </div>
    </div>
  );
}
