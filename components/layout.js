import { useRouter } from "next/router";
import { useStore } from "../store/store";
import useWhiteBoardStore from "../store/whiteBoardStore";
import Toast from "./Elements/Toast";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  const router = useRouter();
  const { useStoreToast } = useStore();
  const { showToast } = useStoreToast();
  const { focusMode } = useWhiteBoardStore();
  return (
    <div>
      {router.pathname === "/login" || router.pathname === "/create" ? (
        <>{children}</>
      ) : (
        <>
          {showToast && <Toast />}
          {!focusMode && <Navbar />}
          {!focusMode && <Sidebar />}
          <main>{children}</main>
        </>
      )}
    </div>
  );
}
