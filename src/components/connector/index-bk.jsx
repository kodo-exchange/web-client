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

// function ConnectorList({ isConnectorListChecked, setIsConnectorListChecked }) {
//   const context = useWeb3React()
//   const { connector, library, account, activate, active, error } = context
//   const [activatingConnector, setActivatingConnector] = useState() // Loading

//   const localContext = stores.accountStore.getStore('web3context')
//   var localConnector = null
//   if (localContext) {
//     localConnector = localContext.connector
//   }
//   var connectorsByName = stores.accountStore.getStore('connectorsByName')

//   // useEffect(() => {
//   //   if (activatingConnector && activatingConnector === connector) {
//   //     setActivatingConnector(undefined)
//   //   }
//   // }, [activatingConnector, connector])

//   useEffect(() => {
//     const switchChain = async () => {
//       const chainId = process.env.NEXT_PUBLIC_CHAINID
//       try {
//         await window.ethereum.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId }],
//         })
//       } catch (switchError) {
//         if (switchError.code === 4902) {
//           try {
//             await window.ethereum.request({
//               method: 'wallet_addEthereumChain',
//               params: [
//                 {
//                   chainId,
//                   chainName: process.env.NEXT_PUBLIC_CHAIN_NAME,
//                   nativeCurrency: {
//                     name: 'Ether',
//                     symbol: 'ETH',
//                     decimals: 18,
//                   },
//                   rpcUrls: [process.env.NEXT_PUBLIC_CHAIN_RPC],
//                   blockExplorerUrls: [process.env.NEXT_PUBLIC_ETHERSCAN_URL],
//                 },
//               ],
//             })
//           } catch (addError) {
//             console.error(addError)
//           }
//         }
//       }
//     }

//     if (error instanceof UnsupportedChainIdError) {
//       switchChain()
//     } else if (error) {
//       console.error(error)
//       setActivatingConnector(undefined)
//     }

//     if (account && active && library) {
//       stores.accountStore.setStore({
//         account: { address: account },
//         web3context: context,
//       })
//       stores.emitter.emit(ACTIONS.CONNECTION_CONNECTED)
//       stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
//       localStorage.setItem('autoConnect', 'true')
//       setIsConnectorListChecked(false)
//       setActivatingConnector(undefined)
//     }
//   }, [account, active, context, library, error])

//   const onConnectionClicked = (currentConnector, name, setActivatingConnector, activate) => {
//     const connectorsByName = stores.accountStore.getStore('connectorsByName')
//     setActivatingConnector(currentConnector)
//     activate(connectorsByName[name])
//   }

//   const onClose = () => {
//     setIsConnectorListChecked(false)
//   }

//   return (
//     <Transition.Root show={isConnectorListChecked} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black-50 backdrop-blur-sm" />
//         </Transition.Child>

//         <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             enterTo="opacity-100 translate-y-0 sm:scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//             leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//           >
//             <Dialog.Panel className="flex flex-col fixed w-full max-w-96 scale-100 border border-border bg-gradient-primary rounded-2xl p-5">
//               <div className="flex flex-col text-center sm:text-left">
//                 <h2 className="text-xl font-semibold flex flex-row items-center">Connect Wallet</h2>
//               </div>
//               <ol className="space-y-[14px] text-sm mt-5">
//                 {Object.keys(connectorsByName)
//                   .filter((name) => name === 'WalletConnectV2' || name === 'MetaMask')
//                   .map((name, index) => {
//                     // const isFirstItem = index === 0
//                     const currentConnector = connectorsByName[name]
//                     const activating = currentConnector === activatingConnector // Check if is activating
//                     const connected = currentConnector === connector || currentConnector === localConnector
//                     const disabled = !!activatingConnector || !!error

//                     let url
//                     let display = name
//                     let descriptor = ''
//                     if (name === 'MetaMask') {
//                       display = 'MetaMask'
//                       url = '/connectors/icn-metamask.svg'
//                       descriptor = 'Connect to your MetaMask wallet'
//                     } else if (name === 'WalletConnectV2') {
//                       display = 'WalletConnect'
//                       url = '/connectors/walletConnectV2Icon.svg'
//                       descriptor = 'Scan with WalletConnect to connect'
//                     }

