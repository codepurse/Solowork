import { ID, Query } from "appwrite";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import {
  DATABASE_ID,
  databases,
  storage,
  TASKS_ATTACHMENTS_BUCKET_ID,
  TASKS_COLLECTION_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Button from "../../../Elements/Button";
import DatePicker from "../../../Elements/DatePicker";
import Dropdown from "../../../Elements/Dropdown";
import Space from "../../../space";

interface AddTaskProps {
  show: boolean;
  onHide: () => void;
}

export default function AddTask({ show, onHide }: Readonly<AddTaskProps>) {
  const [tags, setTags] = useState<string[]>([]);
  const [taskName, setTaskName] = useState<string>("");
  const [status, setStatus] = useState<any>(null);
  const [priority, setPriority] = useState<any>(null);
  const [dependency, setDependency] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | string>(new Date());
  const [description, setDescription] = useState<string>("");
  const { useStoreProjects, useStoreTasks } = useStore();
  const { selectedProject } = useStoreProjects();
  const { setTasks } = useStoreTasks();
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const statusOptions = [
    { label: "To Do", value: "to-do" },
    { label: "In Progress", value: "in-progress" },
    { label: "Done", value: "done" },
  ];

  const handleAddTag = (
    tag: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setTags([...tags, tag]);
      e.currentTarget.value = "";
    }
  };

  const tagsClass = [
    "violet-tag",
    "blue-tag",
    "pink-tag",
    "orange-tag",
    "yellow-tag",
    "cyan-tag",
    "lime-tag",
    "amber-tag",
  ];

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const fetchTasks = async () => {
    const tasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [Query.equal("projectId", selectedProject)]
    );
    setTasks(tasks.documents);
  };

  const handleAddTask = async () => {
    setLoading(true);
    try {
      const uploadedFileIds = [];

      // Upload each file
      for (const f of file) {
        const uploaded = await storage.createFile(
          TASKS_ATTACHMENTS_BUCKET_ID,
          ID.unique(),
          f
        );
        uploadedFileIds.push(uploaded.$id);
      }
      console.log(uploadedFileIds);
      // Create the task with all file IDs
      await databases.createDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        {
          projectId: selectedProject,
          title: taskName,
          status: status.label,
          priority: priority.label,
          dueDate,
          description,
          tags,
          fileId: uploadedFileIds, // array
        }
      );

      fetchTasks();
      onHide();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFile((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Modal show={show} onHide={onHide} centered className="modal-container">
      <Space align="evenly">
        <p className="modal-title">Add Task</p>
        <i className="modal-close-icon" onClick={onHide}>
          <X size={17} />
        </i>
      </Space>
      <p className="modal-description">Add a new task to your project.</p>
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
            <input
              type="text"
              className="input-type"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Status</p>
            <Dropdown
              options={statusOptions}
              onChange={(e) => setStatus(e)}
              value={status}
            />
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Priority</p>
            <Dropdown
              options={priorityOptions}
              onChange={(e) => setPriority(e)}
              value={priority}
            />
          </Col>
          <Col lg={6} className="mt-1">
            <p className="modal-form-title">Dependency</p>
            <input
              type="text"
              className="input-type"
              value={dependency}
              onChange={(e) => setDependency(e.target.value)}
            />
          </Col>
          <Col lg={6} className="mt-1">
            <p className="modal-form-title">Due Date</p>
            <DatePicker
              withTime={false}
              timeZone="Asia/Manila"
              value={dueDate}
              onChange={(e) => {
                const formattedDate = dayjs(e).format("YYYY-MM-DD hh:mm A");
                setDueDate(formattedDate);
              }}
            />
          </Col>
          <Col lg={12}>
            <p className="modal-form-title">Tags</p>
            <input
              type="text"
              className="input-type"
              placeholder="Add tags here.."
              onKeyDown={(e) => handleAddTag(e.currentTarget.value, e)}
            />
            <div className="add-task-modal-tags-container">
              {tags.map((tag, index) => {
                const classIndex = index % tagsClass.length;

                return (
                  <div
                    key={index}
                    className={`add-task-modal-tags ${tagsClass[classIndex]}`}
                  >
                    <p>{tag}</p>
                    <i
                      className="modal-close-icon"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X size={15} />
                    </i>
                  </div>
                );
              })}
            </div>
          </Col>
          <Col lg={12}>
            <p className="modal-form-title">Attachments</p>
            <div className="task-attachments-container">
              <p className="task-attachments-container-text">
                Drag and drop files here, or{" "}
                <u>
                  <span
                    style={{ cursor: "pointer", fontWeight: "500" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </span>
                </u>
              </p>
            </div>
            <div className="task-attachments-container-files">
              {file.map((f, index) => {
                return (
                  <div key={index} className="task-attachments-container-file">
                    <Space gap={10} align="evenly">
                      <div>
                        <p className="task-attachments-title">{f.name}</p>
                      </div>
                      <i>
                        <X
                          size={15}
                          color="#fff"
                          onClick={() => handleRemoveFile(index)}
                        />
                      </i>
                    </Space>
                  </div>
                );
              })}
            </div>
            <input
              type="file"
              id="file-input"
              className="d-none"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setFile(files);
              }}
              ref={fileInputRef}
            />
          </Col>
          <Col lg={12}>
            <p className="modal-form-title">Description</p>
            <textarea
              className="input-type"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
          <Col lg={12} className="d-flex justify-content-end">
            <Button onClick={handleAddTask} loading={loading}>
              Add Task
            </Button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}
