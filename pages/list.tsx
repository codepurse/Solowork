import dayjs from "dayjs";
import { ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import Space from "../components/space";

import { Models, Query } from "appwrite";
import useSWR, { mutate } from "swr";
import Button from "../components/Elements/Button";
import Checkbox from "../components/Elements/Checkbox";
import { ListDivider } from "../components/Pages/List/ListDivider";
import ModalAddList from "../components/Pages/List/ModalAddList";
import {
  DATABASE_ID,
  LIST_COLLECTION_ID,
  databases,
} from "../constant/appwrite";

type ListItem = {
  name: string;
  description?: string;
  done: boolean;
  dateSched: string;
} & Models.Document;

const arrColor = ["#1ABC9C", "#2ECC71", "#3498DB", "#9B59B6"];

export default function List() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pendingUpdates = useRef<Record<string, NodeJS.Timeout>>({});

  const fetchList = async () => {
    const today = dayjs().startOf("day").toISOString();
    const next7 = dayjs().add(6, "day").endOf("day").toISOString();

    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        LIST_COLLECTION_ID,
        [
          Query.greaterThanEqual("dateSched", today),
          Query.lessThanEqual("dateSched", next7),
          Query.orderAsc("dateSched"),
        ]
      );
      return result.documents as ListItem[];
    } catch (err) {
      console.error("Failed to fetch list:", err);
      return [];
    }
  };

  const { data, error } = useSWR("list", fetchList, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (error) {
      console.log("error", error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const groupByDateWithPadding = (items: ListItem[]) => {
    const days: Record<string, ListItem[]> = {};
    for (let i = 0; i < 7; i++) {
      const date = dayjs().add(i, "day").format("YYYY-MM-DD");
      days[date] = [];
    }
    items.forEach((item) => {
      const date = dayjs(item.dateSched).format("YYYY-MM-DD");
      if (!days[date]) days[date] = [];
      days[date].push(item);
    });
    return days;
  };

  const grouped = groupByDateWithPadding(list);

  useEffect(() => {
    console.log(grouped);
  }, [grouped]);

  const deleteTask = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, LIST_COLLECTION_ID, id);
      mutate("list");
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleUpdateTask = async (id: string, done: boolean) => {
    // Clear any pending update for this task
    if (pendingUpdates.current[id]) {
      clearTimeout(pendingUpdates.current[id]);
    }

    // Optimistically update the local state
    setList((prevList) =>
      prevList.map((item) =>
        item.$id === id ? { ...item, done } : item
      )
    );

    // Set a new debounced update
    pendingUpdates.current[id] = setTimeout(async () => {
      try {
        await databases.updateDocument(DATABASE_ID, LIST_COLLECTION_ID, id, {
          done,
        });
        // Remove the pending update after success
        delete pendingUpdates.current[id];
      } catch (error) {
        console.error("Failed to update task:", error);
        // Revert the optimistic update on error
        setList((prevList) =>
          prevList.map((item) =>
            item.$id === id ? { ...item, done: !done } : item
          )
        );
        // Remove the pending update after error
        delete pendingUpdates.current[id];
      }
    }, 500); // Wait 500ms before making the API call
  };

  // Cleanup pending updates on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingUpdates.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <Container className="list-container">
      <Row>
        <Col lg={12}>
          <div className="header-container">
            <Space gap={10} align="evenly">
              <p className="header-title">Stay on Track This Week</p>
              <Button onClick={() => setShowModal(true)}>Add Task</Button>
            </Space>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            Object.entries(grouped).map(([date, items], index) => (
              <div key={date} className="mb-2">
                <div className="list-container-header">
                  <Space gap={7}>
                    <p className="list-date">
                      {dayjs(date).format("ddd, MMM D")}
                    </p>
                    <ListDivider color={arrColor[index % arrColor.length]} />
                    <i>
                      <ChevronDown size={16} />
                    </i>
                  </Space>
                </div>
                <div className="list-container-body">
                  {items.length === 0 ? (
                    <p className="empty-list-text">No items for this day.</p>
                  ) : (
                    items.map((item) => (
                      <Space
                        fill
                        gap={10}
                        align="evenly"
                        alignItems="start"
                        key={item.$id}
                        className="mb-2"
                      >
                        <div>
                          <Checkbox
                            key={item.$id}
                            label={item.name}
                            id={item.$id}
                            checked={item.done}
                            onChange={(e) =>
                              handleUpdateTask(item.$id, e.target.checked)
                            }
                          />
                          {item.description && (
                            <p className="list-item-description">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <i
                          className="delete-icon"
                          onClick={() => deleteTask(item.$id)}
                        >
                          <Trash2 size={16} />
                        </i>
                      </Space>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
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
