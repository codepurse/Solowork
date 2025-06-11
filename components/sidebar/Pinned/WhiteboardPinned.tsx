import { Query } from "appwrite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import client, {
  DATABASE_ID,
  databases,
  WHITEBOARD_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Space from "../../space";

export default function WhiteboardPinned() {
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();
  const [whiteboards, setWhiteboards] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchKanban = async () => {
      const res = await databases.listDocuments(
        DATABASE_ID,
        WHITEBOARD_COLLECTION_ID,
        [Query.equal("userId", user.$id), Query.equal("pinned", true)]
      );
      console.log(res.documents, "task pinned");
      setWhiteboards(res.documents);
    };
    fetchKanban();
  }, []);
  useEffect(() => {
    if (!user?.$id) return;

    // Subscribe specifically to the kanban collection
    const channelName = `databases.${DATABASE_ID}.collections.${WHITEBOARD_COLLECTION_ID}.documents`;

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

      if (isUpdate && (payload as any).userId === user.$id) {
        const updatedTask = payload as any;
        setWhiteboards((prevTasks) => {
          const filtered = prevTasks.filter(
            (task) => task.$id !== updatedTask.$id
          );
          return updatedTask.pinned ? [...filtered, updatedTask] : filtered;
        });
      }

      if (isDelete && (payload as any).userId === user.$id) {
        setWhiteboards((prevTasks) =>
          prevTasks.filter((task) => task.$id !== (payload as any).$id)
        );
      }

      if (isCreate && (payload as any).userId === user.$id) {
        if ((payload as any).pinned) {
          setWhiteboards((prevTasks) => [...prevTasks, payload as any]);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user?.$id, DATABASE_ID, WHITEBOARD_COLLECTION_ID]);

  const handleClick = (whiteboard: any) => {
    router.push(`/whiteboard/${whiteboard?.$id}`);
  };

  return (
    <div className="sidebar-menu-item-container">
      <Space
        direction="column"
        gap={4}
        alignItems="start"
        className="sidebar-menu-item-container-notes"
        style={{ borderLeft: "1px solid #3d3d3d" }}
      >
        {whiteboards.map((whiteboard, index) => (
          <div
            onClick={() => handleClick(whiteboard)}
            key={index}
            className="sidebar-menu-item-container-notes-item"
          >
            <label className="sidebar-dropdown-item">{whiteboard?.name}</label>
          </div>
        ))}
      </Space>
    </div>
  );
}
