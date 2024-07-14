import { useState } from 'react'

// import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
// import HourglassFullIcon from '@material-ui/icons/HourglassFull'
// import CheckCircleIcon from '@material-ui/icons/CheckCircle'
// import ErrorIcon from '@material-ui/icons/Error'
// import PauseIcon from '@material-ui/icons/Pause'

import { ETHERSCAN_URL } from '../../stores/constants'
import { formatAddress } from '../../utils'

import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/outline'
import { Bars } from 'react-loader-spinner'
import { Tooltip } from 'react-tooltip'

export default function Transaction({ transaction }) {
  const [expanded, setExpanded] = useState(false)

  const mapStatusToIcon = (status) => {
    switch (status) {
      case 'WAITING':
        return <PauseCircleIcon className="text-gray-400 w-6 h-6 flex-shrink-0" />
      case 'PENDING':
        return <Bars color="#FD009C" height={20} width={24} />
      case 'SUBMITTED':
        // return <HourglassFullIcon className="text-pink-primary" />
        return <Bars color="#FD009C" height={20} width={24} />
      case 'CONFIRMED':
        return <CheckCircleIcon className="text-green-400 w-6 h-6 flex-shrink-0" />
      case 'REJECTED':
        return <ExclamationCircleIcon className="text-red-400 w-6 h-6 flex-shrink-0" />
      case 'DONE':
        return <CheckCircleIcon className="text-green-400 w-6 h-6 flex-shrink-0" />
      default:
    }
  }

  const mapStatusToTootip = (status) => {
    switch (status) {
      case 'WAITING':
        return 'Transaction will be submitted once ready'
      case 'PENDING':
        return 'Transaction is pending your approval in your wallet'
      case 'SUBMITTED':
        return 'Transaction has been submitted to the blockchain and we are waiting on confirmation.'
      case 'CONFIRMED':
        return 'Transaction has been confirmed by the blockchain.'
      case 'REJECTED':
        return 'Transaction has been rejected.'
      default:
        return ''
    }
  }

  const onExpendTransaction = () => {
    setExpanded(!expanded)
  }

  const onViewTX = () => {
    window.open(`${ETHERSCAN_URL}/tx/${transaction.txHash}`, '_blank')
  }

  return (
    // <div className={classes.transaction} key={transaction.uuid}>
    //   <div className={classes.transactionInfo} onClick={onExpendTransaction}>
    //     <Typography className={classes.transactionDescription}>{transaction.description}</Typography>
    //     <Tooltip title={mapStatusToTootip(transaction.status)}>{mapStatusToIcon(transaction.status)}</Tooltip>
    //   </div>
    //   {expanded && (
    //     <div className={classes.transactionExpanded}>
    //       {transaction.txHash && (
    //         <div className={classes.transaactionHash}>
    //           <Typography color="textSecondary">{formatAddress(transaction.txHash, 'long')}</Typography>
    //           <Button onClick={onViewTX}>View in Explorer</Button>
    //         </div>
    //       )}
    //       {transaction.error && <Typography className={classes.errorText}>{transaction.error}</Typography>}
    //     </div>
    //   )}
    // </div>
    <div
      className="py-5 px-4 mt-2 rounded-[10px] border border-border bg-table-dark hover:border-pink-primary transition-colors duration-300"
      key={transaction.uuid}
    >
      <div className="flex justify-between items-center cursor-pointer" onClick={onExpendTransaction}>
        <div className="text-md">{transaction.description}</div>
        {/* <Tooltip title={mapStatusToTootip(transaction.status)}>{mapStatusToIcon(transaction.status)}</Tooltip> */}
        <div className="">
          <Tooltip id={`tx-status-${transaction.uuid}`} className="max-w-md whitespace-normal" />
          <a
            data-tooltip-id={`tx-status-${transaction.uuid}`}
            data-tooltip-place="top-start"
            data-tooltip-content={mapStatusToTootip(transaction.status)}
          >
            {mapStatusToIcon(transaction.status)}
          </a>
        </div>
      </div>
      {expanded && (
        // {true && (
        <div>
          {transaction.txHash && (
            <div
              className="flex flex-row flex-wrap text-text-gray pt-3 cursor-pointer transition-colors hover:text-white"
              onClick={onViewTX}
            >
              <div className="text-sm">{formatAddress(transaction.txHash, 'long')}</div>
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 mt-0.5" />
            </div>
            // <div className="flex items-center w-full">
            //   <div className="flex flex-row text-blue-gray-400 mt-2" onClick={onViewTX}>
            //     <div className="text-sm">{formatAddress(transaction.txHash, 'long')}</div>
            //     <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 mt-0.5" />
            //   </div>
            //   <button onClick={onViewTX}>View in Explorer</button>
            // </div>
          )}
          {transaction.error && <div className="text-red-500 pt-3 text-sm">{transaction.error}</div>}
        </div>
      )}
    </div>
  )
}

{
  /* <div>
  <Tooltip id="lp-balance-wallet-tooltip" className="max-w-md whitespace-normal" />
  <a
    data-tooltip-id="lp-balance-wallet-tooltip"
    data-tooltip-place="bottom"
    data-tooltip-content={formatCurrency(pair?.balance, pair?.decimals)}
  >
    <div className="cursor-default">{formatCurrency(pair?.balance, 10)}</div>
  </a>
</div> */
}
