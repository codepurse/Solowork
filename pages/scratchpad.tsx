import Whiteboard from "../components/Pages/Scratchpad/Whiteboard";
import WhiteboardList from "../components/Pages/Scratchpad/WhiteboardList";
import useWhiteBoardStore from "../store/whiteBoardStore";

export default function Scratchpad() {
  const { isEditMode } = useWhiteBoardStore();

  return <>{isEditMode ? <Whiteboard /> : <WhiteboardList />}</>;
}
