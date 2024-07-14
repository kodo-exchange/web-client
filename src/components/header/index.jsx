import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { SvgIcon, Badge, Menu, MenuItem } from '@material-ui/core'
import { withStyles, withTheme } from '@material-ui/core/styles'

import Navigation from '../navigation'

import { ACTIONS } from '../../stores/constants'

import stores from '../../stores'

const { CONNECT_WALLET, ACCOUNT_CONFIGURED, ACCOUNT_CHANGED, FIXED_FOREX_CLAIM_VECLAIM } = ACTIONS

function Header(props) {
  const accountStore = stores.accountStore.getStore('account')
  const router = useRouter()
  // const { navigateButtons } = props

  const [account, setAccount] = useState(accountStore)
  const [darkMode, setDarkMode] = useState(props.theme.palette.type === 'dark' ? true : false)
  const [unlockOpen, setUnlockOpen] = useState(false)
  const [chainInvalid, setChainInvalid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transactionQueueLength, setTransactionQueueLength] = useState(0)

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account')
      setAccount(accountStore)
      closeUnlock()
    }
    const connectWallet = () => {
      onAddressClicked()
    }
    // const accountChanged = () => {
    //   const invalid = stores.accountStore.getStore('chainInvalid')
    //   setChainInvalid(invalid)
    // }

    // const invalid = stores.accountStore.getStore('chainInvalid')
    // setChainInvalid(invalid)

    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigure)
    stores.emitter.on(CONNECT_WALLET, connectWallet)
    // stores.emitter.on(ACCOUNT_CHANGED, accountChanged)
    return () => {
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigure)
      stores.emitter.removeListener(CONNECT_WALLET, connectWallet)
      // stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged)
    }
  }, [])

  const handleToggleChange = (event, val) => {
    setDarkMode(val)
    props.changeTheme(val)
  }

  const onAddressClicked = () => {
    setUnlockOpen(true)
  }

  const closeUnlock = () => {
    setUnlockOpen(false)
  }

  useEffect(function () {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode')
    setDarkMode(localStorageDarkMode ? localStorageDarkMode === 'dark' : false)
  }, [])

  const navigate = (url) => {
    router.push(url)
  }

  const callClaim = () => {
    setLoading(true)
    stores.dispatcher.dispatch({ type: FIXED_FOREX_CLAIM_VECLAIM, content: {} })
  }

  const switchChain = async () => {
    // let hexChain = '0x' + Number(process.env.NEXT_PUBLIC_CHAINID).toString(16)
    let hexChain = process.env.NEXT_PUBLIC_CHAINID
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChain }],
      })
    } catch (switchError) {
      console.log('switch error', switchError)
    }
  }

  const setQueueLength = (length) => {
    setTransactionQueueLength(length)
  }

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return <Navigation />
}

export default withTheme(Header)
