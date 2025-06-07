export default function Draw({
  color,
  thickness,
  setColor,
  setThickness,
  canvasRef,
}) {
  const colors = [
    "#ffffff",
    "#000000",
    "#FF5252",
    "#EA80FC",
    "#B388FF",
    "#8C9EFF",
    "#84FFFF",
    "#A7FFEB",
    "#CCFF90",
    "#F4FF81",
    "#FFE57F",
    "#f00",
  ];

  const handleThicknessChange = (newThickness: number) => {
    setThickness(newThickness);
    if (canvasRef.current) {
      // Update drawing brush thickness
      canvasRef.current.freeDrawingBrush.width = newThickness;
      
      // Update selected objects' stroke width
      const activeObjects = canvasRef.current.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => {
          if (obj.strokeWidth !== undefined) {
            obj.set('strokeWidth', newThickness);
          }
        });
        canvasRef.current.requestRenderAll();
      }
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (canvasRef.current) {
      // Update drawing brush color
      canvasRef.current.freeDrawingBrush.color = newColor;
      
      // Update selected objects' colors
      const activeObjects = canvasRef.current.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => {
          // Update stroke color for lines and shapes
          if (obj.stroke !== undefined) {
            obj.set('stroke', newColor);
          }
          // Update fill color for shapes
          if (obj.fill !== undefined) {
            obj.set('fill', newColor);
          }
        });
        canvasRef.current.requestRenderAll();
      }
    }
  };

  return (
    <div className="color-settings animate__animated animate__slideInRight ">
      <p className="draw-title mb-2">Colors</p>
      <div className="color-settings-colors">
        {colors.map((c) => (
          <div
            className="color-settings-item"
            key={c}
            id={c === color ? "activeColor" : ""}
          >
            <div
              className="color-settings-item-color"
              style={{ backgroundColor: c }}
              onClick={() => handleColorChange(c)}
            ></div>
          </div>
        ))}
      </div>
      <p className="draw-title mb-2 mt-3">Thickness</p>
      <div className="draw-sizes">
        <div
          className="draw-size-thin"
          id={thickness === 2 ? "activeThickness" : ""}
          onClick={() => handleThicknessChange(2)}
        >
          <div className="draw-size-thin-inner" />
        </div>
        <div
          className="draw-size-medium"
          id={thickness === 4 ? "activeThickness" : ""}
          onClick={() => handleThicknessChange(4)}
        >
          <div className="draw-size-medium-inner" />
        </div>
        <div
          className="draw-size-thick"
          id={thickness === 6 ? "activeThickness" : ""}
          onClick={() => handleThicknessChange(6)}
        >
          <div className="draw-size-thick-inner" />
        </div>
        <div
          className="draw-size-xlthick"
          id={thickness === 8 ? "activeThickness" : ""}
          onClick={() => handleThicknessChange(8)}
        >
          <div className="draw-size-xlthick-inner" />
        </div>
      </div>
    </div>
  );
}
