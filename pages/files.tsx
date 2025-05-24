import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Tabs } from "../components/Elements/Tab/Tab";
import DashboardFiles from "../components/Pages/Files/DashboardFiles";
import DonutChart from "../components/Pages/Files/DonutChart";
import FolderList from "../components/Pages/Files/FolderList";
export default function Files() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "folders", label: "Folders" },
  ];

  return (
    <Container className="files-container">
      <Row>
        <Col lg={9}>
          <div className="files-main-container">
            <div className="files-header">
              <h1 className="files-header-title">My Files</h1>
            </div>
            <div className="mt-1">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              {activeTab === "dashboard" && <DashboardFiles />}
              {activeTab === "folders" && <FolderList />}
            </div>
          </div>
        </Col>
        <Col lg={3}>
          <div className="files-side-info">
            <DonutChart />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
