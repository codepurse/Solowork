import {
  ChartLine,
  ChevronDown,
  Construction,
  File,
  FolderSymlink,
} from "lucide-react";
import Space from "../../space";

export default function Workspace() {
  const menuItems = [
    {
      id: 1,
      name: "Documents",
      icon: <File size={17} color="gray" />,
      collapsed: true,
    },
    {
      id: 2,
      name: "Roadmap",
      icon: <Construction size={17} color="gray" />,
      collapsed: true,
    },
    {
      id: 3,
      name: "Resources",
      icon: <FolderSymlink size={17} color="gray" />,
    },
    {
      id: 4,
      name: "Analytics",
      icon: <ChartLine size={17} color="gray" />,
    },
  ];
  return (
    <div className="sidebar-menu mt-2">
      <label className="sidebar-menu-title">Workspace</label>
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
