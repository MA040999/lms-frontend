import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <Component {...pageProps} />
    </main>
  );
}
