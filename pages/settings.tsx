import { Col, Container, Row } from "react-bootstrap";

export default function Settings() {
  return (
    <Container fluid className="settings">
      <Row>
        <Col>
          <div className="settings-header">
            <p>Settings</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
