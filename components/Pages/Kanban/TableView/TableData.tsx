import dayjs from "dayjs";
import {
    Calendar,
    ChevronUp,
    Flag,
    Logs,
    ScrollText,
    StickyNote,
    Tag,
} from "lucide-react";
import { useMemo } from "react";
import { tasks } from "../../../../constant/dummy";
import Space from "../../../space";
export default function TableData({ type }: { type: string }) {
  const formatDate = (date: string) => {
    return dayjs(date).format("MMMM D, YYYY");
  };

  const filteredTasks = tasks.filter((task) => task.status === type);

  const tagsClass = ["violet-tag", "blue-tag", "pink-tag", "orange-tag"];

  const color = useMemo(() => {
    if (type === "To Do") return "table-view-to-do";
    if (type === "In Progress") return "table-view-in-progress";
    if (type === "Completed") return "table-view-completed";
    if (type === "Cancelled") return "table-view-cancelled";
    return "#000";
  }, [type]);

  return (
    <div className="mb-3">
      <div>
        <Space gap={15} align="evenly">
          <div>
            <Space gap={10}>
              <div className={`table-view-header-title ${color}`}>
                <i>
                  <Logs size={14} />
                </i>
                <p>{type}</p>
              </div>
              <p className="table-view-header-count">{filteredTasks.length}</p>
            </Space>
          </div>
          <ChevronUp size={18} color="#888" />
        </Space>
      </div>
      <table>
        <thead>
          <th>
            <Space gap={7}>
              <StickyNote size={14} color="#888" />
              <p>Name</p>
            </Space>
          </th>
          <th>
            <Space gap={7}>
              <ScrollText size={14} color="#888" />
              <p>Description</p>
            </Space>
          </th>
          <th>
            <Space gap={7}>
              <Tag size={14} color="#888" />
              <p
                className={
                  tagsClass[Math.floor(Math.random() * tagsClass.length)]
                }
              >
                Tags
              </p>
            </Space>
          </th>
          <th>
            <Space gap={7}>
              <Flag size={14} color="#888" />
              <p>Priority</p>
            </Space>
          </th>
          <th>
            <Space gap={7}>
              <Calendar size={14} color="#888" />
              <p>Due Date</p>
            </Space>
          </th>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={index}>
              <td>
                <p>{task.title}</p>
              </td>
              <td>
                <p className="table-view-description">{task.description}</p>
              </td>
              <td style={{ display: "flex", gap: "10px" }}>
                {task.tags.map((tag, index) => (
                  <p
                    key={index}
                    className={`table-view-tag ${
                      tagsClass[Math.floor(Math.random() * tagsClass.length)]
                    }`}
                  >
                    {tag}
                    {index < task.tags.length - 1}
                  </p>
                ))}
              </td>
              <td>
                <p className={`table-view-priority ${task.priority}`}>
                  {task.priority}
                </p>
              </td>
              <td>
                <p className="table-view-due-date">
                  {formatDate(task.dueDate)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
