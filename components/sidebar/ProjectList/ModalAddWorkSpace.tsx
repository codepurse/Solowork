import { ID } from "appwrite";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  PROJECTS_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Button from "../../Elements/Button";
import Text from "../../Elements/Text";
import TextArea from "../../Elements/TextArea";
import Space from "../../space";

interface ModalProps {
  onHide: () => void;
  info: Info;
  edit: boolean;
}

type Info = {
  name: string;
  description: string;
  $id: string;
};

export default function ModalAddWorkSpace({
  onHide,
  info,
  edit,
}: Readonly<ModalProps>) {
  const { useStoreToast, useStoreUser } = useStore();
  const { user } = useStoreUser();
  const { setShowToast, setToastMessage, setToastTitle } = useStoreToast();
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddWorkspace = async () => {
    setLoading(true);
    console.log(workspaceName, description);
    if (!edit) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          PROJECTS_COLLECTION_ID,
          ID.unique(),
          {
            name: workspaceName,
            description: description,
            userId: user?.$id,
          }
        );
        setShowToast(true);
        setToastTitle("Add Workspace");
        setToastMessage("Workspace added! It's been successfully created.");
        mutate("projects");
        onHide();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await databases.updateDocument(
          DATABASE_ID,
          PROJECTS_COLLECTION_ID,
          info.$id,
          {
            name: workspaceName,
            description: description,
          }
        );
        setShowToast(true);
        setToastTitle("Update Workspace");
        setToastMessage("Workspace updated! It's been successfully updated.");
        mutate("projects");
        onHide();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (info) {
      console.log(info);
      setWorkspaceName(info.name);
      setDescription(info.description);
    }
  }, [info]);

  return (
    <div
      className="modal-add-workspace"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Space align="evenly">
        <p className="modal-title">
          {edit ? "Edit Workspace" : "Add Workspace"}
        </p>
        <i className="modal-close-icon" onClick={onHide}>
          <X size={17} />
        </i>
      </Space>
      <p className="modal-description mt-1">
        A workspace keeps all your tasks, notes, and boards in one clear space —
        perfect for solo projects.
      </p>
      <div>
        <hr
          className="not-faded-line"
          style={{ margin: "15px 0px 10px 0px", background: "#252525" }}
        />
      </div>
      <div>
        <p className="modal-form-title">Workspace Logo</p>
        <Space gap={15} className="mb-2 mt-2">
          <div className="workspace-logo-container"></div>
          <div>
            <div className="button-upload">Upload Image</div>
            <p className="modal-form-description">
              We support .png and .jpg and files up to 1mb.
            </p>
          </div>
        </Space>
        <p className="modal-form-title">Workspace Name</p>
        <Text
          variant="md"
          type="text"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
        <p className="modal-form-title">Description</p>
        <TextArea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="d-flex justify-content-between align-items-center">
          <p className="delete-workspace-text">Delete workspace</p>
          <Button
            className="mt-2"
            onClick={handleAddWorkspace}
            loading={loading}
          >
            {edit ? "Update Workspace" : "Add Workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
}
