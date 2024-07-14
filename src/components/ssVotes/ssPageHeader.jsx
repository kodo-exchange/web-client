import { useState, useEffect } from 'react'
import stores from '../../stores'
import moment from 'moment'
import { CONTRACTS } from '../../stores/constants'

const PageHeader = ({ pair }) => {
  const [startTime, setStartTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [epoch, setEpoch] = useState(0)

  useEffect(() => {
    const startTime = CONTRACTS.VE_DIST_EPOCH_0_START
    setStartTime(startTime)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
      if (startTime) {
        setEpoch(Math.floor((moment().unix() - startTime) / (3600 * 24 * 7)))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  function calculateTimeLeft() {
    const now = Math.floor(Date.now() / 1000) // current unix time
    const next = (Math.floor(now / (3600 * 24 * 7)) + 1) * 3600 * 24 * 7 // next week unix time
    const difference = next - now

    return {
      days: Math.floor(difference / (3600 * 24)),
      hours: Math.floor((difference / 3600) % 24),
      minutes: Math.floor((difference / 60) % 60),
      seconds: Math.floor(difference % 60),
    }
  }

  // // Calculate epoch
  // let epoch = 0
  // if (startTime) {
  //   epoch = Math.floor((moment().unix() - startTime) / (3600 * 24 * 7))
  // }

  return (
    <div className="flex flex-row justify-between mb-8 md:mb-24">
      <div>
        <div className="mb-5 inline-block text-white pb-2 md:pb-3 lg:pb-4 text-4xl sm:text-5xl lg:text-5xl font-bold tracking-normal">
          Vote
        </div>
        <div className="font-sans text-base leading-6 text-text-gray">
          Vote weekly to earn Fees &amp; Bribes from your veKODO NFT
        </div>

        {/* <div className="inline-flex flex-row gap-1 items-center">
          <span>Vote weekly to earn Fees &amp; Bribes from your veKODO NFT</span>
        </div> */}
        <div className="sm:hidden mt-2">
          <div className="rounded-3xl bg-white/8 p-4 border border-white/10 text-center backdrop-blur-sm">
            <div className="text-pink-primary inline-block font-bold whitespace-nowrap">{`Epoch ${epoch} Ends In`}</div>
            <div className="font-mono font-bold">{`${timeLeft.days}d:${timeLeft.hours}h:${timeLeft.minutes}m:${timeLeft.seconds}s`}</div>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex items-center justify-center">
        <div className="rounded-3xl bg-white/8 p-5 border border-white/10 text-center backdrop-blur-sm">
          <div className="text-pink-primary inline-block font-bold whitespace-nowrap">{`Epoch ${epoch} Ends In`}</div>
          <div className="font-mono font-bold">{`${timeLeft.days}d:${timeLeft.hours}h:${timeLeft.minutes}m:${timeLeft.seconds}s`}</div>
        </div>
        {/* <div className="flex flex-row">
          <div className="flex flex-col rounded-[10px] bg-white/8 border border-white/10 backdrop-blur-sm">
            <div>{`Epoch ${epoch}`}</div>
            <div>{`Ends In`}</div>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div> */}
      </div>
    </div>
  )
}

export default PageHeader
