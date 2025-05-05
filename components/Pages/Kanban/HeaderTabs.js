import { useRouter } from "next/router";
import { memo, useState } from "react";
import { ACTIONS, TABS } from "../../../constant";
import { useStore } from "../../../store/store";
import Space from "../../space";
import FilterDropdown from "./Filter/FilterDropdown";
import SortDropdown from "./Filter/SortDropdown";
import AddTaskModal from "./Modal/AddTask";

const Tab = memo(({ id, label, Icon, isSelected, onClick }) => (
  <div
    className={`kanban-board-tab-label ${
      isSelected ? "kanban-board-tab-label-active" : ""
    }`}
    onClick={() => onClick(id)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onClick(id);
      }
    }}
  >
    <Space gap={10}>
      <i>
        <Icon size={15} color={isSelected ? "#7c4dff" : "#888"} />
      </i>
      <p
        className="kanban-column-title"
        style={{ color: isSelected ? "#7c4dff" : "#888" }}
      >
        {label}
      </p>
    </Space>
  </div>
));

const ActionButton = memo(({ label, Icon, onClick, showFilterDropdown }) => (
  <div className="kanban-board-tab-label" onClick={onClick}>
    <Space gap={8}>
      <i>
        <Icon size={15} />
      </i>
      <p className="kanban-column-title">{label}</p>
    </Space>
    {showFilterDropdown && label === "Filter" && <FilterDropdown />}
    {showFilterDropdown && label === "Sort" && <SortDropdown />}
  </div>
));

function HeaderTabs() {
  const { useStoreKanban } = useStore();
  const { selectedKanban, setSelectedKanban } = useStoreKanban();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const router = useRouter();
  const { name } = router.query;
  const handleKanbanChange = (kanbanId) => {
    setSelectedKanban(kanbanId);
  };

  const handleActionClick = (label) => {
    if (label === "Filter") {
      setShowFilterDropdown(!showFilterDropdown);
      setShowSortDropdown(false);
    } else if (label === "Sort") {
      setShowSortDropdown(!showSortDropdown);
      setShowFilterDropdown(false);
    }
  };

  return (
    <div className="kanban-board">
      <Space align="evenly">
        <p className="kanban-board-title">{name}</p>
        <button
          className="add-task-button"
          onClick={() => setShowAddTaskModal(true)}
        >
          <span>Add Task</span>
        </button>
      </Space>
      <Space align="evenly">
        <div>
          <Space gap={18}>
            {TABS.map(({ id, label, Icon }) => (
              <Tab
                key={id}
                id={id}
                label={label}
                Icon={Icon}
                isSelected={selectedKanban === id}
                onClick={handleKanbanChange}
              />
            ))}
          </Space>
        </div>
        <div>
          <Space gap={10}>
            {ACTIONS.map(({ label, Icon }) => (
              <ActionButton
                key={label}
                label={label}
                Icon={Icon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(label);
                }}
                showFilterDropdown={
                  label === "Filter" ? showFilterDropdown : showSortDropdown
                }
              />
            ))}
          </Space>
        </div>
      </Space>
      <AddTaskModal
        show={showAddTaskModal}
        onHide={() => setShowAddTaskModal(false)}
      />
    </div>
  );
}

export default memo(HeaderTabs);
