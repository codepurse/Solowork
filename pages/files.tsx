import {
    Camera,
    Dot,
    File,
    Headphones,
    LayoutGrid,
    List,
    MoveRight,
    Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DonutChart from "../components/Pages/Files/DonutChart";
import TableRecent from "../components/Pages/Files/TableRecent";
import Space from "../components/space";

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

type FolderCardProps = {
  label: string;
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

export default function Files() {
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

  return (
    <Container fluid className="files-container">
      <Row>
        <Col lg={9}>
          <div className="files-main-container">
            <div className="files-header">
              <Space gap={10} align="evenly">
                <h1 className="files-header-title">My Files</h1>
                <Space gap={10}>
                  <span className="files-header-view-all">View all</span>
                  <i className="files-header-icon">
                    <MoveRight size={18} />
                  </i>
                </Space>
              </Space>
            </div>
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
        </Col>
        <Col lg={3}>
          <div className="files-side-info">
            <DonutChart />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
