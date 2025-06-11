import { ChevronDown, Squircle } from "lucide-react";
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import Space from "../../space";
import KanbanPinned from "./KanbanPinned";
import NotesPinned from "./NotesPinned";
import TaskPinned from "./TaskPinned";
import WhiteboardPinned from "./WhiteboardPinned";

export default function Pinned({ showSidebar }: { showSidebar: boolean }) {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

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
          <div>
            <TaskPinned />
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
        <Collapse in={expandedItems.kanban}>
          <div>
            <KanbanPinned />
          </div>
        </Collapse>
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
          <div>
            <NotesPinned />
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
        <Collapse in={expandedItems.whiteboard}>
          <div>
            <WhiteboardPinned />
          </div>
        </Collapse>
      </div>
    </div>
  );
}
