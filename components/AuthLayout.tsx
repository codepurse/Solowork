import { Query } from "appwrite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  account,
  DATABASE_ID,
  databases,
  PROJECTS_COLLECTION_ID,
} from "../constant/appwrite";
import { useStore } from "../store/store";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { useStoreUser, useStoreProjects } = useStore();
  const { setUser } = useStoreUser();
  const { setProjects, setSelectedProject } = useStoreProjects();

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
      return [];
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
        if (!user) {
          router.replace("/login");
          return; // stop here
        } else {
          const project = await fetchProjects(user.$id);
          setProjects(project);
          setSelectedProject(project[0].$id);
        }
      } catch (error) {
        router.replace("/login");
        return; // stop here
      }

      setIsLoading(false); // only set loading false if user found
    };

    checkUser();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
}
