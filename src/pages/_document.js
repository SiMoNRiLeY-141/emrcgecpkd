// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <link rel="icon" href="https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/favicon.ico?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9vcy9mYXZpY29uLmljbyIsImlhdCI6MTcxNjM4OTk1NSwiZXhwIjoyMDMxNzQ5OTU1fQ.pS7XAYfr9OuB7EwJiMEemuRjUfstb7EPp0MUetEFixg&t=2024-05-22T14%3A59%3A16.270Z" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content="Electrical Maintenance and Research Club (EMRC) - GEC Sreekrishnapuram" />
          <meta property="og:description" content="Official website of the Electrical Maintenance and Research Club at Govt. Engineering College, Sreekrishnapuram. Stay updated with our latest news, events, and activities." />
          <meta property="og:image" content="https://tptqglihfsppnrrtukvw.supabase.co/storage/v1/object/sign/assets/logos/pre.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbG9vcy9wcmUuanBnIiwiaWF0IjoxNzE2Mzg5OTE3LCJleHAiOjIwMzE3NDk5MTd9.5drTGw6A8c_eRDFh1Kxox-E6tQ34Ksg8DcxlMOTu-kU&t=2024-05-22T14%3A58%3A38.182Z" />
          <meta property="og:image:width" content="500" />
          <meta property="og:image:height" content="281" />
          <meta property="og:url" content="https://simonriley-141.github.io/emrcgec/" />
          <meta property="og:type" content="website" />
          <title>EMRC GEC</title>
        </Head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
