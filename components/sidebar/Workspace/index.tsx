import { ChevronDown, File, LoaderPinwheel } from "lucide-react";
import { useRouter } from "next/router";
import { useStore } from "../../../store/store";
import Space from "../../space";

export default function Workspace({ showSidebar }: { showSidebar: boolean }) {
  const router = useRouter();
  const { useSidebar } = useStore();
  const { setSidebarSelected, sidebarSelected } = useSidebar();

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
      name: "Focus Mode",
      icon: <LoaderPinwheel size={17} color="gray" />,
      collapsed: false,
      onClick: () => router.push("/focus"),
    },
  ];
  return (
    <div className="sidebar-menu mt-2">
      {showSidebar && <label className="sidebar-menu-title">Workspace</label>}
      <div className="sidebar-menu-container">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="sidebar-menu-item"
            id={item.name === sidebarSelected ? "selectedGeneral" : ""}
          >
            <Space gap={10} align="evenly">
              <div
                onClick={() => {
                  item.onClick();
                  setSidebarSelected(item.name);
                }}
              >
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
