// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google Analytics */}
          <script
            defer
            src="https://www.googletagmanager.com/gtag/js?id=G-GFJQXE1T6K"
          ></script>
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-GFJQXE1T6K');
              `,
            }}
          />
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />
          <meta name="bingbot" content="index, follow" />
          {/* Canonical Tag */}
          <link rel="canonical" href="https://emrcgecpkd.vercel.app/" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
