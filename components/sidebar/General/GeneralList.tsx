import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Space from "../../space";
import KanbanList from "./KanbanList";
import AddKanbanModal from "./KanbanList/AddKanbanModal";
import NotesList from "./NotesList";
import AddNotesModal from "./NotesList/AddNotesModal";

interface GeneralListProps {
  item: {
    id: number;
    name: string;
    icon: React.ReactNode;
    onClick: () => Promise<boolean> | void;
    collapsed?: boolean;
  };
  showSidebar: boolean;
}

type ModalType = "Notes" | "Kanban";

export default function GeneralList({
  item,
  showSidebar,
}: Readonly<GeneralListProps>) {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setShowModal(true);
  };

  const style = {
    width: showSidebar ? "100%" : "33px",
  };

  return (
    <div
      key={item.id}
      style={{ position: "relative" }}
      onClick={() => setShow(!show)}
      onMouseEnter={() => {
        setModalType(item.name as ModalType);
      }}
    >
      <div className="sidebar-menu-item" style={style}>
        <Space key={item.id} gap={10} align="evenly" fill>
          <div onClick={item.onClick}>
            <Space gap={10} fill>
              <i style={{ marginTop: "-3px" }}>{item.icon}</i>
              {showSidebar && (
                <label className="sidebar-menu-item-name animate__animated animate__slideInLeft">
                  {item.name}
                </label>
              )}
            </Space>
          </div>
          {showSidebar && (
            <div>
              <Space gap={5}>
                {item.collapsed && (
                  <Plus size={17} onClick={(e) => handleClick(e)} />
                )}
                {item.collapsed && (
                  <ChevronDown
                    size={17}
                    style={{
                      transform: show ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                )}
              </Space>
            </div>
          )}
        </Space>
      </div>
      <Collapse in={show}>
        <div>
          {modalType === "Notes" && <NotesList />}
          {modalType === "Kanban" && <KanbanList />}
        </div>
      </Collapse>
      <Modal
        onClick={(e) => e.stopPropagation()}
        className="modal-container"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        {modalType === "Notes" && (
          <AddNotesModal onHide={() => setShowModal(false)} />
        )}
        {modalType === "Kanban" && (
          <AddKanbanModal onHide={() => setShowModal(false)} />
        )}
      </Modal>
    </div>
  );
}
