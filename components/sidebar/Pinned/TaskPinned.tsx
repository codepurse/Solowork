import { Query } from "appwrite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import client, {
  DATABASE_ID,
  databases,
  KANBAN_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Space from "../../space";

interface Task {
  $id: string;
  userID: string;
  title: string;
  pinned: boolean;
  kanbanId: string;
}

export default function TaskPinned() {
  const { useStoreUser, useStoreKanban } = useStore();
  const { user } = useStoreUser();
  const { setDrawerInfo, setShowDrawerInfo } = useStoreKanban();
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchKanban = async () => {
      const res = await databases.listDocuments(
        DATABASE_ID,
        KANBAN_COLLECTION_ID,
        [Query.equal("userID", user.$id), Query.equal("pinned", true)]
      );
      console.log(res.documents, "task pinned");
      setTasks(res.documents as unknown as Task[]);
    };

    if (user?.$id) {
      fetchKanban();
    }
  }, [user?.$id]); // Add user dependency

  useEffect(() => {
    if (!user?.$id) return;

    // Subscribe specifically to the kanban collection
    const channelName = `databases.${DATABASE_ID}.collections.${KANBAN_COLLECTION_ID}.documents`;

    const unsubscribe = client.subscribe(channelName, (response) => {
      const { events, payload } = response;

      // Check for any document changes (create, update, delete)
      const isCreate = events.some((event) => event.includes(".create"));
      const isUpdate = events.some((event) => event.includes(".update"));
      const isDelete = events.some((event) => event.includes(".delete"));

      if (isCreate || isUpdate || isDelete) {
        console.log("Kanban collection change detected:", {
          eventType: isCreate ? "create" : isUpdate ? "update" : "delete",
          document: payload,
          events,
        });
      }

      if (isUpdate && (payload as Task).userID === user.$id) {
        const updatedTask = payload as Task;
        setTasks((prevTasks) => {
          const filtered = prevTasks.filter(
            (task) => task.$id !== updatedTask.$id
          );
          return updatedTask.pinned ? [...filtered, updatedTask] : filtered;
        });
      }

      if (isDelete && (payload as Task).userID === user.$id) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.$id !== (payload as Task).$id)
        );
      }

      if (isCreate && (payload as Task).userID === user.$id) {
        if ((payload as Task).pinned) {
          setTasks((prevTasks) => [...prevTasks, payload as Task]);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user?.$id, DATABASE_ID, KANBAN_COLLECTION_ID]);

  return (
    <div className="sidebar-menu-item-container">
      <Space
        direction="column"
        gap={4}
        alignItems="start"
        className="sidebar-menu-item-container-notes"
        style={{ borderLeft: "1px solid #3d3d3d" }}
      >
        {tasks.map((task, index) => (
          <div
            key={task.$id || index}
            className="sidebar-menu-item-container-notes-item"
            onClick={() => {
              console.log(task, "task");
              router.push(`/kanban/${task?.kanbanId}`);
              setDrawerInfo(task);
              setShowDrawerInfo(true);
            }}
          >
            <label className="sidebar-dropdown-item">{task?.title}</label>
          </div>
        ))}
      </Space>
    </div>
  );
}
