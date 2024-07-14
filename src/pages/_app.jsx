import React, { useState, useEffect } from 'react'
import '../styles/global.css'

import PropTypes from 'prop-types'
import Head from 'next/head'
import Layout from '../components/layout'
import { useRouter } from 'next/router'

import darkTheme from '../theme/dark'

import Configure from './configure'

import stores from '../stores/index'

import { ACTIONS } from '../stores/constants'
// import '../styles/global.css'

// import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
// import { Web3Provider } from '@ethersproject/providers'

import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'
import { Web3Modal } from '../context/web3modal'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const [themeConfig, setThemeConfig] = useState(darkTheme)
  const [stalbeSwapConfigured, setStableSwapConfigured] = useState(false)
  const [accountConfigured, setAccountConfigured] = useState(false)

  // const { open } = useWeb3Modal()
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()

  // const [prevWalletProvider, setPrevWalletProvider] = useState(walletProvider)

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  // useEffect(() => {
  //   console.log('address, chainId, isConnected changed:', address, chainId, isConnected)
  // }, [address, chainId, isConnected])

  // useEffect(() => {
  //   if (address && isConnected && walletProvider && chainId) {
  //     stores.accountStore.setStore({
  //       account: { address },
  //       web3context: { library: { provider: walletProvider }, chainId },
  //     })
  //     stores.dispatcher.dispatch({
  //       type: ACTIONS.CONFIGURE_SS,
  //       content: { connected: true },
  //     })

  //     stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
  //   } else if (prevWalletProvider) {
  //     stores.accountStore.setStore({
  //       account: {},
  //       web3context: null,
  //     })
  //     stores.dispatcher.dispatch({
  //       type: ACTIONS.CONFIGURE_SS,
  //       content: { connected: false },
  //     })

  //     stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
  //   }
  //   setPrevWalletProvider(walletProvider)
  // }, [address, isConnected, walletProvider, prevWalletProvider, chainId])

  // DONT UN-COMMENT THIS LOL
  const changeTheme = (dark) => {
    // setThemeConfig(dark ? darkTheme : lightTheme)
    // localStorage.setItem('yearn.finance-dark-mode', dark ? 'dark' : 'light')
  }

  const accountConfigureReturned = () => {
    setAccountConfigured(true)
  }

  const stalbeSwapConfigureReturned = () => {
    setStableSwapConfigured(true)
  }

  useEffect(function () {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode')
    changeTheme(localStorageDarkMode ? localStorageDarkMode === 'dark' : false)
  }, [])

  useEffect(function () {
    stores.emitter.on(ACTIONS.CONFIGURED_SS, stalbeSwapConfigureReturned)
    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigureReturned)

    stores.dispatcher.dispatch({ type: ACTIONS.CONFIGURE_SS })
    stores.dispatcher.dispatch({ type: ACTIONS.CONFIGURE })

    return () => {
      stores.emitter.removeListener(ACTIONS.CONFIGURED_SS, stalbeSwapConfigureReturned)
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigureReturned)
    }
  }, [])

  const validateConfigured = () => {
    switch (router.pathname) {
      case '/':
        return accountConfigured
      default:
        return accountConfigured
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Kodo Exchange</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      {/* <Script defer data-domain="solidly.vision" src="https://plausible.io/js/plausible.js"></Script> */}
      {/* <ThemeProvider theme={themeConfig}> */}
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      {/* <CssBaseline /> */}
      <Web3Modal>
        {validateConfigured() && (
          <Layout changeTheme={changeTheme}>
            <Component {...pageProps} changeTheme={changeTheme} />
          </Layout>
        )}
        {!validateConfigured() && <Configure {...pageProps} />}
      </Web3Modal>
      {/* </ThemeProvider> */}
    </React.Fragment>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
