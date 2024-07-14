// import { useState, useEffect, Fragment } from 'react'
// import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
// // import { Web3Provider } from '@ethersproject/providers'

// import { ACTIONS } from '../../stores/constants'

// import stores from '../../stores'

// import { formatAddress } from '../../utils'
// import Image from 'next/image'
// import { PowerIcon } from '@heroicons/react/24/solid'
// import { XMarkIcon } from '@heroicons/react/24/solid'
// import { Dialog, Transition } from '@headlessui/react'
// import { Triangle } from 'react-loader-spinner'
// import {
//   useWeb3Modal,
//   useWeb3ModalState,
//   useWeb3ModalTheme,
//   useWeb3ModalEvents,
//   useWalletInfo,
//   useWeb3ModalAccount,
//   useWeb3ModalProvider,
// } from '@web3modal/ethers/react'

// function ConnectorList({ isConnectorListChecked, setIsConnectorListChecked }) {
//   const context = useWeb3React()
//   const { open } = useWeb3Modal()
//   const state = useWeb3ModalState()
//   const { themeMode, themeVariables, setThemeMode } = useWeb3ModalTheme()
//   const events = useWeb3ModalEvents()
//   const { address, chainId, isConnected } = useWeb3ModalAccount()
//   const { walletProvider } = useWeb3ModalProvider()
//   const { walletInfo } = useWalletInfo()

//   const { connector, library, account, activate, active, error } = context
//   const [activatingConnector, setActivatingConnector] = useState() // Loading

//   const [prevWalletProvider, setPrevWalletProvider] = useState(walletProvider)

//   const localContext = stores.accountStore.getStore('web3context')
//   var localConnector = null
//   if (localContext) {
//     localConnector = localContext.connector
//   }
//   // var connectorsByName = stores.accountStore.getStore('connectorsByName')

//   useEffect(() => {
//     console.log('open changed:', open)
//   }, [open])

//   useEffect(() => {
//     console.log('state changed:', state)
//   }, [state])

//   useEffect(() => {
//     console.log('themeMode changed:', themeMode)
//   }, [themeMode])

//   useEffect(() => {
//     console.log('themeVariables changed:', themeVariables)
//   }, [themeVariables])

//   useEffect(() => {
//     console.log('events changed:', events)
//   }, [events])

//   useEffect(() => {
//     console.log('walletInfo changed:', walletInfo)
//   }, [walletInfo])

//   useEffect(() => {
//     console.log('address, chainId, isConnected changed:', address, chainId, isConnected)
//   }, [address, chainId, isConnected])

//   // useEffect(() => {
//   //   if (activatingConnector && activatingConnector === connector) {
//   //     setActivatingConnector(undefined)
//   //   }
//   // }, [activatingConnector, connector])

//   useEffect(() => {
//     if (address && isConnected && walletProvider) {
//       stores.accountStore.setStore({
//         account: { address },
//         web3context: { library: { provider: walletProvider } },
//       })
//       stores.dispatcher.dispatch({
//         type: ACTIONS.CONFIGURE_SS,
//         content: { connected: true },
//       })
//       // stores.emitter.emit(ACTIONS.CONNECTION_CONNECTED)
//       stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
//     } else if (prevWalletProvider) {
//       stores.accountStore.setStore({
//         account: {},
//         web3context: null,
//       })
//       stores.dispatcher.dispatch({
//         type: ACTIONS.CONFIGURE_SS,
//         content: { connected: false },
//       })
//       // stores.emitter.emit(ACTIONS.CONNECTION_DISCONNECTED)
//       stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
//     }
//     setPrevWalletProvider(walletProvider)
//   }, [address, isConnected, walletProvider, prevWalletProvider])

//   // useEffect(() => {
//   //   const connectionConnected = () => {
//   //     stores.dispatcher.dispatch({
//   //       type: ACTIONS.CONFIGURE_SS,
//   //       content: { connected: true },
//   //     })
//   //   }

//   //   const connectionDisconnected = () => {
//   //     stores.dispatcher.dispatch({
//   //       type: ACTIONS.CONFIGURE_SS,
//   //       content: { connected: false },
//   //     })
//   //   }

//   //   stores.emitter.on(ACTIONS.CONNECTION_CONNECTED, connectionConnected)
//   //   stores.emitter.on(ACTIONS.CONNECTION_DISCONNECTED, connectionDisconnected)

