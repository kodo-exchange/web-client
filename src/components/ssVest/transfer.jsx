import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

import { formatCurrency } from '../../utils'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid'

export default function Transfer({ nft, vestNFTs, updateLockDuration }) {
  //   const inputEl = useRef(null)
  //   const [lockLoading, setLockLoading] = useState(false)

  //   const [open, setOpen] = useState(false)
  //   const [selectedNFT, setSelectedNFT] = useState(null)
  const router = useRouter()
  const [addr, setAddr] = useState('')
  const [addrError, setAddrError] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  const [web3, setWeb3] = useState(null)
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const transferReturned = () => {
      setTransferLoading(false)
      router.push('/lock')
    }
    const errorReturned = () => {
      setTransferLoading(false)
    }

    const accountChanged = async () => {
      const w3 = await stores.accountStore.getWeb3Provider()
      setWeb3(w3)
      const accountStore = stores.accountStore.getStore('account')
      setAccount(accountStore)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.TRANSFER_VEST_RETURNED, transferReturned)
    // stores.emitter.on(ACTIONS.ACCOUNT_CHANGED, accountChanged)
    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountChanged)

    accountChanged()

    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.TRANSFER_VEST_RETURNED, transferReturned)
      // stores.emitter.removeListener(ACTIONS.ACCOUNT_CHANGED, accountChanged)
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountChanged)
    }
  }, [])

  const onTransfer = () => {
    setAddrError(false)

    let error = false

    if (!addr || addr === '') {
      setAddrError('Address is required')
      error = true
    } else {
      if (!web3.utils.isAddress(addr)) {
        setAddrError('Invalid address or checksum')
        error = true
      } else if (account && account.address && addr.toLowerCase() === account.address.toLowerCase()) {
        setAddrError('Address should not be the same')
        error = true
      }
    }

    if (!error) {
      setTransferLoading(true)

      stores.dispatcher.dispatch({
        type: ACTIONS.TRANSFER_VEST,
        content: { nftId: nft.id, address: addr },
      })
    }
  }

  //   const onClose = () => {
  //     // setManageLocal(false)
  //     // setSearch('')
  //     setOpen(false)
  //   }

  //   const onNftSelect = (value) => {
  //     setOpen(false)
  //     setSelectedNFT(value)
  //   }

  const addrChanged = (event) => {
    setAddrError(false)
    setAddr(event.target.value)
  }

  return (
    <>
      <div className="p-6 pt-0 pb-0 mt-8">
        <div className="text-xl mb-8">Transfer your NFT to another address</div>
        <div className="flex flex-col gap-2 items-start">
          <div className="text-text-gray">To Address</div>
          <input
            className="flex h-12 w-full rounded-xl border border-border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 bg-table-dark focus:border-pink-primary transition-colors duration-300 placeholder:text-text-unselected"
            type="text"
            placeholder="0x"
            value={addr}
            onChange={addrChanged}
            disabled={transferLoading}
          />
        </div>
        <div className="text-red-500/75 text-sm h-5 mt-2">{addrError || ''}</div>
      </div>
      <div className="items-center p-6  pt-0 flex justify-end">
        <button
          className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
          disabled={transferLoading}
          onClick={onTransfer}
        >
          {transferLoading ? `Transfering` : `Transfer`}
        </button>
      </div>
    </>
  )
}
