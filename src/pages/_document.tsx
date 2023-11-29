import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="min-h-[100svh]" lang="en">
      <Head />
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
