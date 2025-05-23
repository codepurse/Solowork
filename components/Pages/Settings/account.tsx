import { CircleX, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { account } from "../../../constant/appwrite";
import Button from "../../Elements/Button";
import Text from "../../Elements/Text";
import Space from "../../space";

export default function Account() {
  const profileImageRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] =
    useState<string>("/image/profile.png");
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [initialEmail, setInitialEmail] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await account.get();
      setFullName(user.prefs?.fullname);
      setInitialEmail(user.email);
      setEmail(user.email);
    };
    fetchUser();
  }, []);

  // Reset password when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      setPassword("");
    }
  }, [isModalOpen]);

  const handleProfileImageChange = () => {
    if (profileImageRef.current) {
      profileImageRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    const fileType = file.type;
    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      setError("Only JPG and PNG files are allowed");
      return;
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    // Reset error state
    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setProfileImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const currentUser = await account.get();
      const currentPrefs = currentUser.prefs || {};
      await account.updatePrefs({
        ...currentPrefs,
        fullname: fullName,
      });
      if (email !== initialEmail) {
        await account.updateEmail(email, password);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.log("❌ Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-content-right">
      <Space gap={10} align="evenly">
        <div>
          <p className="settings-content-title-right">Account</p>
          <p className="settings-content-subtitle-right">
            Everything related to your profile and access.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Save</Button>
      </Space>
      <hr className="not-faded-line" />
      <Container className="p-0">
        <Row>
          <Col lg={12}>
            <Space gap={15}>
              <img
                onClick={handleProfileImageChange}
                src={profileImage}
                alt="profile"
                className="profile-image"
              />
              <div>
                <p className="profile-image-title">Profile picture</p>
                <p className="profile-image-subtitle">
                  We support JPG and PNG files up to 10MB
                </p>
                {error && (
                  <p
                    style={{
                      color: "#ff5252",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>
            </Space>
          </Col>
          <input
            type="file"
            className="d-none"
            ref={profileImageRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
          />
        </Row>
        <Row className="align-items-center mt-4">
          <Col lg={4}>
            <p className="settings-title-inside-right">Full name</p>
            <p className="settings-title-inside-right-subtitle">
              Displayed across your profile and workspace.
            </p>
          </Col>
          <Col lg={8}>
            <Text variant="md" onChange={handleChange} value={fullName} />
          </Col>
        </Row>
        <Row className="mt-3 align-items-center">
          <Col lg={4}>
            <p className="settings-title-inside-right">Email address</p>
            <p className="settings-title-inside-right-subtitle">
              Your primary email address.
            </p>
          </Col>
          <Col lg={8}>
            <Text variant="md" onChange={handleChangeEmail} value={email} />
          </Col>
        </Row>
        <hr className="not-faded-line" />
        <Row className="mt-3 align-items-center">
          <Col lg={7}>
            <p className="settings-title-inside-right-delete">Delete account</p>
            <p className="settings-title-inside-right-subtitle">
              Would you like to delete your account? Deleting your account is a
              permanent action and cannot be undone.
            </p>
          </Col>
          <Col lg={5} className="d-flex justify-content-end">
            <button
              className="btn-delete"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <i>
                <Trash size={16} />
              </i>
              <span>Delete account</span>
            </button>
          </Col>
        </Row>
      </Container>
      <Modal
        className="modal-container"
        centered
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      >
        <Space align="evenly">
          <p className="modal-title">Enter password</p>
          <i className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
            <X size={17} />
          </i>
        </Space>
        <p className="modal-description">
          Please enter your password to confirm your action.
        </p>
        <div>
          <hr
            className="not-faded-line"
            style={{ margin: "5px 0px", background: "#252525" }}
          />
        </div>
        <div className="mt-2">
          <p className="modal-form-title">Password</p>
          <Text
            variant="md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
          />
          <Button
            loading={isLoading}
            className="mt-2"
            style={{ width: "100%" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </Modal>
      <Modal
        className="modal-container delete-user"
        centered
        show={isDeleteModalOpen}
      >
        <Space align="evenly">
          <p className="modal-title">Delete account</p>
          <i
            className="modal-close-icon"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <X size={17} />
          </i>
        </Space>
        <hr
          className="not-faded-line"
          style={{ margin: "5px 0px", background: "#252525" }}
        />
        <p className="modal-description">
          Are you sure you want to delete your account? This action is
          irreversible and cannot be undone.
        </p>
        <Space gap={10} className="mt-3 mb-2">
          <CircleX size={16} color="#ff5252" />
          <p className="modal-description-delete">
            Your account will be deleted and you’ll be logged out
          </p>
        </Space>
        <Space gap={10}>
          <CircleX size={16} color="#ff5252" />
          <p className="modal-description-delete">
            All data and settings will be erased permanently
          </p>
        </Space>
        <button
          className="btn-delete mt-3"
          onClick={() => setIsDeleteModalOpen(true)}
          style={{
            width: "100%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            background: "#ff5252",
          }}
        >
          <i>
            <Trash size={16} />
          </i>
          <span>Delete account</span>
        </button>
      </Modal>
    </div>
  );
}
