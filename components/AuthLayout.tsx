import { Query } from "appwrite";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  account,
  DATABASE_ID,
  databases,
  PROJECTS_COLLECTION_ID,
} from "../constant/appwrite";
import { useStore } from "../store/store";
import FullLoader from "./FullLoader";

// Create a fetcher function outside the component
const projectsFetcher = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );
    return response.documents;
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    throw error; // Let SWR handle the error
  }
};

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRun = useRef(true);
  const { useStoreUser, useStoreProjects } = useStore();
  const { user, setUser } = useStoreUser();
  const { setProjects, setSelectedProject, selectedProject } =
    useStoreProjects();
  const [error, setError] = useState<string | null>(null);

  // Add SWR hook for projects
  const { data: projects, error: projectsError } = useSWR(
    // Only fetch if we have a user
    user && user.$id ? "projects" : null,
    () => projectsFetcher(user?.$id)
  );

  // Handle projects data effect
  useEffect(() => {
    if (projects) {
      setProjects(projects);
      if (projects.length > 0 && !selectedProject) {
        setSelectedProject(projects[0].$id);
      } else {
        setSelectedProject(selectedProject);
      }
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();
        setUser(user);

        // If no user and not on public routes, redirect to login
        if (
          !user &&
          router.pathname !== "/login" &&
          router.pathname !== "/create"
        ) {
          router.replace("/login");
          return;
        } else if (user) {
          // If user exists and on login page, redirect to dashboard
          if (router.pathname === "/login") {
            router.replace("/dashboard");
            return;
          }
        }
      } catch (error) {
        if (error?.code === 401 || error?.code === 403) {
          setUser(null);
          setError(error.message);
          if (router.pathname !== "/login" && router.pathname !== "/create") {
            router.replace("/login");
            return;
          }
        }
      } finally {
        setIsLoading(false);
        isFirstRun.current = false;
      }
    };

    checkUser();
  }, [router.pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <FullLoader />;
  }

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/create"];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  // If no user and not on a public route, don't render children
  // The redirect in the useEffect should handle navigation to the login page
  if (!user && !isPublicRoute) {
    // This is just a fallback - ideally the redirect above would have happened
    // If we're seeing this, it means the redirect didn't work properly
    if (typeof window !== "undefined") {
      router.replace("/login");
    }
    return <div>Redirecting to login...</div>;
  }

  // User is authenticated or on a public route, render children
  return <div>{children}</div>;
}
