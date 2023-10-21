import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins as FontSans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Fragment, useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { BASE_APP_PATH } from "@/utils/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  const isLayoutHidden = [`/login`, '/courses/[courseId]/[lectureId]'].includes(router.pathname);

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

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
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
            <main>
              <Component {...pageProps} />
            </main>
          </>
        </LayoutComponent>
      </SessionProvider>
    </QueryClientProvider>
  );
}
