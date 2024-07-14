import { Typography, Button, Paper } from '@material-ui/core'
import SwapComponent from '../../components/ssSwap'

import { useState, useEffect } from 'react'
import { ACTIONS } from '../../stores/constants'
import stores from '../../stores'
import Unlock from '../../components/unlock'

import classes from './swap.module.css'

function Swap({ changeTheme }) {
  const [account, setAccount] = useState(stores.accountStore.getStore('account'))
  const [unlockOpen, setUnlockOpen] = useState(false)

  useEffect(() => {
    const accountConfigure = () => {
      setAccount(stores.accountStore.getStore('account'))
      closeUnlock()
    }
    const connectWallet = () => {
      onAddressClicked()
    }

    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
    stores.emitter.on(ACTIONS.CONNECT_WALLET, connectWallet)
    return () => {
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure)
      stores.emitter.removeListener(ACTIONS.CONNECT_WALLET, connectWallet)
    }
  }, [])

  const onAddressClicked = () => {
    setUnlockOpen(true)
  }

  const closeUnlock = () => {
    setUnlockOpen(false)
  }

  return (
    <>
      <div className="lg:p-4">
        <SwapComponent />
      </div>
      {/* {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />} */}
    </>
    // <>
    //   {account && account.address ? (
    //     <>
    //       {/* <h1 className="bg-gradient-to-t from-blue-600 to-cyan-400 bg-clip-text inline-block text-transparent pb-2 md:pb-3 lg:pb-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-normal">
    //         Swap
    //       </h1>
    //       <div className="font-sans text-base leading-6 text-white">
    //         Our unique engine automatically chooses the best route for your trade
    //       </div> */}

    //       <div className="lg:p-4 mt-16 mb-[86px]">
    //         <SwapComponent />
    //       </div>
    //     </>
    //   ) : (
    //     <Paper className={classes.notConnectedContent}>
    //       <div className={classes.sphere}></div>
    //       <div className={classes.contentFloat}>
    //         <Typography className={classes.mainHeadingNC} variant="h1">
    //           Swap
    //         </Typography>
    //         <Typography className={classes.mainDescNC} variant="body2">
    //           Swap between Solidly supported stable and volatile assets.
    //         </Typography>
    //         <Button disableElevation className={classes.buttonConnect} variant="contained" onClick={onAddressClicked}>
    //           {account && account.address && <div className={`${classes.accountIcon} ${classes.metamask}`}></div>}
    //           <Typography>Connect Wallet to Continue</Typography>
    //         </Button>
    //       </div>
    //     </Paper>
    //   )}
    //   {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />}
    // </>
  )
}

export default Swap
