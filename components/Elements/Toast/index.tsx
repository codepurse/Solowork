import { CircleAlert, CircleCheck, X } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "../../../store/store";
import Space from "../../space";

export default function Toast() {
  const { useStoreToast } = useStore();
  const {
    showToast,
    toastType,
    setToastMessage,
    toastMessage,
    setShowToast,
    setToastType,
    toastTitle,
    setToastTitle,
  } = useStoreToast();

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
        setToastType("success");
        setToastMessage("");
        setToastTitle("");
      }, 3000);
    }
  }, [showToast]);

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="toast-container animate__animated animate__fadeIn">
      <Space gap={10} alignItems="start">
        <i className="toast-icon">
          {toastType === "success" ? (
            <CircleCheck size={18} />
          ) : (
            <CircleAlert size={18} />
          )}
        </i>
        <div className="toast-content">
          <Space align="evenly" gap={5} fill>
            <p className="toast-title">{toastTitle}</p>
            <i className="toast-close" onClick={handleCloseToast}>
              <X size={18} />
            </i>
          </Space>
          <p className="toast-description">{toastMessage}</p>
        </div>
      </Space>
    </div>
  );
}
