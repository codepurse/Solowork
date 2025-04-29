import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Ellipsis } from "lucide-react";
import { useMemo, useState } from "react";
import Space from "../../../../components/space";
import TaskCard from "./TaskCard";

export default function KanbanColumn({ id, title, tasks }) {
  const [isOver, setIsOver] = useState(false);

  // Enhanced droppable with better feedback
  const { setNodeRef, isOver: dndIsOver } = useDroppable({
    id,
    data: {
      type: "column",
    },
  });

  // Update our local state when dnd-kit reports hover state changes
  useMemo(() => {
    setIsOver(dndIsOver);
  }, [dndIsOver]);

  const color = useMemo(() => {
    if (title === "To Do") return "gray";
    if (title === "In Progress") return "#007bff";
    if (title === "Completed") return "#28a745";
    if (title === "Cancelled") return "#dc3545";
    return "#000";
  }, []);

  // Calculate column styles with visual feedback for droppable state
  const columnStyle = {
    minHeight: "200px", // Ensure column has height even when empty
    padding: "8px",
    borderRadius: "4px",
    // Add visual indicator when dragging over column
    background: isOver
      ? `rgba(${
          color === "gray"
            ? "128, 128, 128"
            : color
                .substring(1)
                .match(/.{2}/g)
                .map((hex) => parseInt(hex, 16))
                .join(", ")
        }, 0.1)`
      : "transparent",
    transition: "background 0.2s ease",
    // Add a subtle border when hovering
    outline: isOver ? `2px dashed ${color}` : "none",
    height: "100%", // Make sure column takes full height
  };

  return (
    <div ref={setNodeRef} className="kanban-to-do" style={columnStyle}>
      <Space gap={10} align="evenly">
        <div>
          <Space gap={10}>
            <div
              className="kanban-board-header-icon"
              style={{ borderColor: color }}
            />
            <p className="kanban-board-header">{title}</p>
            <p className="kanban-board-header-count">({tasks.length})</p>
          </Space>
        </div>
        <i>
          <Ellipsis size={16} color="#888" />
        </i>
      </Space>
      <hr
        className="faded-line"
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        }}
      />
      <SortableContext
        items={tasks.map((task) => task.$id)}
        strategy={rectSortingStrategy}
      >
        <div
          className="kanban-task-container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minHeight: "150px", // Ensure there's always a droppable area
            height: "100%",
            // Add a placeholder style when empty and being dragged over
            ...(tasks.length === 0 && isOver
              ? {
                  background: `rgba(${
                    color === "gray"
                      ? "128, 128, 128"
                      : color
                          .substring(1)
                          .match(/.{2}/g)
                          .map((hex) => parseInt(hex, 16))
                          .join(", ")
                  }, 0.1)`,
                  border: `2px dashed ${color}`,
                  borderRadius: "4px",
                }
              : {}),
          }}
        >
          {tasks.map((task) => (
            <TaskCard key={task.$id} task={task} />
          ))}
          {/* Empty state placeholder to help with dropping */}
        </div>
      </SortableContext>
    </div>
  );
}
