import { MessageCircle, Phone, Settings } from "lucide-react";
import { useRouter } from "next/router";
import Space from "../../space";

export default function Support() {
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
    {
      id: 3,
      name: "Settings",
      icon: <Settings size={17} color="gray" />,
      onClick: () => {
        router.push("/settings");
      },
    },
  ];
  return (
    <div className="sidebar-menu mt-2">
      <label className="sidebar-menu-title">Support</label>

      <div className="sidebar-menu-container">
        {menuItems.map((item) => (
          <div onClick={item.onClick} key={item.id}>
            <Space gap={10} className="sidebar-menu-item">
              <i style={{ marginTop: "-3px" }}>{item.icon}</i>
              <label className="sidebar-menu-item-name">{item.name}</label>
              {item.beta && <span className="beta-badge">Beta</span>}
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
}
