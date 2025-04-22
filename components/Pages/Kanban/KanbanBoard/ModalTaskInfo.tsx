import { Calendar } from "lucide-react";
import { Modal } from "react-bootstrap";
import { DUMMY_TAGS } from "../../../../constant/dummy";
import Space from "../../../space";

export default function ModalTaskInfo({
  show,
  onHide,
  centered,
  ...props
}: Readonly<{ show: boolean; onHide: () => void; centered: boolean }>) {
  return (
    <Modal show={show} onHide={onHide} centered className=" modal-container">
      <div className="kanban-task-info-modal">
        <p className="kanban-task-info-modal-title">
          Implement user authentication
        </p>
        <Space direction="column" gap={10} align="start" alignItems="start">
          <div>
            <Space gap={10}>
              <div style={{ minWidth: "85px" }}>
                <p className="kanban-modal-left-text">Status</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="kanban-modal-status-dot" />
                <p className="kanban-modal-right-text">In Progress</p>
              </div>
            </Space>
          </div>
          <div>
            <Space gap={10}>
              <div style={{ minWidth: "85px" }}>
                <p className="kanban-modal-left-text">Assignee</p>
              </div>
              <p className="kanban-modal-right-text">John Doe</p>
            </Space>
          </div>
          <div>
            <Space gap={10}>
              <div style={{ minWidth: "85px" }}>
                <p className="kanban-modal-left-text">Due Date</p>
              </div>
              <Space gap={10}>
                <Calendar size={13} color="#fff" />
                <p className="kanban-modal-right-text">Feb 15, 2024</p>
              </Space>
            </Space>
          </div>
          <div>
            <Space gap={10}>
              <div style={{ minWidth: "85px" }}>
                <p className="kanban-modal-left-text">Priority</p>
              </div>
              <p
                className="kanban-modal-right-text"
                style={{ color: "#ff4d4d" }}
              >
                High
              </p>
            </Space>
          </div>
          <div>
            <Space gap={10} alignItems="start">
              <div style={{ minWidth: "85px" }}>
                <p className="kanban-modal-left-text">Tags</p>
              </div>
              <div className="kanban-modal-tags-container">
                {DUMMY_TAGS.map((tag) => (
                  <p key={tag} className="kanban-modal-tags">
                    {tag}
                  </p>
                ))}
              </div>
            </Space>
          </div>
        </Space>
        <hr className="not-faded-line" />
        <div>
          <div style={{ minWidth: "85px" }}>
            <p className="kanban-modal-left-text">Description</p>
          </div>
          <p className="kanban-modal-right-text mt-1 description-text">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </p>
        </div>
      </div>
    </Modal>
  );
}
