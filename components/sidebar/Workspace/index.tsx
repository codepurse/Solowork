import {
  ChartLine,
  ChevronDown,
  Construction,
  File,
  FolderSymlink,
} from "lucide-react";
import { useRouter } from "next/router";
import Space from "../../space";

export default function Workspace({ showSidebar }: { showSidebar: boolean }) {
  const router = useRouter();
  const menuItems = [
    {
      id: 1,
      name: "Documents",
      icon: <File size={17} color="gray" />,
      collapsed: true,
      onClick: () => router.push("/files"),
    },
    {
      id: 2,
      name: "Roadmap",
      icon: <Construction size={17} color="gray" />,
      collapsed: true,
      onClick: () => router.push("/roadmap"),
    },
    {
      id: 3,
      name: "Resources",
      icon: <FolderSymlink size={17} color="gray" />,
      collapsed: true,
      onClick: () => router.push("/resources"),
    },
    {
      id: 4,
      name: "Analytics",
      icon: <ChartLine size={17} color="gray" />,
      collapsed: true,
      onClick: () => router.push("/analytics"),
    },
  ];
  return (
    <div className="sidebar-menu mt-2">
      {showSidebar && <label className="sidebar-menu-title">Workspace</label>}
      <div className="sidebar-menu-container">
        {menuItems.map((item) => (
          <div key={item.id} className="sidebar-menu-item">
            <Space gap={10} align="evenly">
              <div onClick={item.onClick}>
                <Space gap={10}>
                  <i style={{ marginTop: "-3px" }}>{item.icon}</i>
                  {showSidebar && (
                    <label className="sidebar-menu-item-name animate__animated animate__slideInLeft">
                      {item.name}
                    </label>
                  )}
                </Space>
              </div>
              {showSidebar && (
                <div>{item.collapsed && <ChevronDown size={17} />}</div>
              )}
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
}
