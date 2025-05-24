import { Lightbulb, MonitorCog, Moon } from "lucide-react";
import { Col, Container, Row } from "react-bootstrap";
import { account } from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Space from "../../space";
type ThemesCardProps = {
  label: string;
};

const ThemesCard = ({ label }: Readonly<ThemesCardProps>) => {
  const { useStoreToast } = useStore();
  const { setShowToast, setToastMessage, setToastTitle } = useStoreToast();

  const updateTheme = async () => {
    try {
      await account.updatePrefs({
        theme: label,
      });
      setShowToast(true);
      setToastTitle("Theme");
      setToastMessage("Theme updated! Your changes have been saved.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`settings-card ${label}`} onClick={updateTheme}>
      <div className="settings-card-header">
        <i>
          {label === "Light" ? (
            <Lightbulb size={15} />
          ) : label === "Dark" ? (
            <Moon size={15} />
          ) : (
            <MonitorCog size={15} />
          )}
        </i>
        <p className="settings-card-header-label">{label}</p>
      </div>
      <div className="settings-card-body">
        <div className="settings-card-body-item">
          <div className="div1" />
          <div className="div2" />
          <div className="div3" />
          <div className="div4" />
          <div className="div5" />
          <div className="div6" />
        </div>
      </div>
    </div>
  );
};

export default function GeneralSettings() {
  return (
    <div
      className="settings-content-right animate__fadeIn animate__animated"
      style={{ animationDuration: "0.3s" }}
    >
      <p className="settings-content-title-right">General</p>
      <p className="settings-content-subtitle-right">
        Everything related to your profile and access.
      </p>
      <hr className="not-faded-line" />
      <Container className="p-0">
        <Row>
          <Col>
            <p className="settings-min-title">Themes</p>
            <p className="settings-min-subtitle">
              Select how you want to see the app. Switch between light and dark
              mode and sync your settings across all your devices.
            </p>
          </Col>
          <Col lg={12} className="mt-4">
            <Space gap={15} fill align="evenly">
              <ThemesCard label="Light" />
              <ThemesCard label="Dark" />
              <ThemesCard label="System" />
            </Space>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
