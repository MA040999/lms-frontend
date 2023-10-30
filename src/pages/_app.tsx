import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins as FontSans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { BASE_APP_PATH } from "@/utils/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress"
import { Toaster } from "@/components/ui/toaster";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  const isLayoutHidden = [
    `/login`,
    "/courses/[courseId]/[lectureId]",
    "/quizzes/[courseId]/[moduleId]",
  ].includes(router.pathname);

  const LayoutComponent = isLayoutHidden ? Fragment : Layout;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const [routeProgress, setRouteProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;

    router.events.on("routeChangeStart", () => {
      setRouteProgress(0);
      timer = setInterval(() => {
        setRouteProgress(currentRouteProgress => currentRouteProgress + 5);
      }, 800);
    });

    router.events.on("routeChangeComplete", () => {
      clearInterval(timer);
      setRouteProgress(100);
      timeoutTimer = setTimeout(() => setRouteProgress(0), 250);
    });

    return () => clearTimeout(timeoutTimer);
  }, [router.events]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
      {routeProgress !== 0 && <Progress className="sticky top-0 left-0 right-0 z-50 h-1 rounded-none" value={routeProgress} />}
        <LayoutComponent>
          <>
            <Head>
              <link rel="icon" href={BASE_APP_PATH + "favicon.ico"} />
              <title>Gufhtugu - Courses and Certification</title>
            </Head>
            <style jsx global>{`
              :root {
                --font-sans: ${fontSans.style.fontFamily};
              }
            `}</style>
            <main className="col-span-3 sm:col-span-1">
              <Component {...pageProps} />
            </main>
            <Toaster />
          </>
        </LayoutComponent>
      </SessionProvider>
    </QueryClientProvider>
  );
}
