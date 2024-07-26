import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

import { formatCurrency } from '../../utils'
import BigNumber from 'bignumber.js'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid'
import { GOV_TOKEN_ADDRESS, GOV_TOKEN_SYMBOL, WETH_ADDRESS, WETH_SYMBOL } from '../../stores/constants/contracts'
import Image from 'next/image'

export default function VestNFT({ nft, govToken, baseAssets }) {
  const router = useRouter()
  const [maxLoading, setMaxLoading] = useState(false)

  //   const [resetLoading, setResetLoading] = useState(false)
  //   const [pokeLoading, setPokeLoading] = useState(false)
  //   const [withdrawLoading, setWithdrawLoading] = useState(false)

  useEffect(() => {
    const maxReturned = () => {
      setMaxLoading(false)
    }

    const errorReturned = () => {
      setMaxLoading(false)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.MAX_VEST_DURATION_RETURNED, maxReturned)

    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.MAX_VEST_DURATION_RETURNED, maxReturned)
    }
  }, [])

  const onMax = () => {
    setMaxLoading(true)

    stores.dispatcher.dispatch({
      type: ACTIONS.MAX_VEST_DURATION,
      content: { nftId: nft.id, unlockTime: 365 * 4 * 24 * 60 * 60 },
    })
  }

  const onView = (nft) => {
    router.push(`/lock/${nft.id}`)
  }

  const govTokenAsset = baseAssets.find(
    (asset) => asset.address === GOV_TOKEN_ADDRESS.toLowerCase() && asset.symbol === GOV_TOKEN_SYMBOL
  )
  const ethTokenAsset = baseAssets.find(
    (asset) => asset.address === WETH_ADDRESS.toLowerCase() && asset.symbol === WETH_SYMBOL
  )

  const calculateInfluence = (row) => {
    if (!BigNumber(row.totalSupply).eq(0) && !isNaN(row.totalSupply) && !isNaN(row.lockValue)) {
      return formatCurrency(BigNumber(row.lockValue).dividedBy(row.totalSupply).times(100), 4)
    } else {
      return 'N/A'
    }
  }

  const calculatePowerProgressBar = (row) => {
    if (row.lockAmount !== 0 && !isNaN(row.lockValue) && !isNaN(row.lockAmount)) {
      return formatCurrency(BigNumber(row.lockValue).dividedBy(row.lockAmount).times(100).minus(100), 4)
    } else {
      return '0'
    }
  }

  const calculatePowerPercentage = (row) => {
    if (row.lockAmount !== 0 && !isNaN(row.lockValue) && !isNaN(row.lockAmount)) {
      return formatCurrency(BigNumber(row.lockValue).dividedBy(row.lockAmount).times(100), 2)
    } else {
      return 'N/A'
    }
  }

  const calculateGovTokenValue = (row) => {
    // console.log('row', row)
    // console.log('govTokenAsset', govTokenAsset)
    // console.log('baseAssets', baseAssets)
    if (govTokenAsset && !isNaN(row.lockAmount)) {
      return formatCurrency(BigNumber(row.lockAmount).times(govTokenAsset.price))
    } else {
      return 'N/A'
    }
  }

  const calculateEthTokenValue = (row) => {
    // console.log('-row', row)
    // console.log('-govTokenAsset', govTokenAsset)
    // console.log('-ethTokenAsset', ethTokenAsset)
    if (
      govTokenAsset &&
      ethTokenAsset &&
      !isNaN(row.lockAmount) &&
      !isNaN(govTokenAsset.price) &&
      !isNaN(ethTokenAsset.price)
    ) {
      return formatCurrency(BigNumber(row.lockAmount).times(govTokenAsset.price).dividedBy(ethTokenAsset.price), 4)
    } else {
      return 'N/A'
    }
  }

  const isMaxLocked = (nft) => {
    const fourYearsLater = moment()
      .add(3600 * 24 * 365 * 4, 'seconds')
      .unix()
    const weeks = Math.floor(fourYearsLater / (3600 * 24 * 7))
    const result = weeks * 3600 * 24 * 7

    return result <= nft.lockEnds
  }

  const isExpired = (nft) => {
    return BigNumber(nft.lockEnds).lt(moment().unix())
  }

  const isNftMaxLocked = isMaxLocked(nft)
  const isNftExpired = isExpired(nft)

  return (
    <>
      <div key={nft.id} className="flex flex-row items-center min-w-[300px] w-full h-full">
        <div className="rounded-[20px] h-full w-full bg-gradient-primary p-6 border border-border flex flex-col">
          <div className="flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-row gap-2">
              <img
                className="min-w-[30px] min-h-[30px] rounded-full"
                src="/img/kodo-pink-bg.svg"
                width="30"
                height="30"
                alt=""
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/tokens/unknown-logo.png'
                }}
              />
              {/* <Image
              src={govToken?.logoURI ? `${govToken?.logoURI}` : '/tokens/unknown-logo.png'}
              alt=""
              width={48}
              height={48}
              className="min-w-[48px] min-h-[48px]"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/tokens/unknown-logo.png'
              }}
            /> */}
              <div className="text-xl font-semibold">veKODO</div>
            </div>

            <div className="text-pink-primary font-semibold">
              <span className="text-xl">#</span>
              <span className="text-[32px]">{nft.id}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 text-xs gap-[6px] bg-table-dark border border-border p-4 rounded-[10px] mt-4">
            <div className="col-span-1 text-text-gray">Balance:</div>
            <div className="col-span-2 inline-flex gap-1 justify-end items-center">
              <div className="text-white">{formatCurrency(nft.lockAmount, 4)}</div>
              <div className="">KODO</div>
            </div>
            <div className="col-span-1 text-text-gray">Votes:</div>
            <div className="col-span-2 inline-flex gap-1 justify-end items-center">
              <div className="text-white">{formatCurrency(nft.lockValue, 4)}</div>
              <div className="">veKODO</div>
            </div>
            <div className="col-span-1 text-text-gray">Influence:</div>
            <div className="col-span-2 inline-flex justify-end items-center">
              <div className="text-white">{calculateInfluence(nft)}%</div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-text-gray text-sm">Power</div>
            <div className="text-pink-primary text-xs">{calculatePowerPercentage(nft)}%</div>
          </div>
          <div className="flex flex-row gap-2 items-center mt-3">
            <div className="relative bg-bg-light border border-border rounded-[13px] flex-grow">
              <div className="relative h-2 w-full overflow-hidden rounded-[13px]">
                <div
                  className="h-full w-full flex-1 bg-pink-primary transition-all rounded-[13px]"
                  // style={{ transform: 'translateX(-25.3139%)' }}
                  style={{ transform: `translateX(${calculatePowerProgressBar(nft)}%)` }}
                ></div>
              </div>
              {/* <div className="absolute inset-0 text-white text-xs rounded-xl px-2 text-center">
                {calculatePowerPercentage(nft)}%
              </div> */}
            </div>
          </div>
          <div className="flex flex-col text-sm gap-[6px] bg-table-dark border border-border p-4 rounded-xl mt-4">
            <div className="text-text-gray text-xs">Locked KODO Value ≈</div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-[6px]">
                <img
                  className="w-[14px] h-[14px] rounded-full"
                  src="/tokens/usdc.png"
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/tokens/unknown-logo.png'
                  }}
                />
                <div className="text-text-gray text-xs">USD</div>
              </div>
              <div className="text-white text-xs">{`$${calculateGovTokenValue(nft)}`}</div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-[6px]">
                <img
                  className="w-[14px] h-[14px] rounded-full"
                  src="/tokens/eth.svg"
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/tokens/unknown-logo.png'
                  }}
                />
                <div className="text-text-gray text-xs">ETH</div>
              </div>
              <div className="text-white text-xs">{`Ξ${calculateEthTokenValue(nft)}`}</div>
            </div>
          </div>
          <div className="flex flex-row justify-between gap-4 mt-[9px]">
            <div className="text-text-gray text-[10px] text-center">
              {isNftExpired ? 'Expired' : 'Expires'}
              {` ${moment.unix(nft.lockEnds).fromNow()} on ${moment.unix(nft.lockEnds).format('YYYY-MM-DD')}`}
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
              title="Click to max lock this NFT"
              disabled={maxLoading || isNftMaxLocked || isNftExpired}
              onClick={onMax}
            >
              {isNftExpired ? 'Expired' : isNftMaxLocked ? 'Max Locked' : maxLoading ? 'Maximizing' : 'Max Lock'}
            </button>
            <button
              className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none border border-border hover:bg-pink-primary hover:border-pink-primary h-10 py-2 px-4 rounded-[10px]"
              onClick={() => {
                onView(nft)
              }}
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
