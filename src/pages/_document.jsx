/* eslint-disable react/jsx-filename-extension */
// import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
// import { ServerStyleSheets } from '@material-ui/core/styles'

// メイン ページとソーシャル ネットワークのサムネイルからのすべての情報がここに表示されます
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="The Native Liquidity Ensemble of Taiko." />
          <meta itemProp="name" content="Kodo Exchange" />
          <meta itemProp="description" content="The Native Liquidity Ensemble of Taiko." />
          <meta itemProp="image" content="http://www.kodo.exchange/kodo.jpg" />
          <meta name="og:title" content="Kodo Exchange" />
          <meta name="og:description" content="The Native Liquidity Ensemble of Taiko." />
          <meta name="og:image" content="https://www.kodo.exchange/kodo.jpg" />
          <meta name="og:url" content="https://www.kodo.exchange" />
          <meta property="og:type" content="dApp" />
          <meta name="twitter:title" content="Kodo Exchange" />
          <meta name="twitter:description" content="The Native Liquidity Ensemble of Taiko." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@kodohq" />
          <meta name="twitter:creator" content="@kodohq" />
          <meta name="twitter:image" content="https://www.kodo.exchange/kodo.jpg" />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <body className="bg-black text-white font-normal">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
