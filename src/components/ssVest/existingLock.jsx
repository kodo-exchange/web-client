import { useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import BigNumber from 'bignumber.js'

import { ArrowLongRightIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { LockClosedIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'
import { formatCurrency } from '../../utils'

import LockAmount from './lockAmount'
import LockDuration from './lockDuration'
import VestingInfo from './vestingInfo'
import Merge from './merge'
import Transfer from './transfer'
import Utils from './utils'

const isExpired = (nft) => {
  return BigNumber(nft.lockEnds).lt(moment().unix())
}

export default function ExistingLock({ nft, govToken, veToken, vestNFTs }) {
  const [futureNFT, setFutureNFT] = useState(null)
  const isNftExpired = isExpired(nft)
  const [tabIndex, setTabIndex] = useState(isNftExpired ? 3 : 0)

  // const [amount, setAmount] = useState('')
  // const [amountError, setAmountError] = useState(false)

  const router = useRouter()

  const onBack = () => {
    router.push('/lock')
  }

  // const setAmountPercent = (percent) => {
  //   setAmount(BigNumber(govToken.balance).times(percent).div(100).toFixed(govToken.decimals))
  // }

  // const onAmountChanged = (event) => {
  //   setAmountError(false)
  //   setAmount(event.target.value)
  // }

  const updateLockAmount = (amount) => {
    if (amount === '') {
      let tmpNFT = {
        lockAmount: nft.lockAmount,
        lockValue: nft.lockValue,
        lockEnds: nft.lockEnds,
      }

      setFutureNFT(tmpNFT)
      return
    }

    let tmpNFT = {
      lockAmount: nft.lockAmount,
      lockValue: nft.lockValue,
      lockEnds: nft.lockEnds,
    }

    const now = moment()
    const expiry = moment.unix(tmpNFT.lockEnds)
    const dayToExpire = expiry.diff(now, 'days')

    tmpNFT.lockAmount = BigNumber(nft.lockAmount).plus(amount).toFixed(18)
    tmpNFT.lockValue = BigNumber(tmpNFT.lockAmount)
      .times(parseInt(dayToExpire) + 1)
      .div(1460)
      .toFixed(18)

    setFutureNFT(tmpNFT)
  }

  const updateLockDuration = (val) => {
    let tmpNFT = {
      lockAmount: nft.lockAmount,
      lockValue: nft.lockValue,
      lockEnds: nft.lockEnds,
    }

    // const now = moment()
    // const expiry = moment(val)
    // const dayToExpire = expiry.diff(now, 'days')
    const secondsToExpire = val
    const expiry = moment().add(secondsToExpire, 'seconds')

    tmpNFT.lockEnds = expiry.unix()
    tmpNFT.lockValue = BigNumber(tmpNFT.lockAmount)
      .times(secondsToExpire)
      .dividedBy(3600 * 24 * 365 * 4)
      .toFixed(18)

    setFutureNFT(tmpNFT)
  }

  return (
    <>
      <div className="relative w-full flex flex-col items-center justify-center">
        <div className=" inline-block text-white pb-2 md:pb-3 lg:pb-4 text-2xl xs:text-4xl sm:text-5xl lg:text-5xl font-bold tracking-normal">
          {`Manage NFT #${nft.id}`}
        </div>
        <div className="font-sans text-base leading-6 text-text-gray">
          Add more KODO, Extend, Merge or Transfer your NFT
        </div>
        <div className="absolute top-0 left-0 sm:pt-2">
          <button
            className="inline-flex items-center justify-center text-white rounded-md border border-white border-opacity-10 bg-white bg-opacity-8 hover:bg-white/20 transition-colors h-9 w-9 "
            onClick={onBack}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center pb-8 pt-6 md:py-8 w-full items-top">
        <div className="max-w-[540px] md:min-w-[540px] flex-grow w-full">
          <Tab.Group selectedIndex={tabIndex}>
            <Tab.List className="w-full items-center justify-center rounded-[10px] bg-bg-light p-1 border border-border text-text-gray grid grid-cols-4">
              {['Manage', 'Merge', 'Transfer', 'Utils'].map((tab, index) => (
                <Tab
                  key={tab}
                  onClick={() => setTabIndex(index)}
                  className={({ selected }) =>
                    ` inline-flex items-center justify-center whitespace-nowrap px-3 py-2.5 text-sm font-medium  transition-all ${
                      selected ? 'bg-pink-primary text-white rounded-md' : ''
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="w-full mt-5">
              <Tab.Panel className="rounded-[20px] border border-border bg-gradient-primary text-white shadow-sm space-y-4">
                <div className="p-6 pt-0 mt-8 ">
                  <LockAmount nft={nft} govToken={govToken} veToken={veToken} updateLockAmount={updateLockAmount} />
                  {/* <div
                    data-orientation="horizontal"
                    role="none"
                    className="shrink-0 bg-gray-700/50 h-[1px] w-full mb-8"
                  ></div> */}
                  <LockDuration
                    nft={nft}
                    govToken={govToken}
                    veToken={veToken}
                    updateLockDuration={updateLockDuration}
                  />

                  <VestingInfo currentNFT={nft} futureNFT={futureNFT} veToken={veToken} showVestingStructure={false} />
                </div>
              </Tab.Panel>
              <Tab.Panel className="rounded-lg border border-border bg-gradient-primary text-white shadow-sm space-y-4">
                <Merge nft={nft} vestNFTs={vestNFTs} />
              </Tab.Panel>
              <Tab.Panel className="rounded-lg border border-border bg-gradient-primary text-white shadow-sm space-y-4">
                <Transfer nft={nft} />
              </Tab.Panel>
              <Tab.Panel className="rounded-lg border border-border bg-gradient-primary text-white shadow-sm space-y-4">
                <Utils nft={nft} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className=" flex flex-col mt-6 gap-4 max-w-[540px] md:min-w-[540px] flex-grow w-full">
          {isNftExpired && (
            <div className="flex flex-row gap-3 rounded-[20px] border border-border bg-gradient-primary text-sm text-text-gray p-6">
              <div>
                <ExclamationTriangleIcon className="h-6 w-6 text-current" />
              </div>
              <div className="whitespace-break-spaces">
                <strong>Important!</strong> NFT #{nft.id} has expired. Please withdraw the KODO before proceeding with
                any other operations.
              </div>
            </div>
          )}

          {tabIndex === 1 && (
            <div className="flex flex-row gap-3 max-w-[540px] rounded-[20px] border border-border bg-gradient-primary text-sm text-text-gray p-6">
              <div>
                <ExclamationTriangleIcon className="h-6 w-6 text-current" />
              </div>
              <div className="whitespace-break-spaces">
                <strong>Important!</strong> Merging will reset any rewards and rebases! Before continuing, please make
                sure you have{' '}
                <a className="underline" href="/rewards">
                  claimed all available rewards
                </a>
                .
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
