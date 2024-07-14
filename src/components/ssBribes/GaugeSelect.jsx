import { Fragment, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { formatCurrency, formatAddress } from '../../utils'

import stores from '../../stores'
import { ETHERSCAN_URL, TOP_ASSETS, CONTRACTS } from '../../stores/constants'
// import Image from 'next/image'
import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'

import { Tooltip } from 'react-tooltip'

export default function GaugeSelect({ type, value, assetOptions, onSelect }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredAssetOptions, setFilteredAssetOptions] = useState([])

  const openSearch = () => {
    setSearch('')
    setOpen(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      let ao = assetOptions.filter((asset) => {
        if (!asset.gauge) {
          return false
        }

        if (search && search !== '') {
          const searchLower = search.toLowerCase()
          return (
            asset.symbol.toLowerCase().includes(searchLower) ||
            asset.address.toLowerCase().includes(searchLower) ||
            asset.token0.symbol.toLowerCase().includes(searchLower) ||
            asset.token0.address.toLowerCase().includes(searchLower) ||
            asset.token0.name.toLowerCase().includes(searchLower) ||
            asset.token1.symbol.toLowerCase().includes(searchLower) ||
            asset.token1.address.toLowerCase().includes(searchLower) ||
            asset.token1.name.toLowerCase().includes(searchLower)
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

  // useEffect(() => {
  //   const topAssets = assetOptions.filter((asset) => TOP_ASSETS.includes(asset.symbol))
  //   setTopAssets(topAssets)
  // }, [assetOptions])

  const onSearchChanged = async (event) => {
    setSearch(event.target.value)
  }

  const onLocalSelect = (type, asset) => {
    setSearch('')
    // setManageLocal(false)
    setOpen(false)
    onSelect(type, asset)
  }

  const onClose = () => {
    // setManageLocal(false)
    setSearch('')
    setOpen(false)
  }

  // const toggleLocal = () => {
  //   setManageLocal(!manageLocal)
  // }

  // const deleteOption = (token) => {
  //   stores.stableSwapStore.removeBaseAsset(token)
  // }

  // const viewOption = (token) => {
  //   window.open(`${ETHERSCAN_URL}/token/${token.address}`, '_blank')
  // }

  // const renderManageOption = (type, asset, idx) => {
  //   return (
  //     <li
  //       className="list-item px-6 py-1 hover:cursor-pointer hover:bg-white/10"
  //       key={asset.address + '_' + idx}
  //       // onClick={() => {
  //       //   onLocalSelect(type, asset)
  //       // }}
  //     >
  //       <div className="flex items-center justify-between">
  //         <div className="flex items-center justify-start gap-2">
  //           <div className="relative row-span-2 h-10 w-10 sm:h-14 sm:w-14">
  //             <img
  //               alt=""
  //               // loading="lazy"
  //               // decoding="async"
  //               // data-nimg="fill"
  //               className="border border-blue-gray-500/30 h-full w-full rounded-full bg-blue-gray-900 p-1"
  //               sizes="100vw"
  //               src={asset ? `${asset.logoURI}` : ''}
  //               onError={(e) => {
  //                 e.target.onerror = null
  //                 e.target.src = '/tokens/unknown-logo.png'
  //               }}
  //             />
  //           </div>
  //           <div className="flex flex-col items-start justify-center text-xs sm:text-sm">
  //             <p>{asset ? asset.symbol : ''}</p>
  //             <p className="text-sm text-blue-gray-400">{asset ? asset.name : ''}</p>
  //           </div>
  //         </div>
  //         <div className="flex items-center gap-4 text-right text-xs sm:text-sm">
  //           {/* <div className="ml-auto">
  //             <p>{asset && asset.balance ? formatCurrency(asset.balance) : '0.00'}</p>
  //             <p className="text-sm text-blue-gray-400">Balance</p>
  //           </div> */}
  //           <button
  //             className="mx-3 sm:mx-2"
  //             onClick={() => {
  //               deleteOption(asset)
  //             }}
  //           >
  //             <TrashIcon
  //               className="w-4 h-4 sm:w-5 sm:h-5 fill-white flex-shrink-0 hover:fill-blue-gray-600"
  //               focusable="false"
  //               viewBox="0 0 24 24"
  //               aria-hidden="true"
  //             />
  //           </button>
  //           <button
  //             className="mx-3 sm:mx-2"
  //             onClick={() => {
  //               viewOption(asset)
  //             }}
  //           >
  //             <ArrowTopRightOnSquareIcon
  //               className="w-4 h-4 sm:w-5 sm:h-5 fill-white flex-shrink-0 hover:fill-blue-gray-600"
  //               focusable="false"
  //               viewBox="0 0 24 24"
  //               aria-hidden="true"
  //             />
  //           </button>
  //         </div>
  //       </div>
  //     </li>
  //   )
  // }

  const renderAssetOption = (type, asset, idx) => {
    return (
      // <li
      //   className="list-item px-6 py-1 hover:cursor-pointer hover:bg-white/10"
      //   key={asset.address + '_' + idx}
      //   onClick={() => {
      //     onLocalSelect(type, asset)
      //   }}
      // >
      //   <div className="flex items-center justify-between">
      //     <div className="flex items-center justify-start gap-2">
      //       <div className="relative flex row-span-2 h-10 w-10 sm:h-14 sm:w-14">
      //         <img
      //           alt=""
      //           // loading="lazy"
      //           // decoding="async"
      //           // data-nimg="fill"
      //           className="border border-blue-gray-500/30 h-full w-full rounded-full bg-blue-gray-900 p-1"
      //           sizes="100vw"
      //           src={asset ? `${asset.logoURI}` : ''}
      //           onError={(e) => {
      //             e.target.onerror = null
      //             e.target.src = '/tokens/unknown-logo.png'
      //           }}
      //         />
      //       </div>
      //       <div className="flex flex-col items-start justify-center text-xs sm:text-sm">
      //         <p>{asset ? asset.symbol : ''}</p>
      //         <p className="text-sm text-blue-gray-400">{asset ? asset.name : ''}</p>
      //       </div>
      //     </div>
      //     <div className="flex flex-col gap-1 text-right text-xs sm:text-sm">
      //       <div className="ml-auto">
      //         <p>{asset && asset.balance ? formatCurrency(asset.balance) : '0.00'}</p>
      //         <p className="text-sm text-blue-gray-400">Balance</p>
      //       </div>
      //     </div>
      //   </div>
      // </li>
      <li
        className="flex w-full flex-row items-center justify-between gap-2 hover:bg-bg-light pl-3 pr-3 py-2 first:pt-1 text-sm"
        key={asset.address + '_' + idx}
        onClick={() => {
          onLocalSelect(type, asset)
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
          <div className="relative flex w-[62px] max-w-[62px] min-w-[62px] h-9">
            <img
              className="absolute left-0 top-0 aspect-square rounded-full"
              src={asset?.token0?.logoURI ?? ''}
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
              src={asset?.token1?.logoURI ?? ''}
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
              src={asset?.token0?.logoURI ?? '/tokens/unknown-logo.png'}
              width={34}
              height={34}
              alt=""
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/tokens/unknown-logo.png'
              }}
            /> */}
            {/* <Image
              className="absolute left-[26px] top-0 z-10 aspect-square rounded-full"
              src={asset?.token1?.logoURI ?? '/tokens/unknown-logo.png'}
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
            <div className="text-white text-sm font-semibold">
              {asset.token0.symbol}/{asset.token1.symbol}
              {/* {(asset?.symbol ?? '').replace(/^(VolatileV1 AMM - |StableV1 AMM - )/, '')} */}
            </div>
            <div className="flex text-text-gray text-[10px] leading-[13px] font-normal">
              {asset?.isStable ? 'Stable Pool' : 'Volatile Pool'}
              <span className="flex items-center">
                <a
                  data-tooltip-id={`bribe-gauge-select-tooltip-${asset.address + '_' + idx}`}
                  data-tooltip-place="top-start"
                >
                  <InformationCircleIcon className="self-center shrink-0 mx-1 h-[12px] w-[12px] text-text-gray" />
                </a>
              </span>
              <Tooltip
                id={`bribe-gauge-select-tooltip-${asset.address + '_' + idx}`}
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
                    <a href={`${ETHERSCAN_URL}/address/${asset.address}`} target="_blank" rel="noopener noreferrer">
                      <div className="flex flex-col p-2 bg-table-dark border border-border hover:bg-bg-highlight hover:border-pink-primary rounded-md cursor-pointer">
                        <div className="text-sm">Pool Address</div>
                        <div className="flex flex-row items-center text-text-gray mt-1">
                          <div className="text-xs ">{formatAddress(asset.address)}</div>
                          <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </a>
                  )}
                  {asset?.gauge_address && (
                    <a
                      href={`${ETHERSCAN_URL}/address/${asset.gauge_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex flex-col p-2 bg-table-dark border border-border hover:bg-bg-highlight hover:border-pink-primary rounded-md cursor-pointer">
                        <div className="text-sm">Gauge Address</div>
                        <div className="flex flex-row items-center text-text-gray mt-1">
                          <div className="text-xs ">{formatAddress(asset.gauge_address)}</div>
                          <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </a>
                  )}
                  {asset && (
                    <div className="flex flex-col p-2 bg-table-dark border border-border  rounded-md">
                      <div className="text-sm">Pool Trading Fee</div>
                      <div className="flex flex-row items-center text-text-gray mt-1">
                        <div className="text-xs ">
                          {asset?.isStable
                            ? `${CONTRACTS.STABLE_FEE_BPS / 100}%`
                            : `${CONTRACTS.VOLATILE_FEE_BPS / 100}%`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end normal-case font-normal ">
          <div className="">
            <div className="flex flex-row gap-1 justify-end">
              <div className="text-white text-sm font-semibold">{formatCurrency(asset?.gauge?.apr ?? 0)}%</div>
            </div>
          </div>
          <div className="">
            <div className="flex flex-row gap-1 justify-end">
              <div className="text-white text-sm font-semibold">{formatCurrency(asset?.gauge?.weight ?? 0)}</div>
            </div>
          </div>
        </div>
      </li>
    )
  }

  // const renderTopAssets = () => {
  //   return (
  //     <>
  //       {topAssets.map((asset) => (
  //         <button
  //           key={asset.symbol}
  //           className="relative col-span-2 inline-flex items-center space-x-1 rounded-md border border-gray-700/70 bg-white/20 px-2 py-1 transition-colors hover:bg-white/5 focus:outline-none focus:ring-1 focus:ring-gray-700"
  //           onClick={() => {
  //             onLocalSelect(type, asset)
  //           }}
  //         >
  //           <span className="relative h-4 w-4 items-center">
  //             <img alt={asset.symbol} className="rounded-full" src={asset.logoURI} />
  //           </span>
  //           <span className="text-sm">{asset.symbol}</span>
  //         </button>
  //       ))}
  //     </>
  //   )
  // }

  // すべての代替資産のリスト
  const renderOptions = () => {
    return (
      <ul className="flex flex-col space-y-1 items-center">
        {filteredAssetOptions
          ? filteredAssetOptions
              .sort((a, b) => {
                if (a.tvl === undefined && b.tvl === undefined) return 0
                if (a.tvl === undefined) return 1
                if (b.tvl === undefined) return -1
                if (BigNumber(a.tvl).lt(b.tvl)) return 1
                if (BigNumber(a.tvl).gt(b.tvl)) return -1
                return 0
              })
              .map((asset, idx) => {
                return renderAssetOption(type, asset, idx)
              })
          : []}
      </ul>
    )
  }

  // // すべての代替資産のリスト
  // const renderManageLocal = () => {
  //   return (
  //     <ul className="flex w-full min-w-[350px] max-w-full list-inside flex-col gap-2 sm:min-w-[450px]">
  //       {filteredAssetOptions
  //         ? filteredAssetOptions
  //             .filter((option) => {
  //               return option.local === true
  //             })
  //             .map((asset, idx) => {
  //               return renderManageOption(type, asset, idx)
  //             })
  //         : []}
  //     </ul>
  //   )
  // }

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
                  <div className="text-xl font-semibold flex flex-row items-center">Select a Pair</div>
                </div>

                <div className="rounded-[10px] border border-border px-3 text-white flex flex-row items-center focus-within:border-pink-primary focus-within:bg-table-dark hover:border-pink-primary transition-colors duration-300">
                  <MagnifyingGlassIcon
                    className="w-4 h-4 fill-white flex-shrink-0"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    className="px-2 w-full h-12 bg-transparent border-0 text-white text-sm font-normal focus:ring-0 focus:outline-none placeholder:text-text-unselected"
                    placeholder="ETH, TAIKO, KODO, 0x..."
                    autoComplete="off"
                    value={search}
                    onChange={onSearchChanged}
                  />
                </div>
                <div>
                  <div className="text-text-gray mb-2 flex flex-row justify-between text-sm pl-3 pr-3">
                    <span>Pair</span>
                    <span>Voting Apr / Votes</span>
                  </div>
                  <div className="overflow-x-hidden overflow-y-scroll h-[280px] rounded-[10px] bg-black py-1">
                    <div className="h-full w-full rounded-[inherit]">{renderOptions()}</div>
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
      {/* <button
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
        <div className="text-sm font-medium leading-6 ml-[6px] mr-1">{value ? `${value.symbol}` : ''}</div>
        <ChevronDownIcon className="ml-1 h-4 w-4" />
      </button> */}
      <button
        className="flex flex-none flex-row items-center w-full"
        onClick={() => {
          openSearch()
        }}
      >
        <div className="flex flex-row w-full justify-between items-center border border-border rounded-[10px] px-4 min-h-[50px] bg-table-dark">
          {value ? (
            <div className="flex w-full flex-row items-center gap-2">
              <div className="flex flex-row items-center gap-2 text-xs">
                <div className="relative flex w-[62px] max-w-[62px] min-w-[62px] h-[30px]">
                  <img
                    className="absolute left-0 top-0 aspect-square rounded-full"
                    src={value?.token0?.logoURI ?? ''}
                    width="30"
                    height="30"
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/tokens/unknown-logo.png'
                    }}
                  />
                  <img
                    className="absolute left-[24px] top-0 z-10 aspect-square rounded-full"
                    src={value?.token1?.logoURI ?? ''}
                    width="30"
                    height="30"
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/tokens/unknown-logo.png'
                    }}
                  />
                  {/* <Image
                    className="absolute left-0 top-0 aspect-square rounded-full"
                    src={value?.token0?.logoURI ?? '/tokens/unknown-logo.png'}
                    width={34}
                    height={34}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/tokens/unknown-logo.png'
                    }}
                  /> */}
                  {/* <Image
                    className="absolute left-[26px] top-0 z-10 aspect-square rounded-full"
                    src={value?.token1?.logoURI ?? '/tokens/unknown-logo.png'}
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
                  <div className="text-white text-sm leading-[18px] font-medium">
                    {value.token0.symbol}/{value.token1.symbol}
                  </div>
                  <div className="text-text-gray text-[10px] leading-[13px] font-normal">
                    {value.isStable ? 'Stable Pool' : 'Volatile Pool'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-text-unselected">Select Pair...</span>
          )}

          <ChevronDownIcon className="h-5 w-5 text-white" />
        </div>
      </button>
      {renderDialog()}
    </>
  )
}
