import { useRouter } from "next/router";
import { useStore } from "../store/store";
import Toast from "./Elements/Toast";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  const router = useRouter();
  const { useStoreToast } = useStore();
  const { showToast, toastType, toastMessage } = useStoreToast();

  return (
    <div>
      {router.pathname === "/login" || router.pathname === "/create" ? (
        <>{children}</>
      ) : (
        <>
          {showToast && <Toast />}
          <Navbar />
          <Sidebar />
          <main>{children}</main>
        </>
      )}
    </div>
  );
}
