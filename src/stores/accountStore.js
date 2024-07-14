import { ACTIONS, CONTRACTS, FALLBACK_RPC, CHAIN_ID } from './constants'
import Multicall from '@dopex-io/web3-multicall'
import { Timelapse } from '@material-ui/icons'

// import { injected, walletconnect, walletConnectV2, walletlink, network } from './connectors'

import Web3 from 'web3'

class Store {
  constructor(dispatcher, emitter) {
    this.dispatcher = dispatcher
    this.emitter = emitter
    this.isListenerAdded = false
    this.web3Instance = null

    this.store = {
      account: null,
      chainInvalid: false,
      web3context: null,
      tokens: [],
      // connectorsByName: {
      //   // MetaMask: injected,
      //   // TrustWallet: injected,
      //   // WalletConnect: walletconnect,
      //   // WalletConnectV2: walletConnectV2,
      //   // WalletLink: walletlink,
      // },
      gasPrices: {
        standard: 90,
        fast: 100,
        instant: 130,
      },
      gasSpeed: 'fast',
      currentBlock: 4773788,
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case ACTIONS.CONFIGURE:
            this.configure(payload)
            break
          default: {
          }
        }
      }.bind(this)
    )
  }

  getStore(index) {
    return this.store[index]
  }

  setStore(obj) {
    this.store = { ...this.store, ...obj }
    // console.log(this.store)
    return this.emitter.emit(ACTIONS.STORE_UPDATED)
  }

  configure = async () => {
    this.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
    // const autoConnect = localStorage.getItem('autoConnect')
    // if (autoConnect === 'false') {
    //   this.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
    //   return
    // }
    // this.getGasPrices();
    // injected.isAuthorized().then((isAuthorized) => {
    //   const { supportedChainIds } = injected
    //   // fall back to ethereum mainnet if chainId undefined
    //   const { chainId = process.env.NEXT_PUBLIC_CHAINID } = window.ethereum || {}
    //   const parsedChainId = parseInt(chainId, 16)
    //   const isChainSupported = supportedChainIds.includes(parsedChainId)
    //   if (!isChainSupported) {
    //     this.setStore({ chainInvalid: true })
    //     this.emitter.emit(ACTIONS.ACCOUNT_CHANGED)
    //   }
    //   if (isAuthorized && isChainSupported) {
    //     injected
    //       .activate()
    //       .then((a) => {
    //         this.setStore({
    //           account: { address: a.account },
    //           web3context: { library: { provider: a.provider }, connector: injected },
    //         })
    //         this.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
    //       })
    //       .then(() => {
    //         this.dispatcher.dispatch({
    //           type: ACTIONS.CONFIGURE_SS,
    //           content: { connected: true },
    //         })
    //       })
    //       .catch((e) => {
    //         this.emitter.emit(ACTIONS.ERROR, e)
    //         this.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
    //         this.dispatcher.dispatch({
    //           type: ACTIONS.CONFIGURE_SS,
    //           content: { connected: false },
    //         })
    //       })
    //   } else {
    //     //we can ignore if not authorized.
    //     this.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
    //     // this.emitter.emit(ACTIONS.CONFIGURED)
    //   }
    // })
    // if (window.ethereum) {
    //   this.updateAccount()
    // } else {
    //   window.removeEventListener('ethereum#initialized', this.updateAccount)
    //   window.addEventListener('ethereum#initialized', this.updateAccount, {
    //     once: true,
    //   })
    // }
  }

  // updateAccount = () => {
  //   // const that = this
  //   // if (!this.isListenerAdded) {
  //   //   window.ethereum.on('accountsChanged', function (accounts) {
  //   //     // console.log('====== accountsChanged event listener ======', accounts)
  //   //     // if (accounts.length === 0) {
  //   //     //   console.log('====== accountsChanged event listener 1 ======', accounts)
  //   //     //   that.setStore({
  //   //     //     account: {},
  //   //     //     web3context: null,
  //   //     //   })
  //   //     //   that.emitter.emit(ACTIONS.CONNECTION_DISCONNECTED)
  //   //     //   that.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
  //   //     //   that.dispatcher.dispatch({
  //   //     //     type: ACTIONS.CONFIGURE_SS,
  //   //     //     content: { connected: false },
  //   //     //   })
  //   //     // } else {
  //   //     console.log('====== accountsChanged event listener 2 ======', accounts)
  //   //     that.setStore({
  //   //       account: { address: accounts[0] },
  //   //       web3context: { library: { provider: window.ethereum }, connector: injected },
  //   //     })
  //   //     that.emitter.emit(ACTIONS.ACCOUNT_CHANGED)
  //   //     // that.emitter.emit(ACTIONS.CONNECTION_CONNECTED)
  //   //     that.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
  //   //     that.dispatcher.dispatch({
  //   //       type: ACTIONS.CONFIGURE_SS,
  //   //       content: { connected: true },
  //   //     })
  //   //     // }
  //   //   })
  //   //   window.ethereum.on('chainChanged', function (chainId) {
  //   //     console.log('====== chainChanged event listener ======')
  //   //     const supportedChainIds = [process.env.NEXT_PUBLIC_CHAINID.toLowerCase()]
  //   //     console.log('supportedChainIds', supportedChainIds)
  //   //     // const parsedChainId = parseInt(chainId + '', 16) + ''
  //   //     console.log('chainId', chainId)
  //   //     // console.log('parsedChainId', parsedChainId)
  //   //     const isChainSupported = supportedChainIds.includes(chainId.toLowerCase())
  //   //     console.log('isChainSupported', isChainSupported)
  //   //     that.setStore({ chainInvalid: !isChainSupported })
  //   //     that.emitter.emit(ACTIONS.ACCOUNT_CHANGED)
  //   //     that.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
  //   //     that.configure()
  //   //   })
  //   //   this.isListenerAdded = true
  //   // }
  // }

  getGasPrices = async (payload) => {
    const gasPrices = await this._getGasPrices()
    let gasSpeed = localStorage.getItem('yearn.finance-gas-speed')

    if (!gasSpeed) {
      gasSpeed = 'fast'
      localStorage.getItem('yearn.finance-gas-speed', 'fast')
    }

    this.setStore({ gasPrices, gasSpeed })
    this.emitter.emit(ACTIONS.GAS_PRICES_RETURNED)
  }

  _getGasPrices = async () => {
    try {
      const web3 = await this.getWeb3Provider()
      const gasPrice = await web3.eth.getGasPrice()
      const gasPriceInGwei = web3.utils.fromWei(gasPrice, 'gwei')
      return {
        standard: gasPriceInGwei,
        fast: gasPriceInGwei,
        instant: gasPriceInGwei,
      }
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  getGasPrice = async (speed) => {
    let gasSpeed = speed
    if (!speed) {
      gasSpeed = this.getStore('gasSpeed')
    }

    try {
      const web3 = await this.getWeb3Provider()
      const gasPrice = await web3.eth.getGasPrice()
      const gasPriceInGwei = web3.utils.fromWei(gasPrice, 'gwei')
      return gasPriceInGwei
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  getWeb3Provider = () => {
    if (this.web3Instance) {
      return this.web3Instance
    }

    let web3context = this.getStore('web3context')
    let provider = null

    if (web3context && web3context.chainId === parseInt(process.env.NEXT_PUBLIC_CHAINID, 16)) {
      provider = web3context.library.provider
    } else {
      provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_CHAIN_RPC)
    }

    if (!provider) {
      return null
    }
    this.web3Instance = new Web3(provider)
    return this.web3Instance
  }

  getMulticall = async (fallback) => {
    let web3 = await this.getWeb3Provider()
    if (fallback) {
      web3 = new Web3(new Web3.providers.HttpProvider(FALLBACK_RPC))
    }

    const multicall = new Multicall({
      multicallAddress: CONTRACTS.MULTICALL_ADDRESS,
      provider: web3,
    })
    return multicall
  }
}

export default Store
