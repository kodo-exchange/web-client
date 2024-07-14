import { useState, useEffect, useCallback } from 'react'

import classes from './ssBribes.module.css'

import BribeCard from '../ssBribeCard'

import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'
import { EnhancedTableToolbar } from '../../pages/bribe'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import BribeCreate from './ssBribeCreate'
import EnhancedTable from './ssBribesTable'

const PageHeader = () => {
  return (
    <div className="mb-8 md:mb-24">
      <div className="mb-5 inline-block text-white pb-2 md:pb-3 lg:pb-4 text-4xl sm:text-5xl lg:text-5xl font-semibold tracking-normal">
        Bribe
      </div>
      <div className="font-sans text-base leading-6 text-text-gray">
        Incentivise voting on a specific liquidity pair by bribing veKODO holders
      </div>
    </div>
  )
}

export default function Bribes() {
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  const [pairs, setPairs] = useState([])

  useEffect(() => {
    const stableSwapUpdated = () => {
      const pairs = stores.stableSwapStore.getStore('pairs')
      const pairsWithBribes = pairs.filter((pair) => {
        return pair && pair.gauge != null && pair.gauge.address && pair.gauge.bribes && pair.gauge.bribes.length > 0
      })
      setPairs(pairsWithBribes)
      forceUpdate()
    }

    stableSwapUpdated()

    stores.emitter.on(ACTIONS.UPDATED, stableSwapUpdated)
    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, stableSwapUpdated)
    }
  }, [])

  return (
    <>
      <PageHeader />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row w-full gap-8 xl:gap-16">
          <BribeCreate />
          <EnhancedTable gauges={pairs} />
        </div>
      </div>
    </>
  )
}
