import { useState, useEffect, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'

import { formatCurrency } from '../../utils'

import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Switch } from '@headlessui/react'

import PageHeader from './ssPageHeader'
import FilterInputs from './ssFilterInputs'
import NftSelect from './ssNftSelect'
import VotesTable from './ssVotesTable'

export default function Votes() {
  const router = useRouter()

  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  const [gauges, setGauges] = useState([])
  const [voteLoading, setVoteLoading] = useState(false)
  const [votes, setVotes] = useState([])
  const [veToken, setVeToken] = useState(null)
  const [token, setToken] = useState(null)
  const [vestNFTs, setVestNFTs] = useState([])
  const [search, setSearch] = useState('')
  const [expectedIncome, setExpectedIncome] = useState(0)
  const [votedOnly, setVotedOnly] = useState(false)
  const [minBribe, setMinBribe] = useState('0')
  const [maxBribe, setMaxBribe] = useState('0')
  const [minTvl, setMinTvl] = useState('0')
  const [minIncomePerVote, setMinIncomePerVote] = useState('0.00')

  const ssUpdated = () => {
    // console.log('ssUpdated')
    setVeToken(stores.stableSwapStore.getStore('veToken'))
    const as = stores.stableSwapStore.getStore('pairs')

    const filteredAssets = as.filter((asset) => {
      return asset.gauge && asset.gauge.address
    })
    setGauges(filteredAssets)

    const nfts = stores.stableSwapStore.getStore('vestNFTs')
    setVestNFTs(nfts)

    let newToken = token
    if (nfts && nfts.length > 0) {
      if (newToken === null && router.query.id) {
        const nftId = router.query.id
        const nft = nfts.find((nft) => nft.id === nftId)
        if (nft) {
          newToken = nft
        } else {
          newToken = nfts[0]
        }
      } else {
        newToken = nfts[0]
      }
    }

    setToken(newToken)

    if (newToken && filteredAssets && filteredAssets.length > 0) {
      stores.dispatcher.dispatch({ type: ACTIONS.GET_VEST_VOTES, content: { tokenID: newToken.id } })
      // stores.dispatcher.dispatch({ type: ACTIONS.GET_VEST_BALANCES, content: { tokenID: nfts[0].id } })
    }

    forceUpdate()
  }

  useEffect(() => {
    const vestVotesReturned = (vals) => {
      setVotes(
        vals.map((asset) => {
          return {
            address: asset?.address,
            value: BigNumber(asset && asset.votePercent ? asset.votePercent : 0).toNumber(0),
          }
        })
      )
      forceUpdate()
    }

    // const vestBalancesReturned = (vals) => {
    //   setGauges(vals)
    //   forceUpdate()
    // }

    const stableSwapUpdated = () => {
      ssUpdated()
    }

    const voteReturned = () => {
      setVoteLoading(false)
    }

    ssUpdated()

    // stores.dispatcher.dispatch({ type: ACTIONS.GET_VEST_NFTS, content: {} })

    stores.emitter.on(ACTIONS.UPDATED, stableSwapUpdated)
    stores.emitter.on(ACTIONS.VOTE_RETURNED, voteReturned)
    stores.emitter.on(ACTIONS.ERROR, voteReturned)
    stores.emitter.on(ACTIONS.VEST_VOTES_RETURNED, vestVotesReturned)
    // stores.emitter.on(ACTIONS.VEST_NFTS_RETURNED, vestNFTsReturned)
    // stores.emitter.on(ACTIONS.VEST_BALANCES_RETURNED, vestBalancesReturned)

    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, stableSwapUpdated)
      stores.emitter.removeListener(ACTIONS.VOTE_RETURNED, voteReturned)
      stores.emitter.removeListener(ACTIONS.ERROR, voteReturned)
      stores.emitter.removeListener(ACTIONS.VEST_VOTES_RETURNED, vestVotesReturned)
      // stores.emitter.removeListener(ACTIONS.VEST_NFTS_RETURNED, vestNFTsReturned)
      // stores.emitter.removeListener(ACTIONS.VEST_BALANCES_RETURNED, vestBalancesReturned)
    }
  }, [])

  useEffect(() => {
    const nonZeroVotes = votes.filter((vote) => !BigNumber(vote.value).isEqualTo(0))
    const income = nonZeroVotes.reduce((sum, vote) => {
      const row = gauges.find((gauge) => gauge.address === vote.address)
      if (row?.gauge?.tbv) {
        // const bribeValue = BigNumber(row?.gauge?.bribeValue)
        // const sliderValue = BigNumber(vote.value)
        const income = !BigNumber(row.gauge.weight).isEqualTo(0)
          ? BigNumber(row.gauge.tbv).dividedBy(row.gauge.weight).times(vote.value).div(100).times(token?.lockValue)
          : BigNumber(row.gauge.tbv)
        return sum.plus(income)
      }

      return sum
    }, BigNumber(0))

    setExpectedIncome(income)
  }, [votes, gauges, token])

  const onVote = () => {
    setVoteLoading(true)
    stores.dispatcher.dispatch({ type: ACTIONS.VOTE, content: { votes, tokenID: token.id } })
  }

  let totalVotes = votes.reduce((acc, curr) => {
    return BigNumber(acc)
      .plus(BigNumber(curr.value).lt(0) ? curr.value * -1 : curr.value)
      .toNumber()
  }, 0)

  const totalVotesIsGt100 = BigNumber(totalVotes).gt(100)

  const handleChange = (value) => {
    setToken(value)
    stores.dispatcher.dispatch({ type: ACTIONS.GET_VEST_VOTES, content: { tokenID: value.id } })
  }

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
  }

  const onBribe = () => {
    router.push('/bribe/create')
  }

  let displayedGauges = gauges

  if (votedOnly) {
    const votedGauges = gauges.filter((gauge) => {
      return votes.some((vote) => vote.value !== 0 && vote.address === gauge.address)
    })

    displayedGauges = votedGauges
  }

  return (
    <div>
      <PageHeader />
      <div className="flex flex-wrap sm:flex-row mb-4 gap-4 items-center ">
        <div className="flex-grow">
          <form className="formRoot">
            <div className="flex flex-row items-center rounded-xl border border-border bg-bg-light px-4 focus-within:border-pink-primary focus-within:bg-table-dark transition-colors duration-300">
              <MagnifyingGlassIcon
                className="w-4 h-4 fill-white flex-shrink-0"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              />
              <input
                className="w-full min-h-12 border-0 bg-transparent px-2 text-sm leading-5 focus:ring-0 focus:outline-none placeholder:text-text-unselected"
                type="text"
                placeholder="Search name or paste address"
                title=""
                name="search"
                value={search}
                onChange={onSearchChanged}
              />
            </div>
          </form>
        </div>
        <Switch.Group>
          <div className="flex items-center gap-2">
            <Switch
              // checked={switchStakedOnlyEnabled}
              // onChange={setSwitchStakeOnlyEnabled}
              // onChange={(checked) => {
              //   const event = { target: { name: 'switchStakedOnlyEnabled', checked } }
              //   onToggle(event)
              // }}
              checked={votedOnly}
              onChange={(checked) => {
                setVotedOnly(checked)
              }}
              className={`${
                votedOnly ? 'bg-pink-primary' : 'bg-bg-light'
              } w-12 h-8 relative rounded-xl border border-border`}
              // className={`bg-blue-500 w-12 h-8 relative rounded-xl border border-gray-700/70`}
            >
              <span className="sr-only">Voted Only</span>
              <span
                aria-hidden="true"
                className={`${
                  votedOnly ? 'translate-x-[23px] bg-white' : 'translate-x-1 bg-text-gray'
                } block w-5 h-5 rounded-full shadow transition-transform duration-100 ease-linear`}
                // className={`translate-x-[23px] block w-5 h-5 bg-white rounded-full shadow transition-transform duration-100 ease-linear`}
              />
            </Switch>
            <Switch.Label className="text-[16px] leading-[21px] font-medium">Voted Only</Switch.Label>
          </div>
        </Switch.Group>

        <div className="flex flex-row gap-2 items-center">
          <div
            className={`rounded-xl py-2 px-4 text-base  ${
              totalVotesIsGt100
                ? 'bg-red-500/85 border border-red-500/85 text-white'
                : 'bg-bg-highlight border border-pink-primary text-pink-primary'
            }`}
          >
            ${formatCurrency(expectedIncome, 2)}
          </div>
          <div className="text-sm text-text-gray">Estimated Income</div>
        </div>
        <NftSelect token={token} setToken={handleChange} vestNFTs={vestNFTs} />
      </div>
      <FilterInputs
        minBribe={minBribe}
        setMinBribe={setMinBribe}
        maxBribe={maxBribe}
        setMaxBribe={setMaxBribe}
        minTvl={minTvl}
        setMinTvl={setMinTvl}
        minIncomePerVote={minIncomePerVote}
        setMinIncomePerVote={setMinIncomePerVote}
      />
      <VotesTable
        gauges={displayedGauges.filter((pair) => {
          if (minBribe && BigNumber(minBribe).gt(0)) {
            if (pair.gauge.bribeValue && BigNumber(pair.gauge.bribeValue).lt(minBribe)) {
              return false
            }
          }

          if (maxBribe && BigNumber(maxBribe).gt(0)) {
            if (pair.gauge.bribeValue && BigNumber(pair.gauge.bribeValue).gt(maxBribe)) {
              return false
            }
          }

          if (minTvl && BigNumber(minTvl).gt(0)) {
            if (pair.gauge.tvl && BigNumber(pair.gauge.tvl).lt(minTvl)) {
              return false
            }
          }

          if (minIncomePerVote && BigNumber(minIncomePerVote).gt(0)) {
            if (pair.gauge.valuePerVote && BigNumber(pair.gauge.valuePerVote).lt(minIncomePerVote)) {
              return false
            }
          }

          if (!search || search === '') {
            return true
          }

          const searchLower = search.toLowerCase()

          if (
            pair.symbol.toLowerCase().includes(searchLower) ||
            pair.address.toLowerCase().includes(searchLower) ||
            pair.token0.symbol.toLowerCase().includes(searchLower) ||
            pair.token0.address.toLowerCase().includes(searchLower) ||
            pair.token0.name.toLowerCase().includes(searchLower) ||
            pair.token1.symbol.toLowerCase().includes(searchLower) ||
            pair.token1.address.toLowerCase().includes(searchLower) ||
            pair.token1.name.toLowerCase().includes(searchLower)
          ) {
            return true
          }

          return false
        })}
        setParentSliderValues={setVotes}
        defaultVotes={votes}
        veToken={veToken}
        token={token}
      />

      <div className="flex flex-col md:flex-row justify-between border border-border bg-bg-table rounded-[20px] mt-8 px-7">
        <div className="max-w-4xl text-text-gray text-sm py-7">
          After creating a veKODO NFT by{' '}
          <a href="/lock">
            <span className="font-black cursor-pointer">Vesting</span>
          </a>{' '}
          your KODO, you can Vote every week on pools to govern their Liquidity incentives. Voters{' '}
          <a href="/rewards">
            <span className="font-black cursor-pointer">Earn</span>
          </a>{' '}
          a share of the Trading Fees generated from the Pool they voted for along with any additional Bribes at the end
          of the ongoing voting Epoch. Each veKODO NFT can vote only once every epoch from Thursday mornings till
          Wednesday nights. The veKODO NFT represents your Votes, which decay linearly if not re-vested weekly.
        </div>
        <img className="hidden md:block h-auto" src="/img/kodo-with-wave.svg" />
      </div>

      <div
        // elevation="10"
        // className="min-w-[50px] fixed bottom-8 left-1/2 -translate-x-1/2 z-20 rounded-3xl border-0 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-400"
        // className={`lg:min-w-[50px] lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 z-20 lg:rounded-[20px] border-0 lg:py-1 py-3 min-w-full fixed bottom-0 left-0 transform translate-x-0 rounded-none ${
        //   totalVotesIsGt100 ? 'bg-red-600' : 'bg-gradient-primary'
        // }`}
        className={`lg:max-w-[1340px] w-full h-auto lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 transform bottom-4 left-0 translate-x-0 z-20 fixed  `}
      >
        <div
          className={`w-full h-20 flex flex-row justify-between items-center rounded-[20px]  border  px-6 sm:px-[50px] ${
            totalVotesIsGt100 ? 'bg-gradient-primary border-red-500' : 'bg-gradient-primary border-border'
          }`}
        >
          <div
            className={`text-sm sm:text-xl font-semibold  ${totalVotesIsGt100 ? 'text-red-500' : 'text-white'}`}
          >{`Voting Power Used: ${totalVotes}%`}</div>
          <button
            className={`bg-pink-primary hover:bg-pink-primary/85 text-sm sm:text-base whitespace-nowrap font-bold text-white px-4 sm:px-16 py-[11px] rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed ${
              totalVotesIsGt100 ? 'disabled:bg-red-500' : ''
            }`}
            disabled={voteLoading || BigNumber(totalVotes).eq(0) || totalVotesIsGt100}
            onClick={onVote}
          >
            {voteLoading ? `Casting Votes` : `Cast Votes`}
          </button>
        </div>
      </div>
    </div>
  )
}
