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

export const tasks: Task[] = [
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

export const DUMMY_TAGS = [
  "Authentication",
  "Security",
  "Backend",
  "UI/UX",
  "Frontend",
];
