import { ID } from "appwrite";
import { X } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  WHITEBOARD_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Button from "../../Elements/Button";
import Text from "../../Elements/Text";
import TextArea from "../../Elements/TextArea";
import Space from "../../space";

interface ModalWhiteboardProps {
  onHide: () => void;
}

export default function ModalWhiteboard({
  onHide,
}: Readonly<ModalWhiteboardProps>) {
  const { useStoreToast, useStoreUser, useStoreProjects } = useStore();
  const { user } = useStoreUser();
  const { setToastType, setToastMessage, setToastTitle } = useStoreToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useStoreProjects();
  const handleSave = async () => {
    try {
      setIsLoading(true);
      await databases.createDocument(
        DATABASE_ID,
        WHITEBOARD_COLLECTION_ID,
        ID.unique(),
        {
          name,
          description,
          userId: user?.$id,
          board: selectedProject,
        }
      );
      setToastType("success");
      setToastTitle("Success");
      setToastMessage("Whiteboard created successfully");
      mutate("whiteboards");
      onHide();
    } catch (error) {
      console.error(error);
      setToastType("error");
      setToastTitle("Error");
      setToastMessage("Failed to create whiteboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-whiteboard">
      <Space align="evenly">
        <p className="modal-title">Add Task</p>
        <i className="modal-close-icon" onClick={onHide}>
          <X size={17} />
        </i>
      </Space>
      <p className="modal-description">Customize your whiteboard.</p>
      <div>
        <hr
          className="not-faded-line"
          style={{ margin: "5px 0px", background: "#252525" }}
        />
      </div>
      <div className="modal-whiteboard-body mt-3">
        <p className="modal-form-title mb-1">Name</p>
        <Text
          placeholder="Enter your whiteboard name"
          variant="md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="modal-form-title mt-2 mb-1">Description</p>
        <TextArea
          placeholder="Enter your whiteboard description"
          variant="md"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div
        className="modal-whiteboard-footer mt-2"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button onClick={handleSave} loading={isLoading}>
          Save
        </Button>
      </div>
    </div>
  );
}
