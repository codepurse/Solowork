import TableData from "./TableData";

export default function TableView({ tasksList }) {
  return (
    <div className="table-view-container">
      <div className="table-view-content">
        <TableData type="To Do" tasks={tasksList} />
        <TableData type="In Progress" tasks={tasksList} />
        <TableData type="Completed" tasks={tasksList} />
        <TableData type="Cancelled" tasks={tasksList} />
      </div>
    </div>
  );
}
