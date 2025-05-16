import { ID, Query } from "appwrite";
import dayjs from "dayjs";
import { ClipboardList, Trash, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  KANBAN_COLLECTION_ID,
  RECENT_ACTIVITY_COLLECTION_ID,
  storage,
  TASKS_ATTACHMENTS_BUCKET_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Button from "../../../Elements/Button";
import DatePicker from "../../../Elements/DatePicker";
import Dropdown from "../../../Elements/Dropdown";
import Text from "../../../Elements/Text";
import TextArea from "../../../Elements/TextArea";
import Space from "../../../space";

interface AddTaskProps {
  show: boolean;
  onHide: () => void;
  data: any;
}

export default function AddTask({
  show,
  onHide,
  data,
}: Readonly<AddTaskProps>) {
  const [tags, setTags] = useState<string[]>([]);
  const [taskName, setTaskName] = useState<string>("");
  const [status, setStatus] = useState<any>(null);
  const [priority, setPriority] = useState<any>(null);
  const [dependency, setDependency] = useState<string>("");
  const [dueDate, setDueDate] = useState(dayjs(new Date()));
  const [description, setDescription] = useState<string>("");
  const {
    useStoreProjects,
    useStoreTasks,
    useStoreUser,
    useStoreToast,
    useStoreKanban,
  } = useStore();
  const { selectedProject } = useStoreProjects();
  const { setShowDrawerInfo } = useStoreKanban();
  const {
    setShowToast,
    setToastType,
    setToastMessage,
    setToastTitle,
  } = useStoreToast();
  const { user } = useStoreUser();
  const { setTasks } = useStoreTasks();
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<(File | string)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [checklist, setChecklist] = useState<
    { name: string; completed: boolean }[]
  >([]);
  const [editTask, setEditTask] = useState<boolean>(false);
  const router = useRouter();
  const { kanban } = router.query;

  const priorityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  const statusOptions = [
    { label: "To Do", value: "To Do" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
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
  const handleAddChecklist = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const name = e.currentTarget.value.trim();

      setChecklist((prev) => [...prev, { name, completed: false }]);

      e.currentTarget.value = "";
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data, "data");
      setEditTask(true);
      setDescription(data.description);
      setTaskName(data.title);
      setStatus({ label: data.status, value: data.status });
      setPriority({ label: data.priority, value: data.priority });
      if (data.dueDate) {
        setDueDate(dayjs(data.dueDate));
      }
      setTags(data.tags);
      if (data.checklist) {
        setChecklist(JSON.parse(data.checklist));
      }
      if (data.fileId && Array.isArray(data.fileId)) {
        setFile(data.fileId);
      }
    }
  }, [data]);

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
      KANBAN_COLLECTION_ID,
      [Query.equal("kanbanId", kanban)]
    );
    setTasks(tasks.documents);
  };

  const handleSaveTask = async () => {
    setLoading(true);
    try {
      const uploadedFileIds = [];

      const newFiles = file.filter((f) => f instanceof File) as File[];
      if (newFiles.length > 0) {
        for (const f of newFiles) {
          const uploaded = await storage.createFile(
            TASKS_ATTACHMENTS_BUCKET_ID,
            ID.unique(),
            f
          );
          uploadedFileIds.push(uploaded.$id);
        }
      }

      const existingFileIds = file.filter(
        (f) => typeof f === "string"
      ) as string[];

      const taskData = {
        kanbanId: kanban,
        title: taskName,
        status: status.label,
        priority: priority.label,
        dueDate: dueDate.format("YYYY-MM-DD hh:mm A"),
        description,
        tags,
        checklist: JSON.stringify(checklist),
        fileId: [...existingFileIds, ...uploadedFileIds],
      };

      if (editTask && data.$id) {
        await databases.updateDocument(
          DATABASE_ID,
          KANBAN_COLLECTION_ID,
          data.$id,
          taskData
        );

        await databases.createDocument(
          DATABASE_ID,
          RECENT_ACTIVITY_COLLECTION_ID,
          ID.unique(),
          {
            type: "edited-task",
            title: "Edited task",
            description: `${taskName} was updated on the board.`,
            board: selectedProject,
            createdAt: new Date().toISOString(),
            userId: user.$id,
          }
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          KANBAN_COLLECTION_ID,
          ID.unique(),
          taskData
        );

        await databases.createDocument(
          DATABASE_ID,
          RECENT_ACTIVITY_COLLECTION_ID,
          ID.unique(),
          {
            type: "added-task",
            title: "Added task",
            description: `${taskName} is being added to the board.`,
            board: selectedProject,
            createdAt: new Date().toISOString(),
            userId: user.$id,
          }
        );
      }

      setShowToast(true);
      setToastTitle(editTask ? "Edit Task" : "Add Task");
      setToastMessage(
        editTask
          ? "Task updated! Your changes have been saved."
          : "Task added! It’s been successfully created."
      );

      fetchTasks();
      onHide();
    } catch (error) {
      console.log(error);
    } finally {
      mutate("kanban_tasks");
      setLoading(false);
      setShowDrawerInfo(false);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFile((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const updateTask = async (index: number, completed: boolean) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].completed = completed;
    setChecklist(updatedChecklist);
  };

  const handleRemoveChecklist = (index: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist.splice(index, 1);
    setChecklist(updatedChecklist);
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
            <Text
              variant="md"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Status</p>
            <Dropdown
              options={statusOptions}
              onChange={(e) => {
                setStatus(e);
                console.log(e);
              }}
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
            <Text
              variant="md"
              type="text"
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
              onChange={(newDate) => {
                if (!dayjs(newDate).isBefore(dayjs())) {
                  setDueDate(newDate);
                }
              }}
            />
          </Col>
          <Col lg={12}>
            <p className="modal-form-title">Tags</p>
            <Text
              variant="md"
              type="text"
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
            <p className="modal-form-title">Checklist</p>
            <Text
              variant="md"
              type="text"
              placeholder="Add checklist here.."
              onKeyDown={(e) => handleAddChecklist(e)}
            />
            {checklist.length !== 0 && (
              <div className="add-task-modal-checklist-container mt-2">
                <Space gap={10} align="evenly">
                  <Space align="center" gap={10}>
                    <ClipboardList size={15} color="#fff" />
                    <p className="add-task-modal-checklist-title">Sub Tasks</p>
                  </Space>
                  <span className="checklist-progress-count">
                    {
                      checklist.filter((checklist) => checklist.completed)
                        .length
                    }
                    /{checklist.length}
                  </span>
                </Space>
                <div className="checklist-progress-container mt-2">
                  <div
                    className="checklist-progress-bar-fill"
                    style={{
                      width: `${
                        checklist.length > 0
                          ? (checklist.filter((item) => item.completed).length /
                              checklist.length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <hr
                  className="not-faded-line"
                  style={{ margin: "10px 0px", background: "#252525" }}
                />
                {checklist.map((item, index) => {
                  return (
                    <Space key={index} align="evenly" gap={10}>
                      <div className="modern-checkbox mb-2" key={index}>
                        <input
                          type="checkbox"
                          id={`checklist-item-${index}`}
                          checked={item.completed}
                          onChange={(e) => updateTask(index, e.target.checked)}
                        />
                        <label htmlFor={`checklist-item-${index}`}>
                          <span className="checkbox-icon"></span>
                          <span className="checkbox-text">{item.name}</span>
                        </label>
                      </div>
                      <div>
                        <i className="trash-icon">
                          <Trash
                            size={15}
                            style={{ marginRight: "5px" }}
                            color="#fff"
                            onClick={() => handleRemoveChecklist(index)}
                          />
                        </i>
                      </div>
                    </Space>
                  );
                })}
              </div>
            )}
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
                        <p className="task-attachments-title">
                          {f instanceof File ? f.name : f}
                        </p>
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
                const files = Array.from(e.target.files || []);
                setFile(files.map((f: File) => f));
              }}
              ref={fileInputRef}
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
              {editTask ? "Update Task" : "Add Task"}
            </Button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}
