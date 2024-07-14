import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import { LockClosedIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'
import BigNumber from 'bignumber.js'
import moment from 'moment'

import ExistingLock from './existingLock'
import Unlock from './unlock'
import Lock from './lock'

export default function Vest() {
  const router = useRouter()

  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  const [govToken, setGovToken] = useState(null)
  const [veToken, setVeToken] = useState(null)
  const [vestNFTs, setVestNFTs] = useState([])
  const [nft, setNFT] = useState(null)

  const ssUpdated = async () => {
    setGovToken(stores.stableSwapStore.getStore('govToken'))
    setVeToken(stores.stableSwapStore.getStore('veToken'))

    const nft = await stores.stableSwapStore.getNFTByID(router.query.id)
    setNFT(nft)

    if (nft !== null && vestNFTs.length === 0) {
      stores.dispatcher.dispatch({ type: ACTIONS.GET_VEST_NFTS, content: {} })
    } else {
      const vestNFTsFromStore = stores.stableSwapStore.getStore('vestNFTs')
      setVestNFTs(vestNFTsFromStore)
    }

    forceUpdate()
  }

  useEffect(() => {
    ssUpdated()

    const vestNFTsReturned = (nfts) => {
      setVestNFTs(nfts)
      forceUpdate()
    }

    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    stores.emitter.on(ACTIONS.VEST_NFTS_RETURNED, vestNFTsReturned)
    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
      stores.emitter.removeListener(ACTIONS.VEST_NFTS_RETURNED, vestNFTsReturned)
    }
  }, [])

  // useEffect(() => {
  //   const vestNFTsReturned = (nfts) => {
  //     setVestNFTs(nfts)
  //     forceUpdate()
  //   }

  //   // window.setTimeout(() => {
  //   //   stores.dispatcher.dispatch({ type: ACTIONS.GET_VEST_NFTS, content: {} })
  //   // }, 1)

  //   stores.emitter.on(ACTIONS.VEST_NFTS_RETURNED, vestNFTsReturned)
  //   return () => {
  //     stores.emitter.removeListener(ACTIONS.VEST_NFTS_RETURNED, vestNFTsReturned)
  //   }
  // }, [])

  useEffect(() => {
    const fetchData = async () => {
      await ssUpdated()
    }

    fetchData()
  }, [router.query.id])

  return (
    <div>
      {/* {router.query.id === 'create' && <Lock nft={nft} govToken={govToken} veToken={veToken} />} */}
      {router.query.id !== 'create' && nft && BigNumber(nft.lockEnds).gt(0) && (
        <ExistingLock nft={nft} govToken={govToken} veToken={veToken} vestNFTs={vestNFTs} />
      )}
      {/* {router.query.id !== 'create' &&
        nft &&
        BigNumber(nft.lockEnds).lt(moment().unix()) &&
        BigNumber(nft.lockEnds).gt(0) && <Unlock nft={nft} govToken={govToken} veToken={veToken} />} */}
    </div>
  )
}
