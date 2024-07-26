import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Typography } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { formatCurrency, formatTokenBalance } from '../../utils'
import classes from './ssBribeCreate.module.css'

import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'
// import Image from 'next/image'

import { Dialog, Transition } from '@headlessui/react'

import AssetSelect from './AssetSelect'
import GaugeSelect from './GaugeSelect'

export default function BribeCreate() {
  const router = useRouter()
  const [createLoading, setCreateLoading] = useState(false)

  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState(false)
  const [asset, setAsset] = useState(null)
  const [assetOptions, setAssetOptions] = useState([])
  const [gauge, setGauge] = useState(null)
  const [gaugeOptions, setGaugeOptions] = useState([])

  const [open, setOpen] = useState(false)

  const ssUpdated = async () => {
    const storeAssetOptions = stores.stableSwapStore.getStore('baseAssets')
    let filteredStoreAssetOptions = storeAssetOptions.filter((option) => {
      return option.address !== 'ETH'
    })
    const storePairs = stores.stableSwapStore.getStore('pairs')
    setAssetOptions(filteredStoreAssetOptions)
    setGaugeOptions(storePairs)

    if (filteredStoreAssetOptions.length > 0 && asset == null) {
      setAsset(filteredStoreAssetOptions[0])
    }

    // Intentionally commented out, by DrumMaster
    // if (storePairs.length > 0 && gauge == null) {
    //   setGauge(storePairs[0])
    // }
  }

  useEffect(() => {
    const createReturned = (res) => {
      setCreateLoading(false)
      setAmount('')

      // onBack() // comment this out, by DrumMaster
    }

    const errorReturned = () => {
      setCreateLoading(false)
    }

    const assetsUpdated = () => {
      const baseAsset = stores.stableSwapStore.getStore('baseAssets')
      let filteredStoreAssetOptions = baseAsset.filter((option) => {
        return option.address !== 'ETH'
      })
      setAssetOptions(filteredStoreAssetOptions)
    }

    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    stores.emitter.on(ACTIONS.BRIBE_CREATED, createReturned)
    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)

    ssUpdated()

    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
      stores.emitter.removeListener(ACTIONS.BRIBE_CREATED, createReturned)
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)
    }
  }, [])

  const setAmountPercent = (input, percent) => {
    setAmountError(false)
    if (input === 'amount') {
      if (asset.balance) {
        let am = BigNumber(asset.balance).times(percent).div(100).toFixed(asset.decimals)
        setAmount(am)
      }
    }
  }

  const onCreate = () => {
    setAmountError(false)

    let error = false

    if (!amount || amount === '' || isNaN(amount)) {
      setAmountError('Bribe amount is required')
      error = true
    } else {
      if (!asset.balance || isNaN(asset.balance) || BigNumber(asset.balance).lte(0)) {
        setAmountError('Invalid balance')
        error = true
      } else if (BigNumber(amount).lt(0)) {
        setAmountError('Invalid amount')
        error = true
      } else if (asset && BigNumber(amount).gt(asset.balance)) {
        setAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if (!asset || asset === null) {
      setAmountError('Bribe asset is required')
      error = true
    }

    if (!error) {
      setCreateLoading(true)
      setOpen(true)
      // stores.dispatcher.dispatch({
      //   type: ACTIONS.CREATE_BRIBE,
      //   content: {
      //     asset,
      //     amount,
      //     gauge,
      //   },
      // })
    }
  }

  const onCreateFromDialog = () => {
    setOpen(false)

    stores.dispatcher.dispatch({
      type: ACTIONS.CREATE_BRIBE,
      content: {
        asset,
        amount,
        gauge,
      },
    })
  }

  const amountChanged = (event) => {
    setAmountError(false)
    setAmount(event.target.value)
  }

  const onAssetSelect = (type, value) => {
    setAmountError(false)
    setAsset(value)
  }

  const onGagugeSelect = (type, value) => {
    setGauge(value)
  }

  // ('gauge', gauge, null, gaugeOptions, onGagugeSelect)
  const renderMassiveGaugeInput = (type, value, error, options, onChange) => {
    return (
      <>
        <div className="text-text-gray mb-1 text-sm font-normal">Pair</div>
        <GaugeSelect type={type} value={value} assetOptions={options} onSelect={onChange} />
      </>
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
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row flex-wrap items-center justify-between gap-y-2 text-sm font-normal">
          <div className="pr-2">
            <span className="text-text-gray">Bribe token</span>
          </div>
          <span className="text-text-gray">
            {`Wallet: ${
              assetValue?.balance ? formatTokenBalance(assetValue.symbol, assetValue.balance) : formatCurrency(0)
            }`}
          </span>
        </div>
        <div className="overflow-hidden rounded-[10px] bg-table-dark border border-border pr-4 focus-within:border-pink-primary hover:border-pink-primary transition-colors duration-300">
          <div className="flex flex-row items-center">
            <input
              className="flex h-12 w-full px-3 focus:outline-none rounded-xl shadow-none bg-transparent border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 placeholder:text-text-unselected"
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
          <div className="text-red-500/85 text-xs">{amountError || ''}</div>
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
                  className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
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

  const onBack = () => {
    router.push('/vote')
  }

  const renderCreateInfo = () => {
    return (
      <div className={classes.depositInfoContainer}>
        <Typography className={classes.depositInfoHeading}>
          You are creating a bribe of{' '}
          <span className={classes.highlight}>
            {formatCurrency(amount)} {asset?.symbol}
          </span>{' '}
          to incentivize Vesters to vote for the{' '}
          <span className={classes.highlight}>
            {gauge?.token0?.symbol}/{gauge?.token1?.symbol} Pool
          </span>
        </Typography>
      </div>
    )
  }

  const onClose = () => {
    setCreateLoading(false)
    setOpen(false)
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
              <Dialog.Panel className="fixed grid w-full max-w-lg gap-4 border border-border bg-gradient-primary shadow-lg p-6 opacity-100 rounded-lg">
                {/* <div className="fixed grid w-full max-w-lg gap-4 border border-gray-700/70 bg-table shadow-lg p-6 opacity-100 rounded-lg"> */}
                <div className="flex flex-col space-y-2 text-center sm:text-left text-sm">
                  <div className="mt-4 mb-2 text-lg font-semibold ">Are you absolutely sure?</div>
                  <div className="flex flex-col gap-4">
                    <div className="text-text-gray">
                      <span>You are creating a bribe of </span>
                      <span className="text-text-gray">
                        {formatCurrency(amount)} {asset.symbol}
                      </span>
                      . This is an advanced feature that is normally used by protocols. If you are trying to deposit
                      liquidity in a pool then please use the{' '}
                      <a href="/liquidity">
                        <span className="font-bold text-pink-primary cursor-pointer underline">Liquidity</span>
                      </a>{' '}
                      page instead.
                    </div>
                    <div className="text-sm text-red-500/90">Bribes deposited here are not reimbursable.</div>
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none border border-border hover:bg-pink-primary/90 hover:border-pink-primary/90 h-10 py-2 px-4  rounded-[10px] mt-2 sm:mt-0"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary text-white hover:bg-pink-primary/90 h-10 py-2 px-4 rounded-[10px]"
                    onClick={onCreateFromDialog}
                  >
                    Create bribe
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }

  return (
    <div className="rounded-xl bg-gradient-primary border border-border p-8 flex-1 flex flex-col lg:max-w-lg">
      <div className="mb-6">
        <div className="mb-2 font-semibold text-white text-xl">Create Bribe</div>
        <div className="font-normal text-text-gray text-sm">Pairs with bribes receive more votes and a higher APR</div>
      </div>
      <div className="mb-6">{renderMassiveGaugeInput('gauge', gauge, null, gaugeOptions, onGagugeSelect)}</div>
      <div className="mb-6">
        {renderMassiveInput('amount', amount, amountError, amountChanged, asset, null, assetOptions, onAssetSelect)}
      </div>
      <div>
        <div className="flex flex-col gap-8">
          {gauge && asset && amount && (
            <>
              <div className="bg-bg-light rounded-[10px] px-4 py-3 border border-border">
                <div className="text-text-gray text-sm">
                  You are creating a bribe of{' '}
                  <span className="text-white">
                    {formatCurrency(amount)} {asset.symbol}
                  </span>{' '}
                  to incentivize votes on the <span className="text-white">{gauge.symbol}</span> Pool
                </div>
              </div>
              <div className="flex flex-row justify-end ">
                <button
                  className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
                  disabled={createLoading}
                  onClick={onCreate}
                >
                  {createLoading ? `Creating` : `Create Bribe`}
                </button>
                {renderDialog()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    // <div className={classes.retain}>
    //   <Paper elevation={0} className={classes.container}>
    //     <div className={classes.titleSection}>
    //       <Tooltip placement="top" title="Back to Voting">
    //         <IconButton className={classes.backButton} onClick={onBack}>
    //           <ArrowBackIcon className={classes.backIcon} />
    //         </IconButton>
    //       </Tooltip>
    //       <Typography className={classes.titleText}>Create Bribe</Typography>
    //     </div>
    //     <div className={classes.reAddPadding}>
    //       <div className={classes.inputsContainer}>
    //         {renderMassiveGaugeInput('gauge', gauge, null, gaugeOptions, onGagugeSelect)}
    //         {renderMassiveInput('amount', amount, amountError, amountChanged, asset, null, assetOptions, onAssetSelect)}
    //         {renderCreateInfo()}
    //       </div>
    //       <div className={classes.actionsContainer}>
    //         <Button
    //           variant="contained"
    //           size="large"
    //           className={createLoading ? classes.multiApprovalButton : classes.buttonOverride}
    //           color="primary"
    //           disabled={createLoading}
    //           onClick={onCreate}
    //         >
    //           <Typography className={classes.actionButtonText}>
    //             {createLoading ? `Creating` : `Create Bribe`}
    //           </Typography>
    //           {createLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //         </Button>
    //       </div>
    //     </div>
    //   </Paper>
    // </div>
  )
}
