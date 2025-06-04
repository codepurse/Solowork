// Handle zoom with mouse wheel
export const handleWheel = (
  e: any,
  stageRef: any,
  scale: number,
  setScale: (scale: number) => void,
  position: { x: number; y: number },
  setPosition: (position: { x: number; y: number }) => void
) => {
  e.evt.preventDefault();

  // Check if Ctrl key is pressed
  if (e.evt.ctrlKey) {
    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    // Handle zoom direction
    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;

    // Limit zoom range
    const limitedScale = Math.max(0.1, Math.min(newScale, 5));

    setScale(limitedScale);

    // Update position to zoom into mouse pointer
    setPosition({
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    });
  }
};
