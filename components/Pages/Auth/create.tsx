import { ID } from "appwrite";
import { useState } from "react";
import {
    account,
    DATABASE_ID,
    databases,
    USER_PROFILES_COLLECTION_ID,
} from "../../../constant/appwrite";

export default function Create() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreate = async () => {
    try {
      const user = await account.create(ID.unique(), email, password);
      await databases.createDocument(
        DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          email,
          name,
          createdAt: new Date().toISOString(),
        }
      );
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-container">
      <h1>Create</h1>
      <div>
        <p className="create-label">Name</p>
        <input
          className="input-type"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <p className="create-label">Email</p>
        <input
          className="input-type"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <p className="create-label">Password</p>
        <input
          className="input-type"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <p className="create-label">Confirm Password</p>
        <input
          className="input-type"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button className="create-button" onClick={handleCreate}>
        Create
      </button>
    </div>
  );
}
