import BigNumber from 'bignumber.js'
import { TOKEN_DISPLAY_DECIMALS } from '../stores/constants/index.js'

/**
 * Formats a number as a currency string.
 *
 * @param {number|string} amount - The amount to format.
 * @param {number} [decimals=2] - The number of decimal places to use.
 * @param {boolean} [largeNumberFormat=false] - Whether to use large number format (K, M, B).
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(amount, decimals = 2, largeNumberFormat = false) {
  const bnAmount = BigNumber(amount)

  if (!bnAmount.isNaN()) {
    if (decimals === 2 && bnAmount.gt(0) && bnAmount.lt(0.01)) {
      return '< 0.01'
    }

    if (decimals === 4 && bnAmount.gt(0) && bnAmount.lt(0.0001)) {
      return '< 0.0001'
    }

    if (decimals === 5 && bnAmount.gt(0) && bnAmount.lt(0.00001)) {
      return '< 0.00001'
    }

    if (largeNumberFormat) {
      if (bnAmount.gte(1e9)) {
        return bnAmount.div(1e9).toFixed(decimals) + 'B'
      } else if (bnAmount.gte(1e6)) {
        return bnAmount.div(1e6).toFixed(decimals) + 'M'
      } else if (bnAmount.gte(1e3)) {
        return bnAmount.div(1e3).toFixed(decimals) + 'K'
      }
    }

    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })

    return formatter.format(bnAmount.toNumber())
  } else {
    return 0
  }
}

export function formatTokenBalance(token, balance) {
  const decimals = TOKEN_DISPLAY_DECIMALS[token]
  if (decimals !== undefined) {
    return formatCurrency(balance, decimals)
  }
  return formatCurrency(balance)
}

export function formatAddress(address, length = 'short') {
  if (address && length === 'short') {
    address = address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)
    return address
  } else if (address && length === 'long') {
    address = address.substring(0, 12) + '...' + address.substring(address.length - 8, address.length)
    return address
  } else if (address && length === 'ultraShort') {
    address = address.substring(0, 4) + '...' + address.substring(address.length - 4, address.length)
    return address
  } else {
    return null
  }
}

export function formatAddressShort(address, length = 'short') {
  if (address && length === 'short') {
    address = address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)
    return address
  } else if (address && length === 'long') {
    address = address.substring(0, 12) + '...' + address.substring(address.length - 8, address.length)
    return address
  } else {
    return null
  }
}

export function bnDec(decimals) {
  return new BigNumber(10).pow(parseInt(decimals))
}

export function sqrt(value) {
  if (value < 0n) {
    throw new Error('square root of negative numbers is not supported')
  }

  if (value < 2n) {
    return value
  }

  function newtonIteration(n, x0) {
    // eslint-disable-next-line no-bitwise
    const x1 = (n / x0 + x0) >> 1n
    if (x0 === x1 || x0 === x1 - 1n) {
      return x0
    }
    return newtonIteration(n, x1)
  }

  return newtonIteration(value, 1n)
}

export function multiplyBnToFixed(...args) {
  if (args.length < 3)
    throw new Error(
      'multiplyBnToFixed needs at least 3 arguments: first bn, second bn to multiply with first, and number of decimals.'
    )

  const decimals = args[args.length - 1]
  const bigNumbers = args.slice(0, -1)

  return bnToFixed(multiplyArray(bigNumbers), decimals * bigNumbers.length, decimals)
}

export function sumArray(numbers) {
  return numbers.reduce((total, n) => total + Number(n), 0)
}

export function bnToFixed(bn, decimals, displayDecimals = decimals) {
  const bnDecimals = new BigNumber(10).pow(decimals)

  return new BigNumber(bn).dividedBy(bnDecimals).toFixed(displayDecimals, BigNumber.ROUND_DOWN)
}

export function floatToFixed(float, decimals = 0) {
  return new BigNumber(float).toFixed(decimals, BigNumber.ROUND_DOWN)
}

export function multiplyArray(numbers) {
  return numbers.reduce((total, n) => total * n, 1)
}
