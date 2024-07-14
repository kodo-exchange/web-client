import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'

import { formatCurrency, formatAddress } from '../../utils'

import { MagnifyingGlassIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

import RangeSlider from './ssRangeSlider'
import { ETHERSCAN_URL, CONTRACTS } from '../../stores/constants'

import { Tooltip } from 'react-tooltip'

function descendingComparator(a, b, orderBy) {
  if (!a || !b) {
    return 0
  }

  switch (orderBy) {
    case 'asset':
      if (a.tvl === undefined && b.tvl === undefined) {
        return 0
      }
      if (a.tvl === undefined) {
        return 1
      }
      if (b.tvl === undefined) {
        return -1
      }
      if (BigNumber(b.tvl).lt(a.tvl)) {
        return -1
      }
      if (BigNumber(b.tvl).gt(a.tvl)) {
        return 1
      }
      return 0

    case 'totalVotes':
      if (a.gauge?.weight === undefined && b.gauge?.weight === undefined) {
        return 0
      }
      if (a.gauge?.weight === undefined) {
        return 1
      }
      if (b.gauge?.weight === undefined) {
        return -1
      }
      if (BigNumber(b.gauge?.weight).lt(a.gauge?.weight)) {
        return -1
      }
      if (BigNumber(b.gauge?.weight).gt(a.gauge?.weight)) {
        return 1
      }
      return 0

    case 'apy':
      if (a.gauge?.apr === undefined && b.gauge?.apr === undefined) {
        return 0
      }
      if (a.gauge?.apr === undefined) {
        return 1
      }
      if (b.gauge?.apr === undefined) {
        return -1
      }
      if (BigNumber(b.gauge?.apr).lt(a.gauge?.apr)) {
        return -1
      }
      if (BigNumber(b.gauge?.apr).gt(a.gauge?.apr)) {
        return 1
      }
      return 0

    case 'tbv':
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

    case 'valuePerVote':
      if (a.gauge?.valuePerVote === undefined && b.gauge?.valuePerVote === undefined) {
        return 0
      }
      if (a.gauge?.valuePerVote === undefined) {
        return 1
      }
      if (b.gauge?.valuePerVote === undefined) {
        return -1
      }
      if (BigNumber(b.gauge?.valuePerVote).lt(a.gauge?.valuePerVote)) {
        return -1
      }
      if (BigNumber(b.gauge?.valuePerVote).gt(a.gauge?.valuePerVote)) {
        return 1
      }
      return 0

    case 'balance':
      if (BigNumber(b?.gauge?.balance).lt(a?.gauge?.balance)) {
        return -1
      }
      if (BigNumber(b?.gauge?.balance).gt(a?.gauge?.balance)) {
        return 1
      }
      return 0

    case 'liquidity':
      let reserveA = BigNumber(a?.reserve0).plus(a?.reserve1).toNumber()
      let reserveB = BigNumber(b?.reserve0).plus(b?.reserve1).toNumber()

      if (BigNumber(reserveB).lt(reserveA)) {
        return -1
      }
      if (BigNumber(reserveB).gt(reserveA)) {
        return 1
      }
      return 0

    case 'myVotes':
      if (BigNumber(a.sliderValue).lt(b.sliderValue)) {
        return -1
      }
      if (BigNumber(a.sliderValue).gt(b.sliderValue)) {
        return 1
      }
      return 0

    case 'mvp':
      if (BigNumber(b?.gauge?.bribes.length).lt(a?.gauge?.bribes.length)) {
        return -1
      }
      if (BigNumber(b?.gauge?.bribes.length).gt(a?.gauge?.bribes.length)) {
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

const headCells = [
  { id: 'asset', numeric: false, disablePadding: false, label: 'Asset' },
  {
    id: 'balance',
    numeric: true,
    disablePadding: false,
    label: 'My Stake',
  },
  {
    id: 'liquidity',
    numeric: true,
    disablePadding: false,
    label: 'Total Liquidity',
  },
  {
    id: 'totalVotes',
    numeric: true,
    disablePadding: false,
    label: 'Total Votes',
  },
  {
    id: 'apy',
    numeric: true,
    disablePadding: false,
    label: 'Bribes',
  },
  {
    id: 'myVotes',
    numeric: true,
    disablePadding: false,
    label: 'My Votes',
  },
  {
    id: 'mvp',
    numeric: true,
    disablePadding: false,
    label: 'My Vote %',
  },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  function getSortIcon(currentOrderBy, orderBy, order) {
    if (currentOrderBy !== orderBy) {
      return null
    }

    return order === 'desc' ? (
      <ArrowDownIcon
        className="w-3.5 h-3.5 text-blue-gray-400"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
      />
    ) : (
      <ArrowUpIcon
        className="w-3.5 h-3.5 text-blue-gray-400"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
      />
    )
  }

  return (
    <thead>
      <tr>
        <th
          scope="col"
          className="align-top text-[14px] leading-[18px] text-text-gray font-normal whitespace-nowrap px-6 py-6 select-none"
          onClick={createSortHandler('asset')}
        >
          <div className="flex flex-row gap-1 items-center justify-start">
            <div className="">Pair</div>
            {getSortIcon(orderBy, 'asset', order)}
          </div>
        </th>
        <th
          scope="col"
          className="align-top text-[14px] leading-[18px] text-text-gray font-normal whitespace-nowrap px-6 py-6 cursor-pointer select-none"
          onClick={createSortHandler('totalVotes')}
        >
          <div className="flex flex-row gap-1 items-center justify-end">
            {getSortIcon(orderBy, 'totalVotes', order)}
            <div className="flex flex-col items-end">
              <div className="flex items-center whitespace-nowrap">
                Votes
                <span className="text-base">
                  <Tooltip id="votes-tooltip" className="max-w-md whitespace-normal text-left" />
                  <a
                    data-tooltip-id="votes-tooltip"
                    data-tooltip-place="top"
                    data-tooltip-content="Votes received by the pool (and its percentage of the total)."
                  >
                    <InformationCircleIcon className="self-center shrink-0 mx-1 h-[15px] w-[15px] text-text-gray" />
                  </a>
                </span>
              </div>
              {/* <div className="whitespace-nowrap">
                <span className="">% of Total</span>
              </div>
              <div className="whitespace-nowrap">
                <span className="">$ Per Vote</span>
              </div> */}
            </div>
          </div>
        </th>
        <th
          scope="col"
          className="align-top text-[14px] leading-[18px] text-text-gray font-normal whitespace-nowrap px-6 py-6 cursor-pointer select-none"
          onClick={createSortHandler('apy')}
        >
          <div className="flex flex-row gap-1 items-center justify-end">
            {getSortIcon(orderBy, 'apy', order)}
            <div className="flex flex-col items-end">
              <div className="flex items-center whitespace-nowrap">
                Voting APR
                <span className="text-base">
                  <Tooltip id="voting-apr-tooltip" className="max-w-md whitespace-normal text-left" />
                  <a
                    data-tooltip-id="voting-apr-tooltip"
                    data-tooltip-place="top"
                    data-tooltip-content="Annualized voting rewards for current epoch."
                  >
                    <InformationCircleIcon className="self-center shrink-0 mx-1 h-[15px] w-[15px] text-text-gray" />
                  </a>
                </span>
              </div>
              {/* <div className="whitespace-nowrap">Voting APR /</div>
              <div className="whitespace-nowrap">
                <span className="">Last Epoch APR</span>
              </div> */}
            </div>
          </div>
        </th>
        <th
          scope="col"
          className="align-top text-[14px] leading-[18px] text-text-gray font-normal whitespace-nowrap px-6 py-6 cursor-pointer select-none"
          onClick={createSortHandler('tbv')}
        >
          <div className="flex flex-row gap-1 items-center justify-end">
            {getSortIcon(orderBy, 'tbv', order)}
            <div className="flex items-center whitespace-nowrap">
              Fees &amp; Bribes
              <span className="text-base">
                <Tooltip id="fees-bribes-tooltip" className="max-w-md whitespace-normal text-left" />
                <a
                  data-tooltip-id="fees-bribes-tooltip"
                  data-tooltip-place="top"
                  data-tooltip-content="Trading fees from the previous epoch + bribes from current epoch."
                >
                  <InformationCircleIcon className="self-center shrink-0 mx-1 h-[15px] w-[15px] text-text-gray" />
                </a>
              </span>
            </div>
          </div>
        </th>
        <th
          scope="col"
          className="align-top text-[14px] leading-[18px] text-text-gray font-normal whitespace-nowrap px-6 py-6 cursor-pointer select-none"
          onClick={createSortHandler('myVotes')}
        >
          <div className="flex flex-row gap-1 items-center justify-end">
            {getSortIcon(orderBy, 'myVotes', order)}
            <div className="flex flex-col items-end">
              <div className="flex items-center whitespace-nowrap">
                My Votes
                <span className="text-base">
                  <Tooltip id="fees-bribes-tooltip" className="max-w-md whitespace-normal text-left" />
                  <a
                    data-tooltip-id="fees-bribes-tooltip"
                    data-tooltip-place="top"
                    data-tooltip-content="Your votes (and its percentage) and estimated rewards."
                  >
                    <InformationCircleIcon className="self-center shrink-0 mx-1 h-[15px] w-[15px] text-text-gray" />
                  </a>
                </span>
              </div>
              {/* <div className="whitespace-nowrap">
                <span className="">My % Votes /</span>
              </div> */}
              {/* <div className="whitespace-nowrap">
                <span className="">My $ Per Vote /</span>
              </div> */}
              {/* <div className="whitespace-nowrap">
                <span className="">My Expected Income</span>
              </div> */}
            </div>
          </div>
        </th>
      </tr>
    </thead>
  )
}

EnhancedTableHead.propTypes = {
  // classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
}

export default function EnhancedTable({ gauges, setParentSliderValues, defaultVotes, veToken, token }) {
  // const classes = useStyles()

  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('totalVotes')
  const [sliderValues, setSliderValues] = useState(defaultVotes)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [page, setPage] = useState(0)

  // const [slideValues, setSlideValues] = useState([3600 * 24 * 7]) // the current value of the slider

  useEffect(() => {
    setSliderValues(defaultVotes)
  }, [defaultVotes])

  // notice: value here is in the form of [slide_value].
  const onSliderChange = (asset) => (value) => {
    let newSliderValues = [...sliderValues]

    newSliderValues = newSliderValues.map((val) => {
      if (asset?.address === val.address) {
        val.value = value[0]
      }
      return val
    })

    setParentSliderValues(newSliderValues)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
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

  // const renderTooltip = (pair) => {
  //   return (
  //     <div className={classes.tooltipContainer}>
  //       {pair?.gauge?.bribes.map((bribe, idx) => {
  //         let earned = 0
  //         if (pair.gauge.bribesEarned && pair.gauge.bribesEarned.length > idx) {
  //           earned = pair.gauge.bribesEarned[idx].earned
  //         }

  //         return (
  //           <div key={idx} className={classes.inlineBetween}>
  //             <Typography>Bribe:</Typography>
  //             <Typography>
  //               {formatCurrency(bribe.rewardAmount)} {bribe.token.symbol}
  //             </Typography>
  //           </div>
  //         )
  //       })}
  //     </div>
  //   )
  // }

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, gauges.length - page * rowsPerPage)
  // const marks = [
  //   {
  //     value: -100,
  //     label: '-100',
  //   },
  //   {
  //     value: 0,
  //     label: '0',
  //   },
  //   {
  //     value: 100,
  //     label: '100',
  //   },
  // ]

  return (
    <div className="font-inter rounded-[20px] w-full bg-bg-table border border-border">
      <div>
        <div className="overflow-x-auto ">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full sm:divide-y sm:divide-border">
              <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
              <tbody className="">
                {gauges.length === 0 ? (
                  <tr>
                    <td className="whitespace-nowrap pl-4 py-6 text-xs text-text-gray align-top">No items available</td>
                  </tr>
                ) : (
                  stableSort(
                    gauges.map((row) => {
                      let sliderValue = sliderValues.find((el) => el.address === row?.address)?.value
                      if (sliderValue) {
                        sliderValue = BigNumber(sliderValue).toNumber(0)
                      } else {
                        sliderValue = 0
                      }
                      return { ...row, sliderValue }
                    }),
                    getComparator(order, orderBy)
                  )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      if (!row) {
                        return null
                      }
                      // let sliderValue = sliderValues.find((el) => el.address === row?.address)?.value
                      // if (sliderValue) {
                      //   sliderValue = BigNumber(sliderValue).toNumber(0)
                      // } else {
                      //   sliderValue = 0
                      // }
                      // console.log('nft', token)
                      // console.log('sliderValues', sliderValues)
                      // console.log('sliderValue', sliderValue)

                      // let totalValue = row.gauge.bribeValue ?? BigNumber(0)

                      const labelId = `enhanced-table-${index}`
                      return (
                        <tr key={labelId} className="hover:bg-bg-light">
                          <td className="whitespace-nowrap text-sm leading-[18px] align-center px-4 md:px-6 py-4 text-left">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <div className="relative flex w-[62px] max-w-[62px] min-w-[62px] h-9">
                                <img
                                  className="absolute left-0 top-0 aspect-square rounded-full w-[34px] h-[34px]"
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
                                  className="absolute left-[26px] top-0 z-10 aspect-square rounded-full w-[34px] h-[34px]"
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
                              <div className="flex flex-col items-start">
                                <div className="text-white text-sm leading-[18px] font-medium mb-[3px]">
                                  {(row?.symbol ?? '').replace(/^(VolatileV1 AMM - |StableV1 AMM - )/, '')}
                                </div>
                                <div className="flex text-text-gray text-[10px] leading-[13px] font-normal mb-[3px]">
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
                                </div>
                                <div className="flex text-text-gray text-[10px] leading-[13px] font-normal gap-1">
                                  <span>TVL</span>
                                  <span className="text-white">
                                    {row?.tvl ? `~$${formatCurrency(row.tvl, 2)}` : '$0.00'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                            <div className="text-white text-sm leading-[18px] font-medium mb-[2px]">
                              <div className="">{formatCurrency(row?.gauge?.weight ?? 0)}</div>
                            </div>
                            <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                              <div className="">{formatCurrency(row?.gauge?.weightPercent ?? 0, 4)}%</div>
                            </div>
                            {/* <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                              <div className="">${formatCurrency(row.gauge.valuePerVote ?? 0, 4)}</div>
                            </div> */}
                          </td>
                          <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                            <div className="flex flex-row justify-end text-white text-sm leading-[18px] font-medium">
                              <div className="">{formatCurrency(row?.gauge?.apr ?? 0)}%</div>
                              <span className="flex items-center">
                                <a data-tooltip-id={`voting-apr-tooltip-${labelId}`} data-tooltip-place="top">
                                  <InformationCircleIcon className="self-center shrink-0 mx-1 h-[15px] w-[15px] text-text-gray" />
                                </a>
                              </span>
                              <Tooltip
                                id={`voting-apr-tooltip-${labelId}`}
                                className="max-w-md border border-border z-20 opacity-100 hover:opacity-100"
                                style={{
                                  padding: '18px',
                                  backgroundColor: '#000000',
                                  borderRadius: '8px',
                                }}
                              >
                                <div className="flex flex-col gap-2 font-normal text-base">
                                  {row?.gauge?.apr_rebase && (
                                    <div className="flex gap-2">
                                      <div className="text-sm text-white">
                                        {formatCurrency(row?.gauge?.apr_rebase ?? 0)}%
                                      </div>
                                      <div className="text-sm text-text-gray">Rebase APR</div>
                                    </div>
                                  )}
                                  <div
                                    data-orientation="horizontal"
                                    role="none"
                                    className="shrink-0 bg-border h-[1px] w-full mt-[2px]"
                                  ></div>
                                  {row?.gauge?.apr && (
                                    <div className="flex gap-2">
                                      <div className="text-sm text-white">
                                        {formatCurrency(BigNumber(row?.gauge?.apr).minus(row?.gauge?.apr_rebase) ?? 0)}%
                                      </div>
                                      <div className="text-sm text-text-gray">Fees + Bribes APR</div>
                                    </div>
                                  )}
                                </div>
                              </Tooltip>
                            </div>
                            {/* <div className="flex flex-row gap-1 justify-end">
                              <div className="text-blue-gray-400">42.21%</div>
                            </div> */}
                          </td>
                          <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                            <div className="flex flex-col">
                              <div className="flex flex-col gap-[2px]">
                                {row?.gauge?.bribes
                                  .filter((bribe) => BigNumber(bribe.rewardAmount).gt(0))
                                  .map((bribe, idx) => {
                                    return (
                                      <div key={idx} className="flex flex-col gap-1">
                                        <div className="flex flex-row gap-[4px] items-center justify-end text-white text-sm leading-[18px] font-medium">
                                          <div className="">{formatCurrency(bribe.rewardAmount)}</div>
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
                                      </div>
                                    )
                                  })}
                              </div>
                              <div
                                data-orientation="horizontal"
                                role="none"
                                className="shrink-0 bg-border h-[1px] w-full mt-[2px]"
                              ></div>
                              <div className="flex flex-row gap-1 justify-end text-[10px] text-text-gray leading-[13px] font-normal mt-[2px]">
                                <span className="">Net Total:</span>
                                <div className="flex flex-row gap-1 justify-end">
                                  <div className="">${formatCurrency(row.gauge.tbv)}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap align-center px-4 md:px-6 py-4  text-right">
                            <div className="text-white text-sm leading-[18px] font-medium mb-[2px]">
                              <div className="">
                                {formatCurrency(BigNumber(row.sliderValue).div(100).times(token?.lockValue), 2)}
                              </div>
                            </div>
                            <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                              <div className="">{formatCurrency(row.sliderValue, 4)}%</div>
                            </div>
                            {/* <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                              <div className="">${formatCurrency(row.gauge.valuePerVote ?? 0, 4)}</div>
                            </div> */}
                            <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                              <div>Est.:</div>
                              <div className="text-white">
                                $
                                {formatCurrency(
                                  row?.gauge?.weight && !BigNumber(row?.gauge?.weight).isEqualTo(0)
                                    ? BigNumber(row.gauge.tbv)
                                        .dividedBy(row?.gauge?.weight)
                                        .times(row.sliderValue)
                                        .div(100)
                                        .times(token?.lockValue)
                                    : BigNumber(row.gauge.tbv),
                                  4
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap text-[10px] leading-[13px] font-normal align-top px-4 md:px-6 py-4">
                            <RangeSlider slideValues={[row.sliderValue]} setSlideValues={onSliderChange(row)} />
                          </td>
                        </tr>
                      )
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {gauges.length > rowsPerPage && (
        <div className="">
          <div className="overflow-x-auto">
            <div className="flex w-full justify-center sm:justify-end py-4 items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>Rows per page:</div>
              <div>
                <select
                  className="bg-bg-table focus:bg-bg-light ring-0 p-1"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value={`${gauges.length}`}>All</option>
                </select>
              </div>
              <div>{`${page * rowsPerPage + 1}-${(page + 1) * rowsPerPage} of ${gauges.length}`}</div>
              <div className="flex flex-row gap-0 sm:gap-1 items-center max-h-12 h-12">
                <button
                  // className="rounded-full w-8 h-8 md:w-12 md:h-12 hover:bg-blue-gray-700/70 hover:text-white hover:cursor-pointer"
                  className={`rounded-full w-8 h-8 md:w-12 md:h-12 ${
                    page === 0 ? 'cursor-not-allowed' : 'hover:bg-bg-light hover:text-white hover:cursor-pointer'
                  }`}
                  disabled={page === 0}
                  onClick={() => handleChangePage(null, page - 1)}
                >
                  &lt;
                </button>
                <button
                  // className="rounded-full w-8 h-8 md:w-12 md:h-12 hover:bg-blue-gray-700/70 hover:text-white hover:cursor-pointer"
                  className={`rounded-full w-8 h-8 md:w-12 md:h-12 ${
                    page >= Math.ceil(gauges.length / rowsPerPage) - 1
                      ? 'cursor-not-allowed'
                      : 'hover:bg-bg-light hover:text-white hover:cursor-pointer'
                  }`}
                  disabled={page >= Math.ceil(gauges.length / rowsPerPage) - 1}
                  onClick={() => handleChangePage(null, page + 1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
