import { useEffect, useRef, useState } from "react";
import Space from "../../space";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    const el = tabRefs.current[index];
    if (el) {
      setSliderStyle({
        width: el.offsetWidth,
        left: el.offsetLeft,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="tabs-container">
      {tabs.map((tab, i) => (
        <div
          className="tab-container"
          key={tab.id}
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          onClick={() => onTabChange(tab.id)}
        >
          <Space gap={5}>
            {tab?.icon && <i style={{ color: "#888" }}>{tab.icon}</i>}
            <button className={`tab ${activeTab === tab.id ? "active" : ""}`}>
              {tab.label}
            </button>
          </Space>
        </div>
      ))}
      <div className="tab-slider" style={sliderStyle} />
    </div>
  );
};
