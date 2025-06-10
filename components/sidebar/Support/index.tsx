import { MessageCircle, Phone } from "lucide-react";
import { useRouter } from "next/router";
import Space from "../../space";

export default function Support({ showSidebar }: { showSidebar: boolean }) {
  const router = useRouter();
  const menuItems = [
    {
      id: 1,
      name: "Feedback",
      icon: <MessageCircle size={17} color="gray" />,
      beta: true,
      onClick: () => {
        router.push("/feedback");
      },
    },
    {
      id: 2,
      name: "Help Center",
      icon: <Phone size={17} color="gray" />,
      collapsed: true,
      onClick: () => {
        router.push("/help-center");
      },
    },
  ];
  return (
    <div className="sidebar-menu mt-2">
      {showSidebar && <label className="sidebar-menu-title">Support</label>}
      <div className="sidebar-menu-container">
        {menuItems.map((item) => (
          <div
            onClick={item.onClick}
            key={item.id}
            className="sidebar-menu-item"
          >
            <Space gap={10}>
              <i style={{ marginTop: "-3px" }}>{item.icon}</i>
              {showSidebar && (
                <>
                  <label className="sidebar-menu-item-name animate__animated animate__slideInLeft">
                    {item.name}
                  </label>
                  {item.beta && <span className="beta-badge">Beta</span>}
                </>
              )}
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
}
