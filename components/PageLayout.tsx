import { useRouter } from "next/router";
import { useStore } from "../store/store";
import useWhiteBoardStore from "../store/whiteBoardStore";
export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { useStoreSidebar } = useStore();
  const { showSidebar } = useStoreSidebar();
  const { focusMode } = useWhiteBoardStore();

  const style =
    router.pathname === "/login"
      ? { marginLeft: "0ox" }
      : {
          marginLeft: focusMode ? "0px" : showSidebar ? "250px" : "58px",
          width: focusMode
            ? "100vw"
            : showSidebar
            ? "calc(100vw - 250px)"
            : "calc(100vw - 58px)",
          zIndex: showSidebar ? 0 : 1,
        };

  return (
    <div className="page-layout" style={style}>
      {children}
    </div>
  );
}
