import { CircleX, Trash, X } from "lucide-react";
import Button from "../../Elements/Button";
import Space from "../../space";

interface DeleteWorkspaceProps {
  onHide: () => void;
}

export default function DeleteWorkspace({
  onHide,
}: Readonly<DeleteWorkspaceProps>) {
  return (
    <div
      className="animate__animated animate__fadeInLeft"
      style={{ animationDuration: "0.3s" }}
    >
      <Space align="evenly">
        <p className="modal-title">Delete workspace</p>
        <i className="modal-close-icon" onClick={onHide}>
          <X size={17} />
        </i>
      </Space>
      <p className="modal-description">
        Are you sure you want to delete your workspace? This action is
        irreversible and cannot be undone.
      </p>
      <div>
        <hr
          className="not-faded-line"
          style={{ margin: "15px 0px 10px 0px", background: "#252525" }}
        />
      </div>
      <Space gap={10} alignItems="start">
        <i>
          <CircleX size={16} color="#ff5252" />
        </i>
        <div>
          <p className="modal-description-delete">
            Deleting this workspace will permanently remove all of its content,
            including:
          </p>
          <ul>
            <li>📝 Notes</li>
            <li>📋 Kanban boards and tasks</li>
            <li>✅ Daily checklists</li>
            <li>📅 Calendar events</li>
            <li>🔗 Resources</li>
            <li>🔑 All settings and preferences</li>
          </ul>
        </div>
      </Space>
      <Space gap={10} align="evenly" className="mt-3">
        <Button style={{ width: "100%" }} onClick={onHide}>
          Cancel
        </Button>
        <button
          className="btn-delete"
          style={{
            width: "100%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            background: "#ff5252",
          }}
        >
          <i>
            <Trash size={16} />
          </i>
          <span>Delete account</span>
        </button>
      </Space>
    </div>
  );
}
