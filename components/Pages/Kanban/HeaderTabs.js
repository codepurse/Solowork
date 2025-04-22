import {
  ArrowDown01,
  FolderKanban,
  ListFilterPlus,
  SquareKanban,
  Table,
} from "lucide-react";
import Space from "../../space";

export default function HeaderTabs() {
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
            <div className="kanban-board-tab-label">
              <Space gap={10}>
                <i>
                  <FolderKanban size={15} />
                </i>
                <p className="kanban-column-title">Detailed Board</p>
              </Space>
            </div>
            <div className="kanban-board-tab-label">
              <Space gap={10}>
                <i>
                  <Table size={15} />
                </i>
                <p className="kanban-column-title">Table View</p>
              </Space>
            </div>
            <div className="kanban-board-tab-label">
              <Space gap={10}>
                <i>
                  <SquareKanban size={15} />
                </i>
                <p className="kanban-column-title">Overview</p>
              </Space>
            </div>
          </Space>
        </div>
        <div>
          <Space gap={10}>
            <div className="kanban-board-tab-label">
              <Space gap={8}>
                <i>
                  <ListFilterPlus size={15} />
                </i>
                <p className="kanban-column-title">Filter</p>
              </Space>
            </div>
            <div className="kanban-board-tab-label">
              <Space gap={8}>
                <i>
                  <ArrowDown01 size={15} />
                </i>
                <p className="kanban-column-title">Sort</p>
              </Space>
            </div>
          </Space>
        </div>
      </Space>
    </div>
  );
}
