export default function Draw({
  color,
  thickness,
  setColor,
  setThickness,
  canvasRef,
}) {
  const colors = [
    "#fff",
    "#000",
    "#f00",
    "#0f0",
    "#00f",
    "#ff0",
    "#0ff",
    "#f0f",
    "#ffa500",
  ];
  const handleThicknessChange = (newThickness: number) => {
    setThickness(newThickness);
    if (canvasRef.current) {
      canvasRef.current.freeDrawingBrush.width = newThickness;
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
              onClick={() => {
                setColor(c);
                if (canvasRef.current) {
                  canvasRef.current.freeDrawingBrush.color = c;
                }
              }}
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
      </div>
    </div>
  );
}
