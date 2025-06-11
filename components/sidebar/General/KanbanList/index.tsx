import { Query } from "appwrite";
import { Folders } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import {
  DATABASE_ID,
  databases,
  KANBAN_FOLDER_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Space from "../../../space";

export default function KanbanList() {
  const { useStoreUser, useSidebar, useStoreKanban } = useStore();
  const router = useRouter();
  const { user } = useStoreUser();
  const { setSidebarSelected, sidebarSelected } = useSidebar();
  const { setKanbanList } = useStoreKanban();

  const fetchKanban = async () => {
    const res = await databases.listDocuments(DATABASE_ID, KANBAN_FOLDER_ID, [
      Query.equal("userId", user.$id),
    ]);
    return res.documents;
  };

  const { data } = useSWR("kanban", fetchKanban);

  useEffect(() => {
    if (data) {
      console.log(data, "data");
      setKanbanList(data);
    }
  }, [data]);

  const handleKanbanClick = (kanbanId: string, kanbanName: string) => {
    router.push(`/kanban/${kanbanId}?name=${kanbanName}`);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className="sidebar-menu-item-container"
    >
      <Space
        direction="column"
        gap={4}
        alignItems="start"
        className="sidebar-menu-item-container-notes"
        style={{ borderLeft: "1px solid #3d3d3d" }}
      >
        {data?.map((kanban) => (
          <Space
            gap={10}
            key={kanban.$id}
            className="sidebar-menu-item-container-notes-item"
            fill
            id={kanban.$id === sidebarSelected ? "selectedNote" : ""}
            onClick={() => {
              console.log(kanban, "kanban");
              handleKanbanClick(kanban.$id, kanban.name);
              setSidebarSelected(kanban.$id);
            }}
          >
            <i>
              <Folders size={15} color="#888" />
            </i>
            <label className="sidebar-dropdown-item">{kanban.name}</label>
          </Space>
        ))}
      </Space>
    </div>
  );
}
