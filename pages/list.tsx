import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ChevronDown, Kanban, ListCheck, Trash2 } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Space from "../components/space";

import { Models, Query } from "appwrite";
import { useInView } from "react-intersection-observer";
import useSWR, { mutate } from "swr";
import Checkbox from "../components/Elements/Checkbox";
import { Tabs } from "../components/Elements/Tab/Tab";
import CalendarList from "../components/Pages/List/CalendarList";
import { ListDivider } from "../components/Pages/List/ListDivider";
import ListHeader from "../components/Pages/List/ListHeader";
import ListStatistics from "../components/Pages/List/ListStatistics";
import { StarButton } from "../components/Pages/Notes/StarNotes";
import {
  DATABASE_ID,
  LIST_COLLECTION_ID,
  databases,
} from "../constant/appwrite";

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

type ListItem = {
  name: string;
  description?: string;
  done: boolean;
  dateSched: string;
  repeat?: "daily" | "weekly" | "monthly";
  completedDates?: string[]; // Store dates when recurring task was completed
} & Models.Document;

const arrColor = ["#1ABC9C", "#2ECC71", "#3498DB", "#9B59B6"];

export default function List() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pendingUpdates = useRef<Record<string, NodeJS.Timeout>>({});
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const [dateRange, setDateRange] = useState({
    start: dayjs().startOf("day"),
    end: dayjs().add(6, "day").endOf("day"),
  });
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [dateSelected, setDateSelected] = useState(dayjs());

  // Add effect to update dateRange when dateSelected changes
  useEffect(() => {
    setDateRange({
      start: dateSelected.startOf("day"),
      end: dateSelected.add(6, "day").endOf("day"),
    });
    setOffset(0); // Reset offset when changing dates
    setHasMore(true); // Reset hasMore when changing dates
  }, [dateSelected]);

  const fetchList = async () => {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        LIST_COLLECTION_ID,
        [
          Query.orderAsc("dateSched"),
          Query.greaterThanEqual("dateSched", dateRange.start.toISOString()),
          Query.lessThanEqual("dateSched", dateRange.end.toISOString()),
          Query.limit(100),
          Query.offset(offset),
        ]
      );

      if (result.documents.length < 100) {
        setHasMore(false);
      }

      const processedDocs = processRecurringTasks(
        result.documents as ListItem[],
        dateRange.start.toISOString(),
        dateRange.end.toISOString()
      );
      return processedDocs;
    } catch (err) {
      console.error("Failed to fetch list:", err);
      return [];
    }
  };

  const { data, error } = useSWR(
    [`list`, dateRange.start.toISOString(), dateRange.end.toISOString()],
    fetchList,
    {
      revalidateOnFocus: false,
    }
  );

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

  // Add effect to load more dates when scrolling
  useEffect(() => {
    if (inView) {
      setDateRange((prev) => ({
        start: prev.start,
        end: dayjs(prev.end).add(7, "day").endOf("day"),
      }));
    }
  }, [inView]);

  const groupByDateWithPadding = (items: ListItem[]) => {
    const days: Record<string, ListItem[]> = {};
    let current = dateRange.start;

    while (current.isSameOrBefore(dateRange.end, "day")) {
      days[current.format("YYYY-MM-DD")] = [];
      current = current.add(1, "day");
    }

    items.forEach((item) => {
      const date = dayjs(item.dateSched).format("YYYY-MM-DD");
      if (days[date]) {
        days[date].push(item);
      }
    });
    return days;
  };

  const grouped = groupByDateWithPadding(list);

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

    // Handle recurring task instances
    const [originalId, dateStr] = id.split("_");
    const isRecurringInstance = dateStr !== undefined;

    // Optimistically update the local state
    setList((prevList) =>
      prevList.map((item) => (item.$id === id ? { ...item, done } : item))
    );

    // Set a new debounced update
    pendingUpdates.current[id] = setTimeout(async () => {
      try {
        if (isRecurringInstance) {
          // For recurring tasks, update the completedDates array
          const originalTask = list.find((item) => item.$id === originalId);
          const completedDates = new Set(originalTask?.completedDates || []);

          if (done) {
            completedDates.add(dateStr);
          } else {
            completedDates.delete(dateStr);
          }

          await databases.updateDocument(
            DATABASE_ID,
            LIST_COLLECTION_ID,
            originalId,
            {
              completedDates: Array.from(completedDates),
            }
          );
        } else {
          // For regular tasks, update as before
          await databases.updateDocument(DATABASE_ID, LIST_COLLECTION_ID, id, {
            done,
          });
        }

        // Remove the pending update after success
        delete pendingUpdates.current[id];
        // Refresh the list to get updated data
        mutate("list");
        mutate("listStatistics");
      } catch (error) {
        console.error("Failed to update task:", error);
        // Revert the optimistic update on error
        setList((prevList) =>
          prevList.map((item) =>
            item.$id === id ? { ...item, done: !done } : item
          )
        );
        delete pendingUpdates.current[id];
      }
    }, 500);
  };

  // Cleanup pending updates on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingUpdates.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, []);

  const DiverMemo = useMemo(() => {
    return function DiverComponent({ index }: { index: number }) {
      return (
        <ListDivider color={arrColor[index % arrColor.length]} index={index} />
      );
    };
  }, []);

  // Function to process recurring tasks
  const processRecurringTasks = (
    tasks: ListItem[],
    startDate: string,
    endDate: string
  ) => {
    const processedTasks: ListItem[] = [];

    tasks.forEach((task) => {
      if (!task.repeat) {
        // If it's a regular task within our date range, include it
        if (dayjs(task.dateSched).isBetween(startDate, endDate, "day", "[]")) {
          processedTasks.push(task);
        }
        return;
      }

      // Handle recurring tasks
      let currentDate = dayjs(startDate);
      const endDateTime = dayjs(endDate);

      while (currentDate.isSameOrBefore(endDateTime, "day")) {
        const originalTaskDate = dayjs(task.dateSched);
        let shouldInclude = false;

        switch (task.repeat) {
          case "daily":
            shouldInclude = true;
            break;
          case "weekly":
            shouldInclude = currentDate.day() === originalTaskDate.day();
            break;
          case "monthly":
            shouldInclude = currentDate.date() === originalTaskDate.date();
            break;
        }

        if (shouldInclude) {
          const dateStr = currentDate.format("YYYY-MM-DD");
          processedTasks.push({
            ...task,
            dateSched: currentDate.toISOString(),
            done: task.completedDates?.includes(dateStr) ?? false,
            // Add a virtual ID for recurring instances
            $id: `${task.$id}_${dateStr}`,
            isRecurringInstance: true,
            originalTaskId: task.$id,
          });
        }

        currentDate = currentDate.add(1, "day");
      }
    });

    return processedTasks.sort(
      (a, b) => dayjs(a.dateSched).valueOf() - dayjs(b.dateSched).valueOf()
    );
  };

  const handleStarToggle = async (id: string, isStarred: boolean) => {
    // Clear any pending update for this task
    if (pendingUpdates.current[id]) {
      clearTimeout(pendingUpdates.current[id]);
    }

    // Handle recurring task instances
    const [originalId, dateStr] = id.split("_");
    const isRecurringInstance = dateStr !== undefined;

    // Get the actual ID to update
    const updateId = isRecurringInstance ? originalId : id;

    // Optimistically update the local state
    setList((prevList) =>
      prevList.map((item) => {
        // For recurring tasks, update all instances
        if (isRecurringInstance) {
          const [itemOriginalId] = item.$id.split("_");
          if (itemOriginalId === originalId) {
            return { ...item, starred: !isStarred };
          }
        } else if (item.$id === id) {
          // For non-recurring tasks, just update the specific item
          return { ...item, starred: !isStarred };
        }
        return item;
      })
    );

    // Set a new debounced update
    pendingUpdates.current[id] = setTimeout(async () => {
      try {
        await databases.updateDocument(
          DATABASE_ID,
          LIST_COLLECTION_ID,
          updateId,
          {
            starred: !isStarred,
          }
        );

        // Remove the pending update after success
        delete pendingUpdates.current[id];
        // Refresh the list to get updated data
        mutate("list");
      } catch (error) {
        console.error("Failed to update task:", error);
        // Revert the optimistic update on error
        setList((prevList) =>
          prevList.map((item) => {
            // For recurring tasks, revert all instances
            if (isRecurringInstance) {
              const [itemOriginalId] = item.$id.split("_");
              if (itemOriginalId === originalId) {
                return { ...item, starred: isStarred };
              }
            } else if (item.$id === id) {
              // For non-recurring tasks, just revert the specific item
              return { ...item, starred: isStarred };
            }
            return item;
          })
        );
        delete pendingUpdates.current[id];
      }
    }, 500);
  };

  const tabs = [
    { id: "List", label: "Kanban", icon: <ListCheck size={15} /> },
    { id: "Kanban", label: "Table", icon: <Kanban size={15} /> },
  ];

  const [activeTab, setActiveTab] = useState("List");

  return (
    <div>
      <ListHeader />
      <Container className="list-container">
        <div style={{ marginTop: "-10px", marginBottom: "10px" }}>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        </div>
        {activeTab === "List" && (
          <Row>
            <Col>
              {loading ? (
                <p>Loading...</p>
              ) : (
                Object.entries(grouped).map(([date, items], index, array) => (
                  <div
                    key={date}
                    className="mb-2"
                    style={{ maxWidth: "1200px", margin: "0 auto" }}
                    ref={index === array.length - 1 ? ref : undefined}
                  >
                    <div className="list-container-header">
                      <Space gap={7}>
                        <p className="list-date">
                          {dayjs(date).format("ddd, MMM D")}
                        </p>
                        <DiverMemo index={index} />
                        <i>
                          <ChevronDown size={16} />
                        </i>
                      </Space>
                    </div>

                    {items.length === 0 ? (
                      <div
                        className="list-container-body"
                        style={{ padding: "10px" }}
                      >
                        <p className="empty-list-text">
                          No items for this day.
                        </p>
                      </div>
                    ) : (
                      <Fragment>
                        {items.map((item) => (
                          <Space key={item.$id} gap={20} alignItems="start">
                            <p className="list-item-time">
                              {dayjs(item.dateSched).format("HH:mm")}
                            </p>
                            <div className="list-container-body">
                              <Space
                                fill
                                gap={10}
                                align="evenly"
                                className="mb-2"
                              >
                                <div>
                                  <Checkbox
                                    key={item.$id}
                                    label={item.name}
                                    id={item.$id}
                                    checked={item.done}
                                    onChange={(e) =>
                                      handleUpdateTask(
                                        item.$id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  {item.description && (
                                    <p className="list-item-description">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <Space gap={10}>
                                  <div style={{ marginTop: "-2px" }}>
                                    <StarButton
                                      isStarred={item?.starred}
                                      onToggle={() => {
                                        handleStarToggle(
                                          item?.$id,
                                          item.starred
                                        );
                                      }}
                                      size={20}
                                    />
                                  </div>
                                  <i
                                    className="delete-icon"
                                    onClick={() => deleteTask(item.$id)}
                                  >
                                    <Trash2 size={16} />
                                  </i>
                                </Space>
                              </Space>
                            </div>
                          </Space>
                        ))}
                      </Fragment>
                    )}
                  </div>
                ))
              )}
            </Col>
            <Col className="list-sidepanel">
              <div style={{ position: "sticky", top: "140px" }}>
                <CalendarList
                  onDateSelect={setDateSelected}
                  selectedDate={dateSelected}
                />
                <div>
                  <ListStatistics selectedDate={dateSelected} />
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
