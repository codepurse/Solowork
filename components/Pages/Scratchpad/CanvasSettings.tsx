import { ID } from "appwrite";
import {
  Download,
  Image,
  Lock,
  Pin,
  Save,
  Settings,
  Telescope,
} from "lucide-react";
import LZString from "lz-string";
import { useCallback, useEffect, useRef, useState } from "react";
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
    showGridLines,
    setShowGridLines,
  } = useWhiteBoardStore();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { useStoreToast, useStoreUser } = useStore();
  const { user } = useStoreUser();
  const { setShowToast, setToastTitle, setToastMessage } = useStoreToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pinMode, setPinMode] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

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

  const generateThumbnail = useCallback(() => {
    if (!canvasRef.current) return null;

    // Store current dimensions and viewport transform
    const currentWidth = canvasRef.current.width;
    const currentHeight = canvasRef.current.height;
    const currentViewportTransform = [...canvasRef.current.viewportTransform];
    const currentZoom = canvasRef.current.getZoom();

    try {
      // Reset viewport transform and ensure all objects are visible
      canvasRef.current.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvasRef.current.setDimensions({
        width: 300,
        height: 200,
      });

      // Get the bounding box of all objects
      const objects = canvasRef.current.getObjects();
      if (objects.length > 0) {
        const bounds = canvasRef.current.getObjects().reduce(
          (acc, obj) => {
            const objBounds = obj.getBoundingRect();
            return {
              left: Math.min(acc.left, objBounds.left),
              top: Math.min(acc.top, objBounds.top),
              right: Math.max(acc.right, objBounds.left + objBounds.width),
              bottom: Math.max(acc.bottom, objBounds.top + objBounds.height),
            };
          },
          { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
        );

        // Calculate scale to fit content
        const contentWidth = bounds.right - bounds.left;
        const contentHeight = bounds.bottom - bounds.top;
        const scale = Math.min(280 / contentWidth, 180 / contentHeight);

        // Apply zoom and center content
        canvasRef.current.setZoom(scale);
        canvasRef.current.absolutePan({
          x: -bounds.left * scale + (300 - contentWidth * scale) / 2,
          y: -bounds.top * scale + (200 - contentHeight * scale) / 2,
        });
      }

      // Force a render and wait for it to complete
      canvasRef.current.renderAll();

      // Generate thumbnail
      const thumbnail = canvasRef.current.toDataURL({
        format: "webp",
        quality: 0.2,
        multiplier: 1,
        enableRetinaScaling: true,
      });

      // Restore original state
      canvasRef.current.setDimensions({
        width: currentWidth,
        height: currentHeight,
      });
      canvasRef.current.setViewportTransform(currentViewportTransform);
      canvasRef.current.setZoom(currentZoom);
      canvasRef.current.renderAll();

      return thumbnail;
    } catch (error) {
      console.error("Error generating thumbnail:", error);

      // Restore original state in case of error
      canvasRef.current.setDimensions({
        width: currentWidth,
        height: currentHeight,
      });
      canvasRef.current.setViewportTransform(currentViewportTransform);
      canvasRef.current.setZoom(currentZoom);
      canvasRef.current.renderAll();

      return null;
    }
  }, [canvasRef]);

  const debouncedSave = useCallback(
    async (state: any) => {
      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set a new timeout
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const thumbnail = generateThumbnail();
          if (!thumbnail) return;

          const payload = {
            body: LZString.compressToUTF16(JSON.stringify(state)),
            image: thumbnail,
          };

          if (!isEditMode) {
            await databases.createDocument(
              DATABASE_ID,
              WHITEBOARD_COLLECTION_ID,
              ID.unique(),
              {
                name: "Untitled",
                description: "Untitled",
                userId: user.$id,
                ...payload,
              }
            );
          } else {
            await databases.updateDocument(
              DATABASE_ID,
              WHITEBOARD_COLLECTION_ID,
              selectedWhiteboard.$id,
              payload
            );
          }

          setShowToast(true);
          setToastTitle("Save");
          setToastMessage("Canvas saved!");
          mutate("Whiteboards");
        } catch (error) {
          console.error("Save failed:", error);
          setShowToast(true);
          setToastTitle("Error");
          setToastMessage("Failed to save canvas");
        }
      }, 2000); // 2 second debounce
    },
    [isEditMode, selectedWhiteboard, user, generateThumbnail]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    const essentialProps = ["type", "version", "objects", "background"];

    const lightState = canvasRef.current.toDatalessJSON(essentialProps);
    await debouncedSave(lightState);
  };

  const style = {
    top: focusMode ? "10px" : "70px",
  };

  const handlePin = async () => {
    setIsPinning(true);

    try {
      await databases.updateDocument(
        DATABASE_ID,
        WHITEBOARD_COLLECTION_ID,
        selectedWhiteboard.$id,
        { pinned: !pinMode }
      );
      setPinMode(!pinMode);
    } catch (error) {
      console.error("Error pinning canvas:", error);
    } finally {
      setIsPinning(false);
    }
  };

  useEffect(() => {
    if (selectedWhiteboard) {
      setPinMode(selectedWhiteboard.pinned);
    }
  }, [selectedWhiteboard]);

  return (
    <div
      className="canvas-settings slideInRight"
      ref={settingsRef}
      style={style}
    >
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
                    <Telescope size={17} />
                  </i>
                  <span className="canvas-settings-item-content-text">
                    Grid lines
                  </span>
                </Space>
                <Switch
                  checked={showGridLines}
                  onChange={() => setShowGridLines(!showGridLines)}
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
                    <Pin size={17} />
                  </i>
                  <span className="canvas-settings-item-content-text">Pin</span>
                </Space>
                <Switch
                  checked={pinMode}
                  onChange={handlePin}
                  size="x-small"
                  disabled={isPinning}
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
