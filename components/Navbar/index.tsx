import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { account } from "../../constant/appwrite";
import { useStore } from "../../store/store";
import Text from "../Elements/Text";
import Space from "../space";

export default function Navbar() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { useStoreUser, useStoreSidebar } = useStore();
  const { user } = useStoreUser();
  const { setShowSidebar, showSidebar } = useStoreSidebar();

  const handleShow = () => setShow((prev) => !prev);

  const handleLogout = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      await account.deleteSession("current");
      // Redirect to login or homepage
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleShowSidebar = () => setShowSidebar(!showSidebar);

  const style = {
    width: showSidebar ? "calc(100vw - 250px)" : "calc(100vw - 50px)",
  };

  return (
    <div className="navbar-container" style={style}>
      <Space align="evenly" fill>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <i className="menu-icon" onClick={handleShowSidebar}>
            {showSidebar ? (
              <ArrowLeftToLine size={18} />
            ) : (
              <ArrowRightToLine size={18} />
            )}
          </i>
          <Text className="input-type" as="search" variant="md" />
        </div>
        <div
          style={{ cursor: "pointer", position: "relative" }}
          onClick={handleShow}
        >
          <Space gap={10}>
            <img src="/image/pngegg.png" alt="avatar" className="avatar-user" />
            <div>
              <Space direction="column" alignItems="start">
                <p className="span-user">{user?.prefs?.fullname}</p>
                <p className="label-email">{user?.email}</p>
              </Space>
            </div>
            <i>
              <ChevronDown size={15} color="#fff" />
            </i>
          </Space>
          {show && (
            <div className="dropdown-profile">
              <p className="dropdown-items">
                <UserRound size={15} />
                My Profile
              </p>
              <p className="dropdown-items">
                <Settings size={15} />
                Settings
              </p>
              <p
                className="dropdown-items logout"
                onClick={(e) => {
                  handleLogout(e);
                }}
              >
                <LogOut size={15} />
                Logout
              </p>
            </div>
          )}
        </div>
      </Space>
    </div>
  );
}
