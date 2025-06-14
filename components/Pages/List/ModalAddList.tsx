import { ID } from "appwrite";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  LIST_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Button from "../../Elements/Button";
import DatePicker from "../../Elements/DatePicker";
import Dropdown from "../../Elements/Dropdown";
import Text from "../../Elements/Text";
import TextArea from "../../Elements/TextArea";
import Space from "../../space";

interface ModalAddListProps {
  show: boolean;
  onHide: () => void;
}

const repeatOptions = [
  { label: "None", value: "none" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export default function ModalAddList({ show, onHide }: ModalAddListProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dateSched, setDateSched] = useState<Date | null>(new Date());
  const [repeat, setRepeat] = useState<{ label: string; value: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { useStoreProjects } = useStore();
  const { selectedProject } = useStoreProjects();

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
          dateSched: dayjs(dateSched).toISOString(),
          done: false,
          repeat: repeat?.value,
          board: selectedProject,
        }
      );
      mutate(`list`);
      mutate(`listStatistics`);
      onHide();
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
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Date</p>
            <DatePicker
              withTime={false}
              timeZone="Asia/Manila"
              value={dateSched}
              onChange={(newDate) => {
                if (!dayjs(newDate).isBefore(dayjs())) {
                  setDateSched(newDate);
                }
              }}
            />
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Repeat</p>
            <Dropdown
              options={repeatOptions}
              onChange={(e) => setRepeat(e)}
              value={repeat}
            />
          </Col>
          <Col lg={12}>
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
