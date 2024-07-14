import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'

import Snackbar from './snackbar'

import { ACTIONS } from '../../stores/constants'

import stores from '../../stores'
const emitter = stores.emitter

const styles = (theme) => ({
  root: {},
})

const SnackbarController = () => {
  const [open, setOpen] = useState(false)
  const [snackbarType, setSnackbarType] = useState(null)
  const [snackbarMessage, setSnackbarMessage] = useState(null)

  const [transactions, setTransactions] = useState([])
  const [purpose, setPurpose] = useState(null)
  const [type, setType] = useState(null)
  const [action, setAction] = useState(null)

  const showError = (error) => {
    setSnackbarMessage(null)
    setSnackbarType(null)
    setOpen(false)

    setTimeout(() => {
      setSnackbarMessage(error.toString())
      setSnackbarType('Error')
      setOpen(true)
    })
  }

  const showSuccess = (success) => {
    setSnackbarMessage(null)
    setSnackbarType(null)
    setOpen(false)

    setTimeout(() => {
      setSnackbarMessage(success.toString())
      setSnackbarType('Success')
      setOpen(true)
    })
  }

  useEffect(() => {
    const transactionAdded = (params) => {
      setPurpose(params.title)
      setType(params.type)
      setAction(params.verb)
      const txs = [...params.transactions]
      setTransactions(txs)
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
          showSuccess(`${tx.description}: transaction succeeded.`)
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
          showError(`${tx.error}: transaction failed.`)
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

    stores.emitter.on(ACTIONS.TX_ADDED, transactionAdded)
    stores.emitter.on(ACTIONS.TX_PENDING, transactionPending)
    stores.emitter.on(ACTIONS.TX_SUBMITTED, transactionSubmitted)
    stores.emitter.on(ACTIONS.TX_CONFIRMED, transactionConfirmed)
    stores.emitter.on(ACTIONS.TX_REJECTED, transactionRejected)
    stores.emitter.on(ACTIONS.TX_STATUS, transactionStatus)

    return () => {
      stores.emitter.removeListener(ACTIONS.TX_ADDED, transactionAdded)
      stores.emitter.removeListener(ACTIONS.TX_PENDING, transactionPending)
      stores.emitter.removeListener(ACTIONS.TX_SUBMITTED, transactionSubmitted)
      stores.emitter.removeListener(ACTIONS.TX_CONFIRMED, transactionConfirmed)
      stores.emitter.removeListener(ACTIONS.TX_REJECTED, transactionRejected)
      stores.emitter.removeListener(ACTIONS.TX_STATUS, transactionStatus)
    }
  }, [transactions])

  useEffect(() => {
    emitter.on(ACTIONS.ERROR, showError)

    return () => {
      emitter.removeListener(ACTIONS.ERROR, showError)
    }
  }, [])

  // if (open) {
  //   return <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
  // } else {
  //   return <div></div>
  // }
  return <Snackbar type={snackbarType} message={snackbarMessage} open={open} setOpen={setOpen} />
}

export default withStyles(styles)(SnackbarController)
