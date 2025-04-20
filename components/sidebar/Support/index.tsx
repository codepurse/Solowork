import { MessageCircle, Phone, Settings } from "lucide-react";
import Space from "../../space";

export default function Support() {
  const menuItems = [
    {
      id: 1,
      name: "Feedback",
      icon: <MessageCircle size={17} color="gray" />,
      beta: true,
    },
    {
      id: 2,
      name: "Help Center",
      icon: <Phone size={17} color="gray" />,
      collapsed: true,
    },
    {
      id: 3,
      name: "Settings",
      icon: <Settings size={17} color="gray" />,
    },
  ];
  return (
    <div className="sidebar-menu mt-2">
      <label className="sidebar-menu-title">Support</label>
      <div className="sidebar-menu-container">
        {menuItems.map((item) => (
          <Space key={item.id} gap={10} className="sidebar-menu-item">
            <i style={{ marginTop: "-3px" }}>{item.icon}</i>
            <label className="sidebar-menu-item-name">{item.name}</label>
            {item.beta && <span className="beta-badge">Beta</span>}
          </Space>
        ))}
      </div>
    </div>
  );
}
