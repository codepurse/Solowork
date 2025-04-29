import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useContext } from "react";

// Optional: Create a context to know when dragging is occurring
export const DragContext = React.createContext({ isDragging: false });

export default function TaskCard({ task, isDragOverlay = false }) {
  // Optional: Get dragging state from context
  const { isDragging: isAnyDragging } = useContext(DragContext);

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
      <div className="kanban-task-card-footer">
        <div className="kanban-task-card-tags">
          {task?.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="kanban-task-card-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
