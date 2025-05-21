import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { account } from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Button from "../../Elements/Button";
import Switch from "../../Elements/Switch";
import Text from "../../Elements/Text";
import Space from "../../space";

export default function SecuritySettings() {
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);
  const [isLoadingTwoFactor, setIsLoadingTwoFactor] = useState<boolean>(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();

  useEffect(() => {
    setIsTwoFactorEnabled(user?.prefs?.twoFactor);
  }, [user]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await account.listSessions();
        setActiveSessions(response?.sessions);
        console.log("Active sessions:", response.sessions);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  const updateTwoFactor = async () => {
    setIsLoadingTwoFactor(true);
    try {
      await account.updatePrefs({
        twoFactor: isTwoFactorEnabled,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTwoFactor(false);
    }
  };

  const handlePasswordChange = async () => {
    setIsLoadingPassword(true);
    try {
      if (!password || !newPassword) {
        alert("Please fill in both password fields.");
        return;
      }

      await account.updatePassword(newPassword, password);
      alert("Password updated successfully!");
      setPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Failed to update password:", error);
      alert("Failed to update password. Please check your current password.");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const logoutSession = async (sessionId: string) => {
    try {
      await account.deleteSession(sessionId);
      console.log(`Logged out of session ${sessionId}`);
    } catch (error) {
      console.error("Failed to log out of session:", error);
    }
  };

  return (
    <div className="settings-content-right">
      <p className="settings-content-title-right">Security</p>
      <p className="settings-content-subtitle-right">
        Everything related to your security and privacy.
      </p>
      <hr className="not-faded-line" />
      <Container className="p-0">
        <Row className="mt-3">
          <Col lg={4}>
            <p className="settings-min-title">Password</p>
            <p className="settings-min-subtitle">
              Change your password to keep your account secure.
            </p>
          </Col>
          <Col lg={8}>
            <p className="settings-min-title settings-min-title-right">
              Current Password
            </p>
            <Text
              variant="md"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="settings-min-title mt-2 settings-min-title-right">
              New Password
            </p>
            <Text
              variant="md"
              type="password"
              placeholder="Enter your password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              className="ml-auto d-flex mt-3 mb-1"
              onClick={handlePasswordChange}
              loading={isLoadingPassword}
            >
              Save password
            </Button>
          </Col>
          <Col lg={12}>
            <div>
              <hr
                className="not-faded-line"
                style={{ margin: "10px 0px", background: "#252525" }}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col lg={4}>
            <p className="settings-min-title">Two-Factor Authentication</p>
            <p className="settings-min-subtitle">
              Enable two-factor authentication to protect your account.
            </p>
          </Col>
          <Col lg={8}>
            <Switch
              checked={isTwoFactorEnabled}
              onChange={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
              label="Enable Two-Factor Authentication"
            />
            <Button
              className="ml-auto d-flex mt-3 mb-1"
              onClick={updateTwoFactor}
              loading={isLoadingTwoFactor}
            >
              Save
            </Button>
          </Col>
          <Col lg={12}>
            <div>
              <hr
                className="not-faded-line"
                style={{ margin: "10px 0px", background: "#252525" }}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col lg={4}>
            <p className="settings-min-title">Active Sessions</p>
            <p className="settings-min-subtitle">
              View and manage your active sessions.
            </p>
          </Col>
          <Col lg={8}>
            <div className="active-sessions-container">
              {activeSessions.map((session) => (
                <Space
                  key={session.id}
                  className="active-session"
                  align="evenly"
                >
                  <div key={session.id}>
                    <Space>
                      <div>
                        <p className="session-client-name">
                          {session.clientName}
                        </p>
                        <p className="session-device-name">
                          {session.deviceName}
                        </p>
                      </div>
                    </Space>
                  </div>
                  <Space gap={15}>
                    <p
                      className={`${
                        session?.current.toString() === "true"
                          ? "session-current-time-true"
                          : "session-current-time-false"
                      }`}
                    >
                      {session?.current.toString() === "true" ? "Current" : ""}
                    </p>
                    <button
                      className="btn-delete"
                      onClick={() => logoutSession(session.id)}
                    >
                      <span>Logout</span>
                    </button>
                  </Space>
                </Space>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
