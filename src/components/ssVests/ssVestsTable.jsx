import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { Button, TableCell, TableHead, TableRow, TableSortLabel, Typography, Toolbar, Grid } from '@material-ui/core'
import { useRouter } from 'next/router'
import EnhancedEncryptionOutlinedIcon from '@material-ui/icons/EnhancedEncryptionOutlined'
import moment from 'moment'

import { formatCurrency } from '../../utils'
import BigNumber from 'bignumber.js'
import VestNFT from './vestNFT'

function descendingComparator(a, b, orderBy) {
  if (!a || !b) {
    return 0
  }

  switch (orderBy) {
    case 'id':
      if (BigNumber(b.id).lt(a.id)) {
        return -1
      }
      if (BigNumber(b.id).gt(a.id)) {
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
  { id: 'NFT', numeric: false, disablePadding: false, label: 'Pair' },
  {
    id: 'Locked Amount',
    numeric: true,
    disablePadding: false,
    label: 'Vest Amount',
  },
  {
    id: 'Lock Value',
    numeric: true,
    disablePadding: false,
    label: 'Vest Value',
  },
  {
    id: 'Lock Expires',
    numeric: true,
    disablePadding: false,
    label: 'Vest Expires',
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
    borderRadius: '30px',
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
  buttonOverride: {
    color: 'rgb(6, 211, 215)',
    background: 'rgb(23, 52, 72)',
    fontWeight: '700',
    width: '100%',
    '&:hover': {
      background: 'rgb(19, 44, 60)',
    },
  },
  toolbar: {
    margin: '24px 0px',
    padding: '0px',
  },
  tableContainer: {
    border: '1px solid rgba(104, 108, 122, 0.25)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  actionButtonText: {
    fontSize: '15px',
    fontWeight: '700',
  },
}))

const EnhancedTableToolbar = (props) => {
  const classes = useStyles()
  const router = useRouter()

  const [search, setSearch] = useState('')

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
  }

  const onCreate = () => {
    router.push('/lock/create')
  }

  return (
    <Toolbar className={classes.toolbar}>
      <Grid container spacing={1}>
        <Grid lg="auto" md={12} sm={12} xs={12} item>
          <Button
            variant="contained"
            startIcon={<EnhancedEncryptionOutlinedIcon />}
            size="large"
            className={classes.buttonOverride}
            color="primary"
            onClick={onCreate}
          >
            <Typography className={classes.actionButtonText}>Create Lock</Typography>
          </Button>
        </Grid>
        <Grid item lg={true} md={true} sm={false} xs={false}></Grid>
      </Grid>
    </Toolbar>
  )
}

export default function EnhancedTable({ vestNFTs, govToken, veToken, baseAssets }) {
  const classes = useStyles()
  const router = useRouter()

  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('id')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // if (!vestNFTs) {
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

  const onView = (nft) => {
    router.push(`/lock/${nft.id}`)
  }

  const onCreate = () => {
    router.push('/lock/create')
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, vestNFTs.length - page * rowsPerPage)

  const calculateTotalInfluence = (vestNFTs) => {
    const totalLockValue = vestNFTs.reduce((sum, row) => sum.plus(row.lockValue), BigNumber(0))
    const totalSupply = vestNFTs[0]?.totalSupply

    if (!BigNumber(totalSupply).eq(0) && !isNaN(totalSupply) && !isNaN(totalLockValue)) {
      return formatCurrency(totalLockValue.dividedBy(totalSupply).times(100), 4)
    } else {
      return '0.0000'
    }
  }

  const calculateTotalLockAmount = (vestNFTs) => {
    const totalLockAmount = vestNFTs.reduce((sum, row) => sum.plus(BigNumber(row.lockAmount)), BigNumber(0))
    return formatCurrency(totalLockAmount, 4)
  }

  const calculateTotalPowerPercentage = (vestNFTs) => {
    const totalLockValue = vestNFTs.reduce((sum, row) => sum.plus(BigNumber(row.lockValue)), BigNumber(0))
    const totalLockAmount = vestNFTs.reduce((sum, row) => sum.plus(BigNumber(row.lockAmount)), BigNumber(0))

    if (!totalLockAmount.eq(0) && !isNaN(totalLockValue) && !isNaN(totalLockAmount)) {
      return formatCurrency(totalLockValue.dividedBy(totalLockAmount).times(100), 2)
    } else {
      return '0.00'
    }
  }

  const calculateTotalLockValue = (vestNFTs) => {
    const totalLockValue = vestNFTs.reduce((sum, row) => sum.plus(BigNumber(row.lockValue)), BigNumber(0))
    return formatCurrency(totalLockValue, 4)
  }

  return (
    <div className="flex flex-col space-y-4 md:space-y-8">
      <div className="flex flex-col gap-4 mb-4 sm:mb-8 md:gap-0">
        <div className="flex flex-wrap justify-between">
          <div className="">
            <div className="mb-5 inline-block text-white pb-2 md:pb-3 lg:pb-4 text-4xl sm:text-5xl lg:text-5xl font-semibold tracking-normal">
              Lock
            </div>
            <div className="hidden md:block text-base leading-6 mb-4 text-text-gray">
              More tokens locked for longer = greater voting power = higher rewards
            </div>
            <div className="flex flex-col md:hidden text-base leading-6 mb-4 text-text-gray">
              <div>More tokens locked for longer </div>
              <div className="pl-4">= greater voting power </div>
              <div className="pl-4">= higher rewards</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="rounded-[10px] px-5 py-3 text-sm font-bold bg-pink-primary hover:bg-pink-primary/90"
              onClick={onCreate}
            >
              Create Lock
            </button>
          </div>
        </div>

        <div className="flex flex-wrap md:mt-0 gap-y-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="rounded-[20px] bg-white/8 border-white/10 border p-6 text-left">
              <div className="text-base sm:text-xl font-semibold">{calculateTotalInfluence(vestNFTs)}%</div>
              <div className="text-text-gray text-sm whitespace-nowrap mt-2">Influence</div>
            </div>
            <div className="rounded-[20px] bg-white/8 border-white/10 border p-6 text-left">
              <div className="text-base sm:text-xl font-semibold">{calculateTotalLockAmount(vestNFTs)}</div>
              <div className="text-text-gray text-sm whitespace-nowrap mt-2">Locked KODO</div>
            </div>
            <div className="rounded-[20px] bg-white/8 border-white/10 border p-6 text-left">
              <div className="text-base sm:text-xl font-semibold">{calculateTotalPowerPercentage(vestNFTs)}%</div>
              <div className="text-text-gray text-sm whitespace-nowrap mt-2">Power</div>
            </div>
            <div className="rounded-[20px] bg-white/8 border-white/10 border p-6 text-left">
              <div className="text-base sm:text-xl font-semibold">{calculateTotalLockValue(vestNFTs)}</div>
              <div className="text-text-gray text-sm whitespace-nowrap mt-2">veKODO</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {stableSort(vestNFTs, getComparator(order, orderBy))
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              if (!row) {
                return null
              }

              return <VestNFT nft={row} key={row.id} govToken={govToken} baseAssets={baseAssets} />
            })}
        </div>
      </div>
    </div>
  )
}
