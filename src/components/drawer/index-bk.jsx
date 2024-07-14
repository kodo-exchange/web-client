import { Fragment, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { NavigationContext } from '../navigation/NavigationContext'
import { DrawerContext } from './DrawerContext'
import Connector from '../connector'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Dialog, Transition } from '@headlessui/react'

// export const navigateButtons = [
//   { name: 'Swap', value: 'swap' },
//   { name: 'Liquidity', value: 'liquidity' },
//   { name: 'Vest', value: 'vest' },
//   { name: 'Vote', value: 'vote' },
//   { name: 'Bribe', value: 'bribe' },
//   { name: 'Rewards', value: 'rewards' },
//   { name: 'RewardsNew', value: 'rewardsNew' },
// ]

export default function Drawer(props) {
  // const [isChecked, setIsChecked] = useState(false)
  // const checkboxRef = useRef(null)
  // const drawerContext = useContext(DrawerContext)
  const router = useRouter()
  const { activeNavigate, setActiveNavigate, navigateButtons } = useContext(NavigationContext)

  const { isDrawerChecked, setIsDrawerChecked } = useContext(DrawerContext)
  // const { navigateButtons } = props

  // const toggleDrawer = () => {
  //   // drawerCheckboxRef.current.click()
  //   setIsDrawerChecked(!isDrawerChecked)
  // }

  function handleNavigate(route) {
    router.push(route)
  }

  const onActiveClick = (event, val) => {
    if (val) {
      setActiveNavigate(val)
      handleNavigate('/' + val)
      setIsDrawerChecked(false)
    }
  }

  const onClose = () => {
    setIsDrawerChecked(false)
  }

  // const [open, setOpen] = useState(true)

  return (
    <Transition.Root show={isDrawerChecked} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full md:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="gap-4 bg-table p-6 opacity-100 shadow-lg border border-gray-700/70 pointer-events-auto w-screen md:max-w-[420px]">
                  <div className="flex flex-col space-y-2 sm:text-left text-left h-full">
                    <div className="w-[32px] h-[32px] md:w-[32px] md:h-[32px]">
                      {/* <img src="logo-round.svg" alt="" width="90" /> */}
                      <Image src="/logo-round.svg" alt="Site Logo" width={32} height={32} />
                    </div>
                    <div className="flex flex-col h-[100%] justify-between gap-4 overflow-y-auto relative">
                      <Connector />
                      <div className="">
                        <h3 className="text-lg mt-4 mb-2 font-medium text-white">Navigation</h3>
                        <div
                          data-orientation="horizontal"
                          role="none"
                          className="shrink-0 bg-gray-700/70 h-[1px] w-full mb-4"
                        ></div>
                        <ol className="space-y-1 text-sm">
                          {navigateButtons.map(({ name, value }) => (
                            <li
                              key={value}
                              className={`no-underline cursor-pointer py-3 font-semibold px-4 rounded-xl hover:bg-table-light hover:text-white
                      ${activeNavigate === value ? 'text-pink-primary' : 'text-white'}`}
                              onClick={(event) => onActiveClick(event, value)}
                            >
                              {name}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="grow"></div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute right-4 top-3 rounded-full opacity-70 p-1 transition-opacity hover:opacity-100 disabled:pointer-events-none"
                    onClick={onClose}
                  >
                    <div className="inline-flex items-center justify-center text-sm font-medium transition-colors border border-gray-700/70 hover:bg-white/80 hover:text-table-dark h-10 w-10 rounded-full p-0">
                      <XMarkIcon className="h-5 w-5" />
                    </div>
                    <span className="sr-only">Close</span>
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
