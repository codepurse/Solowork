import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/list");
  }, []);

  return <div style={{ padding: "2rem" }}></div>;
}
