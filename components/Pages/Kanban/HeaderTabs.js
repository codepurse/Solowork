import { ChartBar, Kanban, Pin, Table } from "lucide-react";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import {
  DATABASE_ID,
  databases,
  KANBAN_FOLDER_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import { Tabs } from "../../Elements/Tab/Tab";
import Space from "../../space";
import AddTaskModal from "./Modal/AddTask";

function HeaderTabs({ kanbanId, kanbanDetails }) {
  const { useStoreKanban } = useStore();
  const { setSelectedKanban } = useStoreKanban();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");
  const router = useRouter();
  const { name } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(kanbanDetails?.pinned);

  const tabs = [
    { id: "kanban", label: "Kanban", icon: <Kanban size={15} /> },
    { id: "table", label: "Table", icon: <Table size={15} /> },
    { id: "gantt", label: "Gantt", icon: <ChartBar size={15} /> },
  ];

  useEffect(() => {
    setIsPinned(kanbanDetails?.pinned);
  }, [kanbanDetails]);

  const handlePinKanban = async (e) => {
    setIsPinned(!e);
    setIsLoading(true);
    console.log(kanbanId, "kanbanId");
    if (!isLoading) {
      try {
        const response = await databases.updateDocument(
          DATABASE_ID,
          KANBAN_FOLDER_ID,
          kanbanId,
          {
            pinned: !e,
          }
        );
        console.log(response, "response");
      } catch (error) {
        console.error("Failed to pin kanban", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="kanban-board">
      <div className="kanban-board-header">
        <Space align="evenly">
          <Space gap={10}>
            <p className="kanban-board-title mb-0">{name}</p>
            <i>
              <Pin
                size={18}
                onClick={() => handlePinKanban(isPinned)}
                color={isPinned ? "gold" : "gray"}
              />
            </i>
          </Space>
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
