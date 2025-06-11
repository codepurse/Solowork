import { Query } from "appwrite";
import { Maximize2, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import useSWR from "swr";
import {
  DATABASE_ID,
  databases,
  WHITEBOARD_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import useWhiteBoardStore from "../../../store/whiteBoardStore";
import Button from "../../Elements/Button";
import Space from "../../space";
import ModalWhiteboard from "./ModalWhiteboard";

export default function WhiteboardList() {
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();
  const { setSelectedWhiteboard, setIsEditMode } = useWhiteBoardStore();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const fetchWhiteboards = async () => {
    const whiteboards = await databases.listDocuments(
      DATABASE_ID,
      WHITEBOARD_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );
    return whiteboards.documents;
  };

  const { data } = useSWR(user && user.$id ? "whiteboards" : null, () =>
    fetchWhiteboards()
  );

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  const handleWhiteboardClick = (whiteboard: any) => {
    setSelectedWhiteboard(whiteboard);
    setIsEditMode(true);
  };

  return (
    <Container fluid className="whiteboard-list dotted">
      <Row>
        <Col lg={12} style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Space gap={10} align="evenly">
            <p className="whiteboard-list-item-title">Whiteboards</p>
            <Button onClick={() => setShowModal(true)}>Add Whiteboard</Button>
          </Space>
          <div className="whiteboard-list-item mt-3">
            {data?.map((whiteboard) => (
              <div
                key={whiteboard.$id}
                className="whiteboard-list-item-card"
                onClick={() => {
                  handleWhiteboardClick(whiteboard);
                  router.push(`/whiteboard/${whiteboard.$id}?name=${whiteboard.name}`);
                }}
              >
                <div className="whiteboard-header">
                  <Space gap={10} align="evenly">
                    <h1>{whiteboard.name}</h1>
                    <Space gap={10}>
                      <i>
                        <Maximize2 size={14} />
                      </i>
                      <i>
                        <X size={18} />
                      </i>
                    </Space>
                  </Space>
                </div>
                <div
                  className="whiteboard-list-item-card-image"
                  style={{ backgroundImage: `url(${whiteboard.image})` }}
                ></div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Modal
        className="modal-container"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <ModalWhiteboard onHide={() => setShowModal(false)} />
      </Modal>
    </Container>
  );
}
