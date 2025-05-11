import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Account from "../components/Pages/Settings/account";
import Space from "../components/space";

export default function Settings() {
  const [active, setActive] = useState("account");

  const handleClick = (e: any) => {
    setActive(e);
  };
  
  return (
    <Container className="settings">
      <Row>
        <Col>
          <div className="settings-header">
            <p className="settings-header-title">Settings</p>
            <p className="settings-header-subtitle">
              Manage your user profile and preferences
            </p>
            <hr className="not-faded-line" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col style={{ width: "250px", maxWidth: "250px" }}>
          <div className="settings-content">
            <Space gap={8} direction="column" alignItems="start">
              <p
                className="settings-content-title"
                onClick={() => handleClick("account")}
              >
                Account
              </p>
              <p
                className="settings-content-title"
                onClick={() => handleClick("general")}
              >
                General
              </p>
              <p
                className="settings-content-title"
                onClick={() => handleClick("notifications")}
              >
                Notifications
              </p>
              <p
                className="settings-content-title"
                onClick={() => handleClick("security")}
              >
                Security & Privacy
              </p>
              <p
                className="settings-content-title"
                onClick={() => handleClick("billing")}
              >
                Billing
              </p>
              <p
                className="settings-content-title"
                onClick={() => handleClick("help")}
              >
                Help
              </p>
            </Space>
          </div>
        </Col>
        <Col lg={8}>{active === "account" && <Account />}</Col>
      </Row>
    </Container>
  );
}
