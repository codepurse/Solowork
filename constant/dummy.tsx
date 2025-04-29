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
    status: "In Progress",
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
    priority: "Low",
    dueDate: "2024-03-05",
    assignee: "Michael Brown",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 2,
  },
  {
    id: "TASK-104",
    title: "Implement error logging system",
    description:
      "Set up centralized error logging with Sentry and implement error tracking dashboard",
    tags: ["Monitoring", "DevOps", "Backend"],
    status: "To Do",
    priority: "Medium",
    dueDate: "2024-03-18",
    assignee: "David Wilson",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 4,
  },
  {
    id: "TASK-105",
    title: "Update documentation",
    description:
      "Update API documentation and add new feature documentation to the wiki",
    tags: ["Documentation", "Technical Writing"],
    status: "To Do",
    priority: "Low",
    dueDate: "2024-03-12",
    assignee: "Emily Davis",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 2,
  },
  {
    id: "TASK-106",
    title: "Optimize database queries",
    description:
      "Review and optimize slow database queries in the reporting module",
    tags: ["Database", "Performance", "Backend"],
    status: "To Do",
    priority: "Medium",
    dueDate: "2024-03-20",
    assignee: "Robert Taylor",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 3,
  },
  {
    id: "TASK-107",
    title: "Add unit tests for new features",
    description:
      "Write unit tests for recently added features to improve test coverage",
    tags: ["Testing", "Quality Assurance"],
    status: "In Progress",
    priority: "Low",
    dueDate: "2024-03-14",
    assignee: "Lisa Anderson",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 2,
  },
  {
    id: "TASK-108",
    title: "Implement payment gateway integration",
    description:
      "Integrate Stripe payment gateway and implement secure payment processing",
    tags: ["Payments", "Security", "Backend"],
    status: "To Do",
    priority: "High",
    dueDate: "2024-03-25",
    assignee: "James Wilson",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 5,
    dependencies: ["TASK-101"],
  },
  {
    id: "TASK-109",
    title: "Implement real-time notifications",
    description:
      "Set up WebSocket connections and implement real-time notification system",
    tags: ["Real-time", "WebSocket", "Frontend"],
    status: "In Progress",
    priority: "High",
    dueDate: "2024-03-22",
    assignee: "Sophia Lee",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 4,
  },
  {
    id: "TASK-110",
    title: "Implement data encryption at rest",
    description:
      "Implement encryption for sensitive data stored in the database",
    tags: ["Security", "Database", "Backend"],
    status: "Completed",
    priority: "High",
    dueDate: "2024-03-28",
    assignee: "Daniel Kim",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 3,
  },
  {
    id: "TASK-111",
    title: "Implement search functionality",
    description:
      "Add Elasticsearch integration and implement advanced search features",
    tags: ["Search", "Backend", "Frontend"],
    status: "Cancelled",
    priority: "Medium",
    dueDate: "2024-03-24",
    assignee: "Emma Thompson",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 4,
  },
  {
    id: "TASK-112",
    title: "Implement caching layer",
    description:
      "Set up Redis caching for frequently accessed data",
    tags: ["Performance", "Caching", "Backend"],
    status: "Completed",
    priority: "Medium",
    dueDate: "2024-03-26",
    assignee: "William Chen",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 3,
  },
  {
    id: "TASK-113",
    title: "Implement analytics dashboard",
    description:
      "Create dashboard for tracking user behavior and system metrics",
    tags: ["Analytics", "Frontend", "Data Visualization"],
    status: "Cancelled",
    priority: "Medium",
    dueDate: "2024-03-30",
    assignee: "Olivia Martinez",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 4,
  },
  {
    id: "TASK-114",
    title: "Update UI components library",
    description:
      "Update and document UI component library with new design system",
    tags: ["UI/UX", "Frontend", "Documentation"],
    status: "In Progress",
    priority: "Low",
    dueDate: "2024-03-29",
    assignee: "Noah Wilson",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 2,
  },
  {
    id: "TASK-115",
    title: "Implement automated backup system",
    description:
      "Set up automated database backups and implement recovery procedures",
    tags: ["DevOps", "Database", "Security"],
    status: "In Progress",
    priority: "Low",
    dueDate: "2024-03-27",
    assignee: "Ava Johnson",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    storyPoints: 2,
  }
];

export const DUMMY_TAGS = [
  "Authentication",
  "Security",
  "Backend",
  "UI/UX",
  "Frontend",
];
