import { ID, Query } from "appwrite";
import { Plus } from "lucide-react";
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
    return dailyCheckList;
  };

  const { data } = useSWR(user.$id ? "daily_checklist" : null, () =>
    fetchDailyCheckList()
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      setDailyCheckList(data.documents);
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

  const handleCheckboxChange = (taskId, itemIndex, isCompleted) => {
    const updatedList = [...dailyCheckList];
    const taskIndex = updatedList.findIndex((task) => task.$id === taskId);

    if (taskIndex !== -1) {
      const items = JSON.parse(updatedList[taskIndex].items);
      items[itemIndex].completed = isCompleted;

      updatedList[taskIndex].items = JSON.stringify(items);
      setDailyCheckList(updatedList);

      databases.updateDocument(
        DATABASE_ID,
        DAILY_CHECKLIST_COLLECTION_ID,
        taskId,
        { items: JSON.stringify(items) }
      );
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
            <Plus size={14} />
          </i>
        </Space>
      </div>
      <div className="daily-checklist-tasks">
        {dailyCheckList.map((task) => {
          const items = JSON.parse(task.items);
          return (
            <div key={task.$id}>
              {items.map((item, index) => (
                <Space key={index} className="task-item">
                  <div className="modern-checkbox">
                    <input
                      type="checkbox"
                      id={`${task.$id}-${index}`}
                      checked={item.completed || false}
                      onChange={(e) =>
                        handleCheckboxChange(task.$id, index, e.target.checked)
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
                </Space>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
