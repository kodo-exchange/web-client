import BigNumber from 'bignumber.js'
import * as contracts from './contracts'
import * as actions from './actions'

export const CHAIN_ID_HEX = process.env.NEXT_PUBLIC_CHAINID
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAINID, 16)

export const ETHERSCAN_URL = process.env.NEXT_PUBLIC_ETHERSCAN_URL

export const CONTRACTS = contracts
export const ACTIONS = actions

export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1).toFixed(0)
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// export const FALLBACK_RPC = 'https://sepolia.infura.io/v3/70f1e54ad1144b5b9798ac6e5d26ac44'
export const FALLBACK_RPC = process.env.NEXT_PUBLIC_CHAIN_RPC

export const TOP_ASSETS = ['WETH', 'TAIKO', 'KODO', 'USDC', 'USDC.e', 'LRC']

export const TOKEN_DISPLAY_DECIMALS = {
  ETH: 5,
  WETH: 5,
  rETH: 5,
  wstETH: 5,
}
