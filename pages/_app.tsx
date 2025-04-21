import type { AppProps } from "next/app";
import Layout from "../components/layout";
import PageLayout from "../components/PageLayout";
import "../styles/index.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </Layout>
  );
}
