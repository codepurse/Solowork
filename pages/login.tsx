import { OAuthProvider } from "appwrite";
import { useRouter } from "next/router";
import { useState } from "react";
import { account } from "../constant/appwrite";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        "http://localhost:3000", // Redirect back here
        "http://localhost:3000/login"
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await account.createEmailPasswordSession(email, password);
      setSuccess("Login successful");
      router.push("/");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      console.log("❌ Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Sign in to your account</h2>
        <p className="success-message">{success}</p>
        <p className="error-message" style={{ color: "red" }}>
          {error}
        </p>
        <input
          type="email"
          placeholder="Email"
          className="input-type"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          className="input-type"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
}
