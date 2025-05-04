import { ID } from "appwrite";
import { X } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";
import {
    DATABASE_ID,
    databases,
    NOTES_FOLDER_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Button from "../../../Elements/Button";
import Text from "../../../Elements/Text";
import Space from "../../../space";

interface AddNotesModalProps {
  onHide: () => void;
}

export default function AddNotesModal({
  onHide,
}: Readonly<AddNotesModalProps>) {
  const [name, setName] = useState("");
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await databases.createDocument(
        DATABASE_ID,
        NOTES_FOLDER_ID,
        ID.unique(),
        {
          userId: user.$id,
          name: name,
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      mutate("notes");
      setLoading(false);
      onHide();
    }
  };



  return (
    <div className="add-notes-modal">
      <Space align="evenly">
        <p className="modal-title">Create a folder note</p>
        <i className="modal-close-icon" onClick={onHide}>
          <X size={17} />
        </i>
      </Space>
      <p className="modal-description">
        Notes are a great way to keep track of your thoughts and ideas.
      </p>
      <div>
        <hr
          className="not-faded-line"
          style={{ margin: "5px 0px", background: "#252525" }}
        />
      </div>
      <div className="mt-3">
        <p className="modal-form-title">Folder name</p>
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
