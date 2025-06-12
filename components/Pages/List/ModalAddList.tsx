import { ID } from "appwrite";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
    DATABASE_ID,
    databases,
    LIST_COLLECTION_ID,
} from "../../../constant/appwrite";
import Button from "../../Elements/Button";
import Text from "../../Elements/Text";
import TextArea from "../../Elements/TextArea";
import Space from "../../space";

interface ModalAddListProps {
  show: boolean;
  onHide: () => void;
}

export default function ModalAddList({ show, onHide }: ModalAddListProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dateSched, setDateSched] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveTask = async () => {
    try {
      setLoading(true);
      await databases.createDocument(
        DATABASE_ID,
        LIST_COLLECTION_ID,
        ID.unique(),
        {
          name: taskName,
          description: description,
          dateSched: dayjs().toISOString(),
          done: false,
        }
      );
      console.log("sucess");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Space align="evenly">
        <p className="modal-title">Add Task</p>
        <i className="modal-close-icon" onClick={onHide}>
          <X size={17} />
        </i>
      </Space>
      <p className="modal-description">Add a new task to your list.</p>
      <div>
        <hr
          className="not-faded-line"
          style={{ margin: "5px 0px", background: "#252525" }}
        />
      </div>
      <Container className="add-task-modal-form">
        <Row style={{ rowGap: "5px" }}>
          <Col lg={12}>
            <p className="modal-form-title">Task Name</p>
            <Text
              variant="md"
              type="text"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
              }}
            />
            <p className="modal-form-title">Description</p>
            <TextArea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
          <Col lg={12} className="d-flex justify-content-end">
            <Button onClick={handleSaveTask} loading={loading}>
              Add Task
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
