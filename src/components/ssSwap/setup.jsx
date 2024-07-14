import React, { Fragment, useState, useEffect } from 'react'

import { withTheme } from '@material-ui/core/styles'

import { formatCurrency, formatAddress } from '../../utils'

import stores from '../../stores'
import { ACTIONS, ETHERSCAN_URL, TOP_ASSETS, CONTRACTS } from '../../stores/constants'
import BigNumber from 'bignumber.js'

import { Dialog, Transition } from '@headlessui/react'

import {
  MagnifyingGlassIcon,
  XMarkIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
  ArrowsUpDownIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid'

import { AdjustmentsHorizontalIcon, Cog6ToothIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

import { ChevronDownIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/20/solid'

import { Tooltip } from 'react-tooltip'
import Image from 'next/image'

function AssetSelect({ type, value, assetOptions, onSelect }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredAssetOptions, setFilteredAssetOptions] = useState([])
  const [topAssets, setTopAssets] = useState([])

  const [manageLocal, setManageLocal] = useState(false)

  const openSearch = () => {
    setSearch('')
    setOpen(true)
  }

  // useEffect(
  //   async function () {
  //     let ao = assetOptions.filter((asset) => {
  //       if (search && search !== '') {
  //         return (
  //           asset.address.toLowerCase().includes(search.toLowerCase()) ||
  //           asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
  //           asset.name.toLowerCase().includes(search.toLowerCase())
  //         )
  //       } else {
  //         return true
  //       }
  //     })

  //     setFilteredAssetOptions(ao)

  //     //no options in our default list and its an address we search for the address
  //     if (ao.length === 0 && search && search.length === 42) {
  //       const baseAsset = await stores.stableSwapStore.getBaseAsset(event.target.value, true, true)
  //     }

  //     return () => {}
  //   },
  //   [assetOptions, search]
  // )

  useEffect(() => {
    async function fetchBaseAsset() {
      let ao = assetOptions.filter((asset) => {
        if (search && search !== '') {
          return (
            asset.address.toLowerCase().includes(search.toLowerCase()) ||
            asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
            asset.name.toLowerCase().includes(search.toLowerCase())
          )
        } else {
          return true
        }
      })

      setFilteredAssetOptions(ao)

      //no options in our default list and its an address we search for the address
      if (ao.length === 0 && search && search.length === 42) {
        const baseAsset = await stores.stableSwapStore.getBaseAsset(event.target.value, true, true)
      }
    }

    fetchBaseAsset()

    return () => {}
  }, [assetOptions, search])

  useEffect(() => {
    const topAssets = assetOptions.filter((asset) => TOP_ASSETS.includes(asset.symbol))
    setTopAssets(topAssets)
  }, [assetOptions])

  const onSearchChanged = async (event) => {
    setSearch(event.target.value)
  }

  const onLocalSelect = (type, asset) => {
    setSearch('')
    setManageLocal(false)
    setOpen(false)
    onSelect(type, asset)
  }

  const onClose = () => {
    setManageLocal(false)
    setSearch('')
    setOpen(false)
  }

  const toggleLocal = () => {
    setManageLocal(!manageLocal)
  }

  const deleteOption = (token) => {
    stores.stableSwapStore.removeBaseAsset(token)
  }

  const viewOption = (token) => {
    window.open(`${ETHERSCAN_URL}/token/${token.address}`, '_blank')
  }

  const renderManageOption = (type, asset, idx) => {
    return (
      <li
        className="list-item px-6 py-1 hover:cursor-pointer hover:bg-white/10"
        key={asset.address + '_' + idx}
        // onClick={() => {
        //   onLocalSelect(type, asset)
        // }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <div className="relative row-span-2 h-10 w-10 sm:h-14 sm:w-14">
              <img
                alt=""
                // loading="lazy"
                // decoding="async"
                // data-nimg="fill"
                className="border border-blue-gray-500/30 h-full w-full rounded-full bg-blue-gray-900 p-1"
                sizes="100vw"
                src={asset ? `${asset.logoURI}` : ''}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/tokens/unknown-logo.png'
                }}
              />
              {/* <Image
                alt=""
                className="border border-blue-gray-500/30 h-full w-full rounded-full bg-blue-gray-900 p-1"
                layout="fill"
                src={asset && asset.logoURI ? asset.logoURI : '/tokens/unknown-logo.png'}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/tokens/unknown-logo.png'
                }}
              /> */}
            </div>
            <div className="flex flex-col items-start justify-center text-xs sm:text-sm">
              <p>{asset ? asset.symbol : ''}</p>
              <p className="text-sm text-blue-gray-400">{asset ? asset.name : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right text-xs sm:text-sm">
            {/* <div className="ml-auto">
              <p>{asset && asset.balance ? formatCurrency(asset.balance) : '0.00'}</p>
              <p className="text-sm text-blue-gray-400">Balance</p>
            </div> */}
            <button
              className="mx-3 sm:mx-2"
              onClick={() => {
                deleteOption(asset)
              }}
            >
              <TrashIcon
                className="w-4 h-4 sm:w-5 sm:h-5 fill-white flex-shrink-0 hover:fill-blue-gray-600"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              />
            </button>
            <button
              className="mx-3 sm:mx-2"
              onClick={() => {
                viewOption(asset)
              }}
            >
              <ArrowTopRightOnSquareIcon
                className="w-4 h-4 sm:w-5 sm:h-5 fill-white flex-shrink-0 hover:fill-blue-gray-600"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </li>
    )
  }

  const renderAssetOption = (type, asset, idx) => {
    return (
      <li
        className="list-item  pl-3 pr-4 py-1 hover:cursor-pointer hover:bg-bg-light transition-colors duration-100"
        key={asset.address + '_' + idx}
        onClick={() => {
          onLocalSelect(type, asset)
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <div className="relative row-span-2 flex-shrink-0">
              <img
                alt=""
                // loading="lazy"
                // decoding="async"
                // data-nimg="fill"
                className="border border-border rounded-full h-10 w-10 sm:h-14 sm:w-14 p-1"
                sizes="100vw"
                src={asset ? `${asset.logoURI}` : ''}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/tokens/unknown-logo.png'
                }}
              />
              {/* <Image
                alt=""
                className="border border-blue-gray-500/30 h-full w-full rounded-full bg-blue-gray-900 p-1"
                layout="fill"
                src={asset && asset.logoURI ? asset.logoURI : '/tokens/unknown-logo.png'}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/tokens/unknown-logo.png'
                }}
              /> */}
            </div>
            <div className="flex flex-col items-start justify-center text-xs sm:text-sm">
              <div className="flex items-center">
                {asset ? asset.symbol : ''}
                {asset?.address != 'ETH' && (
                  <>
                    <span className="flex items-center">
                      <a data-tooltip-id={`pool-tooltip-${asset.address + '_' + idx}`} data-tooltip-place="top-start">
                        <InformationCircleIcon className="self-center shrink-0 mx-1 ml-2 h-[12px] w-[12px] sm:h-[14px] sm:w-[14px] text-text-gray" />
                      </a>
                    </span>
                    <Tooltip
                      id={`pool-tooltip-${asset.address + '_' + idx}`}
                      className="max-w-md border border-border z-20 opacity-100 hover:opacity-100"
                      style={{
                        padding: '12px',
                        backgroundColor: '#1A1A1A',
                        borderRadius: '8px',
                        width: '200px',
                      }}
                      clickable
                    >
                      <div className="flex flex-col gap-1 font-normal text-base">
                        {asset?.address && (
                          <a
                            href={`${ETHERSCAN_URL}/address/${asset.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="flex flex-col p-2 bg-table-dark border border-border hover:bg-bg-highlight hover:border-pink-primary rounded-md cursor-pointer">
                              <div className="text-sm">Token Address</div>
                              <div className="flex flex-row items-center text-text-gray mt-1">
                                <div className="text-xs ">{formatAddress(asset.address)}</div>
                                <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                              </div>
                            </div>
                          </a>
                        )}
                      </div>
                    </Tooltip>
                  </>
                )}
              </div>
              <div className="text-[10px] sm:text-sm text-text-gray">{asset ? asset.name : ''}</div>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right text-xs sm:text-sm">
            <div className="ml-auto">
              <p>{asset && asset.balance ? formatCurrency(asset.balance) : '0.00'}</p>
              <p className="text-[10px] sm:text-sm text-text-gray">Balance</p>
            </div>
          </div>
        </div>
      </li>
    )
  }

  const renderTopAssets = () => {
    return (
      <>
        {topAssets.map((asset) => (
          <button
            key={asset.symbol}
            className="relative col-span-2 inline-flex items-center space-x-1 rounded-[10px] border border-border bg-bg-light px-[10px] py-2 transition-colors duration-300 hover:bg-bg-highlight hover:border-pink-primary"
            onClick={() => {
              onLocalSelect(type, asset)
            }}
          >
            <span className="relative h-4 w-4 items-center">
              <img alt={asset.symbol} className="rounded-full" src={asset.logoURI} />
              {/* <Image alt={asset.symbol} className="rounded-full" src={asset.logoURI} layout="fill" objectFit="cover" /> */}
            </span>
            <span className="text-sm">{asset.symbol}</span>
          </button>
        ))}
      </>
    )
  }

  const renderOptions = () => {
    return (
      <ul className="flex w-full min-w-72 max-w-full list-inside flex-col gap-2 sm:min-w-[450px]">
        {filteredAssetOptions
          ? filteredAssetOptions
              .sort((a, b) => {
                if (BigNumber(a.balance).lt(b.balance)) return 1
                if (BigNumber(a.balance).gt(b.balance)) return -1
                if (a.symbol.toLowerCase() < b.symbol.toLowerCase()) return -1
                if (a.symbol.toLowerCase() > b.symbol.toLowerCase()) return 1
                return 0
              })
              .map((asset, idx) => {
                return renderAssetOption(type, asset, idx)
              })
          : []}
      </ul>
    )
  }

  const renderManageLocal = () => {
    return (
      <ul className="flex w-full min-w-[350px] max-w-full list-inside flex-col gap-2 sm:min-w-[450px]">
        {filteredAssetOptions
          ? filteredAssetOptions
              .filter((option) => {
                return option.local === true
              })
              .map((asset, idx) => {
                return renderManageOption(type, asset, idx)
              })
          : []}
      </ul>
    )
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
              <Dialog.Panel className="fixed max-h-[80vh] min-h-96 max-w-lg gap-4 overflow-y-auto border border-border bg-gradient-primary shadow-lg rounded-lg flex flex-col p-5">
                <div className="flex flex-col text-center sm:text-left">
                  <div className="text-xl font-semibold flex flex-row items-center">Select a Token</div>
                </div>
                <div className="">
                  <div className="flex flex-row items-center px-3 rounded-[10px] bg-bg-light border border-border focus-within:bg-table-dark focus-within:border-pink-primary transition-colors duration-300">
                    <MagnifyingGlassIcon
                      className="w-4 h-4 fill-white flex-shrink-0"
                      focusable="false"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      className="pl-2 w-full h-12 bg-transparent border-0 text-sm text-white focus:ring-0 focus:outline-none placeholder:text-text-unselected"
                      placeholder="Search name or paste address"
                      autoComplete="off"
                      value={search}
                      onChange={onSearchChanged}
                    />
                  </div>
                </div>
                <div className="my-2 space-y-2">
                  {/* <div className="text-base uppercase text-text-gray">Top Coins</div> */}
                  <div className="flex flex-wrap gap-2">{renderTopAssets()}</div>
                </div>
                <div className="h-[600px] overflow-x-hidden overflow-y-scroll py-2 rounded-[10px] bg-black">
                  {!manageLocal && renderOptions()}
                  {manageLocal && renderManageLocal()}
                </div>
                {/* <div className="flex w-full items-center justify-center">
                  <button className="text-sm font-bold transition-opacity hover:opacity-70" onClick={toggleLocal}>
                    {manageLocal ? 'Back to Assets' : 'Manage local assets'}
                  </button>
                </div> */}
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
      <div
        className="flex items-center whitespace-nowrap cursor-pointer mr-4 bg-bg-light hover:bg-white/20 hover:border-white hover:border-opacity-5  px-3 py-[10px] rounded-[10px] transition-colors duration-300"
        onClick={() => {
          openSearch()
        }}
      >
        <img
          src={value ? `${value.logoURI}` : ''}
          alt=""
          width="32px"
          height="32px"
          className="rounded-[16px] mr-3"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/tokens/unknown-logo.png'
          }}
        />
        {/* <Image
          src={value ? `${value.logoURI}` : '/tokens/unknown-logo.png'}
          alt=""
          width={32}
          height={32}
          className="rounded-[16px] mr-3"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/tokens/unknown-logo.png'
          }}
        /> */}
        <div className="max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis text-xl">
          {value ? `${value.symbol}` : ''}
        </div>
        <ChevronDownIcon className="self-center shrink-0 ml-2 h-6 w-6 text-current" aria-hidden="true" />
      </div>
      {renderDialog()}
    </>
  )
}

function Setup() {
  const [, updateState] = React.useState()
  const forceUpdate = React.useCallback(() => updateState({}), [])

  const [loading, setLoading] = useState(false)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [approvalLoading, setApprovalLoading] = useState(false)

  const [fromAmountValue, setFromAmountValue] = useState('')
  const [fromAmountError, setFromAmountError] = useState(false)
  const [fromAssetValue, setFromAssetValue] = useState(null)
  const [fromAssetError, setFromAssetError] = useState(false)
  const [fromAssetOptions, setFromAssetOptions] = useState([])

  const [toAmountValue, setToAmountValue] = useState('')
  const [toAmountError, setToAmountError] = useState(false)
  const [toAssetValue, setToAssetValue] = useState(null)
  const [toAssetError, setToAssetError] = useState(false)
  const [toAssetOptions, setToAssetOptions] = useState([])

  const [slippage, setSlippage] = useState('2')
  const [slippageInput, setSlippageInput] = useState('') // For showing user's input
  const [slippageError, setSlippageError] = useState(false)
  const [isSlippageSettingOpen, setIsSlippageSettingOpen] = useState(false)

  const [quoteError, setQuoteError] = useState(null)
  const [quote, setQuote] = useState(null)

  const [isFromPerToRate, setIsFromPerToRate] = useState(true)
  const [isRefreshClicked, setIsRefreshClicked] = useState(false)
  const [isRouteOpen, setIsRouteOpen] = useState(false)

  const [transactionType, setTransactionType] = useState('swap') // swap, wrap, unwrap
  const transactionTexts = {
    swap: { action: 'Swap', processing: 'Swapping' },
    wrap: { action: 'Wrap', processing: 'Wrapping' },
    unwrap: { action: 'Unwrap', processing: 'Unwrapping' },
  }

  useEffect(
    function () {
      const errorReturned = () => {
        setLoading(false)
        setApprovalLoading(false)
        setQuoteLoading(false)
      }

      const quoteReturned = (val) => {
        if (!val) {
          setQuoteLoading(false)
          setQuote(null)
          setToAmountValue('')
          setQuoteError('Insufficient liquidity or no route available to complete swap')
        }
        if (
          val &&
          val.inputs &&
          val.inputs.fromAmount === fromAmountValue &&
          val.inputs.fromAsset.address === fromAssetValue.address &&
          val.inputs.toAsset.address === toAssetValue.address
        ) {
          setQuoteLoading(false)
          if (BigNumber(val.output.finalValue).eq(0)) {
            setQuote(null)
            setToAmountValue('')
            setQuoteError('Insufficient liquidity or no route available to complete swap')
            return
          }

          setToAmountValue(BigNumber(val.output.finalValue).toFixed(8))
          setQuote(val)
        }
      }

      const ssUpdated = () => {
        const baseAsset = stores.stableSwapStore.getStore('baseAssets')

        setToAssetOptions(baseAsset)
        setFromAssetOptions(baseAsset)

        // if (baseAsset.length > 0 && toAssetValue == null) {
        //   setToAssetValue(baseAsset[0])
        // }

        // if (baseAsset.length > 0 && fromAssetValue == null) {
        //   setFromAssetValue(baseAsset[1])
        // }

        // New logic -> update asset if it's not null.
        if (baseAsset.length > 0) {
          if (toAssetValue != null) {
            const matchingToAsset = baseAsset.find((asset) => asset.address === toAssetValue.address)
            if (matchingToAsset) {
              setToAssetValue(matchingToAsset)
            }
          } else {
            setToAssetValue(baseAsset[0])
          }

          if (fromAssetValue != null) {
            const matchingFromAsset = baseAsset.find((asset) => asset.address === fromAssetValue.address)
            if (matchingFromAsset) {
              setFromAssetValue(matchingFromAsset)
            }
          } else {
            setFromAssetValue(baseAsset[1])
          }
        }

        forceUpdate()
      }

      const assetsUpdated = () => {
        const baseAsset = stores.stableSwapStore.getStore('baseAssets')

        setToAssetOptions(baseAsset)
        setFromAssetOptions(baseAsset)
      }

      const swapReturned = (event) => {
        setLoading(false)
        setFromAmountValue('')
        setToAmountValue('')
        calculateTypeAndReceiveAmount(0, fromAssetValue, toAssetValue)
        setQuote(null)
        setQuoteLoading(false)
      }

      const wrapReturned = (event) => {
        setLoading(false)
        setFromAmountValue('')
        setToAmountValue('')
        calculateTypeAndReceiveAmount(0, fromAssetValue, toAssetValue)
        setQuote(null)
        setQuoteLoading(false)
      }

      stores.emitter.on(ACTIONS.ERROR, errorReturned)
      stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
      stores.emitter.on(ACTIONS.SWAP_RETURNED, swapReturned)
      stores.emitter.on(ACTIONS.WRAP_RETURNED, wrapReturned)
      stores.emitter.on(ACTIONS.QUOTE_SWAP_RETURNED, quoteReturned)
      stores.emitter.on(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)

      ssUpdated()

      return () => {
        stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
        stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
        stores.emitter.removeListener(ACTIONS.SWAP_RETURNED, swapReturned)
        stores.emitter.removeListener(ACTIONS.WRAP_RETURNED, wrapReturned)
        stores.emitter.removeListener(ACTIONS.QUOTE_SWAP_RETURNED, quoteReturned)
        stores.emitter.removeListener(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)
      }
    },
    [fromAmountValue, fromAssetValue, toAssetValue]
  )

  const onAssetSelect = (type, value) => {
    if (type === 'From') {
      if (value.address === toAssetValue.address) {
        setToAssetValue(fromAssetValue)
        setFromAssetValue(toAssetValue)
        calculateTypeAndReceiveAmount(fromAmountValue, toAssetValue, fromAssetValue)
      } else {
        setFromAssetValue(value)
        calculateTypeAndReceiveAmount(fromAmountValue, value, toAssetValue)
      }
    } else {
      if (value.address === fromAssetValue.address) {
        setFromAssetValue(toAssetValue)
        setToAssetValue(fromAssetValue)
        calculateTypeAndReceiveAmount(fromAmountValue, toAssetValue, fromAssetValue)
      } else {
        setToAssetValue(value)
        calculateTypeAndReceiveAmount(fromAmountValue, fromAssetValue, value)
      }
    }

    forceUpdate()
  }

  const fromAmountChanged = (event) => {
    setFromAmountError(false)
    setFromAmountValue(event.target.value)
    if (event.target.value == '') {
      setToAmountValue('')
      setQuote(null)
    } else {
      calculateTypeAndReceiveAmount(event.target.value, fromAssetValue, toAssetValue)
    }
  }

  const toAmountChanged = (event) => {}

  const onSlippageChanged = (event) => {
    // if (event.target.value == '' || !isNaN(event.target.value)) {
    //   setSlippage(event.target.value)
    // }
    setSlippageInput(event.target.value)
    const value = parseFloat(event.target.value)
    if (event.target.value === '' || isNaN(value) || value < 0 || value > 100) {
      setSlippageError('invalid slippage')
    } else {
      setSlippageError('')
      setSlippage(event.target.value)
    }
  }

  const calculateReceiveAmount = (amount, from, to) => {
    if (amount !== '' && !isNaN(amount) && to != null) {
      setQuoteLoading(true)
      setQuoteError(false)

      stores.dispatcher.dispatch({
        type: ACTIONS.QUOTE_SWAP,
        content: {
          fromAsset: from,
          toAsset: to,
          fromAmount: amount,
        },
      })
    }
  }

  const calculateTypeAndReceiveAmount = (amount, from, to) => {
    let txType = 'swap'

    if (from.address === 'ETH' && to.address.toLowerCase() === CONTRACTS.WETH_ADDRESS.toLowerCase()) {
      txType = 'wrap'
    } else if (from.address.toLowerCase() === CONTRACTS.WETH_ADDRESS.toLowerCase() && to.address === 'ETH') {
      txType = 'unwrap'
    }
    setTransactionType(txType)

    if (amount !== '' && !isNaN(amount) && to != null) {
      if (txType === 'wrap' || txType === 'unwrap') {
        setQuoteLoading(false)
        setQuoteError(false)
        setQuote(null)
        setToAmountValue(amount)
      } else {
        // setTransactionType('swap')
        setQuoteLoading(true)
        setQuoteError(false)

        stores.dispatcher.dispatch({
          type: ACTIONS.QUOTE_SWAP,
          content: {
            fromAsset: from,
            toAsset: to,
            fromAmount: amount,
          },
        })
      }
    }
  }

  const onSwap = () => {
    setFromAmountError(false)
    setFromAssetError(false)
    setToAssetError(false)

    let error = false

    if (!fromAmountValue || fromAmountValue === '' || isNaN(fromAmountValue)) {
      setFromAmountError('From amount is required')
      error = true
    } else {
      if (!fromAssetValue.balance || isNaN(fromAssetValue.balance) || BigNumber(fromAssetValue.balance).lte(0)) {
        setFromAmountError('Invalid balance')
        error = true
      } else if (BigNumber(fromAmountValue).lt(0)) {
        setFromAmountError('Invalid amount')
        error = true
      } else if (fromAssetValue && BigNumber(fromAmountValue).gt(fromAssetValue.balance)) {
        setFromAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if (!fromAssetValue || fromAssetValue === null) {
      setFromAssetError('From asset is required')
      error = true
    }

    if (!toAssetValue || toAssetValue === null) {
      setFromAssetError('To asset is required')
      error = true
    }

    if (!error && transactionType === 'swap') {
      setLoading(true)

      stores.dispatcher.dispatch({
        type: ACTIONS.SWAP,
        content: {
          fromAsset: fromAssetValue,
          toAsset: toAssetValue,
          fromAmount: fromAmountValue,
          toAmount: toAmountValue,
          quote,
          slippage,
        },
      })
    } else if (!error && (transactionType === 'wrap' || transactionType === 'unwrap')) {
      setLoading(true)

      stores.dispatcher.dispatch({
        type: ACTIONS.WRAP,
        content: {
          fromAsset: fromAssetValue,
          toAsset: toAssetValue,
          fromAmount: fromAmountValue,
        },
      })
    }
  }

  const setBalance100 = () => {
    if (fromAssetValue.balance) {
      setFromAmountValue(fromAssetValue.balance)
      calculateTypeAndReceiveAmount(fromAssetValue.balance, fromAssetValue, toAssetValue)
    }
  }

  const setBalance75 = () => {
    if (fromAssetValue.balance) {
      let amount = BigNumber(fromAssetValue.balance).times(0.75).toFixed(fromAssetValue.decimals)
      setFromAmountValue(amount)
      calculateTypeAndReceiveAmount(amount, fromAssetValue, toAssetValue)
    }
  }

  const setBalance50 = () => {
    if (fromAssetValue.balance) {
      let amount = BigNumber(fromAssetValue.balance).times(0.5).toFixed(fromAssetValue.decimals)
      setFromAmountValue(amount)
      calculateTypeAndReceiveAmount(amount, fromAssetValue, toAssetValue)
    }
  }

  const setBalance25 = () => {
    if (fromAssetValue.balance) {
      let amount = BigNumber(fromAssetValue.balance).times(0.25).toFixed(fromAssetValue.decimals)
      setFromAmountValue(amount)
      calculateTypeAndReceiveAmount(amount, fromAssetValue, toAssetValue)
    }
  }

  const setBalance10 = () => {
    if (fromAssetValue.balance) {
      let amount = BigNumber(fromAssetValue.balance).times(0.1).toFixed(fromAssetValue.decimals)
      setFromAmountValue(amount)
      calculateTypeAndReceiveAmount(amount, fromAssetValue, toAssetValue)
    }
  }

  const handleRefreshClick = () => {
    setIsRefreshClicked(true)
    setTimeout(() => setIsRefreshClicked(false), 500) // Reset after the same duration as the animation
    calculateTypeAndReceiveAmount(fromAmountValue, fromAssetValue, toAssetValue)
  }

  const handleRouteToggle = () => {
    setIsRouteOpen(!isRouteOpen)
  }

  const swapAssets = () => {
    const fa = fromAssetValue
    const ta = toAssetValue
    setFromAssetValue(ta)
    setToAssetValue(fa)
    calculateTypeAndReceiveAmount(fromAmountValue, ta, fa)
  }

  const renderSwapInformation = () => {
    return (
      <div className="mt-12">
        <div className="grid gap-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center text-text-gray">Rate</div>
            <div className="flex items-center">
              <span>
                {isFromPerToRate
                  ? `1 ${fromAssetValue?.symbol} = ${formatCurrency(
                      BigNumber(quote.output.finalValue).div(quote.inputs.fromAmount).toFixed(18)
                    )} ${toAssetValue?.symbol}`
                  : `1 ${toAssetValue?.symbol} = ${formatCurrency(
                      BigNumber(quote.inputs.fromAmount).div(quote.output.finalValue).toFixed(18)
                    )} ${fromAssetValue?.symbol}`}
              </span>
              <button
                className="inline-flex border-0 outline-none focus:outline-none ml-1"
                onClick={() => setIsFromPerToRate(!isFromPerToRate)}
              >
                <ArrowPathRoundedSquareIcon className="self-center shrink-0 w-4 h-4 text-current" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center text-text-gray">Slippage Tolerance</div>
            <div className="flex items-center">{slippage}%</div>
          </div>
          <div className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center text-text-gray">
              Minimum Received
              <span>
                <Tooltip id="slippage-tooltip" className="max-w-md whitespace-normal" />
                <a
                  data-tooltip-id="slippage-tooltip"
                  data-tooltip-place="right"
                  data-tooltip-content="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
                >
                  <InformationCircleIcon className="self-center shrink-0 mx-1 h-4 w-4 text-text-gray" />
                </a>
              </span>
            </div>
            <div className="flex items-center">
              {`${formatCurrency(
                BigNumber(quote.output.finalValue)
                  .times(1 - slippage / 100)
                  .toFixed(18)
              )} ${toAssetValue?.symbol}`}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center text-text-gray">
              Price Impact
              <span>
                <Tooltip id="price-impact-tooltip" className="max-w-md whitespace-normal" />
                <a
                  data-tooltip-id="price-impact-tooltip"
                  data-tooltip-place="right"
                  data-tooltip-content="A price impact of less than +3% or any negative value is considered safe."
                >
                  <InformationCircleIcon className="self-center shrink-0 mx-1 h-4 w-4 text-text-gray" />
                </a>
              </span>
            </div>
            <div className={`flex items-center ${BigNumber(quote.priceImpact).gt(3) ? 'text-red-500' : ''}`}>
              {formatCurrency(quote.priceImpact)}%
            </div>
          </div>
          <div className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center text-text-gray">Liquidity Routing</div>
            <div className="items-center underline cursor-pointer text-text-gray" onClick={handleRouteToggle}>
              {isRouteOpen ? 'Hide' : 'View'}
            </div>
          </div>
        </div>
        {isRouteOpen && (
          <div className="grow flex items-center justify-between mx-6 mt-12 mb-4">
            <img
              className="w-7 h-7 rounded-full hover:opacity-80"
              alt=""
              src={fromAssetValue ? `${fromAssetValue.logoURI}` : ''}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/tokens/unknown-logo.png'
              }}
            />
            {/* <Image
              src={fromAssetValue ? `${fromAssetValue.logoURI}` : '/tokens/unknown-logo.png'}
              alt=""
              width={28}
              height={28}
              className="rounded-full hover:opacity-80"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/tokens/unknown-logo.png'
              }}
            /> */}
            <div className="relative grow flex justify-center items-center mx-2">
              <div className="relative z-20 rounded-full bg-bg-light text-white p-1 h-6 w-6">
                <ChevronDoubleRightIcon className="" />
              </div>
              <div className="absolute z-10 top-3 border-t border-dashed border-white w-full"></div>
              <div className="absolute top-8 text-xs text-white">
                <div>{quote.output.routes[0].stable ? 'Stable' : 'Volatile'}</div>
              </div>
            </div>
            {quote && quote.output && quote.output.routeAsset && (
              <>
                <img
                  className="w-7 h-7 rounded-full hover:opacity-80"
                  alt=""
                  src={quote.output.routeAsset ? `${quote.output.routeAsset.logoURI}` : ''}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/tokens/unknown-logo.png'
                  }}
                />
                {/* <Image
                  src={quote.output.routeAsset ? `${quote.output.routeAsset.logoURI}` : '/tokens/unknown-logo.png'}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full hover:opacity-80"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/tokens/unknown-logo.png'
                  }}
                /> */}
                <div className="relative grow flex justify-center items-center  mx-2">
                  <div className="relative z-20 rounded-full bg-bg-light text-white p-1 h-6 w-6">
                    <ChevronDoubleRightIcon className="" />
                  </div>
                  <div className="absolute z-10 top-3 border-t border-dashed border-white w-full"></div>
                  <div className="absolute top-8 text-xs text-white">
                    <div>{quote.output.routes[1].stable ? 'Stable' : 'Volatile'}</div>
                  </div>
                </div>
              </>
            )}
            <img
              className="w-7 h-7 rounded-full hover:opacity-80"
              alt=""
              src={toAssetValue ? `${toAssetValue.logoURI}` : ''}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/tokens/unknown-logo.png'
              }}
            />
            {/* <Image
              src={toAssetValue ? `${toAssetValue.logoURI}` : '/tokens/unknown-logo.png'}
              alt=""
              width={28}
              height={28}
              className="rounded-full hover:opacity-80"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/tokens/unknown-logo.png'
              }}
            /> */}
          </div>
        )}

        <div>
          {/* <div className="flex items-center  text-sm font-medium mt-3 mb-3">Routing</div>
            <div className="shrink-0 bg-border h-[1px] w-full mb-2"></div> */}
        </div>
      </div>
    )
  }

  function renderSlippageButton({ value, label }) {
    return (
      <button
        className={`inline-flex items-center justify-center text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none py-2 px-4 rounded-[10px] h-[44px] ${
          value === parseFloat(slippage)
            ? 'border border-pink-primary bg-bg-light text-pink-primary'
            : 'border border-border  hover:bg-bg-highlight hover:border-pink-primary'
        }`}
        disabled={loading}
        onClick={() => onSlippageChanged({ target: { value: label } })}
      >
        {label}%
      </button>
    )
  }

  const renderSlippageSetting = (type, amountValue, amountError, amountChanged) => {
    return (
      <div className="absolute z-30 top-0 left-0 w-full min-h-full bg-table-dark rounded-3xl py-6">
        <div>
          <div className="flex justify-between items-center px-6 py-2">
            <div className="text-xl font-semibold">Settings</div>
            <button
              className="inline-flex border-0 outline-none rounded-full opacity-70 hover:opacity-100 focus:outline-none"
              onClick={() => setIsSlippageSettingOpen(false)}
            >
              <XMarkIcon className="self-center shrink-0 h-6 w-6 text-white" />
            </button>
          </div>
          <div className="px-6 my-7">
            <div className="border-b border-gray-700/50"></div>
          </div>
          <div className="px-6 grid gap-9 text-base">
            <div>
              <div className="flex items-center font-semibold mb-6">
                <span className="text-sm">Slippage Tolerance</span>
                <span className="text-sm">
                  <Tooltip id="slippage-tooltip-setting" className="max-w-md whitespace-normal" />
                  <a
                    data-tooltip-id="slippage-tooltip-setting"
                    data-tooltip-place="right"
                    data-tooltip-content="Your transaction will revert if the price changes unfavorably by more than this percentage."
                  >
                    <InformationCircleIcon className="self-center shrink-0 mx-1 h-4 w-4 text-text-gray" />
                  </a>
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {renderSlippageButton({ value: 0.1, label: '0.1' })}
                {renderSlippageButton({ value: 0.5, label: '0.5' })}
                {renderSlippageButton({ value: 1.0, label: '1.0' })}
                {renderSlippageButton({ value: 3.0, label: '3.0' })}
                <div>
                  <div className="relative flex w-full flex-wrap items-stretch border border-border rounded-lg focus-within:border-pink-primary transition-colors duration-300">
                    <input
                      placeholder={slippage}
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      className="px-3 py-3 bg-transparent relative bg-table border-0 shadow outline-none focus:ring-0 w-full h-[42px] text-text-gray font-medium rounded-lg focus:text-white placeholder:text-text-unselected"
                      value={slippageInput}
                      onChange={amountChanged}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              {amountError && <div className="text-red-500/75 text-sm text-right mt-2">{amountError}</div>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMassiveInput = (
    type,
    amountValue,
    amountError,
    amountChanged,
    assetValue,
    assetError,
    assetOptions,
    onAssetSelect
  ) => {
    return (
      <div className="">
        <div className="grid font-medium">
          <div className="flex justify-between items-center mb-[9px]">
            <div className="font-semibold text-sm text-text-gray">{type === 'From' ? 'From' : 'To'}</div>
            {assetValue && assetValue.balance && (
              <div
                className={`text-sm ${type === 'From' ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (type === 'From') {
                    setBalance100()
                  }
                }}
              >
                <span className="text-text-gray">{'Balance:'}</span>
                <span className="font-semibold text-text-gray">{' ' + formatCurrency(assetValue.balance)}</span>
              </div>
            )}
          </div>
          <div className="grid gap-2 rounded-[10px] p-4 mb-[14px] border border-border bg-table-dark">
            <div className="flex items-center">
              {/* 上のアセット選択のここに入れてください */}
              <AssetSelect type={type} value={assetValue} assetOptions={assetOptions} onSelect={onAssetSelect} />
              <div className="flex-grow basis-0 rounded-lg py-1.5 border-border focus-within:border-pink-primary transition-colors duration-300">
                <input
                  className="p-0 w-full font-semibold text-[22px] leading-7 overflow-hidden text-right text-ellipsis bg-transparent focus:outline-none border-0 focus:ring-0 mb-1 placeholder:text-text-unselected"
                  type="text"
                  placeholder="0.00"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  minLength="1"
                  maxLength="79"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  value={amountValue}
                  onChange={amountChanged}
                  disabled={loading || type === 'To'}
                  // error={amountError}
                  // helperText={amountError}
                />
                <div className="text-right whitespace-nowrap overflow-hidden text-ellipsis text-sm text-text-gray leading-[18px]">
                  {amountValue
                    ? assetValue && assetValue.price
                      ? `~$${formatCurrency(amountValue * assetValue.price)}`
                      : '...'
                    : '$0.00'}
                </div>
              </div>
            </div>
            {amountError && <div className="text-red-500/75 text-sm text-right">{amountError}</div>}
          </div>
          {type === 'From' && (
            <div className="grid grid-cols-5 gap-x-3">
              <button
                className="w-auto rounded-md text-center text-sm p-1.5 transition-all duration-300 border border-border hover:border-pink-primary  hover:bg-bg-highlight"
                onClick={setBalance10}
              >
                10%
              </button>
              <button
                className="w-auto rounded-md text-center text-sm p-1.5 transition-all duration-300 border border-border hover:border-pink-primary  hover:bg-bg-highlight"
                onClick={setBalance25}
              >
                25%
              </button>
              <button
                className="w-auto rounded-md text-center text-sm p-1.5 transition-all duration-300 border border-border hover:border-pink-primary  hover:bg-bg-highlight"
                onClick={setBalance50}
              >
                50%
              </button>
              <button
                className="w-auto rounded-md text-center text-sm p-1.5 transition-all duration-300 border border-border hover:border-pink-primary  hover:bg-bg-highlight"
                onClick={setBalance75}
              >
                75%
              </button>
              <button
                className="w-auto rounded-md text-center text-sm p-1.5 transition-all duration-300 border border-border hover:border-pink-primary  hover:bg-bg-highlight"
                onClick={setBalance100}
              >
                100%
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="flex w-full justify-evenly ">
      <div className="w-full max-w-[485px] md:min-w-[485px] rounded-[20px] conic">
        <div className="conic-content relative px-5 pt-7 sm:px-8 sm:pt-8 pb-12">
          <div className="flex justify-end items-center">
            <div className="flex flex-end gap-5">
              <button
                className={`inline-flex border-0 outline-none focus:outline-none  ${
                  isRefreshClicked ? 'animate-[spin_500ms_linear]' : ''
                }`}
                onClick={handleRefreshClick}
              >
                <div className="inline-flex">
                  <ArrowPathIcon
                    className="h-6 w-6 text-text-gray hover:text-white transition-colors duration-150"
                    aria-hidden="true"
                  />
                </div>
              </button>
              <button className="inline-flex border-0 outline-none focus:outline-none">
                <AdjustmentsHorizontalIcon
                  className="h-6 w-6 text-text-gray hover:text-white transition-colors duration-150"
                  aria-hidden="true"
                  onClick={() => setIsSlippageSettingOpen(true)}
                />
              </button>
            </div>
            {isSlippageSettingOpen && renderSlippageSetting('slippage', slippage, slippageError, onSlippageChanged)}
          </div>
          <div className="grid text-base mt-6">
            {renderMassiveInput(
              'From',
              fromAmountValue,
              fromAmountError,
              fromAmountChanged,
              fromAssetValue,
              fromAssetError,
              fromAssetOptions,
              onAssetSelect
            )}

            <div className="text-center mt-8 mb-2">
              <button
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-table-dark border border-border hover:border-pink-primary hover:text-pink-primary hover:bg-pink-primary transition-all "
                onClick={swapAssets}
              >
                <ArrowsUpDownIcon className="h-7 w-7 text-white" aria-hidden="true" />
              </button>
            </div>
            {renderMassiveInput(
              'To',
              toAmountValue,
              toAmountError,
              toAmountChanged,
              toAssetValue,
              toAssetError,
              toAssetOptions,
              onAssetSelect
            )}
          </div>
          {quoteError && (
            <div className="">
              <div className="text-sm text-center text-text-gray border border-border rounded-lg bg-bg-light p-3">
                Insufficient liquidity or no route available to complete swap
              </div>
            </div>
          )}
          <div className="mt-8">
            <button
              className="inline-flex items-center justify-center font-bold transition-colors duration-300 disabled:bg-pink-primary disabled:text-white disabled:opacity-50 disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white pt-[15px] pb-[14px] px-4 rounded-[10px] w-full text-[16px] leading-[21px]"
              disabled={loading || quoteLoading || (transactionType === 'swap' && !quote) || quoteError}
              onClick={onSwap}
            >
              {loading
                ? transactionTexts[transactionType].processing
                : quoteLoading
                ? 'Finding'
                : transactionTexts[transactionType].action}
            </button>
          </div>
          {quote && !quoteLoading && renderSwapInformation()}
        </div>
      </div>
    </div>
  )
}

export default Setup
