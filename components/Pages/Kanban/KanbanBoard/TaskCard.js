import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useContext, useEffect, useState } from "react";
import {
  storage,
  TASKS_ATTACHMENTS_BUCKET_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Checkbox from "../../../Elements/Checkbox";
import Space from "../../../space";
// Optional: Create a context to know when dragging is occurring
export const DragContext = React.createContext({ isDragging: false });

export default function TaskCard({ task, isDragOverlay = false }) {
  // Optional: Get dragging state from context
  const { isDragging: isAnyDragging } = useContext(DragContext);
  const { useStoreKanban } = useStore();
  const { setShowDrawerInfo, setDrawerInfo } = useStoreKanban();
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    if (task?.checklist) {
      setChecklist(JSON.parse(task?.checklist));
    }
  }, [task?.checklist]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.$id,
    data: {
      type: "task",
      task,
    },
    disabled: isDragOverlay,
  });

  useEffect(() => {
    console.log(checklist);
  }, [checklist]);

  // Card styles
  const cardStyle = {
    cursor: isDragOverlay ? "grabbing" : "grab",
    // Apply transform and transition only when not in overlay
    ...(isDragOverlay
      ? {
          boxShadow: "0 5px 10px rgba(0, 0, 0, 0.15)",
          width: "100%",
          maxWidth: "300px",
        }
      : {
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }),
    // This is the critical part - make the card "transparent" to pointer events
    // when ANY card is being dragged (except this one)
    pointerEvents:
      isAnyDragging && !isDragging && !isDragOverlay ? "none" : "auto",
    position: "relative",
    zIndex: isDragging ? 1 : 0,
  };

  const titleStyle = {
    margin: "0 0 8px 0",
    fontSize: "16px",
  };

  const descriptionStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#666",
  };
  const tagsClass = ["violet-tag", "blue-tag", "pink-tag", "orange-tag"];

  // When used in drag overlay, don't use ref or sortable attributes
  if (isDragOverlay) {
    return (
      <div style={cardStyle}>
        <h3 style={titleStyle}>{task.title}</h3>
        <p style={descriptionStyle}>{task.description}</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ff4d4d";
      case "Medium":
        return "#ffa64d";
      case "Low":
        return "#4dff4d";
      default:
        return "#ff0000";
    }
  };

  // Regular sortable card
  return (
    <div
      className="kanban-task-card"
      ref={setNodeRef}
      style={cardStyle}
      {...attributes}
      {...listeners}
      onClick={() => {
        setShowDrawerInfo(true);
        setDrawerInfo(task);
      }}
    >
      <div className="kanban-task-card-header">
        <p className="kanban-task-card-id">TASK-101</p>
        <p
          className="kanban-task-card-priority"
          style={{ color: getPriorityColor(task?.priority) }}
        >
          {task.priority}
        </p>
      </div>
      <p className="kanban-task-card-title">{task.title}</p>
      <p className="kanban-task-card-description">{task.description}</p>
      <div
        className="kanban-task-attachments-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(
            task?.fileId.length || 1,
            4
          )}, 1fr)`,
          gap: "8px",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {task?.fileId.map((id, index) => (
          <div className="kanban-task-card-attachment" key={index}>
            <img
              src={storage.getFileView(TASKS_ATTACHMENTS_BUCKET_ID, id)}
              alt="task-attachment"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
      </div>
      {task.fileId.length === 0 && (
        <div style={{ marginLeft: "-7px", pointerEvents: "none" }}>
          {checklist?.map((item, index) => (
            <div key={index} style={{ marginTop: "2px", marginBottom: "2px" }}>
              <Checkbox
                checked={item.completed}
                onChange={(e) => {}}
                label={item.name}
                ellipsis={true}
              />
            </div>
          ))}
        </div>
      )}
      {checklist?.length > 0 && (
        <div className="kanban-task-card-checklist mb-2">
          <Space gap={10} align="evenly">
            <p className="kanban-task-card-checklist-title">Checklist</p>
            <p className="kanban-task-card-checklist-count">
              {`${checklist.filter((item) => item.completed).length}/${
                checklist?.length
              }`}
            </p>
          </Space>
          <div className="kanban-progress-container mt-2">
            {checklist?.length > 0 && (
              <div className="kanban-progress-bar-container">
                <div
                  className="kanban-progress-bar-fill"
                  style={{
                    width: `${
                      (checklist.filter((item) => item.completed).length /
                        checklist.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="kanban-task-card-footer">
        <div className="kanban-task-card-tags">
          {task?.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className={`kanban-task-card-tag ${
                tagsClass[Math.floor(Math.random() * tagsClass.length)]
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
