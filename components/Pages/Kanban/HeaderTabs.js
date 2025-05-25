import { ChartBar, Kanban, Table } from "lucide-react";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { useStore } from "../../../store/store";
import { Tabs } from "../../Elements/Tab/Tab";
import Space from "../../space";
import AddTaskModal from "./Modal/AddTask";

function HeaderTabs() {
  const { useStoreKanban } = useStore();
  const { selectedKanban, setSelectedKanban } = useStoreKanban();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");
  const router = useRouter();
  const { name } = router.query;
  const handleKanbanChange = (kanbanId) => {
    setSelectedKanban(kanbanId);
  };

  const tabs = [
    { id: "kanban", label: "Kanban", icon: <Kanban size={15} /> },
    { id: "table", label: "Table", icon: <Table size={15} /> },
    { id: "gantt", label: "Gantt", icon: <ChartBar size={15} /> },
  ];

  return (
    <div className="kanban-board">
      <div className="kanban-board-header">
        <Space align="evenly">
          <p className="kanban-board-title mb-0">{name}</p>
          <button
            className="add-task-button"
            onClick={() => setShowAddTaskModal(true)}
          >
            <span>Add Task</span>
          </button>
        </Space>
      </div>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(e) => {
          setActiveTab(e);
          setSelectedKanban(e);
        }}
      />
      <AddTaskModal
        show={showAddTaskModal}
        onHide={() => setShowAddTaskModal(false)}
      />
    </div>
  );
}

export default memo(HeaderTabs);
