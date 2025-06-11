import {
  ClipboardList,
  Image,
  Pencil,
  Pin,
  Timer,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  KANBAN_COLLECTION_ID,
  storage,
  TASKS_ATTACHMENTS_BUCKET_ID
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import {
  getColor,
  getColorPriority,
  tagsClass,
} from "../../../../utils/CommonFunc";
import Badge from "../../../Elements/Badge";
import Space from "../../../space";
import AddTask from "../Modal/AddTask";

export default function DrawerInfo() {
  const { useStoreKanban } = useStore();
  const { drawerInfo, setShowDrawerInfo } = useStoreKanban();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [fileMetaList, setFileMetaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  

  useEffect(() => {
    if (drawerInfo?.checklist) {
      setChecklist(JSON.parse(drawerInfo?.checklist));
    }
  }, [drawerInfo]);

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };

  const handleCloseDrawer = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDrawerInfo(false);
  };

  useEffect(() => {
    if (!drawerInfo?.fileId || drawerInfo.fileId.length === 0) {
      setFileMetaList([]);
      return;
    }

    const fetchFiles = async () => {
      try {
        const files = await Promise.all(
          drawerInfo.fileId.map((id) =>
            storage.getFile(TASKS_ATTACHMENTS_BUCKET_ID, id)
          )
        );
        setFileMetaList(files);
      } catch (err) {
        console.error("Error fetching file metadata", err);
        setFileMetaList([]); // fallback
      }
    };

    fetchFiles();
  }, [drawerInfo?.fileId]);

  const Loader = () => {
    return (
      <svg className="circular-loader" viewBox="25 25 50 50">
        <circle
          className="loader-path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
        />
      </svg>
    );
  };

  const handleDeleteTask = async () => {
    setLoading(true);
    if (!loading) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          KANBAN_COLLECTION_ID,
          drawerInfo?.$id
        );
        mutate(["kanban_tasks", drawerInfo?.kanbanId]);
        setShowDrawerInfo(false);
        setShowModal(false);
      } catch (err) {
        console.error("Error deleting task", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePinTask = async () => {
    // Prevent multiple API calls
    if (isPinning) return;
    
    setIsPinning(true);
    const newPinnedState = !pinned;
    
    try {
      // Optimistic update for better UX
      setPinned(newPinnedState);
      
      await databases.updateDocument(
        DATABASE_ID,
        KANBAN_COLLECTION_ID,
        drawerInfo?.$id,
        {
          pinned: newPinnedState,
        }
      );
      
      // Optionally refresh the kanban data
      mutate(["kanban_tasks", drawerInfo?.kanbanId]);
      console.log("Task pinned successfully");
    } catch (err) {
      // Revert optimistic update on error
      setPinned(!newPinnedState);
      console.error("Error pinning task", err);
    } finally {
      setIsPinning(false);
    }
  };

  useEffect(() => {
    setPinned(drawerInfo?.pinned);
  }, [drawerInfo]);

  return (
    <div className="drawer-info animate__animated animate__slideInRight">
      <div className="drawer-controls">
        <Space gap={10} align="end">
          <i onClick={() => setShowModal(true)}>
            <Trash size={15} />
          </i>
          <i 
            onClick={handlePinTask}
            style={{ 
              cursor: isPinning ? 'not-allowed' : 'pointer',
              color: pinned ? '#ffd700' : '#888'
            }}
          >
            <Pin size={15} />
          </i>
          <i>
            <Timer size={15} />
          </i>
          <i onClick={() => setShowAddTaskModal(true)}>
            <Pencil size={15} />
          </i>
          <i onClick={handleCloseDrawer}>
            <X size={18} />
          </i>
        </Space>
      </div>
      <div className="drawer-info-content">
        <p className="task-title">{drawerInfo?.title}</p>
        <div className="task-details">
          <Space gap={10} className="task-details-row">
            <div style={{ minWidth: "85px" }}>
              <p className="task-details-label">Status</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge className={getColor(drawerInfo?.status)}>
                {drawerInfo?.status}
              </Badge>
            </div>
          </Space>
          <Space gap={10} className="task-details-row">
            <div style={{ minWidth: "85px" }}>
              <p className="task-details-label">Due Date</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <p className="task-details-value">{drawerInfo?.dueDate}</p>
            </div>
          </Space>
          <Space gap={10} className="task-details-row">
            <div style={{ minWidth: "85px" }}>
              <p className="task-details-label">Priority</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge className={getColorPriority(drawerInfo?.priority)}>
                {drawerInfo?.priority}
              </Badge>
            </div>
          </Space>
          <Space gap={10} className="task-details-row">
            <div style={{ minWidth: "85px" }}>
              <p className="task-details-label">Tags</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {drawerInfo?.tags.length === 0 ? (
                <p className="task-details-value">-</p>
              ) : (
                drawerInfo?.tags.map((tag) => (
                  <p
                    key={tag}
                    style={{ padding: "1px 5px", borderRadius: "5px" }}
                    className={`${
                      tagsClass[Math.floor(Math.random() * tagsClass.length)]
                    } task-details-value`}
                  >
                    {tag}
                  </p>
                ))
              )}
            </div>
          </Space>
          <div>
            <p className="task-details-label">Description</p>
            <p className="task-details-label-content">
              {drawerInfo?.description}
            </p>
          </div>
          <div className="mt-2">
            <p className="task-details-label">
              Attachments ( {fileMetaList.length} )
            </p>
            {fileMetaList.length === 0 ? (
              <p className="task-details-value">-</p>
            ) : (
              fileMetaList.map((file) => (
                <div className="task-details-attachment" key={file.$id}>
                  <Space gap={10}>
                    <i className="task-details-attachment-icon">
                      <Image size={20} />
                    </i>
                    <div>
                      <p
                        className="task-details-attachment-name"
                        key={file.$id}
                      >
                        {file.name}
                      </p>
                      <p className="task-details-attachment-size">
                        {(file.sizeOriginal / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </Space>
                </div>
              ))
            )}
          </div>
          <div className="task-details-tabs">
            <Space gap={15}>
              <p
                className="task-details-tab mb-0"
                id={activeTab === 1 ? "active" : ""}
                onClick={() => handleTabClick(1)}
              >
                Task
              </p>
              <p
                className="task-details-tab mb-0"
                id={activeTab === 2 ? "active" : ""}
                onClick={() => handleTabClick(2)}
              >
                Comments
              </p>
            </Space>
            <hr className="not-faded-line m-0" />
          </div>
          {activeTab === 1 && (
            <div className="add-task-modal-checklist-container mt-2">
              <Space gap={10}>
                <ClipboardList size={15} color="#fff" />
                <p className="add-task-modal-checklist-title">Sub Tasks</p>
              </Space>
              <div className="checklist-progress-container mt-2">
                <div
                  className="checklist-progress-bar-fill"
                  style={{
                    width: `${
                      checklist.length > 0
                        ? (checklist.filter((item) => item.completed).length /
                            checklist.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <hr
                className="not-faded-line"
                style={{ margin: "10px 0px", background: "#252525" }}
              />
              {checklist.map((checklist, index) => {
                return (
                  <Space key={index} align="evenly" gap={10}>
                    <div className="modern-checkbox mb-2" key={index}>
                      <input
                        type="checkbox"
                        id={`${checklist}-${index}`}
                        checked={checklist.completed}
                      />
                      <label htmlFor={`${checklist}-${index}`}>
                        <span className="checkbox-icon"></span>
                        <span className="checkbox-text">{checklist.name}</span>
                      </label>
                    </div>
                  </Space>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Modal
        className="modal-container"
        show={showModal}
        centered
        size="sm"
        onHide={() => setShowModal(false)}
      >
        <Space align="evenly">
          <p className="modal-title">Delete task</p>
          <i className="modal-close-icon" onClick={() => setShowModal(false)}>
            <X size={17} />
          </i>
        </Space>
        <hr
          className="not-faded-line"
          style={{ margin: "5px 0px", background: "#252525" }}
        />
        <p className="modal-description">
          Are you sure you want to delete this task? This action is irreversible
          and cannot be undone.
        </p>
        <button
          className="btn-delete mt-3"
          onClick={handleDeleteTask}
          style={{
            width: "100%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            background: "#ff5252",
          }}
        >
          {loading ? (
            <Loader />
          ) : (
            <Space gap={5}>
              <i style={{ marginTop: "-3px" }}>
                <Trash size={16} />
              </i>
              <span>Delete task</span>
            </Space>
          )}
        </button>
      </Modal>
      {showAddTaskModal && (
        <AddTask
          show={showAddTaskModal}
          onHide={() => setShowAddTaskModal(false)}
          data={drawerInfo}
        />
      )}
    </div>
  );
}
