import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  // Tooltip,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import FilterListIcon from '@material-ui/icons/FilterList'
import SearchIcon from '@material-ui/icons/Search'
import { formatCurrency, formatAddress, formatTokenBalance } from '../../utils'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { ETHERSCAN_URL, CONTRACTS } from '../../stores/constants'
import { Tooltip } from 'react-tooltip'
import { InformationCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

function descendingComparator(a, b, orderBy) {
  if (!a || !b) {
    return 0
  }

  switch (orderBy) {
    case 'bribeValue':
      if (a.gauge?.tbv === undefined && b.gauge?.tbv === undefined) {
        return 0
      }
      if (a.gauge?.tbv === undefined) {
        return 1
      }
      if (b.gauge?.tbv === undefined) {
        return -1
      }
      if (BigNumber(b.gauge?.tbv).lt(a.gauge?.tbv)) {
        return -1
      }
      if (BigNumber(b.gauge?.tbv).gt(a.gauge?.tbv)) {
        return 1
      }
      return 0

    default:
      if (b[orderBy] < a[orderBy]) {
        return -1
      }
      if (b[orderBy] > a[orderBy]) {
        return 1
      }
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

const headCells = [
  { id: 'pair', numeric: false, disablePadding: false, label: 'Pair' },
  {
    id: 'poolBalance',
    numeric: true,
    disablePadding: false,
    label: 'My Pool Amount',
  },
  {
    id: 'stakedBalance',
    numeric: true,
    disablePadding: false,
    label: 'My Staked Amount',
  },
  {
    id: 'rewardPerToken',
    numeric: true,
    disablePadding: false,
    label: 'Bribe Amount',
  },
  {
    id: 'earned',
    numeric: true,
    disablePadding: false,
    label: 'Earned',
  },
  {
    id: 'apy',
    numeric: true,
    disablePadding: false,
    label: 'APY',
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            className={classes.overrideTableHead}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography variant="h5" className={classes.headerText}>
                {headCell.label}
              </Typography>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  assetTableRow: {
    '&:hover': {
      background: 'rgba(104,108,122,0.05)',
    },
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  inline: {
    display: 'flex',
    alignItems: 'center',
  },
  inlineEnd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  icon: {
    marginRight: '12px',
  },
  textSpaced: {
    lineHeight: '1.5',
    fontWeight: '200',
    fontSize: '12px',
  },
  headerText: {
    fontWeight: '200',
    fontSize: '12px',
  },
  cell: {},
  cellSuccess: {
    color: '#4eaf0a',
  },
  cellAddress: {
    cursor: 'pointer',
  },
  aligntRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  skelly: {
    marginBottom: '12px',
    marginTop: '12px',
  },
  skelly1: {
    marginBottom: '12px',
    marginTop: '24px',
  },
  skelly2: {
    margin: '12px 6px',
  },
  tableBottomSkelly: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  assetInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: '24px',
    width: '100%',
    flexWrap: 'wrap',
    borderBottom: '1px solid rgba(104, 108, 122, 0.25)',
    background: 'radial-gradient(circle, rgba(63,94,251,0.7) 0%, rgba(47,128,237,0.7) 48%) rgba(63,94,251,0.7) 100%',
  },
  assetInfoError: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: '24px',
    width: '100%',
    flexWrap: 'wrap',
    borderBottom: '1px rgba(104, 108, 122, 0.25)',
    background: '#dc3545',
  },
  infoField: {
    flex: 1,
  },
  flexy: {
    padding: '6px 0px',
  },
  overrideCell: {
    padding: '0px',
  },
  hoverRow: {
    cursor: 'pointer',
  },
  statusLiquid: {
    color: '#dc3545',
  },
  statusWarning: {
    color: '#FF9029',
  },
  statusSafe: {
    color: 'green',
  },
  img1Logo: {
    position: 'absolute',
    left: '0px',
    top: '0px',
  },
  img2Logo: {
    position: 'absolute',
    left: '20px',
    zIndex: '1',
    top: '0px',
  },
  overrideTableHead: {
    borderBottom: '1px solid rgba(104,108,122,0.2) !important',
  },
  doubleImages: {
    display: 'flex',
    position: 'relative',
    width: '70px',
    height: '35px',
  },
  searchContainer: {
    flex: 1,
    minWidth: '300px',
    marginLeft: '30px',
    marginRight: '40px',
  },
  buttonOverride: {
    color: 'rgb(6, 211, 215)',
    background: 'rgb(23, 52, 72)',
    fontWeight: '700',
    '&:hover': {
      background: 'rgb(19, 44, 60)',
    },
  },
  toolbar: {
    paddingTop: '24px',
  },
}))

// const EnhancedTableToolbar = (props) => {
//   const classes = useStyles()
//   const router = useRouter()

//   const [search, setSearch] = useState('')

//   const onSearchChanged = (event) => {
//     setSearch(event.target.value)
//   }

//   const onAdd = () => {
//     router.push('/bribe/create')
//   }

//   return (
//     <Toolbar className={classes.toolbar}>
//       <Button variant="contained" size="large" className={classes.buttonOverride} color="primary" onClick={onAdd}>
//         <Typography className={classes.actionButtonText}>Add Bribe</Typography>
//       </Button>
//       <TextField
//         className={classes.searchContainer}
//         variant="outlined"
//         fullWidth
//         placeholder="ETH, TAIKO, 0x..."
//         value={search}
//         onChange={onSearchChanged}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon />
//             </InputAdornment>
//           ),
//         }}
//       />
//       <Tooltip title="Filter list">
//         <IconButton aria-label="filter list">
//           <FilterListIcon />
//         </IconButton>
//       </Tooltip>
//     </Toolbar>
//   )
// }

export default function EnhancedTable({ gauges }) {
  const classes = useStyles()
  const router = useRouter()

  const [order, setOrder] = React.useState('desc')
  const [orderBy, setOrderBy] = React.useState('balance')

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // if (!gauges) {
  //   return (
  //     <div className={classes.root}>
  //       <Skeleton variant="rect" width={'100%'} height={40} className={classes.skelly1} />
  //       <Skeleton variant="rect" width={'100%'} height={70} className={classes.skelly} />
  //       <Skeleton variant="rect" width={'100%'} height={70} className={classes.skelly} />
  //       <Skeleton variant="rect" width={'100%'} height={70} className={classes.skelly} />
  //       <Skeleton variant="rect" width={'100%'} height={70} className={classes.skelly} />
  //       <Skeleton variant="rect" width={'100%'} height={70} className={classes.skelly} />
  //     </div>
  //   )
  // }

  const onView = (pair) => {
    router.push(`/liquidity/${pair.address}`)
  }

  return (
    <div className="rounded-xl bg-gradient-primary border border-border p-8 flex-1">
      <div className="mb-6">
        <div className="mb-2 font-semibold text-white text-xl">Top 6 Vote Incentives</div>
        <div className="font-normal text-text-gray text-sm">
          Pools with the highest voting rewards in this epoch (Rankings may vary).
        </div>
      </div>
      <div className="space-y-4">
        {stableSort(gauges, getComparator('desc', 'bribeValue'))
          .slice(0, 6)
          .map((row, index) => {
            if (!row) {
              return null
            }
            const labelId = `bribe-${index}`

            return (
              <div key={labelId} className="border border-border bg-table-dark rounded-[10px] p-4">
                <div className="grid grid-cols-2 md:grid-cols-[80px_1fr_1fr_1fr] gap-y-4 gap-x-2">
                  <div className="hidden md:block">
                    <div className="relative flex w-[62px] max-w-[62px] min-w-[62px] h-9">
                      <img
                        className="absolute left-0 top-0 aspect-square rounded-full"
                        src={row?.token0?.logoURI ?? ''}
                        width="34"
                        height="34"
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/tokens/unknown-logo.png'
                        }}
                      />
                      <img
                        className="absolute left-[26px] top-0 z-10 aspect-square rounded-full"
                        src={row?.token1?.logoURI ?? ``}
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
                        src={row?.token0?.logoURI ?? '/tokens/unknown-logo.png'}
                        width={34}
                        height={34}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/tokens/unknown-logo.png'
                        }}
                      /> */}
                      {/* <Image
                        className="absolute left-[26px] top-0 z-10 aspect-square rounded-full"
                        src={row?.token1?.logoURI ?? '/tokens/unknown-logo.png'}
                        width={34}
                        height={34}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/tokens/unknown-logo.png'
                        }}
                      /> */}
                    </div>
                  </div>
                  <div className="flex-col gap-[2px] hidden md:flex">
                    <span className="text-white text-sm font-medium">{`${row.token0.symbol}/${row.token1.symbol}`}</span>
                    <span className="flex text-text-gray md:max-w-[120px] text-[10px] leading-[13px] font-normal">
                      {row?.isStable ? 'Stable Pool' : 'Volatile Pool'}
                      <span className="flex items-center">
                        <a data-tooltip-id={`pool-tooltip-${labelId}`} data-tooltip-place="top-start">
                          <InformationCircleIcon className="self-center shrink-0 mx-1 h-[12px] w-[12px] text-text-gray" />
                        </a>
                      </span>
                      <Tooltip
                        id={`pool-tooltip-${labelId}`}
                        className="max-w-md border border-border z-20 opacity-100 hover:opacity-100"
                        style={{
                          padding: '12px',
                          backgroundColor: '#1A1A1A',
                          borderRadius: '8px',
                          width: '200px',
                        }}
                        clickable
                      >
                        <div className="flex flex-col gap-1 font-normal text-base">
                          {row?.address && (
                            <a
                              href={`${ETHERSCAN_URL}/address/${row.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="flex flex-col p-2 bg-table-dark border border-border hover:bg-bg-highlight hover:border-pink-primary rounded-md cursor-pointer">
                                <div className="text-sm">Pool Address</div>
                                <div className="flex flex-row items-center text-text-gray mt-1">
                                  <div className="text-xs ">{formatAddress(row.address)}</div>
                                  <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                                </div>
                              </div>
                            </a>
                          )}
                          {row?.gauge_address && (
                            <a
                              href={`${ETHERSCAN_URL}/address/${row.gauge_address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="flex flex-col p-2 bg-table-dark border border-border hover:bg-bg-highlight hover:border-pink-primary rounded-md cursor-pointer">
                                <div className="text-sm">Gauge Address</div>
                                <div className="flex flex-row items-center text-text-gray mt-1">
                                  <div className="text-xs ">{formatAddress(row.gauge_address)}</div>
                                  <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                                </div>
                              </div>
                            </a>
                          )}
                          {row && (
                            <div className="flex flex-col p-2 bg-table-dark border border-border  rounded-md">
                              <div className="text-sm">Pool Trading Fee</div>
                              <div className="flex flex-row items-center text-text-gray mt-1">
                                <div className="text-xs ">
                                  {row?.isStable
                                    ? `${CONTRACTS.STABLE_FEE_BPS / 100}%`
                                    : `${CONTRACTS.VOLATILE_FEE_BPS / 100}%`}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Tooltip>
                    </span>
                  </div>
                  <div className="md:hidden flex flex-row items-center gap-4 col-span-2">
                    <div className="relative flex w-[62px] max-w-[62px] min-w-[62px] h-9">
                      <img
                        className="absolute left-0 top-0 aspect-square rounded-full"
                        src={row?.token0?.logoURI ?? ''}
                        width="34"
                        height="34"
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/tokens/unknown-logo.png'
                        }}
                      />
                      <img
                        className="absolute left-[26px] top-0 z-10 aspect-square rounded-full"
                        src={row?.token1?.logoURI ?? ``}
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
                        src={row?.token0?.logoURI ?? '/tokens/unknown-logo.png'}
                        width={34}
                        height={34}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/tokens/unknown-logo.png'
                        }}
                      />
                      <Image
                        className="absolute left-[26px] top-0 z-10 aspect-square rounded-full"
                        src={row?.token1?.logoURI ?? '/tokens/unknown-logo.png'}
                        width={34}
                        height={34}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/tokens/unknown-logo.png'
                        }}
                      /> */}
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-white text-sm font-medium">{`${row.token0.symbol}/${row.token1.symbol}`}</span>
                      <span className="text-text-gray md:max-w-[120px] text-[10px] leading-[13px] font-normal">
                        {row?.isStable ? 'Stable Pool' : 'Volatile Pool'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-[2px] text-left">
                      <div className="text-text-gray text-[10px] leading-[13px] font-normal">Incentive:</div>
                      <div className="text-white text-sm leading-[18px] font-medium mb-2">
                        ${formatCurrency(row.gauge?.tbv || 0)}
                      </div>
                      <div className="text-text-gray text-[10px] leading-[13px] font-normal">Votes:</div>
                      <div className="text-white text-sm leading-[18px] font-medium">
                        {formatCurrency(row.gauge?.weight || 0)}
                      </div>
                      <div className="text-text-gray text-[10px] leading-[13px] font-normal">
                        {formatCurrency(row.gauge?.weightPercent || 0, 4)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start flex-grow gap-[2px]">
                    {row?.gauge?.bribes
                      .filter((bribe) => BigNumber(bribe.rewardAmount).gt(0))
                      .map((bribe, idx) => {
                        return (
                          <div
                            key={idx}
                            className="flex flex-row gap-[4px] items-center justify-end text-white text-sm leading-[18px] font-medium"
                          >
                            <div className="">{formatTokenBalance(bribe.token.symbol, bribe.rewardAmount)}</div>
                            <div className="">{bribe.token.symbol}</div>
                            <img
                              className="aspect-square rounded-full"
                              src={bribe.token.logoURI ?? ''}
                              width="14"
                              height="14"
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/tokens/unknown-logo.png'
                              }}
                            />
                            {/* <Image
                            className="aspect-square rounded-full"
                            src={bribe.token.logoURI ?? '/tokens/unknown-logo.png'}
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
                </div>
              </div>
            )
          })}
      </div>
    </div>
    // <div className={classes.root}>
    //   <EnhancedTableToolbar />
    //   <TableContainer>
    //     <Table className={classes.table} aria-labelledby="tableTitle" size={'medium'} aria-label="enhanced table">
    //       <EnhancedTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
    //       <TableBody>
    //         {stableSort(gauges, getComparator(order, orderBy)).map((row, index) => {
    //           if (!row) {
    //             return null
    //           }
    //           const labelId = `enhanced-table-checkbox-${index}`

    //           return (
    //             <>
    //               <TableRow key={labelId} className={classes.assetTableRow}>
    //                 <TableCell className={classes.cell} rowSpan={row.gauge.bribes.length}>
    //                   <div className={classes.inline}>
    //                     <div className={classes.doubleImages}>
    //                       <Image
    //                         className={classes.img1Logo}
    //                         src={``}
    //                         width="35"
    //                         height="35"
    //                         alt=""
    //                         onError={(e) => {
    //                           e.target.onerror = null
    //                           e.target.src = '/tokens/unknown-logo.png'
    //                         }}
    //                       />
    //                       <Image
    //                         className={classes.img2Logo}
    //                         src={``}
    //                         width="35"
    //                         height="35"
    //                         alt=""
    //                         onError={(e) => {
    //                           e.target.onerror = null
    //                           e.target.src = '/tokens/unknown-logo.png'
    //                         }}
    //                       />
    //                     </div>
    //                     <div>
    //                       <Typography variant="h2" noWrap>
    //                         {row?.symbol}
    //                       </Typography>
    //                     </div>
    //                   </div>
    //                 </TableCell>
    //                 <TableCell className={classes.cell} align="right" rowSpan={row.gauge.bribes.length}>
    //                   <Typography variant="h2" className={classes.textSpaced}>
    //                     {formatCurrency(row?.balance)}
    //                   </Typography>
    //                   <Typography variant="h5" className={classes.textSpaced} color="textSecondary">
    //                     {formatCurrency(BigNumber(row?.balance).times(100).div(row?.totalSupply))}%
    //                   </Typography>
    //                 </TableCell>
    //                 <TableCell className={classes.cell} align="right" rowSpan={row.gauge.bribes.length}>
    //                   <Typography variant="h2" className={classes.textSpaced}>
    //                     {formatCurrency(row?.gauge?.balance)}
    //                   </Typography>
    //                   <Typography variant="h5" className={classes.textSpaced} color="textSecondary">
    //                     {formatCurrency(BigNumber(row?.gauge?.balance).times(100).div(row?.gauge?.totalSupply))}
    //                   </Typography>
    //                 </TableCell>
    //               </TableRow>
    //               {row.gauge.bribes.map((bribe) => {
    //                 return (
    //                   <>
    //                     <TableCell className={classes.cell} align="right">
    //                       <Typography variant="h2" className={classes.textSpaced}>
    //                         {formatCurrency(bribe?.rewardForDuration)}
    //                       </Typography>
    //                       <Typography variant="h5" className={classes.textSpaced} color="textSecondary">
    //                         {bribe?.token?.symbol}
    //                       </Typography>
    //                     </TableCell>
    //                     <TableCell className={classes.cell} align="right">
    //                       <Typography variant="h2" className={classes.textSpaced}>
    //                         {formatCurrency(bribe?.earned)}
    //                       </Typography>
    //                       <Typography variant="h5" className={classes.textSpaced} color="textSecondary">
    //                         {bribe?.token?.symbol}
    //                       </Typography>
    //                     </TableCell>
    //                     <TableCell className={classes.cell} align="right">
    //                       <Typography variant="h2" className={classes.textSpaced}>
    //                         0.00%
    //                       </Typography>
    //                     </TableCell>
    //                     <TableCell className={classes.cell} align="right">
    //                       <Button
    //                         variant="outlined"
    //                         color="primary"
    //                         onClick={() => {
    //                           onView(row)
    //                         }}
    //                       >
    //                         {BigNumber(row.poolBalance).gt(0) ? 'Manage' : 'Deposit'}
    //                       </Button>
    //                     </TableCell>
    //                   </>
    //                 )
    //               })}
    //             </>
    //           )
    //         })}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </div>
  )
}
