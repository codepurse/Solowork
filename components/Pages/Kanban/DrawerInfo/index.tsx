import { Pencil, Timer, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../../store/store";
import {
  getColor,
  getColorPriority,
  tagsClass,
} from "../../../../utils/CommonFunc";
import Badge from "../../../Elements/Badge";
import Space from "../../../space";

export default function DrawerInfo() {
  const { useStoreKanban } = useStore();
  const { drawerInfo, setShowDrawerInfo } = useStoreKanban();
  const [activeTab, setActiveTab] = useState<number>(1);

  useEffect(() => {
    console.log(drawerInfo);
  }, [drawerInfo]);

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };

  const handleCloseDrawer = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDrawerInfo(false);
  };

  return (
    <div className="drawer-info animate__animated animate__slideInRight">
      <div className="drawer-controls">
        <Space gap={10} align="end">
          <i>
            <Timer size={15} />
          </i>
          <i>
            <Pencil size={15} />
          </i>
          <i onClick={handleCloseDrawer}>
            <X size={18} />
          </i>
        </Space>
      </div>
      <div className="drawer-info-content">
        <p className="task-title">{drawerInfo?.title}</p>
        <div className="task-details">
          <Space gap={10} className="task-details-row">
            <div style={{ minWidth: "85px" }}>
              <p className="task-details-label">Status</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge className={getColor(drawerInfo?.status)}>
                {drawerInfo?.status}
              </Badge>
            </div>
          </Space>
          <Space gap={10} className="task-details-row">
            <div style={{ minWidth: "85px" }}>
              <p className="task-details-label">Due Date</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <p className="task-details-value">{drawerInfo?.dueDate}</p>
            </div>
          </Space>
          <Space gap={10} className="task-details-row">
            <div style={{ minWidth: "85px" }}>
              <p className="task-details-label">Priority</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge className={getColorPriority(drawerInfo?.priority)}>
                {drawerInfo?.priority}
              </Badge>
            </div>
          </Space>
          <Space gap={10} className="task-details-row">
            <div style={{ minWidth: "85px" }}>
              <p className="task-details-label">Tags</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {drawerInfo?.tags.length === 0 ? (
                <p className="task-details-value">-</p>
              ) : (
                drawerInfo?.tags.map((tag) => (
                  <p
                    key={tag}
                    style={{ padding: "1px 5px", borderRadius: "5px" }}
                    className={`${
                      tagsClass[Math.floor(Math.random() * tagsClass.length)]
                    } task-details-value`}
                  >
                    {tag}
                  </p>
                ))
              )}
            </div>
          </Space>
          <div className="task-details-tabs">
            <Space gap={15}>
              <p
                className="task-details-tab"
                id={activeTab === 1 ? "active" : ""}
                onClick={() => handleTabClick(1)}
              >
                Description
              </p>
              <p
                className="task-details-tab"
                id={activeTab === 2 ? "active" : ""}
                onClick={() => handleTabClick(2)}
              >
                Comments
              </p>
              <p
                className="task-details-tab"
                id={activeTab === 3 ? "active" : ""}
                onClick={() => handleTabClick(3)}
              >
                Attachments
              </p>
            </Space>
          </div>
          <div className="task-details-tab-content">
            {activeTab === 1 && (
              <p className="task-details-tab-content-text">
                {drawerInfo?.description}
              </p>
            )}
            {activeTab === 2 && (
              <p className="task-details-tab-content-text">
                {drawerInfo?.comments}
              </p>
            )}
            {activeTab === 3 && (
              <p className="task-details-tab-content-text">
                {drawerInfo?.attachments}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
