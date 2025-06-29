// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* AG Grid CSS from CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-grid.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-theme-alpine.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
