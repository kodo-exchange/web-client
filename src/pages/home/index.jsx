import { Typography, Button, SvgIcon, Grid } from '@material-ui/core'

// import classes from './home.module.css'

// import commonStyles from './common.module.css'
import styles from './index.module.css'

import { useRouter } from 'next/router'

function Home({ changeTheme }) {
  function handleNavigate(route) {
    router.push(route)
  }

  const router = useRouter()

  return (
    <></>
    // <>
    //   <div className={classes.contentContainerFull}>
    //     <SiteLogo className={classes.appLogo} />

    //     <Grid container spacing={2} className={classes.homeContentMain}>
    //       <Grid item lg={12} md={12} sm={12} xs={12}>
    //         <Typography variant="h1" className={classes.preTitle}>
    //           0.01% fee
    //         </Typography>
    //       </Grid>
    //       <Grid item lg={12} md={12} sm={12} xs={12}>
    //         <Typography variant="h1" className={classes.mainTitle}>
    //           Low cost stable coin swaps
    //         </Typography>
    //       </Grid>
    //       <Grid item lg={12} md={12} sm={12} xs={12}>
    //         <Grid container spacing={2}>
    //           <Grid item lg={6} md={6} sm={12} xs={12}>
    //             {/* <Button
    //               className={classes.buttonInfo}
    //               onClick={() =>
    //                 scrollTo({ top: 1000, left: 0, behavior: "smooth" })
    //               }
    //             >
    //               Learn More
    //             </Button> */}
    //           </Grid>
    //           <Grid item lg={6} md={6} sm={12} xs={12}>
    //             <Button className={classes.buttonEnter} onClick={() => router.push('/swap')}>
    //               Enter App
    //             </Button>
    //           </Grid>
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //   </div>

    //   <div id="info" className={classes.contentContainerFullTwo}>
    //     <div className={classes.floatingSphere}></div>

    //     <Grid container spacing={3} className={classes.homeContentMain}>
    //       <Grid item lg={12} md={12} sm={12} xs={12}>
    //         <Typography variant="h1" className={classes.secTitle}>
    //           Welcome to Solidly
    //         </Typography>
    //       </Grid>
    //       <Grid item lg={12} md={12} sm={12} xs={12}>
    //         <Typography variant="body1" className={classes.mainDescription}>
    //           Solidly officially launched in January 2022 with a collective goal of fair and balanced access to DeFi.
    //           Solidly is a decentralized exchange that has launched on the Fantom network with low fees, near 0 slippage
    //           on correlated assets and a strong focus on secondary markets for tokenized locks as NFT’s (veToken =
    //           lpNFTs).
    //         </Typography>
    //         <Typography variant="body2" className={classes.secDescription}>
    //           One segment of the cryptocurrency landscape that has shown incredible potential is the swapping of
    //           stablecoins and volatile assets. Solidly Swap offers users quick, seamless and cheap transactions while
    //           utilizing strategies to maximize their yield.
    //         </Typography>
    //       </Grid>
    //       <Grid item lg={12} md={12} sm={12} xs={12}>
    //         <Button className={classes.buttonEnterSingle} onClick={() => router.push('/swap')}>
    //           Enter App
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   </div>
    // </>
  )
}

export default Home
