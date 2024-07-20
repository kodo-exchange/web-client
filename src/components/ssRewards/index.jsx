import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import RewardsTable from './ssRewardsTable'
// import RewardsTableNFT from './ssRewardsTableNft'
import RewardsTableForVe from './ssRewardsTableForVe'

// import RewardsTableTest from './ssRewardsTableTest'
import { formatCurrency } from '../../utils'

import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'
import { ArrowPathIcon } from '@heroicons/react/24/solid'

export default function Rewards() {
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  // const [rewards, setRewards] = useState([])
  const [addressWiseRewards, setAddressWiseRewards] = useState([])
  const [nftWiseRewards, setNftWiseRewards] = useState([])
  const [vestNFTs, setVestNFTs] = useState([])
  const [search, setSearch] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [token, setToken] = useState(null)
  const [veToken, setVeToken] = useState(null)
  const [loading, setLoading] = useState(false)
  // const [votesMap, setVotesMap] = useState({})

  // このコードは、トークンと veToken を設定し、GET_REWARD_BALANCES イベントを発行し、ページを更新するために使用されます
  // ここで報酬のクエリを開始します - ただし、nft.id は必要ありません
  //  - address wise
  //  - tokenid wise
  const stableSwapUpdated = (rew) => {
    const nfts = stores.stableSwapStore.getStore('vestNFTs')
    setVestNFTs(nfts)
    setVeToken(stores.stableSwapStore.getStore('veToken'))

    window.setTimeout(() => {
      stores.dispatcher.dispatch({ type: ACTIONS.GET_REWARD_BALANCES_ALL, content: {} })
      // stores.dispatcher.dispatch({ type: ACTIONS.GET_VEST_VOTES_ALL, content: { nfts } })
    })

    forceUpdate()
  }

  // このコードはコンポーネント内の報酬ステータスを設定するために使用されます
  const rewardBalancesReturned = (rew) => {
    if (rew) {
      // address wise
      if (rew && rew.fees && rew.rewards && rew.fees.length >= 0 && rew.rewards.length >= 0) {
        setAddressWiseRewards([...rew.fees, ...rew.rewards])
      }
      // nft wise
      if (rew && rew.nftRewards && rew.nftRewards.length >= 0) {
        setNftWiseRewards([...rew.nftRewards])
      }
    } else {
      let re = stores.stableSwapStore.getStore('rewardsAll')
      // address wise
      if (re && re.fees && re.rewards && re.fees.length >= 0 && re.rewards.length >= 0) {
        setAddressWiseRewards([...re.fees, ...re.rewards])
      }
      // nft wise
      if (re && re.nftRewards && re.nftRewards.length >= 0) {
        setNftWiseRewards([...re.nftRewards])
      }
    }
  }

  // このコードは特典ステータスを更新し、ページを更新するために使用されます
  useEffect(() => {
    rewardBalancesReturned()
    stableSwapUpdated()

    // console.log('addressWiseRewards', addressWiseRewards)
    // console.log('nftWiseRewards', nftWiseRewards)
    // console.log('nonZeroVotesCountMap', votesMap)

    stores.emitter.on(ACTIONS.UPDATED, stableSwapUpdated)
    stores.emitter.on(ACTIONS.REWARD_BALANCES_ALL_RETURNED, rewardBalancesReturned)
    // stores.emitter.on(ACTIONS.VEST_VOTES_ALL_RETURNED, vestVotesReturned)

    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, stableSwapUpdated)
      stores.emitter.removeListener(ACTIONS.REWARD_BALANCES_ALL_RETURNED, rewardBalancesReturned)
      // stores.emitter.removeListener(ACTIONS.VEST_VOTES_ALL_RETURNED, vestVotesReturned)
    }
  }, [])

  useEffect(() => {
    const claimReturned = () => {
      setLoading(false)
    }

    const claimAllReturned = () => {
      setLoading(false)
    }

    stableSwapUpdated()

    stores.emitter.on(ACTIONS.CLAIM_BRIBE_RETURNED, claimReturned)
    stores.emitter.on(ACTIONS.CLAIM_REWARD_RETURNED, claimReturned)
    stores.emitter.on(ACTIONS.CLAIM_PAIR_FEES_RETURNED, claimReturned)
    stores.emitter.on(ACTIONS.CLAIM_VE_DIST_RETURNED, claimReturned)
    stores.emitter.on(ACTIONS.CLAIM_ALL_REWARDS_RETURNED, claimAllReturned)
    return () => {
      stores.emitter.removeListener(ACTIONS.CLAIM_BRIBE_RETURNED, claimReturned)
      stores.emitter.removeListener(ACTIONS.CLAIM_REWARD_RETURNED, claimReturned)
      stores.emitter.removeListener(ACTIONS.CLAIM_PAIR_FEES_RETURNED, claimReturned)
      stores.emitter.removeListener(ACTIONS.CLAIM_VE_DIST_RETURNED, claimReturned)
      stores.emitter.removeListener(ACTIONS.CLAIM_ALL_REWARDS_RETURNED, claimAllReturned)
    }
  }, [])

  const onClaimAll = (rewards, nftID) => {
    setLoading(true)
    let sendTokenID = 0
    if (nftID) {
      sendTokenID = nftID
    }
    stores.dispatcher.dispatch({ type: ACTIONS.CLAIM_ALL_REWARDS, content: { pairs: rewards, tokenID: sendTokenID } })
  }

  // // このコードは、tokenID を更新し、rewardBalances を再取得するために使用されます。
  // const handleChange = (event) => {
  //   setToken(event.target.value)
  //   stores.dispatcher.dispatch({ type: ACTIONS.GET_REWARD_BALANCES, content: { tokenID: event.target.value.id } })
  // }

  // const open = Boolean(anchorEl)
  // const id = open ? 'transitions-popper' : undefined

  // // このコードは、tokenID のドロップダウン ボックスをレンダリングするために使用されます。tokenID が変更されると、handleChange が呼び出され、rewardBalances が再取得され、ページが更新されます。
  // const renderMediumInput = (value, options) => {
  //   return (
  //     <div className={classes.textField}>
  //       <div className={classes.mediumInputContainer}>
  //         <Grid container>
  //           <Grid item lg="auto" md="auto" sm={12} xs={12}>
  //             <Typography variant="body2" className={classes.helpText}>
  //               Please select your veNFT:
  //             </Typography>
  //           </Grid>
  //           <Grid item lg={6} md={6} sm={12} xs={12}>
  //             <div className={classes.mediumInputAmount}>
  //               <Select
  //                 fullWidth
  //                 value={value}
  //                 onChange={handleChange}
  //                 InputProps={{
  //                   className: classes.mediumInput,
  //                 }}
  //               >
  //                 {options &&
  //                   options.map((option) => {
  //                     return (
  //                       <MenuItem key={option.id} value={option}>
  //                         <div className={classes.menuOption}>
  //                           <Typography>Token #{option.id}</Typography>
  //                           <div>
  //                             <Typography align="right" className={classes.smallerText}>
  //                               {formatCurrency(option.lockValue)}
  //                             </Typography>
  //                             <Typography color="textSecondary" className={classes.smallerText}>
  //                               {veToken?.symbol}
  //                             </Typography>
  //                           </div>
  //                         </div>
  //                       </MenuItem>
  //                     )
  //                   })}
  //               </Select>
  //             </div>
  //           </Grid>
  //         </Grid>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div>
      {/* <div className={classes.toolbarContainer}>
        <Grid container spacing={1}>
          <Grid item lg="auto" md="auto" sm={12} xs={12}>
            <div className={classes.tokenIDContainer}>{renderMediumInput(token, vestNFTs)}</div>
          </Grid>
          <Grid item lg={true} md={true} sm={false} xs={false}>
            <div className={classes.disclaimerContainer}>
              <Typography className={classes.disclaimer}>
                Rewards are an estimation that are not exact till the supply {'->'} rewardPerToken calculations have run
              </Typography>
            </div>
          </Grid>
          <Grid item lg="auto" md="auto" sm="12" xs="12">
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              size="large"
              className={classes.buttonOverride}
              color="primary"
              onClick={onClaimAll}
              disabled={loading}
            >
              <Typography className={classes.actionButtonText}>Claim All</Typography>
            </Button>
          </Grid>
        </Grid>
      </div> */}
      {/* <div>
        <RewardsTable rewards={addressWiseRewards} vestNFTs={vestNFTs} tokenID={token?.id} />
      </div> */}
      {/* eqh1 gradient-text pb-2 md:pb-3 lg:pb-4 text-4xl sm:text-5xl lg:text-6xl tracking-normal font-etna */}
      {/* <h1 className="text-6xl leading-none bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent py-0 px-0 pb-4 inline-block"> */}

      <div className="mb-5 md:mb-24">
        <div className="mb-5 inline-block text-white pb-2 md:pb-3 lg:pb-4 text-4xl sm:text-5xl lg:text-5xl font-semibold tracking-normal">
          Rewards
        </div>
        <div className="font-sans text-base leading-6 text-text-gray">
          Claim fees from LPs, rewards from staking LPs, new emissions and bribes from any pool you have voted
        </div>
      </div>

      <div className="mt-8 mb-8 border border-border bg-gradient-primary px-5 sm:px-8 py-8 rounded-[20px]">
        <div className="flex justify-between flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="text-xl font-semibold">Liquidity Rewards</div>
          <button
            className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/85 text-white h-10 py-2 px-4 rounded-[10px] whitespace-nowrap"
            disabled={addressWiseRewards.length === 0 || loading}
            onClick={() => onClaimAll(addressWiseRewards)}
          >
            Claim All
          </button>
        </div>
        <div className="rounded-md w-full bg-bg-table border border-border">
          {addressWiseRewards.length > 0 ? (
            <RewardsTable rewards={addressWiseRewards} />
          ) : (
            <div className="p-4 text-sm text-white">
              Add some LP tokens to a{' '}
              <Link href="/liquidity" className="hover:cursor-pointer text-pink-primary underline">
                Liquidity pool
              </Link>{' '}
              to start earning rewards
            </div>
          )}
        </div>
      </div>

      {nftWiseRewards.map((nftWiseReward, index) => {
        return (
          <div
            key={index}
            className="mt-8 mb-8 border border-border bg-gradient-primary px-5 sm:px-8 py-8 rounded-[20px]"
          >
            <div className="flex flex-col sm:flex-row gap-3 mb-3 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-left text-xl font-semibold">NFT ID #{nftWiseReward.nft.id}</h2>
                <div className="flex flex-wrap justify-start gap-2 items-center">
                  <div className="flex flex-row gap-1 justify-end">
                    <div className="text-xs font-normal leading-6">{formatCurrency(nftWiseReward.nft.lockAmount)}</div>
                    <div className="text-xs font-normal leading-6 text-text-gray">KODO</div>
                  </div>
                  <div className="flex flex-row gap-1 justify-end">
                    <div className="text-xs font-normal leading-6">
                      {formatCurrency((100 * nftWiseReward.nft.lockValue) / nftWiseReward.nft.lockAmount)}%
                    </div>
                    <div className="text-xs font-normal leading-6 text-text-gray">Power</div>
                  </div>
                  <div className="flex flex-row gap-1 justify-end">
                    <div className="text-xs font-normal leading-6">
                      {/* {nftWiseReward.nft.id in votesMap ? votesMap[nftWiseReward.nft.id] : 0} */}
                      {formatCurrency(nftWiseReward.nft.lockValue)}
                    </div>
                    <div className="text-xs font-normal leading-6 text-text-gray">Votes</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {/* <div className="h-5 w-5 mr-2">
                  <ArrowPathIcon
                    className="h-5 w-5 cursor-pointer text-blue-gray-400"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  />
                </div> */}
                <Link href={`/lock/${nftWiseReward.nft.id}`} passHref>
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none border border-border hover:bg-white/80 hover:text-table-dark h-10 py-2 px-4 rounded-[10px]"
                    title="Goto lock screen for this NFT"
                  >
                    Lock
                  </button>
                </Link>
                <Link href={`/vote/${nftWiseReward.nft.id}`} passHref>
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none border border-border hover:bg-white/80 hover:text-table-dark h-10 py-2 px-4 rounded-[10px]"
                    title="Goto vote screen for this NFT"
                  >
                    Vote
                  </button>
                </Link>
                <button
                  className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/85 text-white h-10 py-2 px-4 rounded-[10px]"
                  disabled={nftWiseReward.bribes.length + nftWiseReward.veDist.length === 0 || loading}
                  onClick={() => onClaimAll([...nftWiseReward.bribes, ...nftWiseReward.veDist], nftWiseReward.nft.id)}
                >
                  Claim All
                </button>
              </div>
            </div>

            <div className="font-inter rounded-md w-full bg-bg-table border border-border">
              {nftWiseReward.bribes.length + nftWiseReward.veDist.length > 0 ? (
                <RewardsTableForVe
                  rewards={[...nftWiseReward.bribes, ...nftWiseReward.veDist]}
                  vestNFTs={vestNFTs}
                  tokenID={nftWiseReward.nft.id}
                />
              ) : (
                <div className="p-4 text-sm text-white">
                  You&apos;ve claimed all outstanding rewards.{' '}
                  <Link
                    href={`/vote/${nftWiseReward.nft.id}`}
                    className="hover:cursor-pointer text-pink-primary underline"
                  >
                    Cast Votes
                  </Link>{' '}
                  every epoch to keep earning more!
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
