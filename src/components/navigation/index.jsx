import { Fragment, useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { NavigationContext } from './NavigationContext'

import { ACTIONS } from '../../stores/constants'
import stores from '../../stores'

import { formatAddress } from '../../utils'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { ExclamationCircleIcon as ExclamationCircleOutlinedIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import TransactionQueue from '../transactionQueue'
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'

function ConnectButton(props) {
  const accountStore = stores.accountStore.getStore('account')
  const [account, setAccount] = useState(accountStore)

  // const chainInvalidStore = stores.accountStore.getStore('chainInvalid')
  // const [chainInvalid, setChainInvalid] = useState(chainInvalidStore)

  // const [dialogOpen, setDialogOpen] = useState(false)

  const { open } = useWeb3Modal()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

  const [prevWalletProvider, setPrevWalletProvider] = useState(walletProvider)

  useEffect(() => {
    if (address && isConnected && walletProvider && chainId) {
      stores.accountStore.setStore({
        account: { address },
        web3context: { library: { provider: walletProvider }, chainId },
      })
      // After the wallet is connected, recreate the web3Instance
      stores.accountStore.web3Instance = null
      stores.accountStore.getWeb3Provider() // Create web3Instance here
      stores.dispatcher.dispatch({
        type: ACTIONS.CONFIGURE_SS,
        content: { connected: true },
      })

      stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
    } else if (prevWalletProvider) {
      stores.accountStore.setStore({
        account: {},
        web3context: null,
      })
      stores.accountStore.web3Instance = null // Reset web3Instance here
      stores.dispatcher.dispatch({
        type: ACTIONS.CONFIGURE_SS,
        content: { connected: false },
      })

      stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
    }
    setPrevWalletProvider(walletProvider)
  }, [address, isConnected, walletProvider, prevWalletProvider, chainId])

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account')
      setAccount(accountStore)
    }

    // const accountChanged = () => {
    //   const chainInvalidStore = stores.accountStore.getStore('chainInvalid')
    //   setChainInvalid(chainInvalidStore)
    // }

    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
    // stores.emitter.on(ACTIONS.ACCOUNT_CHANGED, accountChanged)
    return () => {
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
      // stores.emitter.removeListener(ACTIONS.ACCOUNT_CHANGED, accountChanged)
    }
  }, [])

  // const switchChain = async () => {
  //   // let hexChain = '0x' + Number(process.env.NEXT_PUBLIC_CHAINID).toString(16)
  //   let hexChain = process.env.NEXT_PUBLIC_CHAINID
  //   try {
  //     await window.ethereum.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{ chainId: hexChain }],
  //     })
  //     setDialogOpen(false)
  //   } catch (switchError) {
  //     console.log('switch error', switchError)
  //   }
  // }

  // const onClose = () => {
  //   setDialogOpen(false)
  // }

  // const renderWrongNetwork = () => {
  //   return (
  //     <>
  //       <div
  //         title="Wrong Network"
  //         className="text-[13px] leading-[17px] md:inline-flex items-center justify-center rounded-[10px] h-[38px] px-5 py-[11px] bg-red-500 hover:bg-red-500/80 transition-colors cursor-pointer"
  //         onClick={() => setDialogOpen(true)}
  //       >
  //         <div className="flex flex-row grow rounded-xl items-center">
  //           <div className="flex items-center">
  //             Wrong Network
  //             {/* <ExclamationCircleOutlinedIcon className="h-6 w-6" /> */}
  //           </div>
  //         </div>
  //       </div>

  //       <Transition.Root show={dialogOpen} as={Fragment}>
  //         <Dialog as="div" className="relative z-10" onClose={onClose}>
  //           <Transition.Child
  //             as={Fragment}
  //             enter="ease-out duration-300"
  //             enterFrom="opacity-0"
  //             enterTo="opacity-100"
  //             leave="ease-in duration-200"
  //             leaveFrom="opacity-100"
  //             leaveTo="opacity-0"
  //           >
  //             <div className="fixed inset-0 bg-black-50 backdrop-blur-sm" />
  //           </Transition.Child>

  //           <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
  //             {/* Dialog Content */}
  //             <Transition.Child
  //               as={Fragment}
  //               enter="ease-out duration-300"
  //               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  //               enterTo="opacity-100 translate-y-0 sm:scale-100"
  //               leave="ease-in duration-200"
  //               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
  //               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  //             >
  //               <Dialog.Panel className="fixed grid gap-4 w-full max-w-lg scale-100 border border-border bg-gradient-primary rounded-2xl p-5">
  //                 <div className="flex flex-col space-y-2 text-center sm:text-left">
  //                   <h2 className="mt-4 mb-2 text-lg  font-semibold flex flex-row items-center gap-2">
  //                     <ExclamationCircleOutlinedIcon className="h-6 w-6" />
  //                     Wrong network detected!
  //                   </h2>
  //                   <div className="flex flex-col gap-4 pb-4">
  //                     <div className="">
  //                       You are connected to the wrong network. Would you like to switch to{' '}
  //                       <span className="font-semibold text-pink-primary">Taiko</span>?
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
  //                   <button
  //                     className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-table border border-border hover:border-pink-primary hover:text-pink-primary h-10 py-2 px-4 rounded-[10px] mt-2 sm:mt-0"
  //                     onClick={onClose}
  //                   >
  //                     Cancel
  //                   </button>
  //                   <button
  //                     type="button"
  //                     className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-table bg-pink-primary text-white hover:bg-pink-primary/80 h-10 py-2 px-4 rounded-[10px]"
  //                     onClick={() => switchChain()}
  //                   >
  //                     Switch to Taiko
  //                   </button>
  //                 </div>
  //               </Dialog.Panel>
  //             </Transition.Child>
  //           </div>
  //         </Dialog>
  //       </Transition.Root>
  //     </>
  //   )
  // }

  return (
    <>
      {isConnected ? (
        <>
          <div
            className="text-white inline-flex items-center justify-center rounded-[10px] text-sm font-normal h-10 py-[7px] px-[10px] border border-white border-opacity-10 bg-white bg-opacity-8 hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => open()}
          >
            <div className="flex flex-row gap-[10px] grow rounded-xl items-center justify-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center">
                  {/* <Image src="/img/taiko-square.svg" alt="" width={24} height={24} className="rounded-md" /> */}
                  <img src="/img/taiko-square.svg" alt="" width="24" height="24" className="rounded-md" />
                </div>
              </div>
              <div className="text-[13px] leading-[17px] text-white my-auto ">
                {formatAddress(address, 'ultraShort')}
              </div>
              <div className="hidden md:flex items-center justify-center">
                <img src="/img/chevron-down.svg" alt="" className="w-[18px] h-[18px]" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <button
            className="flex items-center justify-center bg-pink-primary text-white text-[13px] leading-[17px] font-bold text-center whitespace-nowrap rounded-[10px] h-[38px] px-5 py-[11px] transition-colors"
            onClick={() => open()}
          >
            CONNECT
          </button>
        </>
      )}
    </>
  )
}

