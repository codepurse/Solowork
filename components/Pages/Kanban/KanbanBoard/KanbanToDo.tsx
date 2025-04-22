import { Ellipsis } from "lucide-react";
import { useMemo } from "react";
import { tasks } from "../../../../constant/dummy";
import Space from "../../../space";

const getPriorityColor = (priority: string): string => {
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

export default function KanbanToDo({
  label,
  count,
}: Readonly<{ label: string; count: number }>) {
  const color = useMemo(() => {
    if (label === "To Do") return "gray";
    if (label === "In Progress") return "#007bff";
    if (label === "Completed") return "#28a745";
    if (label === "Cancelled") return "#dc3545";
    return "#000";
  }, [label]);

  return (
    <div className="kanban-to-do">
      <Space gap={10} align="evenly">
        <div>
          <Space gap={10}>
            <div
              className="kanban-board-header-icon"
              style={{ borderColor: color }}
            />
            <p className="kanban-board-header">{label}</p>
            <p className="kanban-board-header-count">({count})</p>
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
      <div className="kanban-task-container">
        {tasks.map((task) => (
          <div key={task.id} className="kanban-task-card">
            <div className="kanban-task-card-header">
              <p className="kanban-task-card-id">{task.id}</p>
              <p
                className="kanban-task-card-priority"
                style={{ color: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </p>
            </div>
            <p className="kanban-task-card-title">{task.title}</p>
            <p className="kanban-task-card-description">{task.description}</p>
            <div className="kanban-task-card-footer">
              <div className="kanban-task-card-tags">
                {task.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="kanban-task-card-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
