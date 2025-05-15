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
          marginLeft: showSidebar ? "250px" : "0px",
          width: showSidebar ? "calc(100vw - 250px)" : "100vw",
          zIndex: showSidebar ? 0 : 2,
        };

  return (
    <div className="page-layout" style={style}>
      {children}
    </div>
  );
}
