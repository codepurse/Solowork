import { Query } from "appwrite";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useSWR from "swr";
import {
    DATABASE_ID,
    databases,
    WHITEBOARD_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import useWhiteBoardStore from "../../../store/whiteBoardStore";

export default function WhiteboardList() {
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();
  const { setSelectedWhiteboard, setIsEditMode } = useWhiteBoardStore();

  const fetchWhiteboards = async () => {
    const whiteboards = await databases.listDocuments(
      DATABASE_ID,
      WHITEBOARD_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );
    return whiteboards.documents;
  };

  const { data, error: whiteboardsError } = useSWR(
    user && user.$id ? "whiteboards" : null,
    () => fetchWhiteboards()
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
    <Container className="whiteboard-list">
      <Row>
        <Col lg={12}>
          <div className="whiteboard-list-item">
            {data?.map((whiteboard) => (
              <div
                key={whiteboard.$id}
                className="whiteboard-list-item-card"
                onClick={() => handleWhiteboardClick(whiteboard)}
              >
                <div className="whiteboard-header">
                  <h1>{whiteboard.name}</h1>
                </div>
                <div className="whiteboard-list-item-card-image">
                  <img src={whiteboard.image} alt={whiteboard.name} />
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
