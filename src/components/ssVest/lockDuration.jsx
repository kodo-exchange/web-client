import { useState, useEffect, useRef } from 'react'
import { Typography, Button, TextField, CircularProgress, RadioGroup, Radio, FormControlLabel } from '@material-ui/core'
import { useRouter } from 'next/router'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import classes from './ssVest.module.css'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

import { LockClosedIcon, CalendarIcon } from '@heroicons/react/24/outline'
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

export default function LockDuration({ nft, updateLockDuration }) {
  const inputEl = useRef(null)
  const [lockLoading, setLockLoading] = useState(false)

  const [selectedDateError, setSelectedDateError] = useState(false)

  const [initialSlideValues, setInitialSlideValues] = useState([3600 * 24 * 7]) // the leftmost value a thumb can take on the slider
  const [slideValues, setSlideValues] = useState([3600 * 24 * 7]) // the current value of the slider

  // const initDate = moment().add(3600 * 24 * 7, 'seconds')
  // const initTimestamp = Math.floor(initDate.unix() / (3600 * 24 * 7)) * (3600 * 24 * 7)
  // const [initialDate, setInitialDate] = useState(moment.unix(initTimestamp).format('MMMM Do, YYYY'))
  const initDate = nft?.lockEnds ? moment.unix(nft.lockEnds).format('MMMM Do, YYYY') : ''
  const [selectedDate, setSelectedDate] = useState(initDate)
  const [curExpiryDate, setCurExpiryDate] = useState(initDate)

  // const router = useRouter()

  useEffect(() => {
    const lockReturned = () => {
      setLockLoading(false)
      // router.push('/vest')
    }
    const errorReturned = () => {
      setLockLoading(false)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.INCREASE_VEST_DURATION_RETURNED, lockReturned)
    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.INCREASE_VEST_DURATION_RETURNED, lockReturned)
    }
  }, [])

  useEffect(() => {
    if (nft && nft.lockEnds) {
      // setSelectedDate(moment.unix(nft.lockEnds).format('YYYY-MM-DD'))
      setCurExpiryDate(moment.unix(nft.lockEnds).format('MMMM Do, YYYY'))

      let diff = nft.lockEnds - moment().unix()
      if (diff > 3600 * 24 * 365 * 4) {
        diff = 3600 * 24 * 365 * 4
      }

      if (diff < 3600 * 24 * 7) {
        diff = 3600 * 24 * 7
      }

      setInitialSlideValues([diff])
      // const date = moment().add(diff, 'seconds')
      // const timestamp = Math.floor(date.unix() / (3600 * 24 * 7)) * (3600 * 24 * 7)
      // setInitialDate(moment.unix(timestamp).format('MMMM Do, YYYY'))

      if (slideValues.length === 0 || slideValues[0] < diff) {
        setSlideValues([diff])
        const date = moment().add(diff, 'seconds')
        const timestamp = Math.floor(date.unix() / (3600 * 24 * 7)) * (3600 * 24 * 7)
        setSelectedDate(moment.unix(timestamp).format('MMMM Do, YYYY'))
      }
    }
  }, [nft])

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value)
    setSelectedValue(null)

    updateLockDuration(event.target.value)
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value)

    let days = 0
    switch (event.target.value) {
      case 'week':
        days = 8
        break
      case 'month':
        days = 30
        break
      case 'year':
        days = 365
        break
      case 'years':
        days = 1461
        break
      default:
    }
    const newDate = moment().add(days, 'days').format('YYYY-MM-DD')

    setSelectedDate(newDate)
    updateLockDuration(newDate)
  }

  const onLock = () => {
    setLockLoading(true)

    // const now = moment()
    // const expiry = moment(selectedDate).add(1, 'days')
    // const secondsToExpire = expiry.diff(now, 'seconds')
    const secondsToExpire = slideValues[0]

    stores.dispatcher.dispatch({
      type: ACTIONS.INCREASE_VEST_DURATION,
      content: { unlockTime: secondsToExpire, tokenID: nft.id },
    })
  }

  const focus = () => {
    inputEl.current.focus()
  }

  let min = moment().add(7, 'days').format('YYYY-MM-DD')
  if (BigNumber(nft?.lockEnds).gt(0)) {
    min = moment.unix(nft?.lockEnds).format('YYYY-MM-DD')
  }

  const renderMassiveInput = (type, amountValue, amountError, amountChanged, balance, logo) => {
    return (
      <div className={classes.textField}>
        <div className={`${classes.massiveInputContainer} ${amountError && classes.error}`}>
          <div className={classes.massiveInputAssetSelect}>
            <div className={classes.displaySelectContainer}>
              <div className={classes.assetSelectMenuItem}>
                <div className={classes.displayDualIconContainer}>
                  <div className={classes.displayAssetIconWhite} onClick={focus}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.massiveInputAmount}>
            <TextField
              inputRef={inputEl}
              id="someDate"
              type="date"
              placeholder="Expiry Date"
              fullWidth
              error={amountError}
              helperText={amountError}
              value={amountValue}
              onChange={amountChanged}
              disabled={lockLoading}
              inputProps={{
                min,
                max: moment().add(1460, 'days').format('YYYY-MM-DD'),
              }}
              InputProps={{
                className: classes.largeInput,
                shrink: true,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  const handleSlideChange = (values) => {
    if (values[0] < initialSlideValues[0]) {
      // setSlideValues([3600 * 24 * 365 * 4 * 0.69])
    } else {
      setSlideValues(values)
      const date = moment().add(values[0], 'seconds')
      const timestamp = Math.floor(date.unix() / (3600 * 24 * 7)) * (3600 * 24 * 7)
      setSelectedDate(moment.unix(timestamp).format('MMMM Do, YYYY'))
      updateLockDuration(values[0])
      // const duration = moment.unix(timestamp).fromNow()
      // console.log(duration) // output duration
    }
  }

  const handleSlideButtonClicked = (value) => {
    if (value < initialSlideValues[0]) {
      // setSlideValues([3600 * 24 * 365 * 4 * 0.69])
    } else {
      setSlideValues([value])
      const date = moment().add(value, 'seconds')
      const timestamp = Math.floor(date.unix() / (3600 * 24 * 7)) * (3600 * 24 * 7)
      setSelectedDate(moment.unix(timestamp).format('MMMM Do, YYYY'))
      updateLockDuration(value)
      // const duration = moment.unix(timestamp).fromNow()
      // console.log(duration) // output duration
    }
  }

  const isSlideButtonDisabled = (value) => {
    return value < initialSlideValues[0]
  }

  return (
    <div className="mb-9">
      <div className="text-xl mb-4">Extend lock duration</div>
      <div className="mb-2">
        <div className="flex flex-row items-center gap-2 mr-2 text-sm ">
          <span className="text-text-gray">Extend from</span>
          <span className="text-text-gray">{curExpiryDate}</span>
          <span className="text-text-gray">to</span>
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
            renderThumb={({ props, isDragged }) => (
              <div
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
        <div className="flex justify-between text-xs mt-5 text-text-gray">
          {[
            { value: 1 * 7 * 24 * 60 * 60, label: '1 Wk', fullLabel: '1 Week' },
            { value: 1 * 365 * 24 * 60 * 60, label: '1 Yr', fullLabel: '1 Year' },
            { value: 2 * 365 * 24 * 60 * 60, label: '2 Yrs', fullLabel: '2 Years' },
            { value: 3 * 365 * 24 * 60 * 60, label: '3 Yrs', fullLabel: '3 Years' },
            { value: 4 * 365 * 24 * 60 * 60, label: '4 Yrs', fullLabel: '4 Years' },
          ].map((button) => (
            <button
              key={button.value}
              className={`hover:text-white ${
                isSlideButtonDisabled(button.value) ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={() => handleSlideButtonClicked(button.value)}
              disabled={isSlideButtonDisabled(button.value)}
            >
              <span className="sm:hidden">{button.label}</span>
              <span className="hidden sm:flex">{button.fullLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* <div className="bg-table-light mt-8 rounded-xl p-4">
        <div className="flex flex-row justify-between items-center">
          <div className="text-sm text-blue-gray-400">Your voting power will be:</div>
          <div className="text-lg">0.12 veKODO</div>
        </div>
      </div> */}
      <div className="flex justify-end mt-6">
        <button
          className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none bg-pink-primary hover:bg-pink-primary/90 text-white h-10 py-2 px-4 rounded-[10px]"
          disabled={lockLoading}
          onClick={onLock}
        >
          {lockLoading ? `Extending lock duration` : `Extend lock duration`}
        </button>
      </div>
    </div>
    // <div className={classes.someContainer}>
    //   <div className={classes.inputsContainer3}>
    //     {renderMassiveInput('lockDuration', selectedDate, selectedDateError, handleDateChange, null, null)}
    //     <div className={classes.inline}>
    //       <Typography className={classes.expiresIn}>Expires: </Typography>
    //       <RadioGroup className={classes.vestPeriodToggle} row onChange={handleChange} value={selectedValue}>
    //         <FormControlLabel
    //           className={classes.vestPeriodLabel}
    //           value="week"
    //           control={<Radio color="primary" />}
    //           label="1 week"
    //           labelPlacement="left"
    //         />
    //         <FormControlLabel
    //           className={classes.vestPeriodLabel}
    //           value="month"
    //           control={<Radio color="primary" />}
    //           label="1 month"
    //           labelPlacement="left"
    //         />
    //         <FormControlLabel
    //           className={classes.vestPeriodLabel}
    //           value="year"
    //           control={<Radio color="primary" />}
    //           label="1 year"
    //           labelPlacement="left"
    //         />
    //         <FormControlLabel
    //           className={classes.vestPeriodLabel}
    //           value="years"
    //           control={<Radio color="primary" />}
    //           label="4 years"
    //           labelPlacement="left"
    //         />
    //       </RadioGroup>
    //     </div>
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
    //         {lockLoading ? `Increasing Duration` : `Increase Duration`}
    //       </Typography>
    //       {lockLoading && <CircularProgress size={10} className={classes.loadingCircle} />}
    //     </Button>
    //   </div>
    // </div>
  )
}
