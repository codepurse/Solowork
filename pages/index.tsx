import { useRouter } from "next/router";
import { account } from "../constant/appwrite";
import { useStore } from "../store/store";

export default function Home() {
  const router = useRouter();
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();

  const handleLogout = async () => {
    await account.deleteSession("current");
    router.push("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "white" }}>Welcome {user?.name || "Guest"}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
