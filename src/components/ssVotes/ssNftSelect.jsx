import { useState, Fragment } from 'react'
import moment from 'moment'
import { formatCurrency } from '../../utils'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

const NftSelect = ({ token, setToken, vestNFTs }) => {
  const [open, setOpen] = useState(false)

  const onClose = () => {
    setOpen(false)
  }

  const onNftSelect = (value) => {
    setOpen(false)
    setToken(value)
  }

  const renderDialog = () => {
    return (
      <Transition.Root show={open} as={Fragment}>
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

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="fixed max-h-[80vh] min-h-96 w-[100vw] max-w-lg gap-4 overflow-y-auto border border-border bg-gradient-primary shadow-lg rounded-lg flex flex-col p-5 pb-12">
                <div className="flex flex-col text-center sm:text-left">
                  <div className="text-xl font-semibold flex flex-row items-center">Select an NFT</div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-text-gray grid grid-cols-4 px-2 w-full">
                    <div className="col-span-1">NFT</div>
                    <div className="col-span-1 text-right">Expires</div>
                    <div className="col-span-1 text-right">Locked</div>
                    <div className="col-span-1 text-right">veKODO</div>
                  </div>
                  {/* <div className="shrink-0 bg-gray-700/70 h-[1px] w-full my-4"></div> */}
                  <div className="relative h-[280px] border border-border bg-table-dark py-1 mt-5 rounded-[10px]">
                    <div className="h-full w-full overflow-x-hidden overflow-y-scroll">
                      <div>
                        <div className="flex flex-col space-y-1 items-center">
                          {vestNFTs
                            // .filter((vestNFT) => vestNFT.id !== token?.id)
                            .map((vestNFT, index) => {
                              return (
                                <div
                                  key={`option-${index}`}
                                  className="grid grid-cols-4 w-full flex-row items-top justify-between gap-2 hover:bg-bg-light pl-2 pr-2 py-2 text-sm cursor-pointer"
                                  onClick={() => onNftSelect(vestNFT)}
                                >
                                  <div className="col-span-1">{`NFT #${vestNFT.id}`}</div>
                                  <div className="col-span-1 flex flex-col items-end normal-case font-normal">
                                    <div className="text-sm text-white">
                                      {moment.unix(vestNFT.lockEnds).format('YYYY-MM-DD')}
                                    </div>
                                    <div className="text-xs text-text-gray">Expires</div>
                                  </div>
                                  <div className="col-span-1 flex flex-col items-end normal-case font-normal">
                                    <div className="text-sm text-white">{formatCurrency(vestNFT.lockAmount)}</div>
                                    <div className="text-xs text-text-gray">KODO</div>
                                  </div>
                                  <div className="col-span-1 flex flex-col items-end normal-case font-normal">
                                    <div className="text-sm text-white">{formatCurrency(vestNFT.lockValue)}</div>
                                    <div className="text-xs text-text-gray">veKODO</div>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="flex h-7 w-7 items-center justify-center absolute right-5 top-5" onClick={onClose}>
                  <XMarkIcon className="h-6 w-6 fill-text-gray hover:fill-white transition-colors" aria-hidden="true" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }

  return (
    <div className="w-full sm:w-5/12 md:w-4/12 lg:w-3/12">
      <button className="w-full" onClick={() => setOpen(true)}>
        <div className="flex flex-row flex-nowrap justify-between rounded-xl pr-4 px-4 items-center min-h-[48px] bg-bg-light border border-border ring-0 hover:bg-white/20 hover:border-white hover:border-opacity-5 transition-colors duration-300">
          {token ? (
            <div className="flex flex-row justify-between items-center text-sm w-full gap-1">
              <div className="whitespace-nowrap text-white">{`NFT #${token.id}`}</div>
              <div className="flex flex-row items-center gap-3">
                <div className="flex flex-row gap-1 whitespace-nowrap text-text-gray">
                  <div className="">{formatCurrency(token.lockValue)}</div>
                  <div className="normal-case">veKODO</div>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-inherit" aria-hidden="true" />
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-2 justify-between text-sm w-full items-center">
              <div className="pl-1 whitespace-nowrap text-text-gray">Select veNFT...</div>
              <ChevronDownIcon className="h-5 w-5 text-inherit" aria-hidden="true" />
            </div>
          )}
        </div>
      </button>
      {renderDialog()}
    </div>
    // <div className={classes.textField}>
    //   <div className={classes.mediumInputContainer}>
    //     <Grid container>
    //       <Grid item lg="auto" md="auto" sm={12} xs={12}>
    //         <Typography variant="body2" className={classes.smallText}>
    //           Please select your veNFT:
    //         </Typography>
    //       </Grid>

    //       <Grid item lg={6} md={6} sm={12} xs={12}>
    //         <div className={classes.mediumInputAmount}>
    //           <Select
    //             fullWidth
    //             value={value}
    //             onChange={handleChange}
    //             InputProps={{
    //               className: classes.mediumInput,
    //             }}
    //           >
    //             {options &&
    //               options.map((option) => {
    //                 return (
    //                   <MenuItem key={option.id} value={option}>
    //                     <div className={classes.menuOption}>
    //                       <Typography>Token #{option.id}</Typography>
    //                       <div>
    //                         <Typography align="right" className={classes.smallerText}>
    //                           {formatCurrency(option.lockValue)}
    //                         </Typography>
    //                         <Typography color="textSecondary" className={classes.smallerText}>
    //                           {veToken?.symbol}
    //                         </Typography>
    //                       </div>
    //                     </div>
    //                   </MenuItem>
    //                 )
    //               })}
    //           </Select>
    //         </div>
    //       </Grid>
    //     </Grid>
    //   </div>
    // </div>
  )
}

export default NftSelect
