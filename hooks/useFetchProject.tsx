import { ID, Query } from "appwrite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { account, databases } from "../constant/appwrite";
import { useStore } from "../store/store";

// Constants
const DATABASE_ID = "680c34d8000b99c9ed54";
const COLLECTION_ID = "680c34e9003adbf5c0ef";
const PROJECTS_COLLECTION_ID = "680daaa10025953e530d";

export const useFetchProject = () => {
  const router = useRouter();
  const { useStoreProjects, useStoreUser } = useStore();
  const { setProjects } = useStoreProjects();
  const { setUser } = useStoreUser();
  const [setLoading] = useState(true);
  const [setError] = useState(null);

  const fetchProjects = async (userId) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        [Query.equal("userId", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      setError("Failed to fetch projects");
      return [];
    }
  };

  const checkUserProfileExists = async (userId) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("userId", userId)]
      );
      return response.documents.length > 0;
    } catch (error) {
      console.error("❌ Error checking user profile:", error);
      setError("Failed to check user profile");
      return false;
    }
  };

  const createUserProfile = async (user) => {
    try {
      const profileExists = await checkUserProfileExists(user.$id);
      if (profileExists) return;

      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        userId: user.$id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error("❌ Failed to create user profile", error);
      setError("Failed to create user profile");
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        const currentUser = await account.get();
        await createUserProfile(currentUser);
        setUser(currentUser);

        // Fetch projects
        const userProjects = await fetchProjects(currentUser.$id);
        console.log(userProjects, "userProjects");
        setProjects(userProjects);
      } catch (error) {
        console.log("❌ Authentication error:", error);
        setError("Authentication failed");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [router, setProjects]);

  return {};
};
