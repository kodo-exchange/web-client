import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Header from '../header'
import Footer from '../footer'
import SnackbarController from '../snackbar'
import Drawer from '../drawer'
import { DrawerContext } from '../drawer/DrawerContext'
import { NavigationContext } from '../navigation/NavigationContext'
import { ACTIONS } from '../../stores/constants'
import stores from '../../stores'
import { Analytics } from '@vercel/analytics/react'

export const allNavigateButtons = [
  { name: 'Swap', value: 'swap', defaultShow: true },
  { name: 'Liquidity', value: 'liquidity', defaultShow: true },
  { name: 'Lock', value: 'lock', defaultShow: false },
  { name: 'Vote', value: 'vote', defaultShow: false },
  { name: 'Bribe', value: 'bribe', defaultShow: true },
  { name: 'Rewards', value: 'rewards', defaultShow: false },
]

export default function Layout({ children, configure, backClicked, changeTheme, title }) {
  const router = useRouter()
  const [isDrawerChecked, setIsDrawerChecked] = useState(false) // Status of drawer's checkbox
  // const drawerCheckboxRef = useRef(null) // Ref to drawer's checkbox
  const [activeNavigate, setActiveNavigate] = useState('swap')

  const account = stores.accountStore.getStore('account')
  const initialNavigateButtons =
    account && account.address ? allNavigateButtons : allNavigateButtons.filter((button) => button.defaultShow)
  const [navigateButtons, setNavigateButtons] = useState(initialNavigateButtons)

  useEffect(() => {
    const setNavigate = () => {
      const account = stores.accountStore.getStore('account')

      if (account && account.address) {
        setNavigateButtons(allNavigateButtons)
      } else {
        setNavigateButtons(navigateButtons.filter((button) => button.defaultShow))
      }
    }

    setNavigate()

    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, setNavigate)

    return () => {
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, setNavigate)
    }
  }, [])

  useEffect(() => {
    const activePath = router.asPath
    allNavigateButtons.forEach(({ value }) => {
      if (activePath.includes(value)) {
        setActiveNavigate(value)
      }
    })
  }, [router.asPath])

  return (
    <div className="flex flex-col justify-between min-h-[calc(100dvh)]">
      <div className="relative flex-grow">
        <div className="max-w-7xl min-w-[320px] mx-auto p-2 pt-[26px] md:p-4 md:pt-[26px] xl:px-0 xl:py-4 xl:pt-[26px]">
          {/* <div className={classes.container}> */}
          <div>
            {/* <div className={classes.content}> */}
            <DrawerContext.Provider value={{ isDrawerChecked, setIsDrawerChecked }}>
              <NavigationContext.Provider value={{ activeNavigate, setActiveNavigate, navigateButtons }}>
                {!configure && <Header backClicked={backClicked} changeTheme={changeTheme} title={title} />}
              </NavigationContext.Provider>
            </DrawerContext.Provider>
            <SnackbarController />
            <main className="sm:p-4 pt-8 sm:pt-16 md:pt-20 xl:px-0">{children}</main>
          </div>
        </div>
        {['/', '/swap'].includes(router.pathname) && (
          <img
            className="w-[1440px] absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10 overflow-hidden"
            src="/img/bg/orbiter.webp"
          ></img>
        )}
        {router.asPath.includes('/liquidity') && (
          <img
            className={`w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10 ${
              router.asPath.includes('/liquidity/create') || router.asPath.includes('/liquidity/0x')
                ? 'h-[200px] sm:h-[300px] blur-2xl md:blur-2xl'
                : 'h-[300px] sm:h-[300px] blur-lg md:blur-none'
            }`}
            src="/img/bg/liquidity.webp"
          ></img>
        )}
        {router.asPath.includes('/lock') && (
          <img
            className={`w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10 ${
              router.asPath.includes('/lock/')
                ? 'h-[200px] sm:h-[300px] blur-2xl md:blur-2xl'
                : 'h-[300px] sm:h-[300px] blur-lg md:blur-none'
            }`}
            src="/img/bg/lock.webp"
          ></img>
        )}
        {router.asPath.includes('/vote') && (
          <img
            className="h-[300px] sm:h-[300px] blur-lg md:blur-none w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10  "
            src="/img/bg/vote.webp"
          ></img>
        )}
        {router.asPath.includes('/bribe') && (
          <img
            className="h-[300px] sm:h-[300px] blur-lg md:blur-none w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10"
            src="/img/bg/bribe.webp"
          ></img>
        )}
        {router.asPath.includes('/rewards') && (
          <img
            className="h-[300px] sm:h-[300px] blur-lg md:blur-none w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10  "
            src="/img/bg/rewards.webp"
          ></img>
        )}
        {/* {['/', '/swap'].includes(router.pathname) && (
          <div className="w-[1440px] absolute top-0 transform left-1/2 -translate-x-1/2 -z-10">
            <Image
              src="/img/bg/orbiter.webp"
              alt=""
              layout="responsive"
              width={1440}
              height={960}
              objectFit="cover"
              className=""
            />
          </div>
        )}
        {router.asPath.includes('/liquidity') && (
          <div
            className={`w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10 ${
              router.asPath.includes('/liquidity/create') || router.asPath.includes('/liquidity/0x')
                ? 'h-[200px] sm:h-[300px] blur-2xl md:blur-2xl'
                : 'h-[300px] sm:h-[300px] blur-lg md:blur-none'
            }`}
          >
            <Image src="/img/bg/liquidity2x.webp" alt="" layout="fill" objectFit="fill" quality={100} className=" " />
          </div>
        )}
        {router.asPath.includes('/lock') && (
          <div
            className={`w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10 ${
              router.asPath.includes('/lock/')
                ? 'h-[200px] sm:h-[300px] blur-2xl md:blur-2xl'
                : 'h-[300px] sm:h-[300px] blur-lg md:blur-none'
            }`}
          >
            <Image src="/img/bg/lock2x.webp" alt="" layout="fill" objectFit="fill" quality={100} className=" " />
          </div>
        )}
        {router.asPath.includes('/vote') && (
          <div className="h-[300px] sm:h-[300px] blur-lg md:blur-none w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10">
            <Image src="/img/bg/vote2x.webp" alt="" layout="fill" objectFit="fill" quality={100} className=" " />
          </div>
        )}
        {router.asPath.includes('/bribe') && (
          <div className="h-[300px] sm:h-[300px] blur-lg md:blur-none w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10">
            <Image src="/img/bg/bribe2x.webp" alt="" layout="fill" objectFit="fill" quality={100} className=" " />
          </div>
        )}
        {router.asPath.includes('/rewards') && (
          <div className="h-[300px] sm:h-[300px] blur-lg md:blur-none w-full absolute flex top-0  transform left-1/2 -translate-x-1/2 -z-10">
            <Image src="/img/bg/rewards2x.webp" alt="" layout="fill" objectFit="fill" className=" " quality={100} />
          </div>
        )} */}
      </div>
      {!configure && <Footer backClicked={backClicked} changeTheme={changeTheme} title={title} />}
      <DrawerContext.Provider value={{ isDrawerChecked, setIsDrawerChecked }}>
        <NavigationContext.Provider value={{ activeNavigate, setActiveNavigate, navigateButtons }}>
          <Drawer />
        </NavigationContext.Provider>
      </DrawerContext.Provider>
      <Analytics />
    </div>
  )
}
