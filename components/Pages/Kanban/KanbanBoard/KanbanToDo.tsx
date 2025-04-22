import { Ellipsis } from "lucide-react";
import { useMemo } from "react";
import Space from "../../../space";

interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "To Do" | "In Progress" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Urgent";
  dueDate: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  storyPoints?: number;
  dependencies?: string[];
}

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

  const tasks: Task[] = [
    {
      id: "TASK-101",
      title: "Implement user authentication",
      description:
        "Set up JWT-based authentication with refresh tokens and implement login/signup flows",
      tags: ["Authentication", "Security", "Backend"],
      status: "To Do",
      priority: "High",
      dueDate: "2024-03-15",
      assignee: "Alex Johnson",
      createdAt: "2024-02-20",
      updatedAt: "2024-02-20",
      storyPoints: 5,
      dependencies: ["TASK-100"],
    },
    {
      id: "TASK-102",
      title: "Design mobile-responsive dashboard",
      description:
        "Create responsive layouts for dashboard components using CSS Grid and Flexbox",
      tags: ["UI/UX", "Frontend", "Responsive Design"],
      status: "To Do",
      priority: "Medium",
      dueDate: "2024-03-10",
      assignee: "Sarah Chen",
      createdAt: "2024-02-20",
      updatedAt: "2024-02-20",
      storyPoints: 3,
    },
    {
      id: "TASK-103",
      title: "Set up CI/CD pipeline",
      description:
        "Configure GitHub Actions for automated testing and deployment",
      tags: ["DevOps", "CI/CD", "Testing"],
      status: "To Do",
      priority: "High",
      dueDate: "2024-03-05",
      assignee: "Michael Brown",
      createdAt: "2024-02-20",
      updatedAt: "2024-02-20",
      storyPoints: 2,
    },
  ];

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
                style={{
                  color:
                    task.priority === "High"
                      ? "#ff4d4d"
                      : task.priority === "Medium"
                      ? "#ffa64d"
                      : task.priority === "Low"
                      ? "#4dff4d"
                      : "#ff0000",
                }}
              >
                {task.priority}
              </p>
            </div>
            <p className="kanban-task-card-title">{task.title}</p>
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
