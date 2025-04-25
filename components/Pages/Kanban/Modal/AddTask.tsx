import { X } from "lucide-react";
import { useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Button from "../../../Elements/Button";
import Space from "../../../space";

interface AddTaskProps {
  show: boolean;
  onHide: () => void;
}

export default function AddTask({ show, onHide }: Readonly<AddTaskProps>) {
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (
    tag: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setTags([...tags, tag]);
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
            <input type="text" className="input-type" />
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Status</p>
            <input type="text" className="input-type" />
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Priority</p>
            <input type="text" className="input-type" />
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Dependency</p>
            <input type="text" className="input-type" />
          </Col>
          <Col lg={6}>
            <p className="modal-form-title">Due Date</p>
            <input type="text" className="input-type" />
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
          <Col lg={12} className="mt-1">
            <p className="modal-form-title">Description</p>
            <textarea className="input-type" rows={5} />
          </Col>
          <Col lg={12} className="d-flex justify-content-end">
            <Button>Add Task</Button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}
