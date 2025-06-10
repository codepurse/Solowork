import { File, Folder, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/router";
import GeneralList from "./GeneralList";

export default function General({ showSidebar }: { showSidebar: boolean }) {
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
      onClick: () => {},
    },
    {
      id: 4,
      name: "Notes",
      icon: <File size={17} color="gray" />,
      collapsed: true,
      onClick: () => {},
    },
  ];

  return (
    <div className="sidebar-menu">
      {showSidebar && <label className="sidebar-menu-title">General</label>}
      <div className="sidebar-menu-container">
        {menuItems.map((item) => (
          <GeneralList key={item.id} item={item} showSidebar={showSidebar} />
        ))}
      </div>
    </div>
  );
}
