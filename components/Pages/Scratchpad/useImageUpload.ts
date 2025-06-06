import * as fabric from "fabric";
import { Canvas } from "fabric";
import { RefObject } from "react";

interface UseImageUploadProps {
  canvasRef: RefObject<Canvas | null>;
  setTool: (tool: string) => void;
}

export const useImageUpload = ({ canvasRef, setTool }: UseImageUploadProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result;
      if (typeof imgUrl !== 'string') return;

      // Create a new image element
      const img = document.createElement('img');
      img.src = imgUrl;
      img.onload = () => {
        // Create a new fabric image instance
        const fabricImage = new fabric.Image(img, {
          crossOrigin: 'anonymous'
        });
        
        // Scale image to reasonable size if too large
        const maxSize = 500;
        if (fabricImage.width && fabricImage.height) {
          if (fabricImage.width > maxSize || fabricImage.height > maxSize) {
            const scale = maxSize / Math.max(fabricImage.width, fabricImage.height);
            fabricImage.scale(scale);
          }
        }

        // Center the image on canvas
        if (canvasRef.current) {
          fabricImage.set({
            left: (canvasRef.current.width ?? 0) / 2 - (fabricImage.width ?? 0) * (fabricImage.scaleX ?? 1) / 2,
            top: (canvasRef.current.height ?? 0) / 2 - (fabricImage.height ?? 0) * (fabricImage.scaleY ?? 1) / 2
          });
          
          canvasRef.current.add(fabricImage);
          canvasRef.current.setActiveObject(fabricImage);
          canvasRef.current.renderAll();
        }
      };
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = '';
    setTool('');
  };

  return { handleImageUpload };
}; 