//   //   return () => {
//   //     stores.emitter.removeListener(ACTIONS.CONNECTION_CONNECTED, connectionConnected)
//   //     stores.emitter.removeListener(ACTIONS.CONNECTION_DISCONNECTED, connectionDisconnected)
//   //   }
//   // }, [])

//   return (
//     <>
//       <button
//         className="flex items-center justify-center bg-pink-primary text-white text-[13px] leading-[17px] font-bold text-center whitespace-nowrap rounded-[10px] h-[38px] px-5 py-[11px] transition-colors"
//         onClick={() => open()}
//       >
//         CONNECT
//       </button>
//     </>
//   )
// }

// function ConnectorStatus(props) {
//   const accountStore = stores.accountStore.getStore('account')
//   const connectorsByName = stores.accountStore.getStore('connectorsByName')

//   const context = useWeb3React()
//   const { connector, deactivate } = context

//   const onDeactivateClicked = (deactivate, connector) => {
//     if (deactivate) {
//       deactivate()
//     }
//     if (connector && connector.close) {
//       connector.close()
//     }
//     stores.accountStore.setStore({ account: {}, web3context: null })
//     stores.emitter.emit(ACTIONS.CONNECTION_DISCONNECTED)
//     stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
//   }

//   console.log('check1', connector === connectorsByName['WalletConnectV2'])
//   const isWalletConnect = connector === connectorsByName['WalletConnectV2']

//   return (
//     <div className="shrink-0 grow-0 flex flex-row gap-4 justify-between rounded-md mt-8 mb-0 border border-transparent bg-white/10">
//       <div
//         className="flex flex-row items-center font-inter text-sm w-full justify-between py-3 px-4 cursor-pointer"
//         onClick={() => onDeactivateClicked(deactivate, connector)}
//       >
//         {isWalletConnect ? (
//           // <img src="/connectors/walletConnectV2Icon.svg" alt="" className="w-5 h-5 mr-4 my-auto" />
//           <div className="mr-4 flex items-center">
//             <Image src="/connectors/walletConnectV2Icon.svg" alt="" width={20} height={20} />
//           </div>
//         ) : (
//           // <img src="/connectors/icn-metamask.svg" alt="" className="w-5 h-5 mr-4 my-auto" />
//           <div className="mr-4 flex items-center">
//             <Image src="/connectors/icn-metamask.svg" alt="" width={20} height={20} />
//           </div>
//         )}
//         <div className="grow">{formatAddress(accountStore.address)}</div>
//         <div>
//           <PowerIcon className="h-5 w-5" />
//         </div>
//       </div>
//     </div>
//   )
// }

// function Connector(props) {
//   //   const [loading, setLoading] = useState(false)
//   //   const [error, setError] = useState(null)

//   const accountStore = stores.accountStore.getStore('account')
//   const [account, setAccount] = useState(accountStore)

//   useEffect(() => {
//     const connectionConnected = () => {
//       stores.dispatcher.dispatch({
//         type: ACTIONS.CONFIGURE_SS,
//         content: { connected: true },
//       })
//     }

//     const connectionDisconnected = () => {
//       stores.dispatcher.dispatch({
//         type: ACTIONS.CONFIGURE_SS,
//         content: { connected: false },
//       })
//     }

//     const accountConfigure = () => {
//       const accountStore = stores.accountStore.getStore('account')
//       setAccount(accountStore)
//     }

//     stores.emitter.on(ACTIONS.CONNECTION_CONNECTED, connectionConnected)
//     stores.emitter.on(ACTIONS.CONNECTION_DISCONNECTED, connectionDisconnected)
//     stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
//     // stores.emitter.on(ERROR, error)

//     return () => {
//       stores.emitter.removeListener(ACTIONS.CONNECTION_CONNECTED, connectionConnected)
//       stores.emitter.removeListener(ACTIONS.CONNECTION_DISCONNECTED, connectionDisconnected)
//       stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
//       //   stores.emitter.removeListener(ERROR, error)
//     }
//   }, [])

//   // const getLibrary = (provider) => {
//   //   const library = new Web3Provider(provider)
//   //   library.pollingInterval = 8000
//   //   return library
//   // }

//   return account && account.address ? <ConnectorStatus /> : <ConnectorList />
// }

// export default ConnectorList
