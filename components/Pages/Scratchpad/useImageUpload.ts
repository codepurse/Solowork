import { Canvas, FabricImage } from "fabric";
import { RefObject } from "react";

interface UseImageUploadProps {
  canvasRef: RefObject<Canvas | null>;
  setTool: (tool: string) => void;
}

const compressImage = (
  img: HTMLImageElement,
  quality = 0.4
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const maxWidth = 300;
    const scale = maxWidth / img.width;
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const compressedDataUrl = canvas.toDataURL("image/jpeg", quality); // lossy compression
    resolve(compressedDataUrl);
  });
};

export const useImageUpload = ({ canvasRef, setTool }: UseImageUploadProps) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imgUrl = event.target?.result;
      if (typeof imgUrl !== "string") return;

      // Create a temporary image to compress
      const img = document.createElement("img");
      img.src = imgUrl;

      img.onload = async () => {
        try {
          // Compress the image
          const compressedImgUrl = await compressImage(img);

          // Create fabric image using fromURL
          const fabricImage = await FabricImage.fromURL(compressedImgUrl, {
            crossOrigin: "anonymous",
          });

          // Center the image on canvas
          if (canvasRef.current) {
            fabricImage.set({
              left:
                (canvasRef.current.width ?? 0) / 2 -
                (fabricImage.width ?? 0) / 2,
              top:
                (canvasRef.current.height ?? 0) / 2 -
                (fabricImage.height ?? 0) / 2,
            });

            canvasRef.current.add(fabricImage);
            canvasRef.current.setActiveObject(fabricImage);
            canvasRef.current.renderAll();
          }
        } catch (error) {
          console.error("Error processing image:", error);
        }
      };
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = "";
    setTool("");
  };

  return { handleImageUpload };
};
