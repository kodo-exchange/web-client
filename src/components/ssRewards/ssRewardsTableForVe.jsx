/* eslint-disable @next/next/no-img-element */
import React from 'react'
// import PropTypes from 'prop-types'
// import { TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@material-ui/core'
// import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'

import { formatCurrency } from '../../utils'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'
// import Image from 'next/image'

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

function descendingComparator(a, b, orderBy) {
  if (!a || !b) {
    return 0
  }

  let aAmount = 0
  let bAmount = 0

  switch (orderBy) {
    case 'reward':
      if (b.rewardType < a.rewardType) {
        return -1
      }
      if (b.rewardType > a.rewardType) {
        return 1
      }
      if (b.symbol < a.symbol) {
        return -1
      }
      if (b.symbol > a.symbol) {
        return 1
      }
      return 0

    case 'balance':
      if (a.rewardType === 'Bribe') {
        aAmount = a.gauge.balance
      } else {
        aAmount = a.balance
      }

      if (b.rewardType === 'Bribe') {
        bAmount = b.gauge.balance
      } else {
        bAmount = b.balance
      }

      if (BigNumber(bAmount).lt(aAmount)) {
        return -1
      }
      if (BigNumber(bAmount).gt(aAmount)) {
        return 1
      }
      return 0

    case 'earned':
      if (a.rewardType === 'Bribe') {
        aAmount = a.gauge.bribes.length
      } else {
        aAmount = 2
      }

      if (b.rewardType === 'Bribe') {
        bAmount = b.gauge.bribes.length
      } else {
        bAmount = 2
      }

      if (BigNumber(bAmount).lt(aAmount)) {
        return -1
      }
      if (BigNumber(bAmount).gt(aAmount)) {
        return 1
      }
      return 0

    default:
      return 0
  }
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

// function EnhancedTableHead(props) {
//   const { classes, order, orderBy, onRequestSort, tokenID } = props

//   const headCells = [
//     { id: 'reward', numeric: false, disablePadding: false, label: 'Pool' },
//     {
//       id: 'balance',
//       numeric: true,
//       disablePadding: false,
//       label: 'Your Position',
//     },
//     {
//       id: 'earned',
//       numeric: true,
//       disablePadding: false,
//       label: 'You Earned',
//     },
//     {
//       id: 'bruh',
//       numeric: true,
//       disablePadding: false,
//       label: 'Actions',
//     },
//   ]

//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property)
//   }

//   return (
//     <TableHead>
//       <TableRow>
//         {headCells.map((headCell) => (
//           <TableCell
//             className={classes.overrideTableHead}
//             key={headCell.id}
//             align={headCell.numeric ? 'right' : 'left'}
//             padding={'normal'}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : 'asc'}
//               onClick={createSortHandler(headCell.id)}
//             >
//               <Typography variant="h5" className={classes.headerText}>
//                 {headCell.label}
//               </Typography>
//               {orderBy === headCell.id ? (
//                 <span className={classes.visuallyHidden}>
//                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                 </span>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   )
// }

// EnhancedTableHead.propTypes = {
//   classes: PropTypes.object.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   tokenID: PropTypes.string,
// }

// const headCells = [
//   { id: 'reward', numeric: false, disablePadding: false, label: 'Pool' },
//   {
//     id: 'balance',
//     numeric: true,
//     disablePadding: false,
//     label: 'Your Position',
//   },
//   {
//     id: 'earned',
//     numeric: true,
//     disablePadding: false,
//     label: 'You Earned',
//   },
//   {
//     id: 'bruh',
//     numeric: true,
//     disablePadding: false,
//     label: 'Actions',
//   },
// ]

export default function EnhancedTable({ rewards, tokenID }) {
  const [order, setOrder] = React.useState('desc')
  const [orderBy, setOrderBy] = React.useState('earned')

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const onClaim = (reward) => {
    if (reward.rewardType === 'Bribe') {
      stores.dispatcher.dispatch({ type: ACTIONS.CLAIM_BRIBE, content: { pair: reward, tokenID } })
    } else if (reward.rewardType === 'Fees') {
      stores.dispatcher.dispatch({ type: ACTIONS.CLAIM_PAIR_FEES, content: { pair: reward, tokenID } })
    } else if (reward.rewardType === 'Reward') {
      stores.dispatcher.dispatch({ type: ACTIONS.CLAIM_REWARD, content: { pair: reward, tokenID } })
    } else if (reward.rewardType === 'Distribution') {
      stores.dispatcher.dispatch({ type: ACTIONS.CLAIM_VE_DIST, content: { tokenID } })
    }
  }

  return (
    <div className="overflow-x-auto ">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th
                scope="col"
                className="align-top text-[14px] leading-[18px] text-text-gray font-normal px-6 py-6 cursor-pointer select-none"
                onClick={() => handleRequestSort('reward')}
              >
                <div className="flex flex-row gap-1 items-center justify-start">
                  {orderBy === 'reward' &&
                    (order === 'desc' ? (
                      <ArrowDownIcon
                        className="w-4 h-4 text-text-gray"
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowUpIcon
                        className="w-4 h-4 text-text-gray"
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      />
                    ))}
                  <div className="">Pool</div>
                </div>
              </th>
              {/* <th
                    scope="col"
                    className="align-top text-xs font-extralight text-white px-6 py-6 cursor-pointer select-none"
                    onClick={() => handleRequestSort('balance')}
                  >
                    <div className="flex flex-row gap-1 items-center justify-end ">
                      {orderBy === 'balance' &&
                        (order === 'desc' ? (
                          <ArrowDownIcon
                            className="w-4 h-4 fill-tableSortIcon"
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowUpIcon
                            className="w-4 h-4 fill-tableSortIcon"
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          />
                        ))}
                      <div>Your Position</div>
                    </div>
                  </th> */}
              <th
                scope="col"
                className="align-top text-[14px] leading-[18px] text-text-gray font-normal px-6 py-6 hidden sm:table-cell cursor-pointer select-none"
                onClick={() => handleRequestSort('earned')}
              >
                <div className="flex flex-row gap-1 items-center justify-end">
                  {orderBy === 'earned' &&
                    (order === 'desc' ? (
                      <ArrowDownIcon
                        className="w-4 h-4 text-text-gray"
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowUpIcon
                        className="w-4 h-4 text-text-gray"
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      />
                    ))}
                  <div>You Earned</div>
                </div>
              </th>
              <th
                scope="col"
                className="align-top text-[14px] leading-[18px] text-text-gray font-normal px-6 py-6 hidden sm:table-cell w-1/6"
              >
                <div className="flex flex-row gap-1 items-center justify-center">
                  <div>Actions</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="">
            {stableSort(rewards, getComparator(order, orderBy)).map((row, index) => {
              if (!row) {
                return null
              }
              return (
                <tr className="hover:bg-bg-light" key={'ssRewardsTable' + index}>
                  <td className="whitespace-nowrap text-sm leading-[18px] align-center px-4 md:px-6 py-4 text-left">
                    {['Bribe'].includes(row.rewardType) && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
                        <div className="relative flex w-[62px] max-w-[62px] min-w-[62px] h-9">
                          <img
                            className="absolute left-0 top-0 aspect-square rounded-full"
                            src={row && row.token0 && row.token0.logoURI ? row.token0.logoURI : ``}
                            width="34"
                            height="34"
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/tokens/unknown-logo.png'
                            }}
                          />
                          {/* <Image
                            className="absolute left-0 top-0 aspect-square rounded-full"
                            src={row.token0 && row.token0.logoURI ? row.token0.logoURI : '/tokens/unknown-logo.png'}
                            width={34}
                            height={34}
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/tokens/unknown-logo.png'
                            }}
                          /> */}
                          <img
                            className="absolute left-6 top-0 z-5 aspect-square rounded-full"
                            src={row && row.token1 && row.token1.logoURI ? row.token1.logoURI : ``}
                            width="34"
                            height="34"
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/tokens/unknown-logo.png'
                            }}
                          />
                          {/* <Image
                            className="absolute left-6 top-0 z-5 aspect-square rounded-full"
                            src={
                              row && row.token1 && row.token1.logoURI ? row.token1.logoURI : '/tokens/unknown-logo.png'
                            }
                            width={34}
                            height={34}
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/tokens/unknown-logo.png'
                            }}
                          /> */}
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="text-white text-sm leading-[18px] font-medium mb-[2px]">{row?.symbol}</div>
                          <div className="text-text-gray text-[10px] leading-[13px] font-normal">{row?.rewardType}</div>
                        </div>
                      </div>
                    )}
                    {['Distribution'].includes(row.rewardType) && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
                        <div className="flex justify-center w-[62px] max-w-[62px] min-w-[62px] h-9 p-0">
                          <img
                            className="rounded-full w-[34px] h-[34px]"
                            src={row && row.lockToken && row.lockToken.logoURI ? row.lockToken.logoURI : ``}
                            width="34"
                            height="34"
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/tokens/unknown-logo.png'
                            }}
                          />
                          {/* <Image
                            className="absolute left-0 top-0 rounded-full"
                            src={
                              row && row.lockToken && row.lockToken.logoURI
                                ? row.lockToken.logoURI
                                : '/tokens/unknown-logo.png'
                            }
                            width={34}
                            height={34}
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/tokens/unknown-logo.png'
                            }}
                          /> */}
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="text-white text-sm leading-[18px] font-medium mb-[2px]">
                            {row?.lockToken?.symbol}
                          </div>
                          {/* <div className="text-text-gray text-[10px] leading-[13px] font-normal">{row?.rewardType}</div> */}
                          <div className="text-text-gray text-[10px] leading-[13px] font-normal">Rebases</div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap text-xs font-extralight align-middle px-4 md:px-6 py-4  text-right">
                    {row && row.rewardType === 'Distribution' && (
                      <div className="flex flex-row gap-[4px] items-center justify-end text-white text-sm leading-[18px] font-medium">
                        <div className="">{formatCurrency(row.earned)}</div>
                        <div className="">KODO</div>
                        <img
                          className="rounded-full w-[14px] h-[14px]"
                          src={row && row.lockToken && row.lockToken.logoURI ? row.lockToken.logoURI : ``}
                          width="14"
                          height="14"
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/tokens/unknown-logo.png'
                          }}
                        />
                        {/* <Image
                          className="rounded-full"
                          src={
                            row && row.lockToken && row.lockToken.logoURI
                              ? row.lockToken.logoURI
                              : '/tokens/unknown-logo.png'
                          }
                          width={20}
                          height={20}
                          alt="KODO logo"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/tokens/unknown-logo.png'
                          }}
                        /> */}
                      </div>
                    )}
                    {row && row.rewardType === 'Bribe' && row.gauge && row.gauge.bribesEarned && (
                      <div className="flex flex-col gap-1">
                        {row.gauge.bribesEarned.map((bribe, index) => {
                          return (
                            <div
                              key={index}
                              className="flex flex-row gap-[4px] items-center justify-end text-white text-sm leading-[18px] font-medium"
                            >
                              <div className="">{formatCurrency(bribe.earned)}</div>
                              <div className="">{bribe.token?.symbol}</div>
                              <img
                                className="rounded-full w-[14px] h-[14px]"
                                src={bribe && bribe.token && bribe.token.logoURI ? bribe.token.logoURI : ``}
                                width="14"
                                height="14"
                                alt=""
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = '/tokens/unknown-logo.png'
                                }}
                              />
                              {/* <Image
                                className="rounded-full"
                                src={
                                  bribe && bribe.token && bribe.token.logoURI
                                    ? bribe.token.logoURI
                                    : '/tokens/unknown-logo.png'
                                }
                                width={20}
                                height={20}
                                alt=""
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = '/tokens/unknown-logo.png'
                                }}
                              /> */}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <div className="sm:hidden mt-4">
                      <button
                        className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 border border-border bg-bg-light hover:bg-pink-primary hover:text-white disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none h-10 py-2 px-4 rounded-md"
                        title={`Claim ${row.rewardType}`}
                        onClick={() => {
                          onClaim(row)
                        }}
                      >
                        Claim
                      </button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-xs font-extralight align-top px-4 md:px-6 py-4  text-center hidden sm:table-cell w-1/6">
                    <button
                      className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 border border-border bg-bg-light hover:bg-pink-primary hover:text-white disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none h-10 py-2 px-4 rounded-md"
                      title={`Claim ${row.rewardType}`}
                      onClick={() => {
                        onClaim(row)
                      }}
                    >
                      Claim
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
