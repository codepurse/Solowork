import {
    Camera,
    Dot,
    File,
    Headphones,
    LayoutGrid,
    List,
    Video,
} from "lucide-react";
import { useRef, useState } from "react";
import Space from "../../space";
import TableRecent from "./TableRecent";
type FolderCardProps = {
  label: string;
};

const getIconComponent = (label: string) => {
  switch (label) {
    case "Audio":
      return <Headphones size={18} />;
    case "Images":
      return <Camera size={18} />;
    case "Videos":
      return <Video size={18} />;
    case "Documents":
    case "Others":
      return <File size={18} />;
    default:
      return null;
  }
};

export default function DashboardFiles() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current?.offsetLeft!);
    setScrollLeft(scrollRef.current?.scrollLeft!);
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const FolderCard = ({ label }: FolderCardProps) => {
    return (
      <div className="folder-card">
        <div className="folder-card-header">
          <i className="folder-icon">{getIconComponent(label)}</i>
          <h3 className="folder-card-title">{label}</h3>
          <Space gap={5} className="mt-1">
            <p className="folder-card-count">100 files</p>
            <i>
              <Dot size={15} color="#888" />
            </i>
            <p className="folder-card-size">100 MB</p>
          </Space>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div
        className="files-content"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Space gap={10} className="files-content-cards">
          <FolderCard label="Audio" />
          <FolderCard label="Images" />
          <FolderCard label="Videos" />
          <FolderCard label="Documents" />
        </Space>
      </div>
      <hr className="faded-line" />
      <div className="file-recent-container">
        <div className="file-recent">
          <Space gap={10} align="evenly">
            <h3 className="file-recent-title">Recent Uploads</h3>
            <Space gap={10}>
              <i className="file-recent-icon">
                <List size={18} />
              </i>
              <i className="file-recent-icon">
                <LayoutGrid size={18} />
              </i>
            </Space>
          </Space>
        </div>
        <TableRecent />
      </div>
    </div>
  );
}