function TransactionQueueAndButton(props) {
  const [transactionQueueLength, setTransactionQueueLength] = useState(0)

  const setQueueLength = (length) => {
    setTransactionQueueLength(length)
  }

  // text-white inline-flex items-center justify-center rounded-[10px] text-sm font-normal h-10 py-[7px] px-[10px] border border-white border-opacity-10 bg-white bg-opacity-8 hover:bg-white/20 transition-colors cursor-pointer
  return (
    <>
      {transactionQueueLength > 0 && (
        <div
          className="text-white md:inline-flex items-center justify-center rounded-[10px] text-sm font-normal h-10 py-[7px] px-[10px] border border-white border-opacity-10 bg-white bg-opacity-8 hover:bg-white/20 transition-colors cursor-pointer"
          onClick={() => {
            stores.emitter.emit(ACTIONS.TX_OPEN)
          }}
        >
          <ClockIcon className="h-6 w-6" />
        </div>
      )}
      <TransactionQueue setQueueLength={setQueueLength} />
    </>
  )
}

function MenuButton(props) {
  const router = useRouter()
  const { activeNavigate, setActiveNavigate, navigateButtons } = useContext(NavigationContext)
  // const [closePopover, setClosePopover] = useState(null)
  const [open, setOpen] = useState(false)

  function handleNavigate(route) {
    router.push(route)
  }

  const onActiveClick = (event, val) => {
    if (val) {
      setActiveNavigate(val)
      handleNavigate('/' + val)
      setOpen(false)
    }
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <button
        className="text-white inline-flex items-center justify-center rounded-[10px] text-sm font-normal h-10 py-[7px] px-[10px] border border-white border-opacity-10 bg-white bg-opacity-8 hover:bg-white/20 transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Bars3Icon className="w-5 h-5" aria-hidden="true" />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-150 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="fixed left-1/2 transform -translate-x-1/2 top-8 z-50 origin-top rounded-[20px] w-[90vw]  border border-border bg-gradient-primary p-8">
                <button className="flex h-7 w-7 items-center justify-center absolute right-8 top-8" onClick={onClose}>
                  <XMarkIcon className="h-6 w-6 fill-text-gray hover:fill-white transition-colors" aria-hidden="true" />
                </button>
                <div className="text-lg mb-4 font-medium text-white">Navigation</div>
                <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full mb-4"></div>
                <nav className="text-sm">
                  <ol className="flex flex-col gap-1">
                    {navigateButtons.map(({ name, value }) => (
                      <Link
                        key={value}
                        href={`/${value}`}
                        onClick={(e) => {
                          setOpen(false)
                        }}
                        className={`no-underline text-left cursor-pointer py-3 font-semibold px-4 rounded-[10px] border  hover:border-pink-primary hover:text-pink-primary 
                      ${
                        activeNavigate === value
                          ? 'text-pink-primary border-pink-primary'
                          : 'text-white border-transparent'
                      }`}
                      >
                        {name}
                      </Link>
                    ))}
                  </ol>
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

function Navigation(props) {
  const router = useRouter()
  // const [menuOpen, setMenuOpen] = useState(false)
  // const [active, setActive] = useState('swap')
  // const { isChecked, setIsChecked, checkboxRef } = useContext(DrawerContext)
  const { activeNavigate, setActiveNavigate, navigateButtons } = useContext(NavigationContext)

  // const { navigateButtons } = props

  // function handleNavigate(route) {
  //   router.push(route)
  // }

  // const onActiveClick = (event, val) => {
  //   if (val) {
  //     setActiveNavigate(val)
  //     handleNavigate('/' + val)
  //   }
  // }

  // useEffect(() => {
  //   const activePath = router.asPath
  //   navigateButtons.forEach(({ value }) => {
  //     if (activePath.includes(value)) {
  //       setActiveNavigate(value)
  //     }
  //   })
  // }, [])

  return (
    <div className="flex flex-row sm:px-2 md:px-0 lg:gap-4 justify-between items-center">
      <div className="my-auto">
        <div className="cursor-pointer flex flex-row items-center">
          <Link href="/swap">
            <img className="h-9 w-auto" src={'/logo.svg'} />
          </Link>
        </div>
      </div>
      <div className="hidden md:block my-auto lg:space-x-1">
        {navigateButtons.map(({ name, value }) => (
          <Link
            key={value}
            href={`/${value}`}
            className={`inline-flex items-center bg-transparent text-base font-medium text-[rgba(128,128,136,1)] transition-colors hover:text-white h-10 px-3 py-1 group w-max ${
              activeNavigate === value ? 'text-white' : ''
            }`}
          >
            {name}
          </Link>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        <TransactionQueueAndButton />
        <ConnectButton />
        <div className="block md:hidden">
          <MenuButton />
        </div>
      </div>
    </div>
  )
}

export default Navigation
