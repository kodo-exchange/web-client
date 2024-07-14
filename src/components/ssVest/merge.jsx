import { useState, useEffect, Fragment } from 'react'
import moment from 'moment'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

import { formatCurrency } from '../../utils'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid'

export default function Merge({ nft, vestNFTs, updateLockDuration }) {
  //   const inputEl = useRef(null)
  const [lockLoading, setLockLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [mergeLoading, setMergeLoading] = useState(false)

  // const router = useRouter()

  useEffect(() => {
    const mergeReturned = () => {
      setMergeLoading(false)
      setSelectedNFT(null)
      // router.push('/vest')
    }
    const errorReturned = () => {
      setMergeLoading(false)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.MERGE_VEST_RETURNED, mergeReturned)
    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.MERGE_VEST_RETURNED, mergeReturned)
    }
  }, [])

  const onMerge = () => {
    setMergeLoading(true)

    // const now = moment()
    // const expiry = moment(selectedDate).add(1, 'days')
    // const secondsToExpire = expiry.diff(now, 'seconds')
    // const secondsToExpire = slideValues[0]

    stores.dispatcher.dispatch({
      type: ACTIONS.MERGE_VEST,
      content: { fromNftId: selectedNFT.id, toNftId: nft.id },
    })
  }

  const onClose = () => {
    // setManageLocal(false)
    // setSearch('')
    setOpen(false)
  }

  const onNftSelect = (value) => {
    setOpen(false)
    setSelectedNFT(value)
  }

  const renderDialog = () => {
    return (
      <Transition.Root show={open} as={Fragment}>
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
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="fixed max-h-[80vh] min-h-96 w-[100vw] max-w-lg gap-4 overflow-y-auto border border-border bg-gradient-primary shadow-lg rounded-lg flex flex-col p-5 pb-12">
                <div className="flex flex-col text-center sm:text-left">
                  <div className="text-xl font-semibold flex flex-row items-center">Select an NFT</div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-text-gray grid grid-cols-4 px-2 w-full">
                    <div className="col-span-1">NFT</div>
                    <div className="col-span-1 text-right">Expires</div>
                    <div className="col-span-1 text-right">Locked</div>
                    <div className="col-span-1 text-right">veKODO</div>
                  </div>
                  {/* <div className="shrink-0 bg-border h-[1px] w-full my-4"></div> */}
                  <div className="relative h-[280px] border border-border bg-table-dark py-1 mt-5 rounded-[10px]">
                    <div className="h-full w-full overflow-x-hidden overflow-y-scroll">
                      <div>
                        <div className="flex flex-col space-y-1 items-center">
                          {vestNFTs
                            .filter((vestNFT) => vestNFT.id !== nft.id)
                            .map((vestNFT, index) => {
                              return (
                                <div
                                  key={`option-${index}`}
                                  className="grid grid-cols-4 w-full flex-row items-top justify-between gap-2 hover:bg-bg-light pl-2 pr-2 py-2 text-sm cursor-pointer"
                                  onClick={() => onNftSelect(vestNFT)}
                                >
                                  <div className="col-span-1">{`NFT #${vestNFT.id}`}</div>
                                  <div className="col-span-1 flex flex-col items-end normal-case font-normal">
                                    <div className="text-sm text-white">
                                      {moment.unix(vestNFT.lockEnds).format('YYYY-MM-DD')}
                                    </div>
                                    <div className="text-xs text-text-gray">Expires</div>
                                  </div>
                                  <div className="col-span-1 flex flex-col items-end normal-case font-normal">
                                    <div className="text-sm text-white">{formatCurrency(vestNFT.lockAmount)}</div>
                                    <div className="text-xs text-text-gray">KODO</div>
                                  </div>
                                  <div className="col-span-1 flex flex-col items-end normal-case font-normal">
                                    <div className="text-sm text-white">{formatCurrency(vestNFT.lockValue)}</div>
                                    <div className="text-xs text-text-gray">veKODO</div>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="flex h-7 w-7 items-center justify-center absolute right-5 top-5" onClick={onClose}>
                  <XMarkIcon className="h-6 w-6 fill-text-gray hover:fill-white transition-colors" aria-hidden="true" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }

  return (
    <>
      <div className="p-6 pt-0 mt-8 mb-4">
        <div className="text-xl mb-8">{`Select and merge an NFT into #${nft.id}`}</div>
        <div className="flex flex-col gap-2 items-start">
          <div className="text-text-gray">Current</div>
          <div className="grid grid-cols-3 gap-4 items-center mb-8 p-4 rounded-xl bg-bg-light border border-border w-full">
            <div>
              <div>{nft?.lockAmount ? formatCurrency(nft.lockAmount) : '0.00'}</div>
              <div className="text-text-gray">Locked</div>
            </div>
            <div>
              <div>{nft?.lockValue ? formatCurrency(nft.lockValue) : '0.00'}</div>
              <div className="text-text-gray">veKODO</div>
            </div>
            <div>
              <div>{nft?.lockEnds ? moment.unix(nft.lockEnds).format('YYYY-MM-DD') : ''}</div>
              <div className="text-text-gray">Expires</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <div className="text-text-gray">Merge</div>
          <div className="flex flex-row items-center gap-4 border border-border bg-table-dark rounded-xl px-4 py-3 w-full justify-between">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:r58:"
              data-state="closed"
              className="w-full"
              onClick={() => setOpen(true)}
            >
              {selectedNFT ? (
                <div className="flex flex-row items-center gap-4 w-full justify-between text-white">
                  <div>{`NFT #${selectedNFT.id}`}</div>
                  <div>{`${formatCurrency(selectedNFT.lockAmount)} Locked`}</div>
                </div>
              ) : (
                <div className="text-left text-text-gray">
                  <div>Select NFT...</div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="items-center p-6 pt-0 flex justify-end">
        <button
          className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
          disabled={mergeLoading || !selectedNFT}
          onClick={onMerge}
        >
          {mergeLoading ? `Merging` : `Merge`}
          {selectedNFT && (
            <>
              {' '}
              {/* {selectedNFT.id} */}
              {`#${selectedNFT.id}`}
              {/* {` into `} */}
              <ArrowLongRightIcon className="inline-block h-5 w-5 mx-0.5" />
              {/* {nft.id} */}
              {`#${nft.id}`}
            </>
          )}
        </button>
      </div>
      {renderDialog()}
    </>
  )
}
