import { ID } from "appwrite";
import { X } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  KANBAN_FOLDER_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Button from "../../../Elements/Button";
import Text from "../../../Elements/Text";
import Space from "../../../space";

interface AddKanbanModalProps {
  onHide: () => void;
}

export default function AddKanbanModal({
  onHide,
}: Readonly<AddKanbanModalProps>) {
  const [name, setName] = useState("");
  const { useStoreUser, useStoreProjects } = useStore();
  const { user } = useStoreUser();
  const { selectedProject } = useStoreProjects();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await databases.createDocument(
        DATABASE_ID,
        KANBAN_FOLDER_ID,
        ID.unique(),
        {
          userId: user.$id,
          name: name,
          createdAt: new Date().toISOString(),
          board: selectedProject,
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      mutate("kanban");
      setLoading(false);
      onHide();
    }
  };

  return (
    <div className="add-notes-modal">
      <Space align="evenly">
        <p className="modal-title">Create a kanban board</p>
        <i className="modal-close-icon" onClick={onHide}>
          <X size={17} />
        </i>
      </Space>
      <p className="modal-description">
        Kanban boards are a great way to keep track of your tasks and ideas.
      </p>
      <div>
        <hr
          className="not-faded-line"
          style={{ margin: "5px 0px", background: "#252525" }}
        />
      </div>
      <div className="mt-3">
        <p className="modal-form-title">Board name</p>
        <Text
          variant="md"
          value={name}
          onChange={(e) => {
            console.log(e.target.value);
            setName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
        />
      </div>

      <div className="mt-3" style={{ textAlign: "right" }}>
        <Button onClick={handleCreate} loading={loading}>
          Create
        </Button>
      </div>
    </div>
  );
}
