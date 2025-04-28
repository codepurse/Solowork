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
import { useEffect, useMemo, useRef, useState } from "react";
import Space from "../../../space";

export default function TableData({
  type,
  tasks,
}: {
  type: string;
  tasks: any;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const filteredTasks = tasks.filter((task) => task.status === type);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [filteredTasks]);

  const formatDate = (date: string) => {
    return dayjs(date).format("MMMM D, YYYY");
  };

  const tagsClass = ["violet-tag", "blue-tag", "pink-tag", "orange-tag"];

  const color = useMemo(() => {
    if (type === "To Do") return "table-view-to-do";
    if (type === "In Progress") return "table-view-in-progress";
    if (type === "Completed") return "table-view-completed";
    if (type === "Cancelled") return "table-view-cancelled";
    return "#000";
  }, [type]);

  const handleToggle = () => {
    if (contentRef.current) {
      if (isOpen) {
        setContentHeight(0);
      } else {
        setContentHeight(contentRef.current.scrollHeight);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      <div
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer" }}
      >
        <Space gap={15} align="evenly" style={{}}>
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
          <ChevronUp
            size={18}
            color="#888"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </Space>
      </div>
      <div
        ref={contentRef}
        className="table-view-data"
        style={{ height: contentHeight !== null ? contentHeight : "auto" }}
      >
        <table>
          <thead>
            <th style={{ width: "20%" }}>
              <Space gap={7}>
                <StickyNote size={14} color="#888" />
                <p>Name</p>
              </Space>
            </th>
            <th style={{ width: "30%" }}>
              <Space gap={7}>
                <ScrollText size={14} color="#888" />
                <p>Description</p>
              </Space>
            </th>
            <th style={{ width: "30%" }}>
              <Space gap={7}>
                <Tag size={14} color="#888" />
                <p>Tags</p>
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
    </div>
  );
}
