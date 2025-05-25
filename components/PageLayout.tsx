import { useRouter } from "next/router";
import { useStore } from "../store/store";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { useStoreSidebar } = useStore();
  const { showSidebar } = useStoreSidebar();

  const style =
    router.pathname === "/login"
      ? { marginLeft: "0ox" }
      : {
          marginLeft: showSidebar ? "250px" : "58px",
          width: showSidebar ? "calc(100vw - 250px)" : "calc(100vw - 58px)",
          zIndex: showSidebar ? 0 : 1,
        };

  return (
    <div className="page-layout" style={style}>
      {children}
    </div>
  );
}
