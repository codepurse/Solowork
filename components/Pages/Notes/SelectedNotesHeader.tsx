import { ListFilter, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Space from "../../space";

export default function SelectedNotesHeader() {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearch]);

  return (
    <div className="notes-list-header">
      {isSearch ? (
        <Space
          key={2}
          className="search-notes animate__animated animate__slideInDown"
          align="evenly"
        >
          <Space gap={2}>
            <i>
              <Search size={17} color="#888" />
            </i>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search all notes"
              className="search-notes-input"
            />
          </Space>
          <i
            style={{ marginBottom: "-1px" }}
            onClick={() => setIsSearch(false)}
          >
            <X size={20} color="#888" />
          </i>
        </Space>
      ) : (
        <Space
          gap={5}
          align="evenly"
          key={1}
          className="animate__animated animate__slideInDown"
          style={{ animationDuration: "0.2s" }}
        >
          <p className="notes-list-header-title">All Notes</p>
          <div>
            <Space gap={7}>
              <i onClick={() => setIsSearch(true)}>
                <Search size={18} />
              </i>
              <i>
                <ListFilter size={18} />
              </i>
              <i>
                <Plus size={18} />
              </i>
            </Space>
          </div>
        </Space>
      )}
    </div>
  );
}
