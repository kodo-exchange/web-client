import { useState, useEffect, useCallback } from 'react'

import PairsTable from './ssLiquidityPairsTable'

import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

export default function LiquidityPairs() {
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  const [pairs, setPairs] = useState([])

  const accountStore = stores.accountStore.getStore('account')
  const [account, setAccount] = useState(accountStore)

  useEffect(() => {
    const stableSwapUpdated = () => {
      setPairs(stores.stableSwapStore.getStore('pairs'))
      forceUpdate()
    }

    setPairs(stores.stableSwapStore.getStore('pairs'))

    stores.emitter.on(ACTIONS.UPDATED, stableSwapUpdated)
    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, stableSwapUpdated)
    }
  }, [])

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account')
      setAccount(accountStore)
    }

    accountConfigure()

    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)

    return () => {
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
    }
  }, [])

  return <PairsTable pairs={pairs} account={account} />
}
