import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import { Typography, MenuItem, Select } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { formatCurrency, formatAddress } from '../../utils'
// import classes from './ssLiquidityCreate.module.css'

import stores from '../../stores'
import { ACTIONS, ETHERSCAN_URL, TOP_ASSETS } from '../../stores/constants'
import {
  ArrowLeftIcon,
  ArrowLongRightIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Tooltip } from 'react-tooltip'

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

  useEffect(() => {
    const fetchData = async () => {
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
        const baseAsset = await stores.stableSwapStore.getBaseAsset(search, true, true)
      }
    }

    fetchData()
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
                sizes="100vw"
                src={asset ? `${asset.logoURI}` : '/tokens/unknown-logo.png'}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/tokens/unknown-logo.png'
                }}
                layout="fill"
                objectFit="cover"
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
        className="list-item pl-3 pr-4 py-1 hover:cursor-pointer hover:bg-bg-light transition-colors duration-100"
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
                sizes="100vw"
                src={asset ? `${asset.logoURI}` : '/tokens/unknown-logo.png'}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/tokens/unknown-logo.png'
                }}
                layout="fill"
                objectFit="cover"
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

  // すべての代替資産のリスト
  const renderTopAssets = () => {
    return (
      <>
        {topAssets.map((asset) => (
          <button
            key={asset.symbol}
            className="relative col-span-2 inline-flex items-center space-x-1 rounded-[10px] border border-border bg-bg-light px-[10px] py-2 transition-colors duration-300 hover:bg-bg-highlight hover:border-pink-primary "
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

  // すべての代替資産のリスト
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

  // すべての代替資産のリスト
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
                  <div className="flex flex-row items-center px-3 rounded-[10px] border border-border focus-within:border-pink-primary focus-within:bg-table-dark transition-colors duration-300">
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
      <button
        className="flex flex-none flex-row items-center"
        onClick={() => {
          openSearch()
        }}
      >
        <img
          className="aspect-square rounded-full"
          src={value ? `${value.logoURI}` : ''}
          width="24"
          height="24"
          alt=""
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/tokens/unknown-logo.png'
          }}
        />
        {/* <Image
          className="aspect-square rounded-full"
          src={value ? `${value.logoURI}` : '/tokens/unknown-logo.png'}
          width={24}
          height={24}
          alt=""
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/tokens/unknown-logo.png'
          }}
        /> */}
        <div className="text-base font-medium leading-6 ml-[6px] mr-1">{value ? `${value.symbol}` : ''}</div>
        <ChevronDownIcon className="ml-1 h-4 w-4" />
      </button>
      {renderDialog()}
    </>
    // <React.Fragment>
    //   <div
    //     className={classes.displaySelectContainer}
    //     onClick={() => {
    //       openSearch()
    //     }}
    //   >
    //     <div className={classes.assetSelectMenuItem}>
    //       <div className={classes.displayDualIconContainer}>
    //         <img
    //           className={classes.displayAssetIcon}
    //           alt=""
    //           src={value ? `${value.logoURI}` : ''}
    //           height="100px"
    //           onError={(e) => {
    //             e.target.onerror = null
    //             e.target.src = '/tokens/unknown-logo.png'
    //           }}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
    //     {!manageLocal && renderOptions()}
    //     {manageLocal && renderManageLocal()}
    //   </Dialog>
    // </React.Fragment>
  )
}

const PageHeader = () => {
  const router = useRouter()

  const onBack = () => {
    router.push('/liquidity')
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <div className="inline-block text-white pb-2 md:pb-3 lg:pb-4 text-2xl xs:text-4xl sm:text-5xl lg:text-5xl font-bold tracking-normal">
        Create Liquidity Pool
      </div>
      <div className="font-sans text-base leading-6 text-text-gray">Create a new liquidity Pool</div>
      <div className="absolute top-0 left-0 sm:pt-2">
        <button
          className="inline-flex items-center justify-center text-white rounded-md border border-white border-opacity-10 bg-white bg-opacity-8 hover:bg-white/20 transition-colors h-9 w-9 "
          onClick={onBack}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default function LiquidityCreate() {
  const router = useRouter()
  const [createLoading, setCreateLoading] = useState(false)
  const [depositLoading, setDepositLoading] = useState(false)

  const [amount0, setAmount0] = useState('')
  const [amount0Error, setAmount0Error] = useState(false)
  const [amount1, setAmount1] = useState('')
  const [amount1Error, setAmount1Error] = useState(false)

  const [stable, setStable] = useState(false)

  const [asset0, setAsset0] = useState(null)
  const [asset1, setAsset1] = useState(null)
  const [assetOptions, setAssetOptions] = useState([])

  // const [quote, setQuote] = useState(null)

  const [token, setToken] = useState(null)
  // const [vestNFTs, setVestNFTs] = useState([])
  // const [veToken, setVeToken] = useState(null)
  // const [advanced, setAdvanced] = useState(false)

  const [pair, setPair] = useState(null)

  //might not be correct to d this every time store updates.
  const ssUpdated = async () => {
    const storeAssetOptions = stores.stableSwapStore.getStore('baseAssets')
    setAssetOptions(storeAssetOptions)

    if (storeAssetOptions.length > 0 && asset0 == null) {
      setAsset0(storeAssetOptions[0])
      // console.log('test setAsset0')
    }

    if (storeAssetOptions.length > 0 && asset1 == null) {
      setAsset1(storeAssetOptions[1])
      // console.log('test setAsset1')
    }

    // console.log('storeAssetOptions', storeAssetOptions)
    // console.log('storeAssetOptions length', storeAssetOptions.length)
    // console.log('asset0', asset0)
    // console.log('asset1', asset1)

    // setVeToken(stores.stableSwapStore.getStore('veToken'))
    // const nfts = stores.stableSwapStore.getStore('vestNFTs')
    // setVestNFTs(nfts)
    // if (nfts.length > 0) {
    //   if (token == null) {
    //     setToken(nfts[0])
    //   }
    // }

    // if (asset0 && asset1) {
    //   const p = await stores.stableSwapStore.getPair(asset0.address, asset1.address, stable)
    //   setPair(p)
    //   console.log('pair!!!!!', p)
    // }
  }

  useEffect(() => {
    const createReturned = (res) => {
      setCreateLoading(false)
      setDepositLoading(false)
      router.push(`/liquidity/${res}`)
    }

    const errorReturned = () => {
      setCreateLoading(false)
      setDepositLoading(false)
    }

    const assetsUpdated = () => {
      const baseAsset = stores.stableSwapStore.getStore('baseAssets')
      setAssetOptions(baseAsset)
    }

    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    stores.emitter.on(ACTIONS.PAIR_CREATED, createReturned)
    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)

    ssUpdated()

    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
      stores.emitter.removeListener(ACTIONS.PAIR_CREATED, createReturned)
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await ssUpdated()
    }

    fetchData()
  }, [router.query.address])

  const setAmountPercent = (input, percent) => {
    if (input === 'amount0') {
      if (asset0.balance) {
        let am = BigNumber(asset0.balance).times(percent).div(100).toFixed(asset0.decimals)
        setAmount0(am)
      }
    } else if (input === 'amount1') {
      if (asset1.balance) {
        let am = BigNumber(asset1.balance).times(percent).div(100).toFixed(asset1.decimals)
        setAmount1(am)
      }
    }
  }

  // const onCreateAndStake = () => {
  //   setAmount0Error(false)
  //   setAmount1Error(false)

  //   let error = false

  //   if (!amount0 || amount0 === '' || isNaN(amount0)) {
  //     setAmount0Error('Amount 0 is required')
  //     error = true
  //   } else {
  //     if (!asset0.balance || isNaN(asset0.balance) || BigNumber(asset0.balance).lte(0)) {
  //       setAmount0Error('Invalid balance')
  //       error = true
  //     } else if (BigNumber(amount0).lte(0)) {
  //       setAmount0Error('Invalid amount')
  //       error = true
  //     } else if (asset0 && BigNumber(amount0).gt(asset0.balance)) {
  //       setAmount0Error(`Greater than your available balance`)
  //       error = true
  //     }
  //   }

  //   if (!amount1 || amount1 === '' || isNaN(amount1)) {
  //     setAmount1Error('Amount 0 is required')
  //     error = true
  //   } else {
  //     if (!asset1.balance || isNaN(asset1.balance) || BigNumber(asset1.balance).lte(0)) {
  //       setAmount1Error('Invalid balance')
  //       error = true
  //     } else if (BigNumber(amount1).lte(0)) {
  //       setAmount1Error('Invalid amount')
  //       error = true
  //     } else if (asset1 && BigNumber(amount1).gt(asset1.balance)) {
  //       setAmount1Error(`Greater than your available balance`)
  //       error = true
  //     }
  //   }

  //   if (!asset0 || asset0 === null) {
  //     setAmount0Error('From asset is required')
  //     error = true
  //   }

  //   if (!asset1 || asset1 === null) {
  //     setAmount1Error('To asset is required')
  //     error = true
  //   }

  //   if (!error) {
  //     setCreateLoading(true)
  //     stores.dispatcher.dispatch({
  //       type: ACTIONS.CREATE_PAIR_AND_STAKE,
  //       content: {
  //         token0: asset0,
  //         token1: asset1,
  //         amount0,
  //         amount1,
  //         isStable: stable,
  //         token,
  //       },
  //     })
  //   }
  // }

  const onCreateAndDeposit = () => {
    setAmount0Error(false)
    setAmount1Error(false)

    let error = false

    if (!amount0 || amount0 === '' || isNaN(amount0)) {
      setAmount0Error('Amount is required')
      error = true
    } else {
      if (!asset0.balance || isNaN(asset0.balance) || BigNumber(asset0.balance).lte(0)) {
        setAmount0Error('Invalid balance')
        error = true
      } else if (BigNumber(amount0).lte(0)) {
        setAmount0Error('Invalid amount')
        error = true
      } else if (asset0 && BigNumber(amount0).gt(asset0.balance)) {
        setAmount0Error(`Greater than your available balance`)
        error = true
      }
    }

    if (!amount1 || amount1 === '' || isNaN(amount1)) {
      setAmount1Error('Amount is required')
      error = true
    } else {
      if (!asset1.balance || isNaN(asset1.balance) || BigNumber(asset1.balance).lte(0)) {
        setAmount1Error('Invalid balance')
        error = true
      } else if (BigNumber(amount1).lte(0)) {
        setAmount1Error('Invalid amount')
        error = true
      } else if (asset1 && BigNumber(amount1).gt(asset1.balance)) {
        setAmount1Error(`Greater than your available balance`)
        error = true
      }
    }

    if (!asset0 || asset0 === null) {
      setAmount0Error('Token 0 is required')
      error = true
    }

    if (!asset1 || asset1 === null) {
      setAmount1Error('Token 1 is required')
      error = true
    }

    if (!error) {
      setDepositLoading(true)
      stores.dispatcher.dispatch({
        type: ACTIONS.CREATE_PAIR_AND_DEPOSIT,
        content: {
          token0: asset0,
          token1: asset1,
          amount0,
          amount1,
          isStable: stable,
          slippage: 0, // This argument is necessary. Should be removed in the future.
        },
      })
    }
  }

  const amount0Changed = (event) => {
    setAmount0Error(false)
    setAmount0(event.target.value)
  }

  const amount1Changed = (event) => {
    setAmount1Error(false)
    setAmount1(event.target.value)
  }

  // const handleChange = (event) => {
  //   setToken(event.target.value)
  // }

  const onAssetSelect = async (type, value) => {
    if (type === 'amount0') {
      setAsset0(value)
      // const p = await stores.stableSwapStore.getPair(value.address, asset1.address, stable)
      // setPair(p)
    } else {
      setAsset1(value)
      // const p = await stores.stableSwapStore.getPair(asset0.address, value.address, stable)
      // setPair(p)
    }
  }

  const setStab = async (val) => {
    setStable(val)
    // const p = await stores.stableSwapStore.getPair(asset0.address, asset1.address, val)
    // setPair(p)
  }

  useEffect(() => {
    if (asset0 && asset1) {
      const fetchPair = async () => {
        const p = await stores.stableSwapStore.getPair(asset0.address, asset1.address, stable)
        setPair(p)
        // console.log('pair!!!!!', p)
      }

      fetchPair()
    }
  }, [asset0, asset1, stable])

  // const renderMediumInputToggle = (type, value) => {
  //   return (
  //     <div className={classes.textField}>
  //       <div className={classes.mediumInputContainer}>
  //         <div className={classes.toggles}>
  //           <div
  //             className={`${classes.toggleOption} ${stable && classes.active}`}
  //             onClick={() => {
  //               setStab(true)
  //             }}
  //           >
  //             <Typography className={classes.toggleOptionText}>Stable</Typography>
  //           </div>
  //           <div
  //             className={`${classes.toggleOption} ${!stable && classes.active}`}
  //             onClick={() => {
  //               setStab(false)
  //             }}
  //           >
  //             <Typography className={classes.toggleOptionText}>Volatile</Typography>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

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
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row flex-wrap items-center justify-between gap-y-2 text-sm">
          <div className="pr-2">
            <span className="text-text-gray">{type === 'amount0' ? 'Token 0' : 'Token 1'}</span>
          </div>
          <span className="text-text-gray">
            {`Wallet: ${
              assetValue?.balance && assetValue?.decimals
                ? formatCurrency(assetValue.balance, assetValue.decimals)
                : formatCurrency(0, 18)
            }`}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl bg-table-dark border-border border-[1px] pr-2 focus-within:border-pink-primary transition-colors duration-300">
          <div className="flex flex-row items-center">
            <input
              className="flex h-12 w-full px-3 py-2 focus:outline-none rounded-xl shadow-none bg-transparent border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 placeholder:text-text-unselected"
              type="text"
              placeholder="0"
              value={amountValue}
              onChange={amountChanged}
              disabled={createLoading}
            />
            <AssetSelect type={type} value={assetValue} assetOptions={assetOptions} onSelect={onAssetSelect} />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="text-red-500">{amountError || ''}</div>
          <div className="flex flex-row items-center justify-end gap-1">
            <button
              className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-pink-primary hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
              onClick={() => {
                setAmountPercent(type, 0)
              }}
            >
              0%
            </button>
            <button
              className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-pink-primary hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
              onClick={() => {
                setAmountPercent(type, 25)
              }}
            >
              25%
            </button>
            <button
              className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-pink-primary hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
              onClick={() => {
                setAmountPercent(type, 50)
              }}
            >
              50%
            </button>
            <button
              className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-pink-primary hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
              onClick={() => {
                setAmountPercent(type, 75)
              }}
            >
              75%
            </button>
            <button
              className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-pink-primary hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
              onClick={() => {
                setAmountPercent(type, 100)
              }}
            >
              MAX
            </button>
          </div>
        </div>
      </div>
      // <div className={classes.textField}>
      //   <div className={classes.inputTitleContainer}>
      //     <div className={classes.inputBalance}>
      //       <Typography
      //         className={classes.inputBalanceText}
      //         noWrap
      //         onClick={() => {
      //           setAmountPercent(type, 100)
      //         }}
      //       >
      //         Balance:
      //         {assetValue && assetValue.balance ? ' ' + formatCurrency(assetValue.balance) : ''}
      //       </Typography>
      //     </div>
      //   </div>
      //   <div className={`${classes.massiveInputContainer} ${(amountError || assetError) && classes.error}`}>
      //     <div className={classes.massiveInputAssetSelect}>
      //       <AssetSelect type={type} value={assetValue} assetOptions={assetOptions} onSelect={onAssetSelect} />
      //     </div>
      //     <div className={classes.massiveInputAmount}>
      //       <TextField
      //         placeholder="0.00"
      //         fullWidth
      //         error={amountError}
      //         helperText={amountError}
      //         value={amountValue}
      //         onChange={amountChanged}
      //         disabled={createLoading}
      //         InputProps={{
      //           className: classes.largeInput,
      //         }}
      //       />
      //       <Typography color="textSecondary" className={classes.smallerText}>
      //         {assetValue?.symbol}
      //       </Typography>
      //     </div>
      //   </div>
      // </div>
    )
  }

  // const renderCreateInformation = () => {
  //   return (
  //     <div className={classes.depositInfoContainer}>
  //       <Typography className={classes.depositInfoHeading}>Starting Liquidity Info</Typography>
  //       <div className={classes.createPriceInfos}>
  //         <div className={classes.priceInfo}>
  //           <Typography className={classes.title}>
  //             {BigNumber(amount1).gt(0) ? formatCurrency(BigNumber(amount0).div(amount1)) : '0.00'}
  //           </Typography>
  //           <Typography className={classes.text}>{`${asset0?.symbol} per ${asset1?.symbol}`}</Typography>
  //         </div>
  //         <div className={classes.priceInfo}>
  //           <Typography className={classes.title}>
  //             {BigNumber(amount0).gt(0) ? formatCurrency(BigNumber(amount1).div(amount0)) : '0.00'}
  //           </Typography>
  //           <Typography className={classes.text}>{`${asset1?.symbol} per ${asset0?.symbol}`}</Typography>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderTokenSelect = () => {
  //   return (
  //     <div className={classes.textField}>
  //       <div className={classes.mediumInputContainer}>
  //         <div className={classes.mediumInputAmount}>
  //           <Select
  //             fullWidth
  //             value={token}
  //             onChange={handleChange}
  //             InputProps={{
  //               className: classes.mediumInput,
  //             }}
  //           >
  //             {vestNFTs &&
  //               vestNFTs.map((option) => {
  //                 return (
  //                   <MenuItem key={option.id} value={option}>
  //                     <div className={classes.menuOption}>
  //                       <Typography>Token #{option.id}</Typography>
  //                       <div>
  //                         <Typography align="right" className={classes.smallerText}>
  //                           {formatCurrency(option.lockValue)}
  //                         </Typography>
  //                         <Typography color="textSecondary" className={classes.smallerText}>
  //                           {veToken?.symbol}
  //                         </Typography>
  //                       </div>
  //                     </div>
  //                   </MenuItem>
  //                 )
  //               })}
  //           </Select>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const onBack = () => {
  //   router.push('/liquidity')
  // }

  // const toggleAdvanced = () => {
  //   setAdvanced(!advanced)
  // }

  return (
    <>
      <PageHeader />
      <section className="flex flex-col gap-4 items-center pb-8 pt-6 md:py-8 items-top">
        <div dir="ltr" data-orientation="horizontal" className="max-w-[520px]">
          <div
            data-state="active"
            data-orientation="horizontal"
            role="tabpanel"
            tabIndex="0"
            className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="rounded-[20px] border border-border bg-gradient-primary text-white shadow-sm space-y-4">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-xl font-semibold leading-none tracking-tight mt-4 mb-2">
                  <div className="flex flex-row justify-between mb-2">
                    {stable ? 'Create Stable Pool' : 'Create Volatile Pool'}
                  </div>
                </h3>
                <p className="text-sm text-text-gray">
                  {stable
                    ? 'You are about to create a brand new stable pool. Stable pools are for closely matched assets e.g. DAI/USDC'
                    : 'You are about to create a brand new volatile pool. Volatile pools are for volatile assets e.g. WETH/USDC, WETH/TAIKO etc.'}
                </p>
              </div>
              <div className="p-6 pt-0 mb-4 space-y-8">
                <div className="space-y-8">
                  <div>
                    <div className="flex flex-row gap-2 items-center">
                      <div className="text-base font-semibold leading-none tracking-tight">Pool type:</div>
                      <div
                        className={`inline-flex items-center border border-transparent rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-white text-xs cursor-pointer ${
                          stable ? 'bg-white/20 hover:bg-white/10' : 'bg-pink-primary hover:bg-pink-primary/80'
                        }`}
                        onClick={() => {
                          setStab(false)
                        }}
                      >
                        Volatile Pool
                      </div>
                      <div
                        className={`inline-flex items-center border border-transparent rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-white text-xs cursor-pointer ${
                          stable ? 'bg-pink-primary hover:bg-pink-primary/80' : 'bg-white/20 hover:bg-white/10'
                        }`}
                        onClick={() => {
                          setStab(true)
                        }}
                      >
                        Stable Pool
                      </div>
                    </div>
                  </div>
                  {renderMassiveInput(
                    'amount0',
                    amount0,
                    amount0Error,
                    amount0Changed,
                    asset0,
                    null,
                    assetOptions,
                    onAssetSelect
                  )}
                  {renderMassiveInput(
                    'amount1',
                    amount1,
                    amount1Error,
                    amount1Changed,
                    asset1,
                    null,
                    assetOptions,
                    onAssetSelect
                  )}
                </div>
                <div className="">
                  <div className="text-base font-semibold leading-none tracking-tight mb-2">Price Info</div>
                  <div className="shrink-0 bg-border h-[1px] w-full mb-2"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div>{BigNumber(amount1).gt(0) ? formatCurrency(BigNumber(amount0).div(amount1)) : '0.00'}</div>
                      <div className="text-sm text-text-gray">{`${asset0?.symbol} per ${asset1?.symbol}`}</div>
                    </div>
                    <div>
                      <div>{BigNumber(amount0).gt(0) ? formatCurrency(BigNumber(amount1).div(amount0)) : '0.00'}</div>
                      <div className="text-sm text-text-gray">{`${asset1?.symbol} per ${asset0?.symbol}`}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
                  <div className="relative flex w-[62px] max-w-[62px] min-w-[62px] h-9">
                    <img
                      className="absolute left-0 top-0 aspect-square rounded-full"
                      src={asset0 ? `${asset0.logoURI}` : ''}
                      width="34"
                      height="34"
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/tokens/unknown-logo.png'
                      }}
                    />
                    <img
                      className="absolute left-[26px] top-0 z-10 aspect-square rounded-full"
                      src={asset1 ? `${asset1.logoURI}` : ''}
                      width="34"
                      height="34"
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/tokens/unknown-logo.png'
                      }}
                    />
                    {/* <Image
                      className="absolute left-0 top-0 aspect-square rounded-full"
                      src={asset0 ? `${asset0.logoURI}` : '/tokens/unknown-logo.png'}
                      width={34}
                      height={34}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/tokens/unknown-logo.png'
                      }}
                    />
                    <Image
                      className="absolute left-[26px] top-0 z-10 aspect-square rounded-full"
                      src={asset1 ? `${asset1.logoURI}` : '/tokens/unknown-logo.png'}
                      width={34}
                      height={34}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/tokens/unknown-logo.png'
                      }}
                    /> */}
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-white"></div>
                    <div className="text-blue-gray-400"></div>
                  </div>
                </div>
              </div>
              <div className="items-center p-6 pt-0 flex justify-end">
                <button
                  className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/85 text-white h-10 py-2 px-4 rounded-md"
                  disabled={createLoading || depositLoading || pair !== null}
                  onClick={onCreateAndDeposit}
                >
                  {pair !== null
                    ? 'Pair exists'
                    : createLoading || depositLoading
                    ? 'Creating'
                    : stable
                    ? 'Create stable pool'
                    : 'Create volatile pool'}
                  {/* {stable ? 'Create stable pool' : 'Create volatile pool'} */}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grow flex flex-row gap-4 mt-6">
          <div className="flex flex-row gap-3 max-w-[520px] rounded-[20px] border border-border bg-gradient-primary text-sm text-text-gray p-6">
            <div>
              <ExclamationTriangleIcon className="h-6 w-6 text-current" />
            </div>
            <div className=" whitespace-break-spaces">
              This is an advanced feature that is normally used by protocols to create pools for their tokens. If you
              are trying to join an existing pool, please visit the{' '}
              <a className="underline text-pink-primary" href="/liquidity">
                Liquidity
              </a>{' '}
              page and click the `manage/deposit` button on any pool.
            </div>
          </div>
        </div>
      </section>
    </>

    // <div className={classes.retain}>
    //   <Paper elevation={0} className={classes.container}>
    //     <div className={classes.titleSection}>
    //       <Tooltip title="Back to Liquidity" placement="top">
    //         <IconButton className={classes.backButton} onClick={onBack}>
    //           <ArrowBackIcon className={classes.backIcon} />
    //         </IconButton>
    //       </Tooltip>
    //       <Typography className={classes.titleText}>Create Liquidity Pair</Typography>
    //     </div>
    //     <div className={classes.reAddPadding}>
    //       <div className={classes.inputsContainer}>
    //         {renderMassiveInput(
    //           'amount0',
    //           amount0,
    //           amount0Error,
    //           amount0Changed,
    //           asset0,
    //           null,
    //           assetOptions,
    //           onAssetSelect
    //         )}
    //         <div className={classes.swapIconContainer}>
    //           <div className={classes.swapIconSubContainer}>
    //             <AddIcon className={classes.swapIcon} />
    //           </div>
    //         </div>
    //         {renderMassiveInput(
    //           'amount1',
    //           amount1,
    //           amount1Error,
    //           amount1Changed,
    //           asset1,
    //           null,
    //           assetOptions,
    //           onAssetSelect
    //         )}
    //         {renderMediumInputToggle('stable', stable)}
    //         {renderTokenSelect()}
    //         {renderCreateInformation()}
    //       </div>
    //       <div className={classes.advancedToggleContainer}>
    //         <FormControlLabel
    //           control={<Switch size="small" checked={advanced} onChange={toggleAdvanced} color={'primary'} />}
    //           className={classes.some}
    //           label="Advanced"
    //           labelPlacement="start"
    //         />
    //       </div>
    //       <div className={classes.actionsContainer}>
    //         {pair === null && (
    //           <>
    //             <Button
    //               variant="contained"
    //               size="large"
    //               className={createLoading || depositLoading ? classes.multiApprovalButton : classes.buttonOverride}
    //               color="primary"
    //               disabled={createLoading || depositLoading}
    //               onClick={onCreateAndStake}
    //             >
    //               <Typography className={classes.actionButtonText}>
    //                 {createLoading ? `Creating` : `Create Pair And Stake`}
    //               </Typography>
    //               {createLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //             </Button>
    //             {advanced && (
    //               <>
    //                 <Button
    //                   variant="contained"
    //                   size="large"
    //                   className={createLoading || depositLoading ? classes.multiApprovalButton : classes.buttonOverride}
    //                   color="primary"
    //                   disabled={createLoading || depositLoading}
    //                   onClick={onCreateAndDeposit}
    //                 >
    //                   <Typography className={classes.actionButtonText}>
    //                     {depositLoading ? `Depositing` : `Create Pair And Deposit`}
    //                   </Typography>
    //                   {depositLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                 </Button>
    //               </>
    //             )}
    //           </>
    //         )}
    //         {pair !== null && (
    //           <Button
    //             variant="contained"
    //             size="large"
    //             className={classes.multiApprovalButton}
    //             color="primary"
    //             disabled={true}
    //           >
    //             <Typography className={classes.actionButtonText}>{`Pair exists`}</Typography>
    //           </Button>
    //         )}
    //       </div>
    //     </div>
    //   </Paper>
    // </div>
  )
}