//                     return (
//                       <li
//                         key={name}
//                         className="bg-table-dark rounded-[10px] border border-border overflow-hidden hover:border-pink-primary hover:bg-bg-highlight transition-all"
//                       >
//                         <div
//                           className="flex flex-row justify-between items-center font-inter text-sm px-4 py-3 cursor-pointer"
//                           onClick={() => onConnectionClicked(currentConnector, name, setActivatingConnector, activate)}
//                         >
//                           {display}
//                           <div className="flex justify-center items-center">
//                             {/* <Image src={url} alt="" width={24} height={24} /> */}
//                             {activating ? (
//                               <Triangle color="#FD009C" height={24} width={24} />
//                             ) : (
//                               <Image src={url} alt="" width={24} height={24} />
//                             )}
//                           </div>
//                         </div>
//                       </li>
//                     )
//                   })}
//               </ol>
//               <button
//                 type="button"
//                 className="flex h-7 w-7 items-center justify-center absolute right-5 top-5"
//                 onClick={onClose}
//               >
//                 <XMarkIcon className="h-6 w-6 fill-text-gray hover:fill-white transition-colors" aria-hidden="true" />
//               </button>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   )
// }

// // function ConnectorStatus(props) {
// //   const accountStore = stores.accountStore.getStore('account')
// //   const connectorsByName = stores.accountStore.getStore('connectorsByName')

// //   const context = useWeb3React()
// //   const { connector, deactivate } = context

// //   const onDeactivateClicked = (deactivate, connector) => {
// //     if (deactivate) {
// //       deactivate()
// //     }
// //     if (connector && connector.close) {
// //       connector.close()
// //     }
// //     stores.accountStore.setStore({ account: {}, web3context: null })
// //     stores.emitter.emit(ACTIONS.CONNECTION_DISCONNECTED)
// //     stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
// //   }

// //   console.log('check1', connector === connectorsByName['WalletConnectV2'])
// //   const isWalletConnect = connector === connectorsByName['WalletConnectV2']

// //   return (
// //     <div className="shrink-0 grow-0 flex flex-row gap-4 justify-between rounded-md mt-8 mb-0 border border-transparent bg-white/10">
// //       <div
// //         className="flex flex-row items-center font-inter text-sm w-full justify-between py-3 px-4 cursor-pointer"
// //         onClick={() => onDeactivateClicked(deactivate, connector)}
// //       >
// //         {isWalletConnect ? (
// //           // <img src="/connectors/walletConnectV2Icon.svg" alt="" className="w-5 h-5 mr-4 my-auto" />
// //           <div className="mr-4 flex items-center">
// //             <Image src="/connectors/walletConnectV2Icon.svg" alt="" width={20} height={20} />
// //           </div>
// //         ) : (
// //           // <img src="/connectors/icn-metamask.svg" alt="" className="w-5 h-5 mr-4 my-auto" />
// //           <div className="mr-4 flex items-center">
// //             <Image src="/connectors/icn-metamask.svg" alt="" width={20} height={20} />
// //           </div>
// //         )}
// //         <div className="grow">{formatAddress(accountStore.address)}</div>
// //         <div>
// //           <PowerIcon className="h-5 w-5" />
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // function Connector(props) {
// //   //   const [loading, setLoading] = useState(false)
// //   //   const [error, setError] = useState(null)

// //   const accountStore = stores.accountStore.getStore('account')
// //   const [account, setAccount] = useState(accountStore)

// //   useEffect(() => {
// //     const connectionConnected = () => {
// //       stores.dispatcher.dispatch({
// //         type: ACTIONS.CONFIGURE_SS,
// //         content: { connected: true },
// //       })
// //     }

// //     const connectionDisconnected = () => {
// //       stores.dispatcher.dispatch({
// //         type: ACTIONS.CONFIGURE_SS,
// //         content: { connected: false },
// //       })
// //     }

// //     const accountConfigure = () => {
// //       const accountStore = stores.accountStore.getStore('account')
// //       setAccount(accountStore)
// //     }

// //     stores.emitter.on(ACTIONS.CONNECTION_CONNECTED, connectionConnected)
// //     stores.emitter.on(ACTIONS.CONNECTION_DISCONNECTED, connectionDisconnected)
// //     stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
// //     // stores.emitter.on(ERROR, error)

// //     return () => {
// //       stores.emitter.removeListener(ACTIONS.CONNECTION_CONNECTED, connectionConnected)
// //       stores.emitter.removeListener(ACTIONS.CONNECTION_DISCONNECTED, connectionDisconnected)
// //       stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
// //       //   stores.emitter.removeListener(ERROR, error)
// //     }
// //   }, [])

// //   // const getLibrary = (provider) => {
// //   //   const library = new Web3Provider(provider)
// //   //   library.pollingInterval = 8000
// //   //   return library
// //   // }

// //   return account && account.address ? <ConnectorStatus /> : <ConnectorList />
// // }

// export default ConnectorList
