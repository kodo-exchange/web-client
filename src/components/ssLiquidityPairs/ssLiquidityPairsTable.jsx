import { useState } from 'react'
import PropTypes from 'prop-types'

import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import { Switch, Tab } from '@headlessui/react'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon as InformationCircleIconSolid,
} from '@heroicons/react/24/solid'
import { InformationCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { formatCurrency, formatAddress, formatTokenBalance } from '../../utils'
import { ETHERSCAN_URL, CONTRACTS } from '../../stores/constants'

import { Tooltip } from 'react-tooltip'

function descendingComparator(a, b, orderBy) {
  if (!a || !b) {
    return 0
  }

  switch (orderBy) {
    case 'pair':
      let volumeA = BigNumber(a?.gauge?.fee_claimable_value ?? 0)
        .times(10000)
        .div(a?.stable ? CONTRACTS.STABLE_FEE_BPS : CONTRACTS.VOLATILE_FEE_BPS)
        .toNumber()
      let volumeB = BigNumber(b?.gauge?.fee_claimable_value ?? 0)
        .times(10000)
        .div(b?.stable ? CONTRACTS.STABLE_FEE_BPS : CONTRACTS.VOLATILE_FEE_BPS)
        .toNumber()

      if (BigNumber(volumeB).lt(volumeA)) {
        return -1
      }
      if (BigNumber(volumeB).gt(volumeA)) {
        return 1
      }
      return 0

    case 'apr':
      if (BigNumber(b?.apr).lt(a?.apr)) {
        return -1
      }
      if (BigNumber(b?.apr).gt(a?.apr)) {
        return 1
      }
      return 0

    case 'poolAmount':
      // let reserveA = BigNumber(a?.reserve0).plus(a?.reserve1).toNumber()
      // let reserveB = BigNumber(b?.reserve0).plus(b?.reserve1).toNumber()

      if (BigNumber(b?.tvl).lt(a?.tvl)) {
        return -1
      }
      if (BigNumber(b?.tvl).gt(a?.tvl)) {
        return 1
      }
      return 0

    case 'fee':
      let feeA = BigNumber(a?.gauge?.fee_claimable_value ?? 0).toNumber()
      let feeB = BigNumber(b?.gauge?.fee_claimable_value ?? 0).toNumber()

      if (BigNumber(feeB).lt(feeA)) {
        return -1
      }
      if (BigNumber(feeB).gt(feeA)) {
        return 1
      }
      return 0

    case 'balance':
      let valueA = BigNumber(a?.token0?.value ?? 0)
        .plus(a?.token1?.value ?? 0)
        .toNumber()
      let valueB = BigNumber(b?.token0?.value ?? 0)
        .plus(b?.token1?.value ?? 0)
        .toNumber()

      if (BigNumber(valueB).lt(valueA)) {
        return -1
      }
      if (BigNumber(valueB).gt(valueA)) {
        return 1
      }
      return 0

    case 'poolBalance':
      if (BigNumber(b?.myTvl).lt(a?.myTvl)) {
        return -1
      }
      if (BigNumber(b?.myTvl).gt(a?.myTvl)) {
        return 1
      }
      return 0

    case 'stakedBalance':
      if (!(a && a.gauge)) {
        return 1
      }

      if (!(b && b.gauge)) {
        return -1
      }

      if (BigNumber(b?.gauge?.myTvl).lt(a?.gauge?.myTvl)) {
        return -1
      }
      if (BigNumber(b?.gauge?.myTvl).gt(a?.gauge?.myTvl)) {
        return 1
      }
      return 0

    case 'stakedAmount':
      if (!(a && a.gauge)) {
        return 1
      }

      if (!(b && b.gauge)) {
        return -1
      }

      let reserveAA = BigNumber(a?.gauge?.reserve0).plus(a?.gauge?.reserve1).toNumber()
      let reserveBB = BigNumber(b?.gauge?.reserve0).plus(b?.gauge?.reserve1).toNumber()

      if (BigNumber(reserveBB).lt(reserveAA)) {
        return -1
      }
      if (BigNumber(reserveBB).gt(reserveAA)) {
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
  { id: 'pair', numeric: true, disablePadding: false, label: 'Pair', align: 'start', sortable: true },
  {
    id: 'apr',
    numeric: true,
    disablePadding: false,
    label: (
      <div className="flex items-center">
        APR
        <span className="text-base">
          <Tooltip id="apr-tooltip" className="max-w-md whitespace-normal" />
          <a
            data-tooltip-id="apr-tooltip"
            data-tooltip-place="top"
            data-tooltip-content="Annualized emission rewards for the current epoch."
          >
            <InformationCircleIcon className="self-center shrink-0 mx-1 h-[14px] w-[14px] text-text-gray" />
          </a>
        </span>
      </div>
    ),
    align: 'end',
    sortable: true,
  },
  {
    id: 'poolAmount',
    numeric: true,
    disablePadding: false,
    label: (
      <div className="flex flex-col items-end">
        <div>TVL /</div>
        <div>Pool Balance</div>
      </div>
    ),
    align: 'end',
    sortable: true,
  },
  // {
  //   id: 'stakedAmount',
  //   numeric: true,
  //   disablePadding: false,
  //   label: (
  //     <div className="flex flex-col items-end">
  //       {/* <div>TVL /</div> */}
  //       <div>Total Pool Staked</div>
  //     </div>
  //   ),
  //   align: 'end',
  //   sortable: true,
  // },
  // {
  //   id: 'volume',
  //   numeric: true,
  //   disablePadding: false,
  //   label: (
  //     <div className="flex items-center">
  //       Volume
  //       <span className="text-base">
  //         <Tooltip id="volume-tooltip" className="max-w-md whitespace-normal" />
  //         <a
  //           data-tooltip-id="volume-tooltip"
  //           data-tooltip-place="top"
  //           data-tooltip-content="Estimated volume based on fees within this epoch."
  //         >
  //           <InformationCircleIcon className="self-center shrink-0 mx-1 h-[14px] w-[14px] text-text-gray" />
  //         </a>
  //       </span>
  //     </div>
  //   ),
  //   align: 'end',
  //   sortable: true,
  // },
  {
    id: 'fee',
    numeric: true,
    disablePadding: false,
    label: (
      <div className="flex items-center">
        Fees
        <span className="text-base">
          <Tooltip id="fee-tooltip" className="max-w-md whitespace-normal" />
          <a
            data-tooltip-id="fee-tooltip"
            data-tooltip-place="top"
            data-tooltip-content="Accumulated trading fees within this epoch."
          >
            <InformationCircleIcon className="self-center shrink-0 mx-1 h-[14px] w-[14px] text-text-gray" />
          </a>
        </span>
      </div>
    ),
    align: 'end',
    sortable: true,
  },
  // {
  //   id: 'balance',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Wallet',
  //   align: 'end',
  //   sortable: true,
  // },
  {
    id: 'poolBalance',
    numeric: true,
    disablePadding: false,
    label: (
      <div className="flex items-center">
        My Pool Amount
        <span className="text-base">
          <Tooltip id="my-pool-amount-tooltip" className="max-w-md whitespace-normal" />
          <a
            data-tooltip-id="my-pool-amount-tooltip"
            data-tooltip-place="top"
            data-tooltip-content="Amount of liquidity provided but not yet staked in the gauge. Stake to earn KODO rewards."
          >
            <InformationCircleIcon className="self-center shrink-0 mx-1 h-[14px] w-[14px] text-text-gray" />
          </a>
        </span>
      </div>
    ),
    align: 'end',
    sortable: true,
  },
  {
    id: 'stakedBalance',
    numeric: true,
    disablePadding: false,
    label: 'My Staked Amount',
    align: 'end',
    sortable: true,
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
    align: 'center',
    sortable: false,
  },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <thead>
      <tr>
        {headCells.map((headCell) => (
          <th
            key={headCell.id}
            scope="col"
            className={`align-top text-[14px] leading-[18px] text-text-gray font-normal whitespace-nowrap px-6 py-6 ${
              headCell.sortable ? 'cursor-pointer select-none' : 'w-1/8'
            }`}
            onClick={() => {
              if (headCell.sortable) {
                createSortHandler(headCell.id)()
              }
            }}
          >
            <div className={`flex flex-row gap-1 items-center justify-${headCell.align}`}>
              {orderBy === headCell.id &&
                (order === 'desc' ? (
                  <ArrowDownIcon
                    className="w-3.5 h-3.5 text-text-gray"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowUpIcon
                    className="w-3.5 h-3.5 text-text-gray"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  />
                ))}
              <div className="">{headCell.label}</div>
            </div>
          </th>
        ))}
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

const getLocalToggles = () => {
  let localToggles = {
    selectedTab: 0, // 0, 1, 2
    switchStakedOnly: false,
    switchActivePools: true,
  }
  // get locally saved toggles
  try {
    const localToggleString = localStorage.getItem('solidly-pairsToggle-v1')
    if (localToggleString && localToggleString.length > 0) {
      localToggles = JSON.parse(localToggleString)
    }
  } catch (ex) {
    console.log(ex)
  }

  return localToggles
}

const EnhancedTableToolbar = (props) => {
  // const classes = useStyles()
  const router = useRouter()

  const localToggles = getLocalToggles()

  const [search, setSearch] = useState('')

  const [selectedTab, setSelectedTab] = useState(localToggles.selectedTab) // 0, 1, 2
  const [switchStakedOnlyEnabled, setSwitchStakedOnlyEnabled] = useState(localToggles.switchStakedOnly)
  const [switchActivePoolsEnabled, setSwitchActivePoolsEnabled] = useState(localToggles.switchActivePools)

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
    props.setSearch(event.target.value)
  }

  const onToggle = (event) => {
    const localToggles = getLocalToggles()

    switch (event.target.name) {
      case 'selectedTab':
        setSelectedTab(event.target.checked)
        props.setSelectedTab(event.target.checked)
        localToggles.selectedTab = event.target.checked
        break
      case 'switchStakedOnlyEnabled':
        setSwitchStakedOnlyEnabled(event.target.checked)
        props.setSwitchStakedOnlyEnabled(event.target.checked)
        localToggles.switchStakedOnly = event.target.checked
        break
      case 'switchActivePoolsEnabled':
        setSwitchActivePoolsEnabled(event.target.checked)
        props.setSwitchActivePoolsEnabled(event.target.checked)
        localToggles.switchActivePools = event.target.checked
        break
      default:
    }

    // set locally saved toggles
    try {
      localStorage.setItem('solidly-pairsToggle-v1', JSON.stringify(localToggles))
    } catch (ex) {
      console.log(ex)
    }
  }

  const onCreate = () => {
    router.push('/liquidity/create')
  }

  return (
    <>
      <div className="flex flex-wrap sm:flex-row gap-4 sm:items-center mt-8 mb-4">
        <div className="flex-grow">
          <div className="flex flex-row h-12 items-center rounded-xl border border-border bg-bg-light px-4 focus-within:border-pink-primary focus-within:bg-table-dark transition-colors duration-300">
            <MagnifyingGlassIcon
              className="w-4 h-4 fill-white flex-shrink-0"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            />
            <input
              className="w-full bg-transparent border-0 px-2 text-sm leading-5 focus:ring-0 focus:outline-none placeholder:text-text-unselected"
              type="text"
              placeholder="Search name or paste address"
              title=""
              name="search"
              value={search}
              onChange={onSearchChanged}
            />
          </div>
        </div>
        <Tab.Group
          className="flex items-center rounded-[10px] border border-border bg-bg-light text-[16px] leading-[21px] font-medium h-12 p-[6px] "
          defaultIndex={selectedTab}
          onChange={(tab) => {
            const event = { target: { name: 'selectedTab', checked: tab } }
            onToggle(event)
          }}
        >
          <Tab.List>
            {['All', 'Stable', 'Volatile'].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `min-w-[80px] cursor-pointer justify-center py-2 px-4 text-center text-text-gray flex items-center outline-none rounded-[6px] transition-all ${
                    selected ? 'bg-pink-primary text-white' : ''
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
        <div className="flex flex-row gap-2">
          <Switch.Group>
            <div className="flex items-center gap-2">
              <Switch
                checked={switchStakedOnlyEnabled}
                // onChange={setSwitchStakeOnlyEnabled}
                onChange={(checked) => {
                  const event = { target: { name: 'switchStakedOnlyEnabled', checked } }
                  onToggle(event)
                }}
                className={`${
                  switchStakedOnlyEnabled ? 'bg-pink-primary' : 'bg-bg-light'
                } w-12 h-8 relative rounded-xl border border-border`}
              >
                <span className="sr-only">Staked Only Switch</span>
                <span
                  aria-hidden="true"
                  className={`${
                    switchStakedOnlyEnabled ? 'translate-x-[23px] bg-white' : 'translate-x-1 bg-text-gray'
                  } block w-5 h-5 rounded-full shadow transition-transform duration-100 ease-linear`}
                />
              </Switch>
              <Switch.Label className="text-[16px] leading-[21px] font-medium">Staked Only</Switch.Label>
            </div>
          </Switch.Group>

          <Switch.Group>
            <div className="flex items-center gap-2">
              <Switch
                checked={switchActivePoolsEnabled}
                // onChange={setSwitchActivePoolsEnabled}
                onChange={(checked) => {
                  const event = { target: { name: 'switchActivePoolsEnabled', checked } }
                  onToggle(event)
                }}
                className={`${
                  switchActivePoolsEnabled ? 'bg-pink-primary' : 'bg-bg-light'
                } w-12 h-8 relative rounded-xl border border-border`}
              >
                <span className="sr-only">Active Pools Switch</span>
                <span
                  aria-hidden="true"
                  className={`${
                    switchActivePoolsEnabled ? 'translate-x-[23px] bg-white' : 'translate-x-1 bg-text-gray'
                  } block w-5 h-5  rounded-full shadow transition-transform duration-100 ease-linear`}
                />
              </Switch>
              <Switch.Label className="text-[16px] leading-[21px] font-medium">Active Pools</Switch.Label>
            </div>
          </Switch.Group>
        </div>
      </div>
    </>
  )
}

const PageHeader = () => {
  const router = useRouter()

  const onCreate = () => {
    router.push('/liquidity/create')
  }

  return (
    <div className="flex flex-wrap gap-3 justify-between md:mb-24">
      <div>
        <div className="mb-5 inline-block text-white pb-2 md:pb-3 lg:pb-4 text-4xl sm:text-5xl lg:text-5xl font-semibold tracking-normal">
          Liquidity
        </div>
        <div className="font-sans text-base leading-6 text-text-gray">
          Add liquidity to pools and earn weekly rewards
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="rounded-[10px] px-5 py-3 text-sm font-bold bg-pink-primary hover:bg-pink-primary/90"
          onClick={onCreate}
        >
          Create New Pool
        </button>
      </div>
    </div>
  )
}

export default function EnhancedTable({ pairs, account }) {
  const router = useRouter()

  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('poolAmount')
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [page, setPage] = useState(0)

  const localToggles = getLocalToggles()

  const [search, setSearch] = useState('')
  const [selectedTab, setSelectedTab] = useState(localToggles.selectedTab) // 0 all, 1 stable, 2 volatile
  const [switchStakedOnlyEnabled, setSwitchStakedOnlyEnabled] = useState(localToggles.switchStakedOnly)
  const [switchActivePoolsEnabled, setSwitchActivePoolsEnabled] = useState(localToggles.switchActivePools)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const onView = (pair) => {
    router.push(`/liquidity/${pair.address}`)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(parseInt(event.target.value, 10))
    // setPage(0)
    const value = event.target.value
    setRowsPerPage(value === 'All' ? filteredPairs.length : parseInt(value, 10))
    setPage(0)
  }

  const filteredPairs = pairs
    .filter((pair) => {
      if (!search || search === '') {
        return true
      }

      const searchLower = search.toLowerCase()

      if (
        pair.symbol.toLowerCase().includes(searchLower) ||
        pair.address.toLowerCase().includes(searchLower) ||
        pair.token0.symbol.toLowerCase().includes(searchLower) ||
        pair.token0.address.toLowerCase().includes(searchLower) ||
        pair.token0.name.toLowerCase().includes(searchLower) ||
        pair.token1.symbol.toLowerCase().includes(searchLower) ||
        pair.token1.address.toLowerCase().includes(searchLower) ||
        pair.token1.name.toLowerCase().includes(searchLower)
      ) {
        return true
      }

      return false
    })
    .filter((pair) => {
      // 1 stable
      if (selectedTab === 1 && pair.isStable === false) {
        return false
      }
      // 2 volatile
      if (selectedTab === 2 && pair.isStable === true) {
        return false
      }
      // active pools
      if (switchActivePoolsEnabled === true && (!pair.gauge || !pair.gauge.address)) {
        return false
      }
      // staked only
      if (switchStakedOnlyEnabled === true) {
        if (!BigNumber(pair?.gauge?.balance).gt(0) && !BigNumber(pair?.balance).gt(0)) {
          return false
        }
      }

      return true
    })

  // const emptyRows = 5 - Math.min(5, filteredPairs.length - page * 5)

  return (
    <>
      <div className="w-full">
        <PageHeader />
        <EnhancedTableToolbar
          setSearch={setSearch}
          setSelectedTab={setSelectedTab}
          setSwitchStakedOnlyEnabled={setSwitchStakedOnlyEnabled}
          setSwitchActivePoolsEnabled={setSwitchActivePoolsEnabled}
        />
        <div className="rounded-[20px] w-full bg-bg-table border border-border">
          <div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-border">
                  <EnhancedTableHead
                    // classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <tbody className="">
                    {filteredPairs.length === 0 ? (
                      <tr>
                        <td className="whitespace-nowrap pl-4 py-6 text-xs text-text-gray align-top">
                          No items available
                        </td>
                      </tr>
                    ) : (
                      stableSort(filteredPairs, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          if (!row) {
                            return null
                          }
                          const labelId = `enhanced-table-checkbox-${index}`

                          return (
                            <tr key={labelId} className="hover:bg-bg-light">
                              <td className="whitespace-nowrap text-sm leading-[18px] align-center px-4 md:px-6 py-4 text-left">
                                <div className="flex flex-row items-center gap-2 ">
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
                                      {row?.symbol ?? ''}
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
                                      <span>Volume</span>
                                      <span className="text-white">
                                        {`~$${formatCurrency(
                                          BigNumber(row?.gauge?.fee_claimable_value ?? 0)
                                            .times(10000)
                                            .div(row?.stable ? CONTRACTS.STABLE_FEE_BPS : CONTRACTS.VOLATILE_FEE_BPS),
                                          2,
                                          false
                                        )}`}
                                      </span>
                                      <span className="flex items-center">
                                        <a data-tooltip-id={`volume-tooltip-${labelId}`} data-tooltip-place="top-start">
                                          <InformationCircleIcon className="self-center shrink-0 h-[12px] w-[12px] text-text-gray" />
                                        </a>
                                      </span>
                                      <Tooltip
                                        id={`volume-tooltip-${labelId}`}
                                        className="max-w-md border border-border z-20 opacity-100 hover:opacity-100"
                                        style={{
                                          padding: '12px',
                                          backgroundColor: '#0B0B0B',
                                          borderRadius: '8px',
                                        }}
                                      >
                                        <div className="flex flex-col gap-1 font-normal text-sm">
                                          Estimated volume based on pool fees.
                                        </div>
                                      </Tooltip>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                                <div className="flex flex-row gap-1 justify-end">
                                  <div className="text-text-green text-sm leading-[18px] font-medium">{`${formatCurrency(
                                    row?.apr ?? 0
                                  )}%`}</div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                                <div className="text-white text-sm leading-[18px] font-medium mb-[2px]">
                                  {row?.tvl ? `$${formatCurrency(row.tvl, 2, true)}` : '$0.00'}
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">{formatCurrency(row?.reserve0 ?? 0)}</div>
                                  <div className="">{row?.token0?.symbol ?? ''}</div>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">{formatCurrency(row?.reserve1 ?? 0)}</div>
                                  <div className="">{row?.token1?.symbol ?? ''}</div>
                                </div>
                              </td>
                              {/* <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                                <div className="text-white text-sm leading-[18px] font-medium mb-[2px]">
                                  <span>
                                    {`$${formatCurrency(
                                      BigNumber(row?.gauge?.fee_claimable_value ?? 0)
                                        .times(10000)
                                        .div(row?.stable ? CONTRACTS.STABLE_FEE_BPS : CONTRACTS.VOLATILE_FEE_BPS),
                                      2,
                                      true
                                    )}`}
                                  </span>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">
                                    {formatCurrency(
                                      BigNumber(row?.gauge?.fee_claimable0 ?? 0)
                                        .times(10000)
                                        .div(row?.stable ? CONTRACTS.STABLE_FEE_BPS : CONTRACTS.VOLATILE_FEE_BPS)
                                    )}
                                  </div>
                                  <div className="">{row?.token0?.symbol ?? ''}</div>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">
                                    {formatCurrency(
                                      BigNumber(row?.gauge?.fee_claimable1 ?? 0)
                                        .times(10000)
                                        .div(row?.stable ? CONTRACTS.STABLE_FEE_BPS : CONTRACTS.VOLATILE_FEE_BPS)
                                    )}
                                  </div>
                                  <div className="">{row?.token1?.symbol ?? ''}</div>
                                </div>
                              </td> */}
                              <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                                <div className="text-white text-sm leading-[18px] font-medium mb-[2px]">
                                  <span>
                                    {`$${formatCurrency(BigNumber(row?.gauge?.fee_claimable_value ?? 0), 2, true)}`}
                                  </span>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">{formatCurrency(BigNumber(row?.gauge?.fee_claimable0 ?? 0))}</div>
                                  <div className="">{row?.token0?.symbol ?? ''}</div>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">{formatCurrency(BigNumber(row?.gauge?.fee_claimable1 ?? 0))}</div>
                                  <div className="">{row?.token1?.symbol ?? ''}</div>
                                </div>
                              </td>
                              {/* <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                                <div className="text-white text-sm leading-[18px] font-medium mb-[2px]">
                                  <span>
                                    {`$${formatCurrency(
                                      BigNumber(row?.token0?.value ?? 0).plus(row?.token1?.value ?? 0)
                                    )}`}
                                  </span>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">{formatCurrency(row?.token0?.balance ?? '0.00')}</div>
                                  <div className="">{row?.token0?.symbol ?? ''}</div>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">{formatCurrency(row?.token1?.balance ?? '0.00')}</div>
                                  <div className="">{row?.token1?.symbol ?? ''}</div>
                                </div>
                              </td> */}
                              <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                                <div className="flex flex-row gap-1 justify-end text-white text-sm leading-[18px] font-medium mb-[2px]">
                                  <span>{row?.myTvl ? `$${formatCurrency(row.myTvl, 2, true)}` : '$0.00'}</span>
                                  <span className="">{`(${
                                    row?.balance && row?.totalSupply
                                      ? formatCurrency(BigNumber(row.balance).div(row.totalSupply).times(100))
                                      : '0.00'
                                  }%)`}</span>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">
                                    {row?.balance && row?.totalSupply && row?.reserve0
                                      ? formatTokenBalance(
                                          row?.token0?.symbol,
                                          BigNumber(row.balance).div(row.totalSupply).times(row.reserve0)
                                        )
                                      : '0.00'}
                                  </div>
                                  <div className="">{row?.token0?.symbol ?? ''}</div>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">
                                    {row?.balance && row?.totalSupply && row?.reserve1
                                      ? formatTokenBalance(
                                          row?.token1?.symbol,
                                          BigNumber(row.balance).div(row.totalSupply).times(row.reserve1)
                                        )
                                      : '0.00'}
                                  </div>
                                  <div className="">{row?.token1?.symbol ?? ''}</div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-right">
                                <div className="flex flex-row gap-1 justify-end text-white text-sm leading-[18px] font-medium mb-[2px]">
                                  <span>
                                    {row?.gauge?.myTvl ? `$${formatCurrency(row.gauge.myTvl, 2, true)}` : '$0.00'}
                                  </span>
                                  <span className="">
                                    {`(${
                                      row?.gauge?.balance && row?.gauge?.totalSupply
                                        ? formatCurrency(
                                            BigNumber(row.gauge.balance).div(row.gauge.totalSupply).times(100)
                                          )
                                        : '0.00'
                                    }%)`}
                                  </span>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">
                                    {row?.gauge?.balance && row?.gauge?.totalSupply && row?.gauge?.reserve0
                                      ? formatTokenBalance(
                                          row?.token0?.symbol,
                                          BigNumber(row.gauge.balance)
                                            .div(row.gauge.totalSupply)
                                            .times(row.gauge.reserve0)
                                        )
                                      : '0.00'}
                                  </div>
                                  <div className="">{row?.token0?.symbol ?? ''}</div>
                                </div>
                                <div className="flex flex-row gap-1 justify-end text-text-gray text-[10px] leading-[13px] font-normal mb-[2px]">
                                  <div className="">
                                    {row?.gauge?.balance && row?.gauge?.totalSupply && row?.gauge?.reserve1
                                      ? formatTokenBalance(
                                          row?.token1?.symbol,
                                          BigNumber(row.gauge.balance)
                                            .div(row.gauge.totalSupply)
                                            .times(row.gauge.reserve1)
                                        )
                                      : '0.00'}
                                  </div>
                                  <div className="">{row?.token1?.symbol ?? ''}</div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap align-center px-4 md:px-6 py-4 text-center w-1/8">
                                <button
                                  className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-300 border border-border bg-bg-light hover:bg-pink-primary hover:text-white disabled:bg-bg-disable disabled:text-text-disabled disabled:pointer-events-none h-10 py-2 px-4 rounded-md"
                                  title="Manage liquidity"
                                  disabled={!(account && account.address)}
                                  onClick={() => {
                                    onView(row)
                                  }}
                                >
                                  {row?.balance ? 'Manage' : 'Deposit'}
                                </button>
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
          {filteredPairs.length > rowsPerPage && (
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
                      <option value={`${filteredPairs.length}`}>All</option>
                    </select>
                  </div>
                  <div>{`${page * rowsPerPage + 1}-${(page + 1) * rowsPerPage} of ${filteredPairs.length}`}</div>
                  <div className="flex flex-row gap-0 sm:gap-1 items-center max-h-12 h-12 ">
                    <button
                      className={`rounded-full w-8 h-8 md:w-12 md:h-12 ${
                        page === 0 ? 'cursor-not-allowed' : 'hover:bg-bg-light hover:text-white hover:cursor-pointer'
                      }`}
                      disabled={page === 0}
                      onClick={() => handleChangePage(null, page - 1)}
                    >
                      &lt;
                    </button>
                    <button
                      className={`rounded-full w-8 h-8 md:w-12 md:h-12 ${
                        page >= Math.ceil(filteredPairs.length / rowsPerPage) - 1
                          ? 'cursor-not-allowed'
                          : 'hover:bg-bg-light hover:text-white hover:cursor-pointer'
                      }`}
                      disabled={page >= Math.ceil(filteredPairs.length / rowsPerPage) - 1}
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
      </div>
    </>
  )
}
