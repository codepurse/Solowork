import { ID, Query } from "appwrite";
import { Send, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import {
  DAILY_CHECKLIST_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Space from "../../../space";

export default function DailyCheckList() {
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();
  const [dailyCheckList, setDailyCheckList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const fetchDailyCheckList = async () => {
    const dailyCheckList = await databases.listDocuments(
      DATABASE_ID,
      DAILY_CHECKLIST_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );
    return dailyCheckList.documents;
  };

  const { data } = useSWR(user.$id ? "daily_checklist" : null, () =>
    fetchDailyCheckList()
  );

  const completedTasks = dailyCheckList.flatMap((task) =>
    JSON.parse(task.items).filter((item) => item.completed)
  );

  const totalItems = dailyCheckList.reduce(
    (sum, task) => sum + JSON.parse(task.items).length,
    0
  );

  const progress =
    totalItems > 0 ? Math.round((completedTasks.length / totalItems) * 100) : 0;

  useEffect(() => {
    if (data) {
      const today = new Date().toDateString();

      const updatedList = data.map((task) => {
        const taskDate = new Date(task.date).toDateString();

        if (taskDate !== today) {
          // Reset completed fields
          const items = JSON.parse(task.items).map((item) => ({
            ...item,
            completed: false,
          }));

          // Immediately update backend
          databases.updateDocument(
            DATABASE_ID,
            DAILY_CHECKLIST_COLLECTION_ID,
            task.$id,
            {
              items: JSON.stringify(items),
              date: new Date().toISOString(), // update reset date
            }
          );

          return {
            ...task,
            items: JSON.stringify(items),
            date: new Date().toISOString(),
          };
        }

        return task;
      });

      setDailyCheckList(updatedList);
    }
  }, [data]);

  const handleAddTask = async () => {
    console.log(name);
    try {
      await databases.createDocument(
        DATABASE_ID,
        DAILY_CHECKLIST_COLLECTION_ID,
        ID.unique(),
        {
          items: JSON.stringify([
            {
              name: name,
              completed: false,
            },
          ]),
          date: new Date().toISOString(),
          completedTime: null,
          userId: user.$id,
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      mutate("daily_checklist");
    }
  };

  const updateTask = async (
    taskId: string,
    itemIndex: number,
    completed: boolean
  ) => {
    const updatedList = [...dailyCheckList];
    const taskIndex = updatedList.findIndex((task) => task.$id === taskId);

    if (taskIndex !== -1) {
      const items = JSON.parse(updatedList[taskIndex].items);
      items[itemIndex].completed = completed;

      // Update local state
      updatedList[taskIndex].items = JSON.stringify(items);
      setDailyCheckList(updatedList);

      // Update in Appwrite
      try {
        await databases.updateDocument(
          DATABASE_ID,
          DAILY_CHECKLIST_COLLECTION_ID,
          taskId,
          {
            items: JSON.stringify(items),
          }
        );
      } catch (error) {
        console.error("Failed to update task completion status", error);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        DAILY_CHECKLIST_COLLECTION_ID,
        taskId
      );
      mutate("daily_checklist"); // refresh the list
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div className="daily-checklist">
      <div className="daily-checklist-header">
        <p className="daily-checklist-title">Daily Check List</p>
        <p className="daily-checklist-subtitle">
          Check your daily tasks and complete them.
        </p>
      </div>
      <div className="daily-checklist-input-container">
        <Space gap={15} align="evenly">
          <input
            type="text"
            placeholder="Add a task"
            className="daily-checklist-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
                setName("");
              }
            }}
          />
          <i className="add-task-icon" onClick={handleAddTask}>
            <Send size={14} />
          </i>
        </Space>
      </div>
      <div className="daily-checklist-tasks">
        {dailyCheckList.map((task) => {
          const items = JSON.parse(task.items);
          return (
            <div key={task.$id}>
              {items.map((item, index) => (
                <Space key={index} align="evenly">
                  <div className="modern-checkbox mb-1" key={index}>
                    <input
                      type="checkbox"
                      id={`${task.$id}-${index}`}
                      checked={item.completed || false}
                      onChange={(e) =>
                        updateTask(task.$id, index, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`${task.$id}-${index}`}
                      className={item.completed ? "completed" : ""}
                    >
                      <span className="checkbox-icon"></span>
                      <span className="checkbox-text">{item.name}</span>
                    </label>
                  </div>
                  <div>
                    <Trash
                      size={15}
                      style={{ marginRight: "5px" }}
                      className="trash-icon"
                      onClick={() => handleDeleteTask(task.$id)}
                    />
                  </div>
                </Space>
              ))}
            </div>
          );
        })}
      </div>
      <div className="daily-checklist-footer">
        <p className="daily-checklist-footer-text">
          <span> Progress</span>: {progress}%
        </p>
        <div className="checklist-progress-bar">
          <div
            className="checklist-progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
