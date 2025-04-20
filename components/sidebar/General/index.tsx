import {
  Calendar,
  ChevronDown,
  File,
  Folder,
  LayoutDashboard,
} from "lucide-react";
import Space from "../../space";

export default function General() {
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      icon: <LayoutDashboard size={17} color="gray"/>,
    },
    {
      id: 2,
      name: "Kanban",
      icon: <Folder size={17} color="gray"/>,
      collapsed: true,
    },
    {
      id: 3,
      name: "Calendar",
      icon: <Calendar size={17} color="gray"/>,
    },
    {
      id: 4,
      name: "Notes",
      icon: <File size={17} color="gray"/>,
      collapsed: true,
    },
  ];
  return (
    <div className="sidebar-menu">
      <label className="sidebar-menu-title">General</label>
      <div className="sidebar-menu-container">
        {menuItems.map((item) => (
          <Space
            key={item.id}
            gap={10}
            className="sidebar-menu-item"
            align="evenly"
          >
            <div>
              <Space gap={10}>
                <i style={{ marginTop: "-3px" }}>{item.icon}</i>
                <label className="sidebar-menu-item-name">{item.name}</label>
              </Space>
            </div>
            {item.collapsed && <ChevronDown size={17} />}
          </Space>
        ))}
      </div>
    </div>
  );
}
