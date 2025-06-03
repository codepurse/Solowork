import { ID } from "appwrite";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  NOTES_COLLECTION_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Button from "../../../Elements/Button";
import Radio from "../../../Elements/Radio";
import Space from "../../../space";

interface CopyMoveNotesProps {
  onHide: () => void;
  modalLabel: string;
  selectedNotes: any;
  currentFolder: any;
}

export default function CopyMoveNotes({
  onHide,
  modalLabel,
  selectedNotes,
  currentFolder,
}: Readonly<CopyMoveNotesProps>) {
  const { useStoreNotes, useStoreToast } = useStore();
  const { notesFolders, setSelectedNotes } = useStoreNotes();
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setShowToast, setToastTitle, setToastMessage } = useStoreToast();

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  const handleCopyMoveNotes = async () => {
    if (selectedFolder === "") return;
    setIsLoading(true);
    try {
      if (modalLabel === "Move notes") {
        console.log("move notes");
        await databases.updateDocument(
          DATABASE_ID,
          NOTES_COLLECTION_ID,
          selectedNotes.$id,
          {
            folderId: selectedFolder,
          }
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          NOTES_COLLECTION_ID,
          ID.unique(),
          {
            title: selectedNotes.title,
            content: selectedNotes.content,
            userId: selectedNotes.userId,
            tags: selectedNotes.tags,
            emoji: selectedNotes.emoji,
            banner: selectedNotes.banner,
            isStarred: selectedNotes.isStarred,
            hideNotesBanner: selectedNotes.hideNotesBanner,
            spellCheck: selectedNotes.spellCheck,
            autoSave: selectedNotes.autoSave,
            focusMode: selectedNotes.focusMode,
            showFooter: selectedNotes.showFooter,
            readOnly: selectedNotes.readOnly,
            folderId: selectedFolder,
          }
        );
      }
      setShowToast(true);
      setToastTitle(modalLabel);
      setToastMessage(
        modalLabel === "Move notes"
          ? "Notes moved! It's been successfully moved."
          : "Notes copied! It's been successfully copied."
      );
      mutate(`notes/${currentFolder}`);
      if (modalLabel === "Move notes") {
        setSelectedNotes(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onHide();
    }
  };

  return (
    <div className="copy-move-notes" onClick={(e) => e.stopPropagation()}>
      <Space align="evenly">
        <p className="modal-title">{modalLabel}</p>
        <i className="modal-close-icon" onClick={onHide}>
          <X size={17} />
        </i>
      </Space>
      <p className="modal-description">
        {modalLabel === "Move notes"
          ? "Move your notes to a different folder."
          : "Copy your notes to a different folder."}
      </p>
      <div>
        <hr
          className="not-faded-line"
          style={{ margin: "5px 0px", background: "#252525" }}
        />
      </div>
      <div className="copy-move-notes-folders">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {notesFolders
                .filter((folder) => folder.$id !== currentFolder)
                .map((folder) => (
                  <tr
                    key={folder.$id}
                    onClick={() => handleFolderSelect(folder.$id)}
                    style={{ cursor: "pointer" }}
                    className={
                      selectedFolder === folder.$id ? "selected-row" : ""
                    }
                  >
                    <td
                      style={{ width: "20px", padding: "0px 0px 0px 10px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ marginTop: "7px" }}>
                        <Radio
                          id={`folder-${folder.$id}`}
                          name="folder-selection"
                          value={folder.$id}
                          checked={selectedFolder === folder.$id}
                          onChange={(e) => handleFolderSelect(e.target.value)}
                          label=""
                        />
                      </div>
                    </td>
                    <td>
                      <p className="copy-move-notes-folder-name">
                        {folder.name}
                      </p>
                    </td>
                    <td>
                      <p className="copy-move-notes-folder-name">
                        {dayjs(folder.createdAt).format("DD MMMM YYYY")}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Button
          onClick={handleCopyMoveNotes}
          loading={isLoading}
          style={{ marginTop: "10px", display: "flex", marginLeft: "auto" }}
        >
          {modalLabel === "Move notes" ? "Move" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
