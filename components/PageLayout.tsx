import { useRouter } from "next/router";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const style =
    router.pathname === "/login"
      ? { marginLeft: "0ox" }
      : { marginLeft: "250px" };
  return (
    <div className="page-layout" style={style}>
      {children}
    </div>
  );
}
