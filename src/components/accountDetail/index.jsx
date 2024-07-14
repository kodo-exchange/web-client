import { useState, useEffect, useCallback, Fragment } from 'react'
// import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
// import { Web3Provider } from '@ethersproject/providers'

import { ACTIONS } from '../../stores/constants'

import stores from '../../stores'

import Image from 'next/image'

import { XMarkIcon } from '@heroicons/react/24/solid'

import { Dialog, Transition } from '@headlessui/react'
import { formatAddress, formatCurrency } from '../../utils'

function AccountDetail({ isAccountDetailChecked, setIsAccountDetailChecked }) {
  const accountStore = stores.accountStore.getStore('account')
  // const connectorsByName = stores.accountStore.getStore('connectorsByName')

  // const context = useWeb3React()
  // const { connector, deactivate } = context

  const [ethToken, setEthToken] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const ssUpdated = async () => {
      const baseAssets = stores.stableSwapStore.getStore('baseAssets')
      const filteredAssets = baseAssets.filter((asset) => asset.address === 'ETH')

      if (filteredAssets.length > 0) {
        setEthToken(filteredAssets[0])
      }
    }

    ssUpdated()

    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
    }
  }, [])

  const onDeactivateClicked = (deactivate, connector) => {
    // if (deactivate) {
    //   deactivate()
    // }
    // if (connector && connector.close) {
    //   connector.close()
    // }
    // stores.accountStore.setStore({ account: {}, web3context: null })
    // stores.emitter.emit(ACTIONS.CONNECTION_DISCONNECTED)
    // stores.emitter.emit(ACTIONS.ACCOUNT_CONFIGURED)
    // setIsAccountDetailChecked(false)
    // localStorage.setItem('autoConnect', 'false')
  }

  const onClose = () => {
    setIsAccountDetailChecked(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountStore?.address || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
  }

  // const isWalletConnect = connector === connectorsByName['WalletConnectV2']

  return (
    <Transition.Root show={isAccountDetailChecked} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* Dialog Content */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="flex flex-col items-center fixed w-full max-w-96 scale-100 border border-border bg-gradient-primary rounded-2xl p-5">
              <div className="mt-1">
                <Image src="/img/drum-avatar.svg" alt="" width={60} height={60} />
              </div>
              <div className="flex flex-col text-center mt-[10px]">
                <div className="text-xl font-semibold flex flex-row items-center">
                  {formatAddress(accountStore?.address || '')}
                </div>
              </div>
              <div className="flex flex-col text-center mt-1">
                <div className="text-xs text-text-gray font-normal flex flex-row items-center">
                  {ethToken?.balance ? `${formatCurrency(ethToken.balance, 4)} ETH` : '0.00 ETH'}
                </div>
              </div>
              <div className="w-full grid grid-cols-2 text-sm justify-between mt-5 gap-3">
                <div
                  className="flex flex-col items-center bg-table-dark rounded-[10px] border border-border overflow-hidden py-[14px] px-5 gap-1 cursor-pointer hover:border-pink-primary hover:bg-bg-light transition-colors duration-150"
                  onClick={handleCopy}
                >
                  <div className="flex justify-center items-center ">
                    {copied ? (
                      // <DocumentCheckIcon className="h-7 w-7" />
                      <div className="flex flex-col items-center justify-center h-[28px] w-[28px]">
                        <Image src="/img/copied.svg" alt="" width={24} height={24} />
                      </div>
                    ) : (
                      <Image src="/img/copy.svg" alt="" width={28} height={28} />
                    )}
                  </div>
                  <div className="text-center">{copied ? 'Copied!' : 'Copy Address'}</div>
                </div>
                <div
                  className=" flex flex-col items-center bg-table-dark rounded-[10px] border border-border overflow-hidden py-[14px] px-5 gap-1 cursor-pointer hover:border-pink-primary hover:bg-bg-light transition-colors duration-150"
                  // onClick={() => onDeactivateClicked(deactivate, connector)}
                >
                  <div className="flex justify-center items-center">
                    <Image src="/img/disconnect.svg" alt="" width={28} height={28} />
                  </div>

                  <div className="text-center">Disconnect</div>
                </div>
              </div>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center absolute right-5 top-5"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6 fill-text-gray hover:fill-white transition-colors" aria-hidden="true" />
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default AccountDetail
