import { ChevronDown, Squircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import {
  DATABASE_ID,
  databases,
  PINNED_COLLECTION_ID,
} from "../../../constant/appwrite";
import Space from "../../space";

export default function Pinned({ showSidebar }: { showSidebar: boolean }) {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const [tasks, setTasks] = useState<any[]>([]);
  const [kanban, setKanban] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [whiteboard, setWhiteboard] = useState<any[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  useEffect(() => {
    console.log(expandedItems);
  }, [expandedItems]);

  useEffect(() => {
    const fetchPinnedItems = async () => {
      const pinnedItems = await databases.listDocuments(
        DATABASE_ID,
        PINNED_COLLECTION_ID
      );
      console.log(pinnedItems, "pinnedItems");
      setTasks(
        pinnedItems.documents.filter((item: any) => item.type === "task")
      );
      setKanban(
        pinnedItems.documents.filter((item: any) => item.type === "kanban")
      );
      setNotes(
        pinnedItems.documents.filter((item: any) => item.type === "note")
      );
      setWhiteboard(
        pinnedItems.documents.filter((item: any) => item.type === "whiteboard")
      );
    };
    fetchPinnedItems();
  }, []);

  return (
    <div className="sidebar-menu mt-2">
      {showSidebar && <label className="sidebar-menu-title">Pinned</label>}
      <div className="sidebar-menu-container">
        <div
          className="sidebar-menu-item"
          onClick={() => toggleExpanded("tasks")}
        >
          <Space gap={10} align="evenly">
            <Space gap={10}>
              <i>
                <Squircle size={15} color="#1976D2" />
              </i>
              <label className="sidebar-menu-item-name animate__animated animate__slideInLeft">
                Tasks
              </label>
            </Space>
            <div className="chevron-container">
              <ChevronDown
                size={17}
                className={`chevron ${expandedItems.tasks ? "rotated" : ""}`}
              />
            </div>
          </Space>
        </div>
        <Collapse in={expandedItems.tasks}>
          <div className="sidebar-menu-item-container">
            <Space
              direction="column"
              gap={4}
              alignItems="start"
              className="sidebar-menu-item-container-notes"
              style={{ borderLeft: "1px solid #3d3d3d" }}
            >
              {expandedItems.tasks && (
                <Space
                  gap={10}
                  className="sidebar-menu-item-container-notes-item"
                >
                  {tasks.map((task) => (
                    <label className="sidebar-dropdown-item" key={task.$id}>
                      {task?.name}
                    </label>
                  ))}
                </Space>
              )}
            </Space>
          </div>
        </Collapse>
        <div
          className="sidebar-menu-item"
          style={{ marginTop: "-7px" }}
          onClick={() => toggleExpanded("kanban")}
        >
          <Space gap={10} align="evenly">
            <Space gap={10}>
              <i>
                <Squircle size={15} color="#FBC02D" />
              </i>
              <label className="sidebar-menu-item-name animate__animated animate__slideInLeft">
                Kanban
              </label>
            </Space>
            <div className="chevron-container">
              <ChevronDown
                size={17}
                className={`chevron ${expandedItems.kanban ? "rotated" : ""}`}
              />
            </div>
          </Space>
        </div>
        <div
          className="sidebar-menu-item"
          style={{ marginTop: "-7px" }}
          onClick={() => toggleExpanded("notes")}
        >
          <Space gap={10} align="evenly">
            <Space gap={10}>
              <i>
                <Squircle size={15} color="#388E3C" />
              </i>
              <label
                style={{ marginTop: "2px" }}
                className="sidebar-menu-item-name animate__animated animate__slideInLeft"
              >
                Notes
              </label>
            </Space>
            <div className="chevron-container">
              <ChevronDown
                size={17}
                className={`chevron ${expandedItems.notes ? "rotated" : ""}`}
              />
            </div>
          </Space>
        </div>
        <Collapse in={expandedItems.notes}>
          <div className="sidebar-menu-item-container">
            <Space
              direction="column"
              gap={4}
              alignItems="start"
              className="sidebar-menu-item-container-notes"
              style={{ borderLeft: "1px solid #3d3d3d" }}
            >
              {expandedItems.notes && (
                <Space
                  gap={10}
                  className="sidebar-menu-item-container-notes-item"
                >
                  {notes.map((note) => (
                    <label className="sidebar-dropdown-item" key={note.$id}>
                      {note?.name}
                    </label>
                  ))}
                </Space>
              )}
            </Space>
          </div>
        </Collapse>
        <div
          className="sidebar-menu-item"
          style={{ marginTop: "-7px" }}
          onClick={() => toggleExpanded("whiteboard")}
        >
          <Space gap={10} align="evenly">
            <Space gap={10}>
              <i>
                <Squircle size={15} color="#512DA8" />
              </i>
              <label
                style={{ marginTop: "2px" }}
                className="sidebar-menu-item-name animate__animated animate__slideInLeft"
              >
                Whiteboard
              </label>
            </Space>
            <div className="chevron-container">
              <ChevronDown
                size={17}
                className={`chevron ${
                  expandedItems.whiteboard ? "rotated" : ""
                }`}
              />
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
}
