import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

// 2. Set chains
const taiko = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAINID, 16),
  name: process.env.NEXT_PUBLIC_CHAIN_NAME,
  currency: 'ETH',
  explorerUrl: process.env.NEXT_PUBLIC_ETHERSCAN_URL,
  rpcUrl: process.env.NEXT_PUBLIC_CHAIN_RPC,
}

// 3. Create a metadata object
const metadata = {
  name: 'Kodo Exchange',
  description: "The Heartbeat of Taiko's Liquidity",
  url: 'https://app.kodo.exchange', // origin must match your domain & subdomain
  icons: ['https://app.kodo.exchange/logo.svg'],
}
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: process.env.NEXT_PUBLIC_CHAIN_RPC, // used for the Coinbase SDK
  defaultChainId: parseInt(process.env.NEXT_PUBLIC_CHAINID, 16), // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [taiko],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  allowUnsupportedChain: false,
  allWallets: 'ONLY_MOBILE',
  themeVariables: {
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 10,
    '--w3m-accent': '#FD009C',
    '--w3m-font-family': 'NTSomic',
    '--w3m-border-radius-master': '2px',
    '--w3m-logo-image-url': 'https://kodo.exchange/img/taiko-blk.png',
  },
  featuredWalletIds: [
    '344d0e58b139eb1b6da0c29ea71d52a8eace8b57897c6098cb9b46012665c193', // Timeless
    '3968c3f5e1aa69375e71bfc3da08a1d24791ac0b3d1c3b1c7e3a2676d175c856', // loopring
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // metamask
    'e7c4d26541a7fd84dbdfa9922d3ad21e936e13a7a0e44385d44f006139e44d3b', // walletconnect
  ],
  chainImages: {
    167008: 'https://kodo.exchange/img/taiko-blk.png',
    167009: 'https://kodo.exchange/img/taiko-blk.png',
    167000: 'https://kodo.exchange/img/taiko-blk.png',
  },
})

export function Web3Modal({ children }) {
  return children
}
