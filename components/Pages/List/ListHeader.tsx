import { ListFilterPlus } from "lucide-react";
import { useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Button from "../../Elements/Button";
import Space from "../../space";
import ModalAddList from "../List/ModalAddList";

export default function ListHeader() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Container className="list-container" style={{ paddingTop: "55px" }}>
      <Row>
        <Col lg={12}>
          <div className="header-container">
            <Space gap={10} align="evenly">
              <div>
                <p className="header-title">
                  Hi, Alfon <span className="wave-emoji">👋</span>
                </p>
                <p className="header-subtitle">This is your weekly list</p>
              </div>
              <Space gap={10}>
                <button className="filter-button">
                  <i>
                    <ListFilterPlus size={15} />
                  </i>
                  <span>Filter</span>
                </button>
                <Button onClick={() => setShowModal(true)}>Add Task</Button>
              </Space>
            </Space>
          </div>
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-container"
        centered
      >
        <ModalAddList onHide={() => setShowModal(false)} show={showModal} />
      </Modal>
    </Container>
  );
}
