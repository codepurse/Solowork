import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";
export default function Layout({ children }) {
  const router = useRouter();
  return (
    <div>
      {router.pathname === "/login" || router.pathname === "/create" ? (
        <>{children}</>
      ) : (
        <>
          <Navbar />
          <Sidebar />
          <main>{children}</main>
        </>
      )}
    </div>
  );
}
