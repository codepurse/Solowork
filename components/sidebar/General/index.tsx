import {
  Calendar,
  ChevronDown,
  File,
  Folder,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/router";
import Space from "../../space";

export default function General() {
  const router = useRouter();
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      icon: <LayoutDashboard size={17} color="gray" />,
      onClick: () => router.push("/dashboard"),
    },
    {
      id: 2,
      name: "Kanban",
      icon: <Folder size={17} color="gray" />,
      collapsed: true,
      onClick: () => router.push("/kanban"),
    },
    {
      id: 3,
      name: "Calendar",
      icon: <Calendar size={17} color="gray" />,
      onClick: () => router.push("/calendar"),
    },
    {
      id: 4,
      name: "Notes",
      icon: <File size={17} color="gray" />,
      collapsed: true,
      onClick: () => router.push("/notes"),
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
            <div onClick={item.onClick}>
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
