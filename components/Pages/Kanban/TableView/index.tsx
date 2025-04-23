import TableData from "./TableData";

export default function TableView() {
  return (
    <div className="table-view-container">
      <div className="table-view-content">
        <TableData type="To Do" />
        <TableData type="In Progress" />
        <TableData type="Completed" />
        <TableData type="Cancelled" />
      </div>
    </div>
  );
}
