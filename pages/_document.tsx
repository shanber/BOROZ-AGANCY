import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar">
        <Head />
        <body className="bg-white text-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
