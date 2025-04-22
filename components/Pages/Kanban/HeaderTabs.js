import { memo } from "react";
import { ACTIONS, TABS } from "../../../constant";
import { useStore } from "../../../store/store";
import Space from "../../space";

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

const ActionButton = memo(({ label, Icon }) => (
  <div className="kanban-board-tab-label">
    <Space gap={8}>
      <i>
        <Icon size={15} />
      </i>
      <p className="kanban-column-title">{label}</p>
    </Space>
  </div>
));

function HeaderTabs() {
  const { useStoreKanban } = useStore();
  const { selectedKanban, setSelectedKanban } = useStoreKanban();

  const handleKanbanChange = (kanbanId) => {
    setSelectedKanban(kanbanId);
  };

  return (
    <div className="kanban-board">
      <Space align="evenly">
        <p className="kanban-board-title">Dashboard Page</p>
        <button className="add-task-button">
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
              <ActionButton key={label} label={label} Icon={Icon} />
            ))}
          </Space>
        </div>
      </Space>
    </div>
  );
}

export default memo(HeaderTabs);
