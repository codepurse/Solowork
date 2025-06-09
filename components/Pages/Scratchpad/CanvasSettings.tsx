import { ID } from "appwrite";
import { Download, Image, Lock, Save, Settings, Telescope } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  WHITEBOARD_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import useWhiteBoardStore from "../../../store/whiteBoardStore";
import Switch from "../../Elements/Switch";
import Space from "../../space";

type CanvasSettingsProps = {
  canvasRef: any;
};

export default function CanvasSettings({
  canvasRef,
}: Readonly<CanvasSettingsProps>) {
  const {
    focusMode,
    setFocusMode,
    lockMode,
    setLockMode,
    canvasStyle,
    setCanvasStyle,
    isEditMode,
    selectedWhiteboard,
  } = useWhiteBoardStore();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { useStoreToast, useStoreUser } = useStore();
  const { user } = useStoreUser();
  const { setShowToast, setToastTitle, setToastMessage } = useStoreToast();

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
      enableRetinaScaling: true,
    } as any);

    // Try the traditional download first
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";

    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // For mobile devices, open in a new tab
      window.open(dataURL, "_blank");
    } else {
      // For desktop, try the direct download
      try {
        link.click();
      } catch (err) {
        // Fallback to opening in new tab if download fails
        window.open(dataURL, "_blank");
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    }

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  const handleSave = async () => {
    if (!isEditMode) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          WHITEBOARD_COLLECTION_ID,
          ID.unique(),
          {
            name: "Untitled",
            description: "Untitled",
            body: JSON.stringify(canvasRef.current),
            userId: user.$id,
            image: canvasRef.current.toDataURL(),
          }
        );

        setShowToast(true);
        setToastTitle("Save");
        setToastMessage("Canvas saved!");
        mutate("Whiteboards");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await databases.updateDocument(
          DATABASE_ID,
          WHITEBOARD_COLLECTION_ID,
          selectedWhiteboard.$id,
          {
            body: JSON.stringify(canvasRef.current),
            image: canvasRef.current.toDataURL(),
          }
        );
        setShowToast(true);
        setToastTitle("Save");
        setToastMessage("Canvas saved!");
        mutate("Whiteboards");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="canvas-settings slideInRight" ref={settingsRef}>
      <i onClick={() => setShowSettings(!showSettings)}>
        <Settings size={18} />
      </i>
      <div className="canvas-settings-item-container">
        {showSettings && (
          <div className="canvas-settings-item">
            <div className="canvas-settings-content">
              <Space gap={8} onClick={handleSave}>
                <i>
                  <Save size={17} />
                </i>
                <span className="canvas-settings-item-content-text">Save</span>
              </Space>
              <Space gap={8} onClick={handleDownload} className="mt-1">
                <i>
                  <Download size={17} />
                </i>
                <span className="canvas-settings-item-content-text">
                  Download
                </span>
              </Space>
              <Space gap={8} className="mt-1" align="evenly">
                <Space gap={8}>
                  <i>
                    <Telescope size={17} />
                  </i>
                  <span className="canvas-settings-item-content-text">
                    Focus mode
                  </span>
                </Space>
                <Switch
                  checked={focusMode}
                  onChange={() => setFocusMode(!focusMode)}
                  size="x-small"
                />
              </Space>
              <Space gap={8} className="mt-1" align="evenly">
                <Space gap={8}>
                  <i>
                    <Lock size={17} />
                  </i>
                  <span className="canvas-settings-item-content-text">
                    Lock
                  </span>
                </Space>
                <Switch
                  checked={lockMode}
                  onChange={() => setLockMode(!lockMode)}
                  size="x-small"
                />
              </Space>
              <Space gap={8} className="mt-1" align="evenly">
                <Space gap={8}>
                  <i>
                    <Image size={17} />
                  </i>
                  <span className="canvas-settings-item-content-text">
                    Background style
                  </span>
                </Space>
              </Space>
              <Space gap={8} className="mt-3">
                <div
                  className={`dotted ${
                    canvasStyle === "dotted" ? "activeStyle" : ""
                  }`}
                  onClick={() => setCanvasStyle("dotted")}
                />
                <div
                  className={`paper ${
                    canvasStyle === "paper" ? "activeStyle" : ""
                  }`}
                  onClick={() => setCanvasStyle("paper")}
                />
                <div
                  className={`grid ${
                    canvasStyle === "grid" ? "activeStyle" : ""
                  }`}
                  onClick={() => setCanvasStyle("grid")}
                />
              </Space>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
