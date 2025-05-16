import "animate.css";

import type { AppProps } from "next/app";
import AuthLayout from "../components/AuthLayout";
import Layout from "../components/layout";
import PageLayout from "../components/PageLayout";
import "../styles/index.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
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
