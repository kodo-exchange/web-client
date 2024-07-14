import { Fragment, useState, useEffect } from 'react'
import { Typography, DialogContent, Slide, IconButton } from '@material-ui/core'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import CloseIcon from '@material-ui/icons/Close'

import Lottie from 'lottie-react'
import successAnim from '/public/lottiefiles/successAnim.json'
import swapSuccessAnim from '/public/lottiefiles/swapSuccess.json'
import lockSuccessAnim from '/public/lottiefiles/lockSuccess.json'
import pairSuccessAnim from '/public/lottiefiles/pairSuccess.json'

import Transaction from './transaction'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid'

// function Transition(props) {
//   return <Slide direction="up" {...props} />
// }

import classes from './transactionQueue.module.css'
import stores from '../../stores'
import { ACTIONS, ETHERSCAN_URL } from '../../stores/constants'

export default function TransactionQueue({ setQueueLength }) {
  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [purpose, setPurpose] = useState(null)
  const [type, setType] = useState(null)
  const [action, setAction] = useState(null)

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const clearTransactions = () => {
      setTransactions([])
      setQueueLength(0)
    }

    const openQueue = () => {
      setOpen(true)
    }

    const transactionAdded = (params) => {
      setPurpose(params.title)
      setType(params.type)
      setAction(params.verb)
      setOpen(true)
      const txs = [...params.transactions]
      setTransactions(txs)

      setQueueLength(params.transactions.length)
    }

    const transactionPending = (params) => {
      let txs = transactions.map((tx) => {
        if (tx.uuid === params.uuid) {
          tx.status = 'PENDING'
          tx.description = params.description ? params.description : tx.description
        }
        return tx
      })
      setTransactions(txs)
    }

    const transactionSubmitted = (params) => {
      let txs = transactions.map((tx) => {
        if (tx.uuid === params.uuid) {
          tx.status = 'SUBMITTED'
          tx.txHash = params.txHash
          tx.description = params.description ? params.description : tx.description
        }
        return tx
      })
      setTransactions(txs)
    }

    const transactionConfirmed = (params) => {
      let txs = transactions.map((tx) => {
        if (tx.uuid === params.uuid) {
          tx.status = 'CONFIRMED'
          tx.txHash = params.txHash
          tx.description = params.description ? params.description : tx.description
        }
        return tx
      })
      setTransactions(txs)
    }

    const transactionRejected = (params) => {
      let txs = transactions.map((tx) => {
        if (tx.uuid === params.uuid) {
          tx.status = 'REJECTED'
          tx.description = params.description ? params.description : tx.description
          tx.error = params.error
        }
        return tx
      })
      setTransactions(txs)
    }

    const transactionStatus = (params) => {
      let txs = transactions.map((tx) => {
        if (tx.uuid === params.uuid) {
          tx.status = params.status ? params.status : tx.status
          tx.description = params.description ? params.description : tx.description
        }
        return tx
      })
      setTransactions(txs)
    }

    stores.emitter.on(ACTIONS.CLEAR_TRANSACTION_QUEUE, clearTransactions)
    stores.emitter.on(ACTIONS.TX_ADDED, transactionAdded)
    stores.emitter.on(ACTIONS.TX_PENDING, transactionPending)
    stores.emitter.on(ACTIONS.TX_SUBMITTED, transactionSubmitted)
    stores.emitter.on(ACTIONS.TX_CONFIRMED, transactionConfirmed)
    stores.emitter.on(ACTIONS.TX_REJECTED, transactionRejected)
    stores.emitter.on(ACTIONS.TX_STATUS, transactionStatus)
    stores.emitter.on(ACTIONS.TX_OPEN, openQueue)

    return () => {
      stores.emitter.removeListener(ACTIONS.CLEAR_TRANSACTION_QUEUE, clearTransactions)
      stores.emitter.removeListener(ACTIONS.TX_ADDED, transactionAdded)
      stores.emitter.removeListener(ACTIONS.TX_PENDING, transactionPending)
      stores.emitter.removeListener(ACTIONS.TX_SUBMITTED, transactionSubmitted)
      stores.emitter.removeListener(ACTIONS.TX_CONFIRMED, transactionConfirmed)
      stores.emitter.removeListener(ACTIONS.TX_REJECTED, transactionRejected)
      stores.emitter.removeListener(ACTIONS.TX_STATUS, transactionStatus)
      stores.emitter.removeListener(ACTIONS.TX_OPEN, openQueue)
    }
  }, [transactions])

  useEffect(() => {
    if (
      transactions &&
      transactions.filter((tx) => ['DONE', 'CONFIRMED'].includes(tx.status)).length === transactions.length
    ) {
      setTimeout(() => {
        setOpen(false)
      }, 3000)
    }
  }, [transactions])

  const renderDone = (txs) => {
    if (
      !(
        transactions &&
        transactions.filter((tx) => {
          return ['DONE', 'CONFIRMED'].includes(tx.status)
        }).length === transactions.length
      )
    ) {
      return null
    }

    let lottie = <Lottie loop={false} className={classes.animClass} animationData={successAnim} />
    if (type === 'Liquidity') {
      lottie = <Lottie loop={false} className={classes.animClass} animationData={pairSuccessAnim} />
    } else if (type === 'Swap') {
      lottie = <Lottie loop={false} className={classes.animClass} animationData={swapSuccessAnim} />
    } else if (type === 'Lock') {
      lottie = <Lottie loop={false} className={classes.animClass} animationData={lockSuccessAnim} />
    }

    return (
      <div className={classes.successDialog}>
        {lottie}
        <Typography className={classes.successTitle}>{action ? action : 'Transaction Successful!'}</Typography>
        <Typography className={classes.successText}>Transaction has been confirmed by the blockchain.</Typography>
        {txs &&
          txs.length > 0 &&
          txs
            .filter((tx) => {
              return tx.txHash != null
            })
            .map((tx, idx) => {
              return (
                <Typography className={classes.viewDetailsText} key={`tx_key_${idx}`}>
                  <a href={`${ETHERSCAN_URL}/tx/${tx?.txHash}`} target="_blank" rel="noreferrer">
                    {tx && tx.description ? tx.description : 'View in Explorer'}{' '}
                    <OpenInNewIcon className={classes.newWindowIcon} />
                  </a>
                </Typography>
              )
            })}
      </div>
    )
  }

  const renderTransactions = (transactions) => {
    // if (
    //   transactions &&
    //   transactions.filter((tx) => {
    //     return ['DONE', 'CONFIRMED'].includes(tx.status)
    //   }).length === transactions.length
    // ) {
    //   return null
    // }

    return (
      <>
        {/* <div className={classes.headingContainer}>
          <Typography className={classes.heading}>{purpose ? purpose : 'Pending Transactions'}</Typography>
        </div> */}
        <div className="flex flex-col space-y-1.5 text-center mt-2">
          <h2 className="text-lg font-semibold leading-none">{purpose ? purpose : 'Pending Transactions'}</h2>
        </div>
        <div className="max-h-[600px] overflow-x-hidden overflow-y-scroll">
          {transactions &&
            [...transactions].map((tx, idx) => {
              return <Transaction key={idx} transaction={tx} />
            })}
        </div>
      </>
    )
  }

  return (
    // <Dialog
    //   className={classes.dialogScale}
    //   open={open}
    //   onClose={handleClose}
    //   fullWidth={true}
    //   maxWidth={'sm'}
    //   TransitionComponent={Transition}
    //   fullScreen={fullScreen}
    // >
    //   <DialogContent>
    //     <IconButton className={classes.closeIconbutton} onClick={handleClose}>
    //       <CloseIcon />
    //     </IconButton>
    //     {renderTransactions(transactions)}
    //     {renderDone(transactions)}
    //   </DialogContent>
    // </Dialog>
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
            <Dialog.Panel className="fixed max-h-[80vh] w-[95vw] max-w-lg gap-4 overflow-y-auto border border-border bg-gradient-primary shadow-lg rounded-[20px] flex flex-col p-6 pb-8">
              {renderTransactions(transactions)}
              {/* <button
                type="button"
                className="absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-700 focus-visible:ring-offset-2 disabled:pointer-events-none"
                onClick={handleClose}
              >
                <XMarkIcon className="h-5 w-5 fill-white" aria-hidden="true" />
              </button> */}
              <button className="flex h-7 w-7 items-center justify-center absolute right-5 top-5" onClick={handleClose}>
                <XMarkIcon className="h-6 w-6 fill-text-gray hover:fill-white transition-colors" aria-hidden="true" />
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
