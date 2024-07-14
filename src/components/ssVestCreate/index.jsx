import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'
// import moment from 'moment'

// import ExistingLock from './existingLock'
// import Unlock from './unlock'
import Lock from './lock'

import {
  ArrowLongRightIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'

import { LockClosedIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function Vest() {
  const router = useRouter()

  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  const [govToken, setGovToken] = useState(null)
  const [veToken, setVeToken] = useState(null)
  const [nft, setNFT] = useState(null)

  const ssUpdated = async () => {
    setGovToken(stores.stableSwapStore.getStore('govToken'))
    setVeToken(stores.stableSwapStore.getStore('veToken'))

    const nft = await stores.stableSwapStore.getNFTByID(router.query.id)
    setNFT(nft)
    forceUpdate()
  }

  useEffect(() => {
    ssUpdated()

    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await ssUpdated()
    }

    fetchData()
  }, [router.query.id])

  return (
    <div>
      <Lock govToken={govToken} veToken={veToken} />
    </div>
  )
}
