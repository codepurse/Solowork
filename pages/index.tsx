import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { account } from "../constant/appwrite";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        console.log("✅ Logged in user:", currentUser);
        setUser(currentUser);
      } catch (err) {
        console.log(err)
        console.log("❌ No user is logged in, redirecting to login");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome {user?.name || "Guest"}!</h1>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </div>
  );
}
