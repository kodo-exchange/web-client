import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import { formatCurrency } from '../../utils'

import stores from '../../stores'
import { ACTIONS, CONTRACTS } from '../../stores/constants'
import { ArrowLeftIcon, ArrowDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { Cog6ToothIcon, InformationCircleIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

import { Tab, Popover } from '@headlessui/react'

import { Tooltip } from 'react-tooltip'
import { usePopper } from 'react-popper'
import Image from 'next/image'

const PageHeader = ({ pair }) => {
  const router = useRouter()

  const onBack = () => {
    router.push('/liquidity')
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <div className="inline-block text-white pb-2 md:pb-3 lg:pb-4 text-2xl xs:text-4xl sm:text-5xl lg:text-5xl font-bold tracking-normal">
        Manage Pool
      </div>
      <div className="font-sans text-base leading-6 text-text-gray">{`Manage your ${pair.symbol} position`}</div>
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

export default function LiquidityManage() {
  const router = useRouter()
  const amount0Ref = useRef(null)
  const amount1Ref = useRef(null)

  const [pairReadOnly, setPairReadOnly] = useState(false)

  const [pair, setPair] = useState(null)
  const [veToken, setVeToken] = useState(null)

  const [depositLoading, setDepositLoading] = useState(false)
  const [stakeLoading, setStakeLoading] = useState(false)
  const [depositStakeLoading, setDepositStakeLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [unstakeLoading, setUnstakeLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  const [amount0, setAmount0] = useState('')
  const [amount0Error, setAmount0Error] = useState(false)
  const [amount1, setAmount1] = useState('')
  const [amount1Error, setAmount1Error] = useState(false)

  const [stable, setStable] = useState(false)

  const [asset0, setAsset0] = useState(null)
  const [asset1, setAsset1] = useState(null)
  const [assetOptions, setAssetOptions] = useState([])

  const [withdrawAsset, setWithdrawAsset] = useState(null)
  const [withdrawAassetOptions, setWithdrawAssetOptions] = useState([])
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAmountError, setWithdrawAmountError] = useState(false)

  const [withdrawAmount0, setWithdrawAmount0] = useState('')
  const [withdrawAmount1, setWithdrawAmount1] = useState('')

  const [withdrawAmount0Percent, setWithdrawAmount0Percent] = useState('')
  const [withdrawAmount1Percent, setWithdrawAmount1Percent] = useState('')

  const [activeTab, setActiveTab] = useState('deposit')
  const [quote, setQuote] = useState(null)
  const [withdrawQuote, setWithdrawQuote] = useState(null)

  const [priorityAsset, setPriorityAsset] = useState(0)
  const [advanced, setAdvanced] = useState(false)

  const [token, setToken] = useState(null)
  const [vestNFTs, setVestNFTs] = useState([])

  const [slippage, setSlippage] = useState('1')
  const [slippageError, setSlippageError] = useState(false)
  const [slippageInput, setSlippageInput] = useState('') // For showing user's input

  const [referenceSlippagePopper, setReferenceSlippagePopper] = useState()
  const [slippagePopperElement, setSlippagePopperElement] = useState()
  const { styles: slippagePopperStyles, attributes: slippagePopperAttributes } = usePopper(
    referenceSlippagePopper,
    slippagePopperElement,
    { modifiers: [{ name: 'offset', options: { offset: [0, 10] } }] }
  )

  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeAmountError, setStakeAmountError] = useState(false)
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [unstakeAmountError, setUnstakeAmountError] = useState(false)

  const [tabIndex, setTabIndex] = useState(0)
  const tabListRef = useRef(null)

  const ssUpdated = async () => {
    const storeAssetOptions = stores.stableSwapStore.getStore('baseAssets')
    const nfts = stores.stableSwapStore.getStore('vestNFTs')
    const veTok = stores.stableSwapStore.getStore('veToken')
    const pairs = stores.stableSwapStore.getStore('pairs')

    const onlyWithBalance = pairs.filter((ppp) => {
      return BigNumber(ppp.balance).gt(0) || (ppp.gauge && BigNumber(ppp.gauge.balance).gt(0))
    })

    setWithdrawAssetOptions(onlyWithBalance)
    setAssetOptions(storeAssetOptions)
    setVeToken(veTok)
    setVestNFTs(nfts)

    if (nfts.length > 0) {
      if (token == null) {
        setToken(nfts[0])
      }
    }

    if (router.query.address && router.query.address !== 'create') {
      setPairReadOnly(true)

      const pp = await stores.stableSwapStore.getPairByAddress(router.query.address)
      setPair(pp)

      if (pp) {
        setWithdrawAsset(pp)
        setAsset0(pp.token0)
        setAsset1(pp.token1)
        setStable(pp.isStable)
      }

      if (pp && BigNumber(pp.balance).gt(0)) {
        setAdvanced(true)
      }
    } else {
      let aa0 = asset0
      let aa1 = asset1
      if (storeAssetOptions.length > 0 && asset0 == null) {
        setAsset0(storeAssetOptions[0])
        aa0 = storeAssetOptions[0]
      }
      if (storeAssetOptions.length > 0 && asset1 == null) {
        setAsset1(storeAssetOptions[1])
        aa1 = storeAssetOptions[1]
      }
      if (withdrawAassetOptions.length > 0 && withdrawAsset == null) {
        setWithdrawAsset(withdrawAassetOptions[1])
      }

      if (aa0 && aa1) {
        const p = await stores.stableSwapStore.getPair(aa0.address, aa1.address, stable)
        setPair(p)
      }
    }
  }

  useEffect(() => {
    const depositReturned = () => {
      setDepositLoading(false)
      setStakeLoading(false)
      setDepositStakeLoading(false)
      setCreateLoading(false)
      setUnstakeLoading(false)
      setWithdrawLoading(false)

      setAmount0('')
      setAmount1('')
      setStakeAmount('')
      setUnstakeAmount('')
      setQuote(null)
      setWithdrawAmount('')
      setWithdrawAmount0('')
      setWithdrawAmount1('')
      setWithdrawQuote(null)

      // onBack()
    }

    const createGaugeReturned = () => {
      setCreateLoading(false)
      ssUpdated()
    }

    const errorReturned = () => {
      setDepositLoading(false)
      setStakeLoading(false)
      setDepositStakeLoading(false)
      setCreateLoading(false)
      setUnstakeLoading(false)
      setWithdrawLoading(false)
    }

    const quoteAddReturned = (res) => {
      setQuote(res.output)
    }

    const quoteRemoveReturned = (res) => {
      if (!res) {
        return
      }
      setWithdrawQuote(res.output)
      setWithdrawAmount0(res.output.amount0)
      setWithdrawAmount1(res.output.amount1)
    }

    const assetsUpdated = () => {
      setAssetOptions(stores.stableSwapStore.getStore('baseAssets'))
    }

    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    stores.emitter.on(ACTIONS.LIQUIDITY_ADDED, depositReturned)
    stores.emitter.on(ACTIONS.ADD_LIQUIDITY_AND_STAKED, depositReturned)
    stores.emitter.on(ACTIONS.LIQUIDITY_REMOVED, depositReturned)
    stores.emitter.on(ACTIONS.REMOVE_LIQUIDITY_AND_UNSTAKED, depositReturned)
    stores.emitter.on(ACTIONS.LIQUIDITY_STAKED, depositReturned)
    stores.emitter.on(ACTIONS.LIQUIDITY_UNSTAKED, depositReturned)
    stores.emitter.on(ACTIONS.PAIR_CREATED, depositReturned)
    stores.emitter.on(ACTIONS.QUOTE_ADD_LIQUIDITY_RETURNED, quoteAddReturned)
    stores.emitter.on(ACTIONS.QUOTE_REMOVE_LIQUIDITY_RETURNED, quoteRemoveReturned)
    stores.emitter.on(ACTIONS.CREATE_GAUGE_RETURNED, createGaugeReturned)
    stores.emitter.on(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)
    stores.emitter.on(ACTIONS.ERROR, errorReturned)

    ssUpdated()

    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_ADDED, depositReturned)
      stores.emitter.removeListener(ACTIONS.ADD_LIQUIDITY_AND_STAKED, depositReturned)
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_REMOVED, depositReturned)
      stores.emitter.removeListener(ACTIONS.REMOVE_LIQUIDITY_AND_UNSTAKED, depositReturned)
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_STAKED, depositReturned)
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_UNSTAKED, depositReturned)
      stores.emitter.removeListener(ACTIONS.PAIR_CREATED, depositReturned)
      stores.emitter.removeListener(ACTIONS.QUOTE_ADD_LIQUIDITY_RETURNED, quoteAddReturned)
      stores.emitter.removeListener(ACTIONS.QUOTE_REMOVE_LIQUIDITY_RETURNED, quoteRemoveReturned)
      stores.emitter.removeListener(ACTIONS.CREATE_GAUGE_RETURNED, createGaugeReturned)
      stores.emitter.removeListener(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await ssUpdated()
    }

    fetchData()
  }, [router.query.address])

  // useEffect(() => {
  //   // Check if the user has clicked the "Stake" link
  //   if (tabIndex === 1 && tabListRef.current) {
  //     // Scroll to the tab list
  //     window.scrollTo(0, tabListRef.current.offsetTop)
  //   }
  // }, [tabIndex])

  const onBack = () => {
    router.push('/liquidity')
  }

  const callQuoteAddLiquidity = (amountA, amountB, pa, sta, pp, assetA, assetB) => {
    if (!pp) {
      return null
    }

    let invert = false

    //TODO: Add check that asset0.address === pp.token0, otherwise we need to invert the calcs

    let addy0 = assetA.address
    let addy1 = assetB.address

    if (assetA.address === 'ETH') {
      addy0 = CONTRACTS.WETH_ADDRESS
    }
    if (assetB.address === 'ETH') {
      addy1 = CONTRACTS.WETH_ADDRESS
    }

    if (
      addy1.toLowerCase() == pp.token0.address.toLowerCase() &&
      addy0.toLowerCase() == pp.token1.address.toLowerCase()
    ) {
      invert = true
    }

    if (pa == 0) {
      if (amountA == '') {
        setAmount1('')
      } else {
        if (invert) {
          amountB = BigNumber(amountA).times(pp.reserve0).div(pp.reserve1).toFixed(pp.token0.decimals)
          // .toFixed(pp.token0.decimals > 6 ? 6 : pp.token0.decimals)
        } else {
          amountB = BigNumber(amountA).times(pp.reserve1).div(pp.reserve0).toFixed(pp.token1.decimals)
          // .toFixed(pp.token1.decimals > 6 ? 6 : pp.token1.decimals)
        }
        setAmount1(amountB)
      }
    }
    if (pa == 1) {
      if (amountB == '') {
        setAmount0('')
      } else {
        if (invert) {
          amountA = BigNumber(amountB).times(pp.reserve1).div(pp.reserve0).toFixed(pp.token1.decimals)
          // .toFixed(pp.token1.decimals > 6 ? 6 : pp.token1.decimals)
        } else {
          amountA = BigNumber(amountB).times(pp.reserve0).div(pp.reserve1).toFixed(pp.token0.decimals)
          // .toFixed(pp.token0.decimals > 6 ? 6 : pp.token0.decimals)
        }
        setAmount0(amountA)
      }
    }

    if (BigNumber(amountA).lte(0) || BigNumber(amountB).lte(0) || isNaN(amountA) || isNaN(amountB)) {
      return null
    }

    stores.dispatcher.dispatch({
      type: ACTIONS.QUOTE_ADD_LIQUIDITY,
      content: {
        pair: pp,
        token0: pp.token0,
        token1: pp.token1,
        amount0: amountA,
        amount1: amountB,
        stable: sta,
      },
    })
  }

  // const handleChange = (event) => {
  //   setToken(event.target.value)
  // }

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

  const setAmountPercent = (input, percent) => {
    setAmount0Error(false)
    setAmount1Error(false)

    if (input === 'amount0') {
      let am = BigNumber(asset0.balance).times(percent).div(100).toFixed(asset0.decimals)
      setAmount0(am)
      amount0Ref.current.focus()
      callQuoteAddLiquidity(am, amount1, 0, stable, pair, asset0, asset1)
    } else if (input === 'amount1') {
      let am = BigNumber(asset1.balance).times(percent).div(100).toFixed(asset1.decimals)
      setAmount1(am)
      amount1Ref.current.focus()
      callQuoteAddLiquidity(amount0, am, 1, stable, pair, asset0, asset1)
    }
    // else if (input === 'withdraw') {
    //   let am = ''
    //   // if (pair && pair.gauge) {
    //   //   am = BigNumber(pair.gauge.balance).times(percent).div(100).toFixed(18)
    //   //   setWithdrawAmount(am)
    //   // } else {
    //   //   am = BigNumber(pair.balance).times(percent).div(100).toFixed(18)
    //   //   setWithdrawAmount(am)
    //   // }

    //   am = BigNumber(pair.balance).times(percent).div(100).toFixed(pair.decimals)
    //   setWithdrawAmount(am)

    //   if (am === '') {
    //     setWithdrawAmount0('')
    //     setWithdrawAmount1('')
    //   } else if (am !== '' && !isNaN(am)) {
    //     calcRemove(pair, am)
    //   }
    // }
  }

  const onDeposit = () => {
    setAmount0Error(false)
    setAmount1Error(false)

    let error = false

    if (!amount0 || amount0 === '' || isNaN(amount0)) {
      setAmount0Error('Amount 0 is required')
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
      setAmount1Error('Amount 1 is required')
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

    if (!error) {
      setDepositLoading(true)

      stores.dispatcher.dispatch({
        type: ACTIONS.ADD_LIQUIDITY,
        content: {
          pair,
          token0: asset0,
          token1: asset1,
          amount0,
          amount1,
          minLiquidity: quote ? quote : '0',
          slippage: (slippage && slippage) != '' ? slippage : '2',
        },
      })
    }
  }

  const setStakeAmountPercent = (percent) => {
    setStakeAmountError(false)
    let am = BigNumber(pair?.balance || 0)
      .times(percent)
      .div(100)
      .toFixed(pair?.decimals || 18)
    setStakeAmount(am)
  }

  const stakeAmountChanged = (event) => {
    setStakeAmountError(false)
    setStakeAmount(event.target.value)
  }

  const onStake = () => {
    setStakeAmountError(false)

    let error = false

    if (!stakeAmount || stakeAmount === '' || isNaN(stakeAmount)) {
      setStakeAmountError('Invalid amount')
      error = true
    } else {
      if (!pair || !pair.balance || isNaN(pair.balance) || BigNumber(pair.balance).lte(0)) {
        setStakeAmountError('Invalid balance')
        error = true
      } else if (BigNumber(stakeAmount).lte(0)) {
        setStakeAmountError('Invalid amount')
        error = true
      } else if (pair && BigNumber(stakeAmount).gt(pair.balance)) {
        setStakeAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if (!error) {
      setStakeLoading(true)

      stores.dispatcher.dispatch({
        type: ACTIONS.STAKE_LIQUIDITY,
        content: {
          pair,
          stakeAmount,
        },
      })
    }
  }

  // const onStake = () => {
  //   setAmount0Error(false)
  //   setAmount1Error(false)

  //   let error = false

  //   if (!error) {
  //     setStakeLoading(true)

  //     stores.dispatcher.dispatch({
  //       type: ACTIONS.STAKE_LIQUIDITY,
  //       content: {
  //         pair,
  //         token,
  //         slippage: (slippage && slippage) != '' ? slippage : '2',
  //       },
  //     })
  //   }
  // }

  // const onDepositAndStake = () => {
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

  //   if (!error) {
  //     setDepositStakeLoading(true)

  //     stores.dispatcher.dispatch({
  //       type: ACTIONS.ADD_LIQUIDITY_AND_STAKE,
  //       content: {
  //         pair,
  //         token0: asset0,
  //         token1: asset1,
  //         amount0,
  //         amount1,
  //         minLiquidity: quote ? quote : '0',
  //         token,
  //         slippage: (slippage && slippage) != '' ? slippage : '2',
  //       },
  //     })
  //   }
  // }

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
  //     setAmount0Error('Asset is required')
  //     error = true
  //   }

  //   if (!asset1 || asset1 === null) {
  //     setAmount1Error('Asset is required')
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
  //         slippage: (slippage && slippage) != '' ? slippage : '2',
  //       },
  //     })
  //   }
  // }

  // const onCreateAndDeposit = () => {
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
  //     setAmount0Error('Asset is required')
  //     error = true
  //   }

  //   if (!asset1 || asset1 === null) {
  //     setAmount1Error('Asset is required')
  //     error = true
  //   }

  //   if (!error) {
  //     setDepositLoading(true)
  //     stores.dispatcher.dispatch({
  //       type: ACTIONS.CREATE_PAIR_AND_DEPOSIT,
  //       content: {
  //         token0: asset0,
  //         token1: asset1,
  //         amount0,
  //         amount1,
  //         isStable: stable,
  //         token,
  //         slippage: (slippage && slippage) != '' ? slippage : '2',
  //       },
  //     })
  //   }
  // }

  const onWithdraw = () => {
    setWithdrawAmountError(false)

    let error = false

    if (!withdrawAmount || withdrawAmount === '' || isNaN(withdrawAmount)) {
      setWithdrawAmountError('Amount is required')
      error = true
    } else {
      if (
        withdrawAsset &&
        (!withdrawAsset.balance || isNaN(withdrawAsset.balance) || BigNumber(withdrawAsset.balance).lte(0))
      ) {
        setWithdrawAmountError('Invalid balance')
        error = true
      } else if (BigNumber(withdrawAmount).lte(0)) {
        setWithdrawAmountError('Invalid amount')
        error = true
      } else if (withdrawAsset && BigNumber(withdrawAmount).gt(withdrawAsset.balance)) {
        setWithdrawAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if (!error) {
      setWithdrawLoading(true)

      stores.dispatcher.dispatch({
        type: ACTIONS.REMOVE_LIQUIDITY,
        content: {
          pair,
          token0: pair.token0,
          token1: pair.token1,
          withdrawAmount,
          quote: withdrawQuote,
          slippage: (slippage && slippage) != '' ? slippage : '2',
        },
      })
    }
  }

  // const onUnstakeAndWithdraw = () => {
  //   setWithdrawAmountError(false)

  //   let error = false

  //   if (!withdrawAmount || withdrawAmount === '' || isNaN(withdrawAmount)) {
  //     setWithdrawAmountError('Amount is required')
  //     error = true
  //   } else {
  //     if (
  //       withdrawAsset &&
  //       withdrawAsset.gauge &&
  //       (!withdrawAsset.gauge.balance ||
  //         isNaN(withdrawAsset.gauge.balance) ||
  //         BigNumber(withdrawAsset.gauge.balance).lte(0))
  //     ) {
  //       setWithdrawAmountError('Invalid balance')
  //       error = true
  //     } else if (BigNumber(withdrawAmount).lte(0)) {
  //       setWithdrawAmountError('Invalid amount')
  //       error = true
  //     } else if (withdrawAsset && BigNumber(withdrawAmount).gt(withdrawAsset.gauge.balance)) {
  //       setWithdrawAmountError(`Greater than your available balance`)
  //       error = true
  //     }
  //   }

  //   if (!withdrawAsset || withdrawAsset === null) {
  //     setWithdrawAmountError('From asset is required')
  //     error = true
  //   }

  //   if (!error) {
  //     setDepositStakeLoading(true)
  //     stores.dispatcher.dispatch({
  //       type: ACTIONS.UNSTAKE_AND_REMOVE_LIQUIDITY,
  //       content: {
  //         pair,
  //         token0: pair.token0,
  //         token1: pair.token1,
  //         amount: withdrawAmount,
  //         amount0: withdrawAmount0,
  //         amount1: withdrawAmount1,
  //         quote: withdrawQuote,
  //         slippage: (slippage && slippage) != '' ? slippage : '2',
  //       },
  //     })
  //   }
  // }

  const setUnstakeAmountPercent = (percent) => {
    setUnstakeAmountError(false)
    let am = BigNumber(pair?.gauge?.balance || 0)
      .times(percent)
      .div(100)
      .toFixed(pair?.decimals || 18)
    setUnstakeAmount(am)
  }

  const unstakeAmountChanged = (event) => {
    setUnstakeAmountError(false)
    setUnstakeAmount(event.target.value)
  }

  const onUnstake = () => {
    setUnstakeAmountError(false)

    let error = false

    if (!unstakeAmount || unstakeAmount === '' || isNaN(unstakeAmount)) {
      setUnstakeAmountError('Invalid amount')
      error = true
    } else {
      if (
        !pair ||
        !pair.gauge ||
        !pair.gauge.balance ||
        isNaN(pair.gauge.balance) ||
        BigNumber(pair.gauge.balance).lte(0)
      ) {
        setUnstakeAmountError('Invalid balance')
        error = true
      } else if (BigNumber(unstakeAmount).lte(0)) {
        setUnstakeAmountError('Invalid amount')
        error = true
      } else if (pair && pair.gauge && BigNumber(unstakeAmount).gt(pair.gauge.balance)) {
        setUnstakeAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if (!error) {
      setUnstakeLoading(true)

      stores.dispatcher.dispatch({
        type: ACTIONS.UNSTAKE_LIQUIDITY,
        content: {
          pair,
          // token0: pair.token0,
          // token1: pair.token1,
          amount: unstakeAmount,
          // amount0: withdrawAmount0,
          // amount1: withdrawAmount1,
          // quote: withdrawQuote,
          // slippage: (slippage && slippage) != '' ? slippage : '2',
        },
      })
    }
  }

  // const setWithdrawAmountPercent = (percent) => {
  //   setWithdrawAmountError(false)
  //   let am = BigNumber(pair?.balance).times(percent).div(100).toFixed(pair?.decimals)
  //   setWithdrawAmount(am)
  // }

  // const onUnstake = () => {
  //   setStakeLoading(true)
  //   stores.dispatcher.dispatch({
  //     type: ACTIONS.UNSTAKE_LIQUIDITY,
  //     content: {
  //       pair,
  //       token0: pair.token0,
  //       token1: pair.token1,
  //       amount: withdrawAmount,
  //       amount0: withdrawAmount0,
  //       amount1: withdrawAmount1,
  //       quote: withdrawQuote,
  //       slippage: (slippage && slippage) != '' ? slippage : '2',
  //     },
  //   })
  // }

  // const onCreateGauge = () => {
  //   setCreateLoading(true)
  //   stores.dispatcher.dispatch({
  //     type: ACTIONS.CREATE_GAUGE,
  //     content: {
  //       pair,
  //     },
  //   })
  // }

  const toggleDeposit = () => {
    setActiveTab('deposit')
  }

  const toggleWithdraw = () => {
    setActiveTab('withdraw')
  }

  const amount0Changed = (event) => {
    setAmount0Error(false)
    setAmount0(event.target.value)
    callQuoteAddLiquidity(event.target.value, amount1, priorityAsset, stable, pair, asset0, asset1)
  }

  const amount1Changed = (event) => {
    setAmount1Error(false)
    setAmount1(event.target.value)
    callQuoteAddLiquidity(amount0, event.target.value, priorityAsset, stable, pair, asset0, asset1)
  }

  const amount0Focused = (event) => {
    setPriorityAsset(0)
    callQuoteAddLiquidity(amount0, amount1, 0, stable, pair, asset0, asset1)
  }

  const amount1Focused = (event) => {
    setPriorityAsset(1)
    callQuoteAddLiquidity(amount0, amount1, 1, stable, pair, asset0, asset1)
  }

  const onAssetSelect = async (type, value) => {
    if (type === 'amount0') {
      setAsset0(value)
      const p = await stores.stableSwapStore.getPair(value.address, asset1.address, stable)
      setPair(p)
      callQuoteAddLiquidity(amount0, amount1, priorityAsset, stable, p, value, asset1)
    } else if (type === 'amount1') {
      setAsset1(value)
      const p = await stores.stableSwapStore.getPair(asset0.address, value.address, stable)
      setPair(p)
      callQuoteAddLiquidity(amount0, amount1, priorityAsset, stable, p, asset0, value)
    } else if (type === 'withdraw') {
      setWithdrawAsset(value)
      const p = await stores.stableSwapStore.getPair(value.token0.address, value.token1.address, value.isStable)
      setPair(p)
      calcRemove(p, withdrawAmount)
    }
  }

  const setStab = async (val) => {
    setStable(val)
    const p = await stores.stableSwapStore.getPair(asset0.address, asset1.address, val)
    setPair(p)
    callQuoteAddLiquidity(amount0, amount1, priorityAsset, val, p, asset0, asset1)
  }

  const setWithdrawAmountPercent = (percent) => {
    setWithdrawAmountError(false)
    let am = BigNumber(pair?.balance || 0)
      .times(percent)
      .div(100)
      .toFixed(pair.decimals)
    setWithdrawAmount(am)
    calcRemove(pair, am)
  }

  const withdrawAmountChanged = (event) => {
    setWithdrawAmountError(false)
    setWithdrawAmount(event.target.value)
    calcRemove(pair, event.target.value)
    // if (event.target.value === '') {
    //   setWithdrawAmount0('')
    //   setWithdrawAmount1('')
    // } else if (event.target.value !== '' && !isNaN(event.target.value)) {
    //   calcRemove(pair, event.target.value)
    // }
  }

  const calcRemove = (pair, amount) => {
    if (!pair) {
      return null
    }

    // if (amount === '') {
    //   setWithdrawAmount0('')
    //   setWithdrawAmount1('')
    //   return
    // }

    // if (BigNumber(amount).isEqualTo(0)) {
    //   setWithdrawAmount0(BigNumber('0').toFixed(pair.token0.decimals > 6 ? 6 : pair.token0.decimals))
    //   setWithdrawAmount1(BigNumber('0').toFixed(pair.token1.decimals > 6 ? 6 : pair.token1.decimals))
    //   return
    // }

    // if (!(amount && amount != '' && amount > 0)) {
    //   return
    // }

    if (!amount || BigNumber(amount).lte(0) || isNaN(amount)) {
      setWithdrawAmount0(BigNumber('0').toFixed(6))
      // .toFixed(pair.token0.decimals > 6 ? 6 : pair.token0.decimals))
      setWithdrawAmount1(BigNumber('0').toFixed(6))
      return null
    }

    callQuoteRemoveLiquidity(pair, amount)
  }

  const callQuoteRemoveLiquidity = (p, amount) => {
    if (!pair) {
      return null
    }

    stores.dispatcher.dispatch({
      type: ACTIONS.QUOTE_REMOVE_LIQUIDITY,
      content: {
        pair: p,
        token0: p.token0,
        token1: p.token1,
        withdrawAmount: amount,
      },
    })
  }

  // const renderMediumInput = (type, value, logo, symbol) => {
  //   return (
  //     <div className={classes.textField}>
  //       <div className={classes.mediumInputContainer}>
  //         <div className={classes.mediumInputAssetSelect}>
  //           <div className={classes.mediumdisplaySelectContainer}>
  //             <div className={classes.assetSelectMenuItem}>
  //               <div className={classes.mediumdisplayDualIconContainer}>
  //                 {logo && (
  //                   <img
  //                     className={classes.mediumdisplayAssetIcon}
  //                     alt=""
  //                     src={logo}
  //                     height="50px"
  //                     onError={(e) => {
  //                       e.target.onerror = null
  //                       e.target.src = '/tokens/unknown-logo.png'
  //                     }}
  //                   />
  //                 )}
  //                 {!logo && (
  //                   <img
  //                     className={classes.mediumdisplayAssetIcon}
  //                     alt=""
  //                     src={'/tokens/unknown-logo.png'}
  //                     height="50px"
  //                     onError={(e) => {
  //                       e.target.onerror = null
  //                       e.target.src = '/tokens/unknown-logo.png'
  //                     }}
  //                   />
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <div className={classes.mediumInputAmount}>
  //           <TextField
  //             placeholder="0.00"
  //             fullWidth
  //             value={value}
  //             disabled={true}
  //             InputProps={{
  //               className: classes.mediumInput,
  //             }}
  //           />
  //           <Typography color="textSecondary" className={classes.smallestText}>
  //             {symbol}
  //           </Typography>
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
    onAssetSelect,
    onFocus,
    inputRef
  ) => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row flex-wrap items-center justify-between gap-y-2 text-sm">
          <div className="pr-2">
            <span className=" text-text-gray">{type === 'amount0' ? 'Token 0' : 'Token 1'}</span>
          </div>
          <span className="text-text-gray">
            {`Wallet: ${
              assetValue?.balance && assetValue?.decimals
                ? formatCurrency(assetValue.balance, assetValue.decimals)
                : formatCurrency(0, 18)
            }`}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl bg-table-dark border-border border pr-2 focus-within:border-pink-primary transition-colors duration-300">
          <div className="flex flex-row items-center">
            <input
              className="flex h-12 w-full px-3 py-2 focus:outline-none rounded-xl shadow-none bg-transparent border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 placeholder:text-text-unselected"
              type="text"
              placeholder="0"
              value={amountValue}
              onChange={amountChanged}
              onFocus={onFocus ? onFocus : null}
              ref={inputRef}
              disabled={createLoading}
            />
            <div className="flex flex-none flex-row items-center">
              <img
                className="aspect-square rounded-full"
                src={assetValue ? `${assetValue.logoURI}` : ''}
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
                src={assetValue ? `${assetValue.logoURI}` : '/tokens/unknown-logo.png'}
                width={24}
                height={24}
                alt=""
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/tokens/unknown-logo.png'
                }}
              /> */}
              <div className="text-base font-medium leading-6 ml-[6px] mr-1">
                {assetValue ? `${assetValue.symbol}` : ''}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="text-red-500/75 text-sm">{amountError || ''}</div>
          <div className="flex flex-row items-center justify-end gap-1">
            {[
              { value: 0, label: '0%' },
              { value: 25, label: '25%' },
              { value: 50, label: '50%' },
              { value: 75, label: '75%' },
              { value: 100, label: 'MAX' },
            ].map((item, index) => {
              return (
                <button
                  key={index}
                  className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-white hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
                  onClick={() => {
                    setAmountPercent(type, item.value)
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // const renderMassiveInput = (
  //   type,
  //   amountValue,
  //   amountError,
  //   amountChanged,
  //   assetValue,
  //   assetError,
  //   assetOptions,
  //   onAssetSelect,
  //   onFocus,
  //   inputRef
  // ) => {
  //   return (
  //     <div className={classes.textField}>
  //       <div className={classes.inputTitleContainer}>
  //         <div className={classes.inputBalance}>
  //           {type !== 'withdraw' && (
  //             <Typography
  //               className={classes.inputBalanceText}
  //               noWrap
  //               onClick={() => {
  //                 setAmountPercent(type, 100)
  //               }}
  //             >
  //               Balance:
  //               {assetValue && assetValue.balance ? ' ' + formatCurrency(assetValue.balance) : ''}
  //             </Typography>
  //           )}
  //           {type === 'withdraw' && (
  //             <Typography
  //               className={classes.inputBalanceText}
  //               noWrap
  //               onClick={() => {
  //                 setAmountPercent(type, 100)
  //               }}
  //             >
  //               Balance:
  //               {assetValue && assetValue.gauge && assetValue.gauge.balance
  //                 ? ' ' + formatCurrency(assetValue.gauge.balance)
  //                 : assetValue && assetValue.balance
  //                 ? ' ' + formatCurrency(assetValue.balance)
  //                 : '0.00'}
  //             </Typography>
  //           )}
  //         </div>
  //       </div>
  //       <div className={`${classes.massiveInputContainer} ${(amountError || assetError) && classes.error}`}>
  //         <div className={classes.massiveInputAssetSelect}>
  //           <AssetSelect
  //             type={type}
  //             value={assetValue}
  //             assetOptions={assetOptions}
  //             onSelect={onAssetSelect}
  //             disabled={pairReadOnly}
  //           />
  //         </div>
  //         <div className={classes.massiveInputAmount}>
  //           <TextField
  //             inputRef={inputRef}
  //             placeholder="0.00"
  //             fullWidth
  //             error={amountError}
  //             helperText={amountError}
  //             value={amountValue}
  //             onChange={amountChanged}
  //             disabled={createLoading}
  //             onFocus={onFocus ? onFocus : null}
  //             InputProps={{
  //               className: classes.largeInput,
  //             }}
  //           />
  //           <Typography color="textSecondary" className={classes.smallerText}>
  //             {assetValue?.symbol}
  //           </Typography>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  const renderDepositInformation = () => {
    return (
      <>
        <div>
          <h4 className="text-base font-semibold leading-none tracking-tight">Reserves</h4>
          <div className="shrink-0 bg-border h-[1px] w-full my-2"></div>
          <div className="grid w-full grid-cols-3 gap-1 text-sm">
            <div className="font-semibold text-text-gray">{`${pair?.token0?.symbol}`}</div>
            <div className="font-semibold text-text-gray">{`${pair?.token1?.symbol}`}</div>
            {/* <div>&nbsp;</div> */}
            <div className="font-semibold text-text-gray flex flex-row gap-1 justify-end items-center">Slippage</div>
            <div>{formatCurrency(pair?.reserve0, 3)}</div>
            <div>{formatCurrency(pair?.reserve1, 3)}</div>
            {/* <div>&nbsp;</div> */}
            <div className="text-right">{formatCurrency(slippage, 3)}%</div>
          </div>
        </div>
        <div>
          <h4 className="flex items-center text-base font-semibold leading-none tracking-tight gap-1">
            Your pools
            <span className="text-sm font-medium">
              <Tooltip id="lp-balance-tooltip" className="max-w-md whitespace-normal" />
              <a
                data-tooltip-id="lp-balance-tooltip"
                data-tooltip-place="right"
                data-tooltip-content={`${pair?.symbol} liquidity token you have in your wallet and staked in the gauge.`}
              >
                <InformationCircleIcon className="self-center shrink-0 mx-1 h-4 w-4 text-text-gray" />
              </a>
            </span>
          </h4>
          <div className="shrink-0 bg-border h-[1px] w-full my-2"></div>
          <div className="grid w-full grid-cols-3 gap-1 text-sm">
            <div className="font-semibold text-text-gray">Wallet</div>
            <div className="font-semibold text-text-gray">Staked</div>
            <div>&nbsp;</div>
            <div>
              <span className="text-sm font-normal">
                <Tooltip id="lp-balance-wallet-tooltip" className="max-w-md whitespace-normal" />
                <a
                  data-tooltip-id="lp-balance-wallet-tooltip"
                  data-tooltip-place="bottom"
                  data-tooltip-content={formatCurrency(pair?.balance, pair?.decimals)}
                >
                  <div className="cursor-default">{formatCurrency(pair?.balance, 10)}</div>
                </a>
              </span>
            </div>
            <div>
              {/* <div className="cursor-default">{formatCurrency(pair?.gauge?.balance, 10)}</div> */}
              <span className="text-sm font-normal">
                <Tooltip id="lp-balance-staked-tooltip" className="max-w-md whitespace-normal" />
                <a
                  data-tooltip-id="lp-balance-staked-tooltip"
                  data-tooltip-place="bottom"
                  data-tooltip-content={formatCurrency(pair?.gauge?.balance, pair?.decimals)}
                >
                  <div className="cursor-default">{formatCurrency(pair?.gauge?.balance, 10)}</div>
                </a>
              </span>
            </div>
            <div>&nbsp;</div>
          </div>
        </div>
      </>
    )
  }

  // const renderDepositInformation = () => {
  //   if (!pair) {
  //     return (
  //       <div className={classes.depositInfoContainer}>
  //         <Typography className={classes.depositInfoHeading}>Starting Liquidity Info</Typography>
  //         <div className={classes.createPriceInfos}>
  //           <div className={classes.priceInfo}>
  //             <Typography className={classes.title}>
  //               {BigNumber(amount1).gt(0) ? formatCurrency(BigNumber(amount0).div(amount1)) : '0.00'}
  //             </Typography>
  //             <Typography className={classes.text}>{`${asset0?.symbol} per ${asset1?.symbol}`}</Typography>
  //           </div>
  //           <div className={classes.priceInfo}>
  //             <Typography className={classes.title}>
  //               {BigNumber(amount0).gt(0) ? formatCurrency(BigNumber(amount1).div(amount0)) : '0.00'}
  //             </Typography>
  //             <Typography className={classes.text}>{`${asset1?.symbol} per ${asset0?.symbol}`}</Typography>
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   } else {
  //     return (
  //       <div className={classes.depositInfoContainer}>
  //         <Typography className={classes.depositInfoHeading}>Reserve Info</Typography>
  //         <div className={classes.priceInfos}>
  //           <div className={classes.priceInfo}>
  //             <Typography className={classes.title}>{formatCurrency(pair?.reserve0)}</Typography>
  //             <Typography className={classes.text}>{`${pair?.token0?.symbol}`}</Typography>
  //           </div>
  //           <div className={classes.priceInfo}>
  //             <Typography className={classes.title}>{formatCurrency(pair?.reserve1)}</Typography>
  //             <Typography className={classes.text}>{`${pair?.token1?.symbol}`}</Typography>
  //           </div>
  //           <div className={classes.priceInfo}>
  //             {renderSmallInput('slippage', slippage, slippageError, onSlippageChanged)}
  //           </div>
  //         </div>
  //         <Typography className={classes.depositInfoHeading}>Your Balances</Typography>
  //         <div className={classes.createPriceInfos}>
  //           <div className={classes.priceInfo}>
  //             <Typography className={classes.title}>{formatCurrency(pair?.balance)}</Typography>
  //             <Typography className={classes.text}>{`Pooled ${pair?.symbol}`}</Typography>
  //           </div>
  //           <div className={classes.priceInfo}>
  //             <Typography className={classes.title}>{formatCurrency(pair?.gauge?.balance)}</Typography>
  //             <Typography className={classes.text}>{`Staked ${pair?.symbol} `}</Typography>
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   }
  // }

  // const renderWithdrawInformation = () => {
  //   return (
  //     <div className={classes.withdrawInfoContainer}>
  //       <Typography className={classes.depositInfoHeading}>Reserve Info</Typography>
  //       <div className={classes.priceInfos}>
  //         <div className={classes.priceInfo}>
  //           <Typography className={classes.title}>{formatCurrency(pair?.reserve0)}</Typography>
  //           <Typography className={classes.text}>{`${pair?.token0?.symbol}`}</Typography>
  //         </div>
  //         <div className={classes.priceInfo}>
  //           <Typography className={classes.title}>{formatCurrency(pair?.reserve1)}</Typography>
  //           <Typography className={classes.text}>{`${pair?.token1?.symbol}`}</Typography>
  //         </div>
  //         <div className={classes.priceInfo}>
  //           {renderSmallInput('slippage', slippage, slippageError, onSlippageChanged)}
  //         </div>
  //       </div>
  //       <Typography className={classes.depositInfoHeading}>Your Balances</Typography>
  //       <div className={classes.createPriceInfos}>
  //         <div className={classes.priceInfo}>
  //           <Typography className={classes.title}>{formatCurrency(pair?.balance)}</Typography>
  //           <Typography className={classes.text}>{`Pooled ${pair?.symbol}`}</Typography>
  //         </div>
  //         <div className={classes.priceInfo}>
  //           <Typography className={classes.title}>{formatCurrency(pair?.gauge?.balance)}</Typography>
  //           <Typography className={classes.text}>{`Staked ${pair?.symbol} `}</Typography>
  //         </div>
  //       </div>
  //       <div className={classes.disclaimerContainer}>
  //         <Typography className={classes.disclaimer}>
  //           {'Please make sure to claim any rewards before withdrawing'}
  //         </Typography>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderSmallInput = (type, amountValue, amountError, amountChanged) => {
  //   return (
  //     <div className={classes.textField}>
  //       <div className={classes.inputTitleContainerSlippage}>
  //         <div className={classes.inputBalanceSlippage}>
  //           <Typography className={classes.inputBalanceText} noWrap>
  //             {' '}
  //             Slippage{' '}
  //           </Typography>
  //         </div>
  //       </div>
  //       <div className={classes.smallInputContainer}>
  //         <TextField
  //           placeholder="0.00"
  //           fullWidth
  //           error={amountError}
  //           helperText={amountError}
  //           value={amountValue}
  //           onChange={amountChanged}
  //           disabled={depositLoading || stakeLoading || depositStakeLoading || createLoading}
  //           InputProps={{
  //             className: classes.smallInput,
  //             endAdornment: <InputAdornment position="end">%</InputAdornment>,
  //           }}
  //         />
  //       </div>
  //     </div>
  //   )
  // }

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

  // const renderTokenSelect = () => {
  //   if (vestNFTs.length === 0) {
  //     return null
  //   }

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

  // const toggleAdvanced = () => {
  //   setAdvanced(!advanced)
  // }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const renderSlippagePopper = () => {
    return (
      <Popover className="relative">
        <Popover.Button ref={setReferenceSlippagePopper} className="focus-visible:outline-none">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-text-gray hover:text-white transition-colors" />
        </Popover.Button>
        <Popover.Panel
          ref={setSlippagePopperElement}
          style={slippagePopperStyles.popper}
          {...slippagePopperAttributes.popper}
          className="w-[28rem] p-4 bg-bg-light text-white rounded-md border border-border shadow-md"
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="font-medium leading-none">Slippage</div>
              <p className="text-sm text-text-gray font-normal">Set the slippage when adding liquidity.</p>
            </div>
            <div className="flex flex-row gap-3">
              <div className="flex items-center rounded-lg border border-border bg-bg-light text-sm leading-5">
                {[
                  { value: 0.1, label: '0.1' },
                  { value: 0.5, label: '0.5' },
                  { value: 1.0, label: '1.0' },
                  { value: 3.0, label: '3.0' },
                ].map((item) => (
                  <button
                    key={item.value}
                    className={classNames(
                      'flex items-center justify-center w-20 cursor-pointer px-4 py-2 text-center rounded-lg ',
                      parseFloat(slippage) === item.value ? 'bg-pink-primary' : 'hover:text-pink-primary'
                    )}
                    onClick={() => onSlippageChanged({ target: { value: item.label } })}
                  >
                    {item.label}%
                  </button>
                ))}
              </div>
              <div className="max-w-40 flex flex-row gap-[4px] items-center text-sm">
                <input
                  className="flex h-10 w-full rounded-md border border-border bg-table-dark px-2 py-2 text-sm ring-offset-background focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 max-w-[60px] placeholder:text-text-unselected"
                  placeholder={slippage}
                  type="text"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  value={slippageInput}
                  onChange={onSlippageChanged}
                />
                %
              </div>
            </div>
            {slippageError && <div className="text-red-500/75 text-sm text-right mt-2">{slippageError}</div>}
          </div>
        </Popover.Panel>
      </Popover>
    )
  }

  return (
    pair && (
      <>
        <PageHeader pair={pair} />
        <section className="flex flex-col gap-4 items-center pb-8 pt-6 md:py-8  items-top">
          <div className="max-w-[520px] w-full">
            <Tab.Group selectedIndex={tabIndex}>
              <Tab.List
                ref={tabListRef}
                className="w-full items-center justify-center rounded-[10px] bg-bg-light p-1 border border-border text-text-gray grid grid-cols-4"
              >
                {['Deposit', 'Stake', 'Unstake', 'Withdraw'].map((tab, index) => (
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
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-xl font-semibold leading-none tracking-tight mt-4 mb-2">
                      <div className="flex flex-row justify-between">
                        Deposit
                        <div className="flex flex-row gap-2 items-center">
                          <div className="text-sm font-medium">
                            <Tooltip id="pool-type-tooltip" className="max-w-md whitespace-normal" />
                            <a
                              data-tooltip-id="pool-type-tooltip"
                              data-tooltip-place="top"
                              data-tooltip-content={
                                stable
                                  ? 'Stable pools are for closely matched assets e.g. DAI/USDC'
                                  : 'Volatile pools are for volatile assets e.g. TAIKO/USDC, BTC/ETH'
                              }
                            >
                              <div className="inline-flex items-center border rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-pink-primary hover:bg-pink-primary/90 border-transparent text-white text-xs cursor-default">
                                {stable ? 'Stable Pool' : 'Volatile Pool'}
                              </div>
                            </a>
                          </div>
                          {renderSlippagePopper()}
                        </div>
                      </div>
                    </h3>
                  </div>
                  <div className="p-6 pt-0 mb-4 space-y-8">
                    <div className="space-y-8">
                      {renderMassiveInput(
                        'amount0',
                        amount0,
                        amount0Error,
                        amount0Changed,
                        asset0,
                        null,
                        assetOptions,
                        onAssetSelect,
                        amount0Focused,
                        amount0Ref
                      )}
                      {renderMassiveInput(
                        'amount1',
                        amount1,
                        amount1Error,
                        amount1Changed,
                        asset1,
                        null,
                        assetOptions,
                        onAssetSelect,
                        amount1Focused,
                        amount1Ref
                      )}
                    </div>
                    {renderDepositInformation()}
                  </div>
                  <div className="items-center p-6 pt-0 flex justify-end">
                    <button
                      className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
                      disabled={(amount0 === '' && amount1 === '') || depositLoading}
                      onClick={onDeposit}
                    >
                      {depositLoading ? `Depositing` : `Deposit liquidity`}
                    </button>
                  </div>
                </Tab.Panel>
                <Tab.Panel className="rounded-[20px] border border-border bg-gradient-primary text-white shadow-sm space-y-4">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-xl font-semibold leading-none tracking-tight mt-4 mb-2">Stake</h3>
                    <p className="text-sm text-text-gray">
                      {`Users staked in the ${pair?.symbol} pool are currently earning ${pair?.apr}% APR.`}
                    </p>
                  </div>
                  <div className="p-6 pt-0 space-y-4">
                    <div className="">
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-col items-start gap-y-2 text-sm">
                          <div className="pr-2">
                            <span className="font-semibold text-white">{`${pair?.symbol} Liquidity Token`}</span>
                          </div>
                          <span data-state="closed">
                            <span className="font-normal text-text-gray">{`Wallet: ${formatCurrency(
                              pair?.balance || 0,
                              pair?.decimals || 18
                            )}`}</span>
                          </span>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-border focus-within:border-pink-primary transition-colors duration-300">
                          <div className="flex flex-row items-center">
                            <input
                              className="flex h-12 w-full px-3 py-2 focus:outline-none rounded-xl shadow-none bg-table-dark border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 placeholder:text-text-unselected"
                              type="text"
                              placeholder="0"
                              value={stakeAmount}
                              onChange={stakeAmountChanged}
                              disabled={stakeLoading}
                            />
                          </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <div className="text-red-500 text-sm">{stakeAmountError || ''}</div>
                          <div className="flex flex-row items-center justify-end gap-1">
                            {[
                              { value: 0, label: '0%' },
                              { value: 25, label: '25%' },
                              { value: 50, label: '50%' },
                              { value: 75, label: '75%' },
                              { value: 100, label: 'MAX' },
                            ].map((item, index) => {
                              return (
                                <button
                                  key={index}
                                  className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-white hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
                                  onClick={() => {
                                    setStakeAmountPercent(item.value)
                                  }}
                                >
                                  {item.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="items-center p-6 pt-0 flex justify-end gap-4">
                    <button
                      className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
                      disabled={BigNumber(pair?.balance || 0).eq(0) || stakeAmount === '' || stakeLoading}
                      onClick={onStake}
                    >
                      {stakeLoading ? `Staking` : `Stake liquidity`}
                    </button>
                  </div>
                </Tab.Panel>
                <Tab.Panel className="rounded-lg border border-border bg-gradient-primary text-white shadow-sm space-y-4">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-xl font-semibold leading-none tracking-tight mt-4 mb-2">Unstake</h3>
                    <p className="text-sm text-text-gray">{`Unstake your ${pair?.symbol} liquidity token.`}</p>
                  </div>
                  <div className="p-6 pt-0 space-y-4">
                    <div className="">
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-col items-start gap-y-2 text-sm">
                          <div className="pr-2">
                            <span className="font-semibold text-white">{`${pair?.symbol} Liquidity Token`}</span>
                          </div>
                          <span data-state="closed">
                            <span className="text-text-gray">{`Staked: ${formatCurrency(
                              pair?.gauge?.balance || 0,
                              pair?.decimals || 18
                            )}`}</span>
                          </span>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-border focus-within:border-pink-primary transition-colors duration-300">
                          <div className="flex flex-row items-center">
                            <input
                              className="flex h-12 w-full px-3 py-2 focus:outline-none rounded-xl shadow-none bg-table-dark border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 placeholder:text-text-unselected"
                              type="text"
                              placeholder="0"
                              value={unstakeAmount}
                              onChange={unstakeAmountChanged}
                              disabled={unstakeLoading}
                            />
                          </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <div className="text-red-500 text-sm">{unstakeAmountError || ''}</div>
                          <div className="flex flex-row items-center justify-end gap-1">
                            {[
                              { value: 0, label: '0%' },
                              { value: 25, label: '25%' },
                              { value: 50, label: '50%' },
                              { value: 75, label: '75%' },
                              { value: 100, label: 'MAX' },
                            ].map((item, index) => {
                              return (
                                <button
                                  key={index}
                                  className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-white hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
                                  onClick={() => {
                                    setUnstakeAmountPercent(item.value)
                                  }}
                                >
                                  {item.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="items-center p-6 pt-0 flex justify-end gap-4">
                    <button
                      className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
                      disabled={BigNumber(pair?.gauge?.balance || 0).eq(0) || unstakeAmount === '' || unstakeLoading}
                      onClick={onUnstake}
                    >
                      {unstakeLoading ? `Unstaking` : `Unstake liquidity`}
                    </button>
                  </div>
                </Tab.Panel>
                <Tab.Panel className="rounded-lg border border-border bg-gradient-primary text-white shadow-sm space-y-4">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-xl font-semibold leading-none tracking-tight mt-4 mb-2">Withdraw</h3>
                    <p className="text-sm text-text-gray">
                      {`Withdraw your ${pair?.symbol} liquidity back into ${pair?.token0?.symbol} and ${pair?.token1?.symbol} tokens.`}
                    </p>
                  </div>
                  <div className="p-6 pt-0 space-y-8">
                    <div className="">
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-col items-start gap-y-2 text-sm">
                          <div className="pr-2">
                            <span className="font-semibold text-white">{`${pair?.symbol} Liquidity Token`}</span>
                          </div>
                          <span data-state="closed">
                            <span className=" text-text-gray">{`Wallet: ${formatCurrency(
                              pair?.balance || 0,
                              pair?.decimals || 18
                            )}`}</span>
                          </span>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-border focus-within:border-pink-primary transition-colors duration-300">
                          <div className="flex flex-row items-center">
                            <input
                              className="flex h-12 w-full px-3 py-2 focus:outline-none rounded-xl shadow-none bg-table-dark border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 placeholder:text-text-unselected"
                              type="text"
                              placeholder="0"
                              value={withdrawAmount}
                              onChange={withdrawAmountChanged}
                              disabled={withdrawLoading}
                            />
                          </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <div className="text-red-500 text-sm">{withdrawAmountError || ''}</div>
                          <div className="flex flex-row items-center justify-end gap-1">
                            {[
                              { value: 0, label: '0%' },
                              { value: 25, label: '25%' },
                              { value: 50, label: '50%' },
                              { value: 75, label: '75%' },
                              { value: 100, label: 'MAX' },
                            ].map((item, index) => {
                              return (
                                <button
                                  key={index}
                                  className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-white hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
                                  onClick={() => {
                                    // setAmountPercent('withdraw', item.value)
                                    setWithdrawAmountPercent(item.value)
                                  }}
                                >
                                  {item.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mx-auto w-9 h-9 border border-border rounded-full stroke-white fill-white flex items-center">
                        <ArrowDownIcon className="h-5 w-5 mx-auto text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <div className="overflow-hidden rounded-xl bg-table-dark border border-border pr-4">
                          <div className="flex flex-row items-center">
                            <input
                              className="flex h-12 w-full px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 grow rounded-xl shadow-none ring-offset-table bg-transparent border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 focus-within:border-0 focus-within:ring-0 focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-text-unselected"
                              type="text"
                              placeholder="0"
                              value={withdrawAmount0}
                              readOnly
                            />
                            <img
                              alt=""
                              width="24"
                              height="24"
                              className="mr-1 h-[24px] w-[24px] rounded-full"
                              src={pair?.token0?.logoURI}
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/tokens/unknown-logo.png'
                              }}
                            />
                            {/* <Image
                              alt=""
                              width={24}
                              height={24}
                              className="mr-1 h-[24px] w-[24px]"
                              src={pair?.token0?.logoURI ?? '/tokens/unknown-logo.png'}
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/tokens/unknown-logo.png'
                              }}
                            /> */}
                            <div className="ml-1 text-sm font-medium leading-6">{pair?.token0?.symbol}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col space-y-2">
                          <div className="overflow-hidden rounded-xl bg-table-dark border border-border pr-4">
                            <div className="flex flex-row items-center">
                              <input
                                className="flex h-12 w-full px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 grow rounded-xl shadow-none ring-offset-table bg-transparent border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 focus-within:border-0 focus-within:ring-0 focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-text-unselected"
                                type="text"
                                placeholder="0"
                                value={withdrawAmount1}
                                readOnly
                              />
                              <img
                                alt=""
                                width="24"
                                height="24"
                                className="mr-1 h-[24px] w-[24px] rounded-full"
                                src={pair?.token1?.logoURI}
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = '/tokens/unknown-logo.png'
                                }}
                              />
                              {/* <Image
                                alt=""
                                width={24}
                                height={24}
                                className="mr-1 h-[24px] w-[24px]"
                                src={pair?.token1?.logoURI ?? '/tokens/unknown-logo.png'}
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = '/tokens/unknown-logo.png'
                                }}
                              /> */}
                              <div className="ml-1 text-sm font-medium leading-6">{pair?.token1?.symbol}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="items-center p-6 pt-0 flex justify-end gap-4">
                    <button
                      className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
                      disabled={withdrawAmount === '' || withdrawLoading}
                      onClick={onWithdraw}
                    >
                      {withdrawLoading ? `Withdrawing` : `Withdraw liquidity`}
                    </button>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
          {BigNumber(pair?.balance || 0).gt(0) && (
            <div className="grow flex flex-row gap-4 mt-6">
              <div className="flex flex-row gap-3 max-w-[520px] rounded-[20px] border border-border bg-gradient-primary text-sm text-text-gray p-6">
                <div>
                  <ExclamationTriangleIcon className="h-6 w-6 text-current" />
                </div>
                <div className="whitespace-break-spaces">
                  You have unstaked tokens in your wallet, please visit the{' '}
                  <div
                    className=" inline-block underline text-pink-primary cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      setTabIndex(1)
                      if (tabListRef.current) {
                        // Scroll to the tab list
                        window.scrollTo(0, tabListRef.current.offsetTop)
                      }
                    }}
                  >
                    Stake
                  </div>{' '}
                  tab to stake in the gauge and earn more yield on your liquidity tokens.
                </div>
              </div>
            </div>
          )}
        </section>
      </>
    )

    // <div className={classes.retain}>
    //   <Paper elevation={0} className={classes.container}>
    //     <div className={classes.toggleButtons}>
    //       <Grid container spacing={0}>
    //         <Grid item lg={6} md={6} sm={6} xs={6}>
    //           <Paper
    //             className={`${activeTab === 'deposit' ? classes.buttonActive : classes.button} ${
    //               classes.topLeftButton
    //             }`}
    //             onClick={toggleDeposit}
    //             disabled={depositLoading}
    //           >
    //             <Typography variant="h5">Deposit</Typography>
    //             <div className={`${activeTab === 'deposit' ? classes.activeIcon : ''}`}></div>
    //           </Paper>
    //         </Grid>
    //         <Grid item lg={6} md={6} sm={6} xs={6}>
    //           <Paper
    //             className={`${activeTab === 'withdraw' ? classes.buttonActive : classes.button}  ${
    //               classes.bottomLeftButton
    //             }`}
    //             onClick={toggleWithdraw}
    //             disabled={depositLoading}
    //           >
    //             <Typography variant="h5">Withdraw</Typography>
    //             <div className={`${activeTab === 'withdraw' ? classes.activeIcon : ''}`}></div>
    //           </Paper>
    //         </Grid>
    //       </Grid>
    //     </div>
    //     <div className={classes.titleSection}>
    //       <Tooltip title="Back to Liquidity" placement="top">
    //         <IconButton className={classes.backButton} onClick={onBack}>
    //           <ArrowBackIcon className={classes.backIcon} />
    //         </IconButton>
    //       </Tooltip>
    //       <Typography className={classes.titleText}>Manage Liquidity Pair</Typography>
    //     </div>
    //     <div className={classes.reAddPadding}>
    //       <div className={classes.inputsContainer}>
    //         {activeTab === 'deposit' && (
    //           <>
    //             {renderMassiveInput(
    //               'amount0',
    //               amount0,
    //               amount0Error,
    //               amount0Changed,
    //               asset0,
    //               null,
    //               assetOptions,
    //               onAssetSelect,
    //               amount0Focused,
    //               amount0Ref
    //             )}
    //             <div className={classes.swapIconContainer}>
    //               <div className={classes.swapIconSubContainer}>
    //                 <AddIcon className={classes.swapIcon} />
    //               </div>
    //             </div>
    //             {renderMassiveInput(
    //               'amount1',
    //               amount1,
    //               amount1Error,
    //               amount1Changed,
    //               asset1,
    //               null,
    //               assetOptions,
    //               onAssetSelect,
    //               amount1Focused,
    //               amount1Ref
    //             )}
    //             {renderMediumInputToggle('stable', stable)}
    //             {renderTokenSelect()}
    //             {renderDepositInformation()}
    //           </>
    //         )}
    //         {activeTab === 'withdraw' && (
    //           <>
    //             {renderMassiveInput(
    //               'withdraw',
    //               withdrawAmount,
    //               withdrawAmountError,
    //               withdrawAmountChanged,
    //               withdrawAsset,
    //               null,
    //               withdrawAassetOptions,
    //               onAssetSelect,
    //               null,
    //               null
    //             )}
    //             <div className={classes.swapIconContainer}>
    //               <div className={classes.swapIconSubContainer}>
    //                 <ArrowDownwardIcon className={classes.swapIcon} />
    //               </div>
    //             </div>
    //             <div className={classes.receiveAssets}>
    //               {renderMediumInput('withdrawAmount0', withdrawAmount0, pair?.token0?.logoURI, pair?.token0?.symbol)}
    //               {renderMediumInput('withdrawAmount1', withdrawAmount1, pair?.token1?.logoURI, pair?.token1?.symbol)}
    //             </div>
    //             {renderWithdrawInformation()}
    //           </>
    //         )}
    //       </div>
    //       <div className={classes.advancedToggleContainer}>
    //         <FormControlLabel
    //           control={<Switch size="small" checked={advanced} onChange={toggleAdvanced} color={'primary'} />}
    //           className={classes.some}
    //           label="Advanced"
    //           labelPlacement="start"
    //         />
    //       </div>
    //       {activeTab === 'deposit' && (
    //         <div className={classes.actionsContainer}>
    //           {pair == null && asset0 && asset0.isWhitelisted == true && asset1 && asset1.isWhitelisted == true && (
    //             <>
    //               <Button
    //                 variant="contained"
    //                 size="large"
    //                 className={createLoading || depositLoading ? classes.multiApprovalButton : classes.buttonOverride}
    //                 color="primary"
    //                 disabled={createLoading || depositLoading}
    //                 onClick={onCreateAndStake}
    //               >
    //                 <Typography className={classes.actionButtonText}>
    //                   {createLoading ? `Creating` : `Create Pair & Stake`}
    //                 </Typography>
    //                 {createLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //               </Button>
    //               {advanced && (
    //                 <>
    //                   <Button
    //                     variant="contained"
    //                     size="large"
    //                     className={
    //                       createLoading || depositLoading ? classes.multiApprovalButton : classes.buttonOverride
    //                     }
    //                     color="primary"
    //                     disabled={createLoading || depositLoading}
    //                     onClick={onCreateAndDeposit}
    //                   >
    //                     <Typography className={classes.actionButtonText}>
    //                       {depositLoading ? `Depositing` : `Create Pair & Deposit`}
    //                     </Typography>
    //                     {depositLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                   </Button>
    //                 </>
    //               )}
    //             </>
    //           )}
    //           {pair == null && !(asset0 && asset0.isWhitelisted == true && asset1 && asset1.isWhitelisted == true) && (
    //             <>
    //               <Button
    //                 variant="contained"
    //                 size="large"
    //                 className={createLoading || depositLoading ? classes.multiApprovalButton : classes.buttonOverride}
    //                 color="primary"
    //                 disabled={createLoading || depositLoading}
    //                 onClick={onCreateAndDeposit}
    //               >
    //                 <Typography className={classes.actionButtonText}>
    //                   {depositLoading ? `Depositing` : `Create Pair & Deposit`}
    //                 </Typography>
    //                 {depositLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //               </Button>
    //             </>
    //           )}
    //           {
    //             // There is no Gauge on the pair yet. Can only deposit
    //             pair && !(pair && pair.gauge && pair.gauge.address) && (
    //               <>
    //                 <Button
    //                   variant="contained"
    //                   size="large"
    //                   className={
    //                     (amount0 === '' && amount1 === '') || depositLoading || stakeLoading || depositStakeLoading
    //                       ? classes.multiApprovalButton
    //                       : classes.buttonOverride
    //                   }
    //                   color="primary"
    //                   disabled={
    //                     (amount0 === '' && amount1 === '') || depositLoading || stakeLoading || depositStakeLoading
    //                   }
    //                   onClick={onDeposit}
    //                 >
    //                   <Typography className={classes.actionButtonText}>
    //                     {depositLoading ? `Depositing` : `Deposit`}
    //                   </Typography>
    //                   {depositLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                 </Button>
    //                 {pair.token0.isWhitelisted && pair.token1.isWhitelisted && (
    //                   <Button
    //                     variant="contained"
    //                     size="large"
    //                     className={
    //                       createLoading || depositLoading || stakeLoading || depositStakeLoading
    //                         ? classes.multiApprovalButton
    //                         : classes.buttonOverride
    //                     }
    //                     color="primary"
    //                     disabled={createLoading || depositLoading || stakeLoading || depositStakeLoading}
    //                     onClick={onCreateGauge}
    //                   >
    //                     <Typography className={classes.actionButtonText}>
    //                       {createLoading ? `Creating` : `Create Gauge`}
    //                     </Typography>
    //                     {createLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                   </Button>
    //                 )}
    //               </>
    //             )
    //           }
    //           {
    //             // There is a Gauge on the pair. Can deposit and stake
    //             pair && pair && pair.gauge && pair.gauge.address && (
    //               <>
    //                 <Button
    //                   variant="contained"
    //                   size="large"
    //                   className={
    //                     (amount0 === '' && amount1 === '') || depositLoading || stakeLoading || depositStakeLoading
    //                       ? classes.multiApprovalButton
    //                       : classes.buttonOverride
    //                   }
    //                   color="primary"
    //                   disabled={
    //                     (amount0 === '' && amount1 === '') || depositLoading || stakeLoading || depositStakeLoading
    //                   }
    //                   onClick={onDepositAndStake}
    //                 >
    //                   <Typography className={classes.actionButtonText}>
    //                     {depositStakeLoading ? `Depositing` : `Deposit & Stake`}
    //                   </Typography>
    //                   {depositStakeLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                 </Button>
    //                 {advanced && (
    //                   <>
    //                     <Button
    //                       variant="contained"
    //                       size="large"
    //                       className={
    //                         (amount0 === '' && amount1 === '') || depositLoading || stakeLoading || depositStakeLoading
    //                           ? classes.multiApprovalButton
    //                           : classes.buttonOverride
    //                       }
    //                       color="primary"
    //                       disabled={
    //                         (amount0 === '' && amount1 === '') || depositLoading || stakeLoading || depositStakeLoading
    //                       }
    //                       onClick={onDeposit}
    //                     >
    //                       <Typography className={classes.actionButtonText}>
    //                         {depositLoading ? `Depositing` : `Deposit LP`}
    //                       </Typography>
    //                       {depositLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                     </Button>
    //                     <Button
    //                       variant="contained"
    //                       size="large"
    //                       className={
    //                         BigNumber(pair.balance).eq(0) || depositLoading || stakeLoading || depositStakeLoading
    //                           ? classes.multiApprovalButton
    //                           : classes.buttonOverride
    //                       }
    //                       color="primary"
    //                       disabled={
    //                         BigNumber(pair.balance).eq(0) || depositLoading || stakeLoading || depositStakeLoading
    //                       }
    //                       onClick={onStake}
    //                     >
    //                       <Typography className={classes.actionButtonText}>
    //                         {BigNumber(pair.balance).gt(0)
    //                           ? stakeLoading
    //                             ? `Staking`
    //                             : `Stake ${formatCurrency(pair.balance)} LP`
    //                           : `Nothing Unstaked`}
    //                       </Typography>
    //                       {stakeLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                     </Button>
    //                   </>
    //                 )}
    //               </>
    //             )
    //           }
    //         </div>
    //       )}
    //       {activeTab === 'withdraw' && (
    //         <div className={classes.actionsContainer}>
    //           {!(pair && pair.gauge && pair.gauge.address) && (
    //             <Button
    //               variant="contained"
    //               size="large"
    //               color="primary"
    //               className={
    //                 depositLoading || withdrawAmount === '' ? classes.multiApprovalButton : classes.buttonOverride
    //               }
    //               disabled={depositLoading || withdrawAmount === ''}
    //               onClick={onWithdraw}
    //             >
    //               <Typography className={classes.actionButtonText}>
    //                 {depositLoading ? `Withdrawing` : `Withdraw`}
    //               </Typography>
    //               {depositLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //             </Button>
    //           )}
    //           {pair && pair.gauge && pair.gauge.address && (
    //             <>
    //               <Button
    //                 variant="contained"
    //                 size="large"
    //                 color="primary"
    //                 className={
    //                   depositLoading || stakeLoading || depositStakeLoading || withdrawAmount === ''
    //                     ? classes.multiApprovalButton
    //                     : classes.buttonOverride
    //                 }
    //                 disabled={depositLoading || stakeLoading || depositStakeLoading || withdrawAmount === ''}
    //                 onClick={onUnstakeAndWithdraw}
    //               >
    //                 <Typography className={classes.actionButtonText}>
    //                   {depositStakeLoading ? `Withdrawing` : `Unstake and Withdraw`}
    //                 </Typography>
    //                 {depositStakeLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //               </Button>
    //               {advanced && (
    //                 <>
    //                   <Button
    //                     variant="contained"
    //                     size="large"
    //                     className={
    //                       withdrawAmount === '' || depositLoading || stakeLoading || depositStakeLoading
    //                         ? classes.multiApprovalButton
    //                         : classes.buttonOverride
    //                     }
    //                     color="primary"
    //                     disabled={withdrawAmount === '' || depositLoading || stakeLoading || depositStakeLoading}
    //                     onClick={onUnstake}
    //                   >
    //                     <Typography className={classes.actionButtonText}>
    //                       {stakeLoading ? `Unstaking` : `Unstake LP`}
    //                     </Typography>
    //                     {stakeLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                   </Button>
    //                   <Button
    //                     variant="contained"
    //                     size="large"
    //                     className={
    //                       BigNumber(pair.balance).eq(0) || depositLoading || stakeLoading || depositStakeLoading
    //                         ? classes.multiApprovalButton
    //                         : classes.buttonOverride
    //                     }
    //                     color="primary"
    //                     disabled={
    //                       BigNumber(pair.balance).eq(0) || depositLoading || stakeLoading || depositStakeLoading
    //                     }
    //                     onClick={onWithdraw}
    //                   >
    //                     <Typography className={classes.actionButtonText}>
    //                       {BigNumber(pair.balance).gt(0)
    //                         ? depositLoading
    //                           ? `Withdrawing`
    //                           : `Withdraw ${formatCurrency(pair.balance)} LP`
    //                         : `Nothing Unstaked`}
    //                     </Typography>
    //                     {depositLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //                   </Button>
    //                 </>
    //               )}
    //             </>
    //           )}
    //         </div>
    //       )}
    //     </div>
    //   </Paper>
    // </div>
  )
}
