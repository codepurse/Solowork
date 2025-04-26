import { OAuthProvider } from "appwrite";
import { account } from "../constant/appwrite";

const DATABASE_ID = "680c34d8000b99c9ed54";
const COLLECTION_ID = "680c34e9003adbf5c0ef";

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        "http://localhost:3000", // Redirect back here
        "http://localhost:3000/login"
      );
    } catch (error) {
      console.error("❌ Error during Google login:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Sign in to your account</h2>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
