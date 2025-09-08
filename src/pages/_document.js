import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en"  style={{ minHeight: "100vh", background: "#2d2d2d", fontFamily: "Arial, sans-serif"}}>

      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
