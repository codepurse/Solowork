import { Query } from "appwrite";
import { DATABASE_ID, databases } from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import TableData from "./TableData";

import { useEffect, useState } from "react";

export default function TableView() {
  const { useStoreProjects } = useStore();
  const { selectedProject } = useStoreProjects();
  const TASK_COLLECTION_ID = "680dd9b5000ea2b16323";
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await databases.listDocuments(
        DATABASE_ID,
        TASK_COLLECTION_ID,
        [Query.equal("projectId", selectedProject)]
      );
      console.log(tasks);
      setTasks(tasks.documents);
    };
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject]);

  return (
    <div className="table-view-container">
      <div className="table-view-content">
        <TableData type="To Do" tasks={tasks} />
        <TableData type="In Progress" tasks={tasks} />
        <TableData type="Completed" tasks={tasks} />
        <TableData type="Cancelled" tasks={tasks} />
      </div>
    </div>
  );
}
