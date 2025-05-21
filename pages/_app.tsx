import "animate.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import Layout from "../components/layout";
import PageLayout from "../components/PageLayout";
import { useStore } from "../store/store";
import "../styles/index.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();

  useEffect(() => {
    if (user) {
      console.log(user);
      const theme = user?.prefs?.theme;
      if (theme) {
        document.documentElement.classList.add(theme + "_Theme");
      }
    }
  }, [user]);

  return (
    <AuthLayout>
      <Layout>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Layout>
    </AuthLayout>
  );
}
