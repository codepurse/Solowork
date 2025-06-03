import {
  Copy,
  EyeOff,
  Footprints,
  Move,
  PencilOff,
  Pin,
  Printer,
  Save,
  ScanEye,
  SpellCheck,
  Trash,
} from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  NOTES_COLLECTION_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Switch from "../../../Elements/Switch";
import Space from "../../../space";
import CopyMoveNotes from "./CopyMoveNotes";

type NoteSettingsProps = {
  noteId: string;
  setShowSettings: (showSettings: boolean) => void;
  selectedNote: any;
};

export default function NoteSettings({
  noteId,
  setShowSettings,
  selectedNote,
}: Readonly<NoteSettingsProps>) {
  const router = useRouter();
  const { notes } = router.query;
  const { useStoreToast, useStoreNotes, useNoteSettings } = useStore();
  const { setShowToast, setToastTitle, setToastMessage } = useStoreToast();
  const [showModal, setShowModal] = useState(false);
  const { setSelectedNotes } = useStoreNotes();
  const [modalLabel, setModalLabel] = useState("Move notes");
  const settingsRef = useRef<HTMLDivElement>(null);

  // Use the global store instead of local state
  const { noteSettings, setNoteSettings } = useNoteSettings();

  // Track if settings have changed
  const [hasChanges, setHasChanges] = useState(false);

  // Debounced update function
  useEffect(() => {
    if (!hasChanges) return;
    const updateTimer = setTimeout(async () => {
      try {
        await databases.updateDocument(
          DATABASE_ID,
          NOTES_COLLECTION_ID,
          noteId,
          {
            hideNotesBanner: noteSettings.hideBanner,
            spellCheck: noteSettings.spellCheck,
            autoSave: noteSettings.autoSave,
            focusMode: noteSettings.focusMode,
            showFooter: noteSettings.showFooter,
            readOnly: noteSettings.readOnly,
            pinned: noteSettings.pinned,
          }
        );
        mutate(`notes/${notes}`);
        setHasChanges(false);
      } catch (error) {
        console.error("Failed to update note settings:", error);
      }
    }, 1000);

    return () => clearTimeout(updateTimer);
  }, [noteSettings, hasChanges, noteId]);

  // Generic handler for all switches
  const handleSwitchChange = useCallback(
    (key: keyof typeof noteSettings) => {
      setNoteSettings({
        ...noteSettings,
        [key]: !noteSettings[key],
      });
      setHasChanges(true);
    },
    [noteSettings, setNoteSettings]
  );

  const handleDeleteNote = async () => {
    try {
      await databases.deleteDocument(DATABASE_ID, NOTES_COLLECTION_ID, noteId);
      setShowToast(true);
      setToastTitle("Delete Note");
      setToastMessage("Your note has been successfully deleted");
      setShowSettings(false);
      setSelectedNotes(null);
      mutate(`notes/${notes}`);
    } catch (e) {
      setShowSettings(false);
      setShowToast(true);
      setToastTitle("Cannot process");
      setToastMessage("Something went wrong, please try again later");
      mutate(`notes/${notes}`);
    }
  };

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Ignore clicks on the settings icon and modal content
      if (
        (event.target as Element).closest('.settings-icon') ||
        (event.target as Element).closest('.modal-container')
      ) {
        return;
      }
      
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSettings]);

  return (
    <>
      <div className="note-settings" ref={settingsRef}>
        <div className="note-settings-content">
          <Space gap={5} align="evenly" className="note-settings-content-item">
            <Space gap={8}>
              <i>
                <EyeOff color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Hide banner</p>
            </Space>
            <Switch
              checked={noteSettings.hideBanner}
              onChange={() => handleSwitchChange("hideBanner")}
              size="small"
            />
          </Space>
          <Space gap={5} align="evenly" className="note-settings-content-item">
            <Space gap={8}>
              <i>
                <ScanEye color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Focus mode</p>
            </Space>
            <Switch
              checked={noteSettings.focusMode}
              onChange={() => handleSwitchChange("focusMode")}
              size="small"
            />
          </Space>
          <Space gap={5} align="evenly" className="note-settings-content-item">
            <Space gap={8}>
              <i>
                <Footprints color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Show footer</p>
            </Space>
            <Switch
              checked={noteSettings.showFooter}
              onChange={() => handleSwitchChange("showFooter")}
              size="small"
            />
          </Space>
          <hr className="not-faded-line" style={{ margin: "7px 0" }} />

          <Space gap={5} align="evenly" className="note-settings-content-item">
            <Space gap={8}>
              <i>
                <SpellCheck color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Spell check</p>
            </Space>
            <Switch
              checked={noteSettings.spellCheck}
              onChange={() => handleSwitchChange("spellCheck")}
              size="small"
            />
          </Space>
          <Space gap={5} align="evenly" className="note-settings-content-item">
            <Space gap={8}>
              <i>
                <Save color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Auto save</p>
            </Space>
            <Switch
              checked={noteSettings.autoSave}
              onChange={() => handleSwitchChange("autoSave")}
              size="small"
            />
          </Space>

          <Space gap={5} align="evenly" className="note-settings-content-item">
            <Space gap={8}>
              <i>
                <PencilOff color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Read only</p>
            </Space>
            <Switch
              checked={noteSettings.readOnly}
              onChange={() => handleSwitchChange("readOnly")}
              size="small"
            />
          </Space>
          <hr className="not-faded-line" style={{ margin: "7px 0" }} />
          <div>
            <Space
              gap={8}
              className="note-settings-content-item"
              onClick={() => {
                setShowModal(true);
                setModalLabel("Copy notes");
              }}
            >
              <i>
                <Copy color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Copy to</p>
            </Space>
            <Space
              gap={8}
              className="note-settings-content-item"
              onClick={() => {
                setShowModal(true);
                setModalLabel("Move notes");
              }}
            >
              <i>
                <Move color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Move to</p>
            </Space>
            <Space
              gap={8}
              align="evenly"
              className="note-settings-content-item"
            >
              <Space gap={8}>
                <i>
                  <Pin color="#fff" size={16} />
                </i>
                <p className="note-settings-content-title">Pin note</p>
              </Space>
              <Switch
                checked={noteSettings.pinned}
                onChange={() => handleSwitchChange("pinned")}
                size="small"
              />
            </Space>
            <Space gap={8} className="note-settings-content-item">
              <i>
                <Printer color="#fff" size={16} />
              </i>
              <p className="note-settings-content-title">Print note</p>
            </Space>
            <hr className="not-faded-line" style={{ margin: "7px 0" }} />
            <Space
              gap={8}
              className="note-settings-content-item"
              onClick={handleDeleteNote}
            >
              <i>
                <Trash color="#FF0000" size={16} />
              </i>
              <p
                className="note-settings-content-title"
                style={{ color: "#FF0000" }}
              >
                Delete note
              </p>
            </Space>
          </div>
        </div>
      </div>
      <Modal
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-container"
      >
        <CopyMoveNotes
          onHide={() => setShowModal(false)}
          selectedNotes={selectedNote}
          modalLabel={modalLabel}
          currentFolder={notes}
        />
      </Modal>
    </>
  );
}
