import { create } from "zustand";

interface WhiteBoardStore {
  tool: string;
  setTool: (tool: string) => void;
  color: string;
  setColor: (color: string) => void;
  thickness: number;
  setThickness: (thickness: number) => void;
  selectedShape: string;
  setSelectedShape: (shape: string) => void;
  shapeColor: string;
  setShapeColor: (color: string) => void;
  isBold: boolean;
  setIsBold: (isBold: boolean) => void;
  isItalic: boolean;
  setIsItalic: (isItalic: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (isUnderline: boolean) => void;
  isCreateText: boolean;
  setIsCreateText: (isCreateText: boolean) => void;
  textFontSize: number;
  setTextFontSize: (size: number) => void;
  textFontWeight: string;
  setTextFontWeight: (weight: string) => void;
  textFontStyle: string;
  setTextFontStyle: (style: string) => void;
  isCaseSensitive: boolean;
  setIsCaseSensitive: (isCaseSensitive: boolean) => void;
  isCaseUpper: boolean;
  setIsCaseUpper: (isCaseUpper: boolean) => void;
  isCaseLower: boolean;
  setIsCaseLower: (isCaseLower: boolean) => void;
  text: string;
  setText: (text: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  shapeStroke: string;
  setShapeStroke: (color: string) => void;
  shapeFill: string;
  setShapeFill: (color: string) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  focusMode: boolean;
  setFocusMode: (focusMode: boolean) => void;
  lockMode: boolean;
  setLockMode: (lockMode: boolean) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
  setCanUndo: (canUndo: boolean) => void;
  setCanRedo: (canRedo: boolean) => void;
  canvasStyle: string;
  setCanvasStyle: (canvasStyle: string) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snapToGrid: boolean) => void;
  selectedWhiteboard: any;
  setSelectedWhiteboard: (selectedWhiteboard: any) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
}

const useWhiteBoardStore = create<WhiteBoardStore>((set) => ({
  tool: "",
  setTool: (tool) => set({ tool }),
  color: "#fff",
  setColor: (color) => set({ color }),
  thickness: 2,
  setThickness: (thickness) => set({ thickness }),
  selectedShape: "box",
  setSelectedShape: (selectedShape) => set({ selectedShape }),
  shapeColor: "#FF5252",
  setShapeColor: (shapeColor) => set({ shapeColor }),
  isBold: false,
  setIsBold: (isBold) => set({ isBold }),
  isItalic: false,
  setIsItalic: (isItalic) => set({ isItalic }),
  isUnderline: false,
  setIsUnderline: (isUnderline) => set({ isUnderline }),
  isCreateText: false,
  setIsCreateText: (isCreateText) => set({ isCreateText }),
  textFontSize: 16,
  setTextFontSize: (textFontSize) => set({ textFontSize }),
  textFontWeight: "normal",
  setTextFontWeight: (textFontWeight) => set({ textFontWeight }),
  textFontStyle: "normal",
  setTextFontStyle: (textFontStyle) => set({ textFontStyle }),
  isCaseSensitive: false,
  setIsCaseSensitive: (isCaseSensitive) => set({ isCaseSensitive }),
  isCaseUpper: false,
  setIsCaseUpper: (isCaseUpper) => set({ isCaseUpper }),
  isCaseLower: false,
  setIsCaseLower: (isCaseLower) => set({ isCaseLower }),
  text: "This is a text",
  setText: (text) => set({ text }),
  textColor: "#ffffff",
  setTextColor: (textColor) => set({ textColor }),
  shapeStroke: "#ffffff",
  setShapeStroke: (shapeStroke) => set({ shapeStroke }),
  shapeFill: "#ffffff",
  setShapeFill: (shapeFill) => set({ shapeFill }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
  focusMode: false,
  setFocusMode: (focusMode) => set({ focusMode }),
  lockMode: false,
  setLockMode: (lockMode) => set({ lockMode }),
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  canUndo: false,
  canRedo: false,
  setCanUndo: (canUndo) => set({ canUndo }),
  setCanRedo: (canRedo) => set({ canRedo }),
  canvasStyle: "dotted",
  setCanvasStyle: (canvasStyle) => set({ canvasStyle }),
  snapToGrid: false,
  setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
  selectedWhiteboard: null,
  setSelectedWhiteboard: (selectedWhiteboard) => set({ selectedWhiteboard }),
  isEditMode: false,
  setIsEditMode: (isEditMode) => set({ isEditMode }),
}));

export default useWhiteBoardStore;
