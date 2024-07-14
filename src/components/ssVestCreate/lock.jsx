import React, { useState, useEffect, useRef } from 'react'
// import { Typography, TextField } from '@material-ui/core'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { formatCurrency } from '../../utils'
// import classes from './ssVest.module.css'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

import VestingInfo from './vestingInfo'

import { ArrowLongRightIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
// import { LockClosedIcon } from '@heroicons/react/24/outline'

// import DatePicker from 'tailwind-datepicker-react'
// import { Range, getTrackBackground } from 'react-range'
import Slider from 'rc-slider'

const SliderTooltip = ({ value, theme = {} }) => {
  const themeTooltip = {
    ...theme,
    color: '#FD009C',
    fontSize: '12px',
    whiteSpace: theme.whiteSpace || 'nowrap',
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
  }

  const percentage = ((value / (3600 * 24 * 365 * 4)) * 100).toFixed(2) + '%'

  return <div style={themeTooltip}>{percentage}</div>
}

export default function Lock({ govToken, veToken }) {
  // const inputEl = useRef(null)
  const router = useRouter()

  const [lockLoading, setLockLoading] = useState(false)

  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState(false)
  // const [selectedValue, setSelectedValue] = useState('week')

  // const [selectedDateError, setSelectedDateError] = useState(false)

  const [slideValues, setSlideValues] = useState([3600 * 24 * 365 * 4])
  const initialDate = moment().add(slideValues[0], 'seconds')
  const initialTimestamp = Math.floor(initialDate.unix() / (3600 * 24 * 7)) * (3600 * 24 * 7)
  const [selectedDate, setSelectedDate] = useState(moment.unix(initialTimestamp).format('MMMM Do, YYYY'))

  const [value, setValue] = useState(3)

  useEffect(() => {
    const lockReturned = () => {
      setLockLoading(false)
      router.push('/lock')
    }
    const errorReturned = () => {
      setLockLoading(false)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.CREATE_VEST_RETURNED, lockReturned)
    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.CREATE_VEST_RETURNED, lockReturned)
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
  }

  // const handleDateChange = (event) => {
  //   setSelectedDate(event.target.value)
  //   setSelectedValue(null)
  // }

  const handleSlideChange = (values) => {
    setSlideValues(values)
    const date = moment().add(values[0], 'seconds')
    const timestamp = Math.floor(date.unix() / (3600 * 24 * 7)) * (3600 * 24 * 7)
    setSelectedDate(moment.unix(timestamp).format('MMMM Do, YYYY'))
    // const duration = moment.unix(timestamp).fromNow()
    // console.log(duration) // output duration
  }

  const handleSlideButtonClicked = (value) => {
    setSlideValues([value])
    const date = moment().add(value, 'seconds')
    const timestamp = Math.floor(date.unix() / (3600 * 24 * 7)) * (3600 * 24 * 7)
    setSelectedDate(moment.unix(timestamp).format('MMMM Do, YYYY'))
    // const duration = moment.unix(timestamp).fromNow()
    // console.log(duration) // output duration
  }

  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value)

  //   let days = 0
  //   switch (event.target.value) {
  //     case 'week':
  //       days = 7
  //       break
  //     case 'month':
  //       days = 30
  //       break
  //     case 'year':
  //       days = 365
  //       break
  //     case 'years':
  //       days = 1460
  //       break
  //     default:
  //   }
  //   const newDate = moment().add(days, 'days').format('YYYY-MM-DD')

  //   setSelectedDate(newDate)
  // }

  const calculateVotingPower = () => {
    if (!amount || amount === '' || isNaN(amount)) {
      return '0.000'
    } else {
      const votingPower = BigNumber(amount)
        .times(slideValues[0])
        .dividedBy(3600 * 24 * 365 * 4)
        .toFixed(3)

      return votingPower
    }
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

      // const now = moment()
      // const expiry = moment(selectedDate).add(1, 'days')
      // const secondsToExpire = expiry.diff(now, 'seconds')
      const secondsToExpire = slideValues[0]

      stores.dispatcher.dispatch({ type: ACTIONS.CREATE_VEST, content: { amount, unlockTime: secondsToExpire } })
    }
  }

  // const focus = () => {
  //   inputEl.current.focus()
  // }

  const onAmountChanged = (event) => {
    setAmountError(false)
    setAmount(event.target.value)
  }

  // const renderMassiveDateInput = (type, amountValue, amountError, amountChanged, balance, logo) => {
  //   return (
  //     <div className={classes.textField}>
  //       <div className={`${classes.massiveInputContainer} ${amountError && classes.error}`}>
  //         <div className={classes.massiveInputAssetSelect}>
  //           <div className={classes.displaySelectContainer}>
  //             <div className={classes.assetSelectMenuItem}>
  //               <div className={classes.displayDualIconContainer}>
  //                 <div className={classes.displayAssetIcon} onClick={focus}></div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <div className={classes.massiveInputAmount}>
  //           <TextField
  //             inputRef={inputEl}
  //             id="someDate"
  //             type="date"
  //             placeholder="Expiry Date"
  //             fullWidth
  //             error={amountError}
  //             helperText={amountError}
  //             value={amountValue}
  //             onChange={amountChanged}
  //             disabled={lockLoading}
  //             inputProps={{
  //               min: moment().add(7, 'days').format('YYYY-MM-DD'),
  //               max: moment().add(1460, 'days').format('YYYY-MM-DD'),
  //             }}
  //             InputProps={{
  //               className: classes.largeInput,
  //               shrink: true,
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderMassiveInput = (type, amountValue, amountError, amountChanged, token) => {
  //   return (
  //     <div className={classes.textField}>
  //       <div className={classes.inputTitleContainer}>
  //         <div className={classes.inputBalance}>
  //           <Typography
  //             className={classes.inputBalanceText}
  //             noWrap
  //             onClick={() => {
  //               setAmountPercent(100)
  //             }}
  //           >
  //             Balance: {token && token.balance ? ' ' + formatCurrency(token.balance) : ''}
  //           </Typography>
  //         </div>
  //       </div>
  //       <div className={`${classes.massiveInputContainer} ${amountError && classes.error}`}>
  //         <div className={classes.massiveInputAssetSelect}>
  //           <div className={classes.displaySelectContainer}>
  //             <div className={classes.assetSelectMenuItem}>
  //               <div className={classes.displayDualIconContainer}>
  //                 {token && token.logoURI && (
  //                   <img
  //                     className={classes.displayAssetIcon}
  //                     alt=""
  //                     src={token.logoURI}
  //                     height="100px"
  //                     onError={(e) => {
  //                       e.target.onerror = null
  //                       e.target.src = '/tokens/unknown-logo.png'
  //                     }}
  //                   />
  //                 )}
  //                 {!(token && token.logoURI) && (
  //                   <img
  //                     className={classes.displayAssetIcon}
  //                     alt=""
  //                     src={'/tokens/unknown-logo.png'}
  //                     height="100px"
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
  //         <div className={classes.massiveInputAmount}>
  //           <TextField
  //             placeholder="0.00"
  //             fullWidth
  //             error={amountError}
  //             helperText={amountError}
  //             value={amountValue}
  //             onChange={amountChanged}
  //             disabled={lockLoading}
  //             InputProps={{
  //               className: classes.largeInput,
  //             }}
  //           />
  //           <Typography color="textSecondary" className={classes.smallerText}>
  //             {token?.symbol}
  //           </Typography>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderVestInformation = () => {
  //   const now = moment()
  //   const expiry = moment(selectedDate)
  //   const dayToExpire = expiry.diff(now, 'days')

  //   const tmpNFT = {
  //     lockAmount: amount,
  //     lockValue: BigNumber(amount)
  //       .times(parseInt(dayToExpire) + 1)
  //       .div(1460)
  //       .toFixed(18),
  //     lockEnds: expiry.unix(),
  //   }

  //   return <VestingInfo futureNFT={tmpNFT} govToken={govToken} veToken={veToken} showVestingStructure={true} />
  // }

  const onBack = () => {
    router.push('/lock')
  }

  return (
    <>
      <div className="relative w-full flex flex-col items-center justify-center">
        <div className="inline-block text-white pb-2 md:pb-3 lg:pb-4 text-2xl xs:text-4xl sm:text-5xl lg:text-5xl font-bold tracking-normal">
          Create Lock
        </div>
        <div className="hidden md:block text-base leading-6 text-text-gray">
          More tokens locked for longer = greater voting power = higher rewards
        </div>
        <div className="flex flex-col md:hidden text-base leading-6 text-text-gray">
          <div>More tokens locked for longer </div>
          <div className="pl-4">= greater voting power </div>
          <div className="pl-4">= higher rewards</div>
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
      <div className="flex flex-col items-center w-full pb-8 pt-6">
        <div className="rounded-[20px] border border-border bg-gradient-primary text-white shadow-sm max-w-[540px] space-y-4 w-full">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-xl font-semibold leading-none tracking-tight mt-4 mb-2">
              <div className="flex flex-row justify-between">Create Lock</div>
            </h3>
            <p className="text-sm text-text-gray">Lock KODO into a veKODO NFT to vote, receive bribes &amp; fees</p>
          </div>
          <div className="p-6 pt-0 mb-4">
            <div className="mb-8">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-row flex-wrap items-center justify-between gap-y-2 text-sm">
                  <div className="pr-2">
                    <span className="text-text-gray">KODO</span>
                  </div>
                  <div className="text-text-gray">
                    {`Wallet: ${govToken?.balance ? formatCurrency(govToken.balance, 3) : formatCurrency(0, 3)}`}
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl bg-table-dark border border-border pr-2 focus-within:border-pink-primary transition-colors duration-300">
                  <div className="flex flex-row items-center">
                    <input
                      className="flex h-12 w-full px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 grow rounded-xl shadow-none ring-offset-shaded bg-transparent border-0 border-transparent rounded-l-none ring-offset-0 pl-4 text-lg leading-6 ring-0 focus-within:border-0 focus-within:ring-0 focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-text-unselected"
                      type="text"
                      placeholder="0"
                      value={amount}
                      onChange={onAmountChanged}
                      disabled={lockLoading}
                    />
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
                          className="inline-flex items-center justify-center font-medium transition-colors duration-300 border border-border hover:border-pink-primary hover:text-pink-primary hover:bg-bg-highlight h-7 px-2 text-xs rounded-md"
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
            </div>
            <div className="mt-10 mb-4">
              <div className="flex flex-row items-center gap-2 mr-2 text-sm ">
                {/* <LockClosedIcon className="w-5 h-5 text-blue-gray-400" /> */}
                {/* <span className="text-blue-gray-400">Lock Expires</span> */}
                <span className="text-text-gray">Locked until</span>
                <span className="text-white">{selectedDate}</span>
              </div>
              <div className="mt-8 mb-2 px-4">
                <Slider
                  defaultValue={slideValues[0]}
                  value={slideValues[0]}
                  onChange={(values) => handleSlideChange([values])}
                  min={3600 * 24 * 7}
                  max={3600 * 24 * 365 * 4}
                  step={3600 * 24 * 7}
                  handleRender={(renderProps) => {
                    return (
                      <div {...renderProps.props}>
                        <SliderTooltip value={slideValues[0]} />
                      </div>
                    )
                  }}
                  styles={{
                    track: {
                      background: '#FD009C',
                      height: 7,
                    },
                    rail: {
                      background: '#724360',
                      height: 7,
                    },
                    handle: {
                      background: '#FD009C',
                      borderRadius: '50%',
                      height: 24,
                      width: 24,
                      opacity: 1,
                      marginTop: -9,
                    },
                  }}
                />
                {/* <Range
                  step={3600 * 24 * 7}
                  min={3600 * 24 * 7}
                  max={3600 * 24 * 365 * 4}
                  values={slideValues}
                  onChange={(values) => handleSlideChange(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      className="px-4"
                      style={{ ...props.style }}
                    >
                      <div
                        key={'track'}
                        ref={props.ref}
                        className="h-[9px] w-full rounded-full self-center border border-border"
                        style={{
                          background: getTrackBackground({
                            values: slideValues,
                            colors: ['#FD009C', '#724360'], // blue-500, blue-gray-400
                            min: 3600 * 24 * 7,
                            max: 3600 * 24 * 365 * 4,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  )}
                  renderThumb={({ key, isDragged, ...props }) => (
                    <div
                      key={key}
                      {...props}
                      className="w-6 h-6 bg-pink-primary rounded-full focus:outline-none flex items-center justify-center text-xs text-white hover:shadow-md hover:shadow-pink-primary"
                      style={{ ...props.style }}
                    >
                      <span className="absolute text-xs text-pink-primary -top-5">
                        {((slideValues[0] / (3600 * 24 * 365 * 4)) * 100).toFixed(2) + '%'}
                      </span>
                    </div>
                  )}
                /> */}
              </div>
              <div className="flex justify-between text-xs mt-5 text-text-gray ">
                <button className="hover:text-white" onClick={() => handleSlideButtonClicked(1 * 7 * 24 * 60 * 60)}>
                  <span className="sm:hidden">1 Wk</span>
                  <span className="hidden sm:flex">1 Week</span>
                </button>
                <button className="hover:text-white" onClick={() => handleSlideButtonClicked(1 * 365 * 24 * 60 * 60)}>
                  <span className="sm:hidden">1 Yr</span>
                  <span className="hidden sm:flex">1 Year</span>
                </button>
                <button className="hover:text-white" onClick={() => handleSlideButtonClicked(2 * 365 * 24 * 60 * 60)}>
                  <span className="sm:hidden">2 Yrs</span>
                  <span className="hidden sm:flex">2 Years</span>
                </button>
                <button className="hover:text-white" onClick={() => handleSlideButtonClicked(3 * 365 * 24 * 60 * 60)}>
                  <span className="sm:hidden">3 Yrs</span>
                  <span className="hidden sm:flex">3 Years</span>
                </button>
                <button className="hover:text-white" onClick={() => handleSlideButtonClicked(4 * 365 * 24 * 60 * 60)}>
                  <span className="sm:hidden">4 Yrs</span>
                  <span className="hidden sm:flex">4 Years</span>
                </button>
              </div>
            </div>
            <div className="bg-bg-light mt-12 rounded-xl p-4">
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-text-gray">Your voting power will be:</div>
                <div className="text-lg">{`${calculateVotingPower()} veKODO`}</div>
              </div>
            </div>
          </div>
          <div className="items-center p-6 pt-0 flex justify-end">
            <button
              className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/85 text-white h-10 py-2 px-4 rounded-md"
              disabled={lockLoading}
              onClick={onLock}
            >
              {lockLoading ? `Locking` : `Lock`}
            </button>
          </div>
        </div>
        <div className="grow flex flex-col gap-4 mt-8">
          {/* <div className="max-w-[540px] rounded-xl bg-orange-500/95 text-sm p-4 mb-2">
            Locking will give you an NFT, referred to as a veNFT. You can increase the Lock amount or extend the Lock
            time at any point after.
          </div> */}
          <div className="flex flex-row gap-3 max-w-[540px] rounded-[20px] border border-border bg-gradient-primary text-sm text-text-gray p-6">
            <div>
              <ExclamationTriangleIcon className="h-6 w-6 text-current" />
            </div>
            <div className=" whitespace-break-spaces">
              Locking will give you an NFT, referred to as a veNFT. You can increase the Lock amount or extend the Lock
              time at any point after.
            </div>
          </div>
        </div>
      </div>
    </>
    // <>
    //   <Paper elevation={0} className={classes.container3}>
    //     <div className={classes.titleSection}>
    //       <Tooltip title="Back to Vest" placement="top">
    //         <IconButton className={classes.backButton} onClick={onBack}>
    //           <ArrowBackIcon className={classes.backIcon} />
    //         </IconButton>
    //       </Tooltip>
    //       <Typography className={classes.titleText}>Create New Lock</Typography>
    //     </div>
    //     {renderMassiveInput('amount', amount, amountError, onAmountChanged, govToken)}
    //     <div>
    //       {renderMassiveDateInput(
    //         'date',
    //         selectedDate,
    //         selectedDateError,
    //         handleDateChange,
    //         govToken?.balance,
    //         govToken?.logoURI
    //       )}
    //       <div className={classes.inline}>
    //         <Typography className={classes.expiresIn}>Expires: </Typography>
    //         <RadioGroup className={classes.vestPeriodToggle} row onChange={handleChange} value={selectedValue}>
    //           <FormControlLabel
    //             className={classes.vestPeriodLabel}
    //             value="week"
    //             control={<Radio color="primary" />}
    //             label="1 week"
    //             labelPlacement="left"
    //           />
    //           <FormControlLabel
    //             className={classes.vestPeriodLabel}
    //             value="month"
    //             control={<Radio color="primary" />}
    //             label="1 month"
    //             labelPlacement="left"
    //           />
    //           <FormControlLabel
    //             className={classes.vestPeriodLabel}
    //             value="year"
    //             control={<Radio color="primary" />}
    //             label="1 year"
    //             labelPlacement="left"
    //           />
    //           <FormControlLabel
    //             className={classes.vestPeriodLabel}
    //             value="years"
    //             control={<Radio color="primary" />}
    //             label="4 years"
    //             labelPlacement="left"
    //           />
    //         </RadioGroup>
    //       </div>
    //     </div>
    //     {renderVestInformation()}
    //     <div className={classes.actionsContainer}>
    //       <Button
    //         className={classes.buttonOverride}
    //         fullWidth
    //         variant="contained"
    //         size="large"
    //         color="primary"
    //         disabled={lockLoading}
    //         onClick={onLock}
    //       >
    //         <Typography className={classes.actionButtonText}>{lockLoading ? `Locking` : `Lock`}</Typography>
    //         {lockLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //       </Button>
    //     </div>
    //   </Paper>
    //   <br />
    //   <br />
    // </>
  )
}
