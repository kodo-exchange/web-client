import { useState, useEffect } from 'react'
import { Typography, Button, TextField, CircularProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import { formatCurrency } from '../../utils'
import classes from './ssVest.module.css'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'
import Image from 'next/image'

export default function LockAmount({ nft, govToken, updateLockAmount }) {
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [lockLoading, setLockLoading] = useState(false)

  const [amount, setAmount] = useState('0')
  const [amountError, setAmountError] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const lockReturned = () => {
      setLockLoading(false)
      // router.push('/vest')
    }

    const errorReturned = () => {
      setApprovalLoading(false)
      setLockLoading(false)
    }

    updateLockAmount('0')

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.INCREASE_VEST_AMOUNT_RETURNED, lockReturned)
    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.INCREASE_VEST_AMOUNT_RETURNED, lockReturned)
    }
  }, [])

  const setAmountPercent = (percent) => {
    let val
    if (percent === 0) {
      val = '0'
    } else {
      val = BigNumber(govToken.balance).times(percent).div(100).toFixed(govToken.decimals)
    }
    setAmount(val)
    updateLockAmount(val)
  }

  const onLock = () => {
    setAmountError(false)

    let error = false

    if (!amount || amount === '' || isNaN(amount)) {
      setAmountError('Amount is required')
      error = true
    } else {
      if (!govToken.balance || isNaN(govToken.balance) || BigNumber(govToken.balance).lte(0)) {
        setAmountError('Invalid balance')
        error = true
      } else if (BigNumber(amount).lte(0)) {
        setAmountError('Invalid amount')
        error = true
      } else if (govToken && BigNumber(amount).gt(govToken.balance)) {
        setAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if (!error) {
      setLockLoading(true)
      stores.dispatcher.dispatch({ type: ACTIONS.INCREASE_VEST_AMOUNT, content: { amount, tokenID: nft.id } })
    }
  }

  const amountChanged = (event) => {
    setAmountError(false)
    setAmount(event.target.value)
    updateLockAmount(event.target.value)
  }

  const renderMassiveInput = (type, amountValue, amountError, amountChanged, balance, logo) => {
    return (
      <div className={classes.textField}>
        <div className={classes.inputTitleContainer}>
          <div className={classes.inputBalance}>
            <Typography
              className={classes.inputBalanceText}
              noWrap
              onClick={() => {
                setAmountPercent(100)
              }}
            >
              Balance: {balance ? ' ' + formatCurrency(balance) : ''}
            </Typography>
          </div>
        </div>
        <div className={`${classes.massiveInputContainer} ${amountError && classes.error}`}>
          <div className={classes.massiveInputAssetSelect}>
            <div className={classes.displaySelectContainer}>
              <div className={classes.assetSelectMenuItem}>
                <div className={classes.displayDualIconContainer}>
                  {logo && (
                    <img
                      className={classes.displayAssetIcon}
                      alt=""
                      src={logo}
                      height="100px"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/tokens/unknown-logo.png'
                      }}
                    />
                    // <Image
                    //   src={logo ? `${logo}` : '/tokens/unknown-logo.png'}
                    //   alt=""
                    //   width={100}
                    //   height={100}
                    //   className={classes.displayAssetIcon}
                    //   onError={(e) => {
                    //     e.target.onerror = null
                    //     e.target.src = '/tokens/unknown-logo.png'
                    //   }}
                    // />
                  )}
                  {!logo && (
                    <img
                      className={classes.displayAssetIcon}
                      alt=""
                      src={'/tokens/unknown-logo.png'}
                      height="100px"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/tokens/unknown-logo.png'
                      }}
                    />
                    // <Image
                    //   src="/tokens/unknown-logo.png"
                    //   alt=""
                    //   width={100}
                    //   height={100}
                    //   className={classes.displayAssetIcon}
                    //   onError={(e) => {
                    //     e.target.onerror = null
                    //     e.target.src = '/tokens/unknown-logo.png'
                    //   }}
                    // />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.massiveInputAmount}>
            <TextField
              placeholder="0.00"
              fullWidth
              error={amountError}
              helperText={amountError}
              value={amountValue}
              onChange={amountChanged}
              disabled={lockLoading}
              InputProps={{
                className: classes.largeInput,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="text-xl mb-4">Increase lock amount</div>
      <div className="mb-6">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row flex-wrap items-center justify-between gap-y-2 text-sm">
            <div className="pr-2">
              <span className="text-text-gray">{`Locked: ${
                nft?.lockAmount ? formatCurrency(nft.lockAmount, 4) : formatCurrency(0, 4)
              } KODO`}</span>
            </div>
            <span className="text-text-gray">{`Wallet: ${
              govToken?.balance ? formatCurrency(govToken.balance, 3) : formatCurrency(0, 3)
            }`}</span>
          </div>
          <div className="overflow-hidden rounded-xl bg-table-dark border border-border pr-2 focus-within:border-pink-primary transition-colors duration-300">
            <div className="flex flex-row items-center">
              <input
                className="flex h-12 w-full px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 grow rounded-xl shadow-none ring-offset-shaded bg-transparent border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 focus-within:border-0 focus-within:ring-0 focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-text-unselected"
                type="text"
                placeholder="0"
                value={amount}
                onChange={amountChanged}
                disabled={lockLoading}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="text-red-500/85 text-sm">{amountError || ''}</div>
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
                      setAmountPercent(item.value)
                    }}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
            disabled={lockLoading}
            onClick={onLock}
          >
            {lockLoading ? `Increasing lock amount` : `Increase lock amount`}
          </button>
        </div>
      </div>
    </>
    // <div className={classes.someContainer}>
    //   <div className={classes.inputsContainer3}>
    //     {renderMassiveInput('lockAmount', amount, amountError, amountChanged, govToken?.balance, govToken?.logoURI)}
    //   </div>
    //   <div className={classes.actionsContainer3}>
    //     <Button
    //       className={classes.buttonOverride}
    //       fullWidth
    //       variant="contained"
    //       size="large"
    //       color="primary"
    //       disabled={lockLoading}
    //       onClick={onLock}
    //     >
    //       <Typography className={classes.actionButtonText}>
    //         {lockLoading ? `Increasing Lock Amount` : `Increase Lock Amount`}
    //       </Typography>
    //       {lockLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //     </Button>
    //   </div>
    // </div>
  )
}
