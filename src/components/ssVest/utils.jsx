import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

import { Tooltip } from 'react-tooltip'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

import { formatCurrency } from '../../utils'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid'

export default function Utils({ nft, vestNFTs, updateLockDuration }) {
  //   const inputEl = useRef(null)
  //   const [lockLoading, setLockLoading] = useState(false)

  //   const [open, setOpen] = useState(false)
  //   const [selectedNFT, setSelectedNFT] = useState(null)
  const router = useRouter()
  // const [addr, setAddr] = useState('')
  // const [addrError, setAddrError] = useState(false)
  // const [transferLoading, setTransferLoading] = useState(false)
  // const [web3, setWeb3] = useState(null)
  // const [account, setAccount] = useState(null)

  const [resetLoading, setResetLoading] = useState(false)
  const [pokeLoading, setPokeLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  useEffect(() => {
    const resetReturned = () => {
      setResetLoading(false)
    }

    const pokeReturned = () => {
      setPokeLoading(false)
    }

    const withdrawReturned = () => {
      setWithdrawLoading(false)
      router.push('/lock')
    }

    const errorReturned = () => {
      setResetLoading(false)
      setPokeLoading(false)
      setWithdrawLoading(false)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.RESET_VEST_RETURNED, resetReturned)
    stores.emitter.on(ACTIONS.POKE_VEST_RETURNED, pokeReturned)
    stores.emitter.on(ACTIONS.WITHDRAW_VEST_RETURNED, withdrawReturned)

    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.RESET_VEST_RETURNED, resetReturned)
      stores.emitter.removeListener(ACTIONS.POKE_VEST_RETURNED, pokeReturned)
      stores.emitter.removeListener(ACTIONS.WITHDRAW_VEST_RETURNED, withdrawReturned)
    }
  }, [])

  const onReset = () => {
    setResetLoading(true)

    stores.dispatcher.dispatch({
      type: ACTIONS.RESET_VEST,
      content: { nftId: nft.id },
    })
  }

  const onPoke = () => {
    setPokeLoading(true)

    stores.dispatcher.dispatch({
      type: ACTIONS.POKE_VEST,
      content: { nftId: nft.id },
    })
  }

  const onWithdraw = () => {
    setWithdrawLoading(true)

    stores.dispatcher.dispatch({
      type: ACTIONS.WITHDRAW_VEST,
      content: { tokenID: nft.id },
    })
  }

  return (
    <>
      <div className="p-6 pt-0 mt-8 mb-4">
        <div className="mb-8 text-xl">Useful utilities for your NFT</div>
        <div className="flex justify-between items-center">
          <div className="text-text-gray flex items-center">
            Reset your NFT
            <span className="text-base font-medium">
              <Tooltip id="reset-tooltip" className="max-w-md whitespace-normal" />
              <a
                data-tooltip-id="reset-tooltip"
                data-tooltip-place="right"
                data-tooltip-content={`Before you withdraw, transfer or merge your NFT, if it has already voted, you need to reset it.`}
              >
                <InformationCircleIcon className="self-center shrink-0 mx-1 h-4 w-4 text-text-gray" />
              </a>
            </span>
          </div>
          <button
            className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px] min-w-[100px]"
            disabled={resetLoading}
            onClick={onReset}
          >
            {resetLoading ? `Resetting` : `Reset`}
          </button>
        </div>
        <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-4"></div>
        <div className="flex justify-between items-center">
          {/* <div className="text-text-gray">Poke your NFT</div> */}
          <div className="text-text-gray flex items-center">
            Poke your NFT
            <span className="text-base font-medium">
              <Tooltip id="poke-tooltip" className="max-w-md whitespace-normal" />
              <a
                data-tooltip-id="poke-tooltip"
                data-tooltip-place="right"
                data-tooltip-content={`After adding KODO or merging veKODO into your lock, you can use poke to update your voting snapshot, maintaining the exact same proportions as before. It's not limited to once per epoch.`}
              >
                <InformationCircleIcon className="self-center shrink-0 mx-1 h-4 w-4 text-text-gray" />
              </a>
            </span>
          </div>
          <button
            className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px] min-w-[100px]"
            disabled={pokeLoading}
            onClick={onPoke}
          >
            {pokeLoading ? `Poking` : `Poke`}
          </button>
        </div>
        <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-4"></div>
        <div className="flex justify-between items-center">
          <div className="text-text-gray flex items-center">
            Withdraw KODO from your expired NFT
            <span className="text-base font-medium">
              <Tooltip id="withdraw-tooltip" className="max-w-md whitespace-normal" />
              <a
                data-tooltip-id="withdraw-tooltip"
                data-tooltip-place="right"
                data-tooltip-content={`If you've voted with this veNFT, please reset it first.`}
              >
                <InformationCircleIcon className="self-center shrink-0 mx-1 h-4 w-4 text-text-gray" />
              </a>
            </span>
          </div>
          <button
            className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px] min-w-[100px]"
            disabled={withdrawLoading}
            onClick={onWithdraw}
          >
            {withdrawLoading ? `Withdrawing` : `Withdraw`}
          </button>
        </div>
      </div>
      {/* <div className="p-6 pt-0 pb-0 mt-8">
        <div className="text-lg mb-8">Transfer your NFT to another address</div>
        <div className="flex flex-col gap-2 items-start">
          <div className="text-blue-gray-400">To Address</div>
          <input
            className="flex h-10 w-full rounded-md border border-gray-700/70 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 bg-table-dark"
            type="text"
            placeholder="0x"
            value={addr}
            onChange={addrChanged}
            disabled={transferLoading}
          />
        </div>
        <div className="text-red-500 text-sm h-5 mt-2">{addrError || ''}</div>
      </div> */}
      {/* <div className="items-center p-6  pt-0 flex justify-end">
        <button
          className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-white text-table-dark hover:bg-white/80 h-10 py-2 px-4 rounded-md"
          disabled={transferLoading}
          onClick={onTransfer}
        >
          {transferLoading ? `Transfering` : `Transfer`}
        </button>
      </div> */}
    </>
  )
}
