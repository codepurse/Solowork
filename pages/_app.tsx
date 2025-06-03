import "animate.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import Layout from "../components/layout";
import PageLayout from "../components/PageLayout";
import { useStore } from "../store/store";
import "../styles/index.scss";

const PixelSpirit = dynamic(() => import("../components/Companion"), {
  ssr: false,
});

const CompanionBird = dynamic(() => import("../components/CompanionBird"), {
  ssr: false,
});

const CompanionIceCube = dynamic(
  () => import("../components/CompanionIceCube"),
  {
    ssr: false,
  }
);

const CompanionGhost = dynamic(() => import("../components/CompanionGhost"), {
  ssr: false,
});

const CompanionPanda = dynamic(() => import("../components/CompanionPanda"), {
  ssr: false,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({
      x: window.innerWidth - 80,
      y: window.innerHeight - 80,
    });
  }, []);

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
      {/*   <PixelSpirit initialX={position.x} initialY={position.y} /> */}
      {/*   <CompanionIceCube /> */}
      {/*     <CompanionGhost /> */}
      {/* <CompanionPanda /> */}
      <Layout>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Layout>
    </AuthLayout>
  );
}
