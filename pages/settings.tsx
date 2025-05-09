import { Col, Container, Row } from "react-bootstrap";
import Space from "../components/space";

export default function Settings() {
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
              <p className="settings-content-title">Account</p>
              <p className="settings-content-title">General</p>
              <p className="settings-content-title">Notifications</p>
              <p className="settings-content-title">Security & Privacy</p>
              <p className="settings-content-title">Billing</p>
              <p className="settings-content-title">Help</p>
            </Space>
          </div>
        </Col>
        <Col lg={8}>
          <div className="settings-content-right">
            <p className="settings-content-title-right">Account</p>
            <p className="settings-content-subtitle-right">
              Settings for your account
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
