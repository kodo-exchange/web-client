import { useState, useEffect } from 'react'
import { NumericFormat } from 'react-number-format'

// This is used to fill in the range to be filtered
// Here we use a responsive method to choose different layouts
// Because we need to be compatible with older browsers, we will check if addEventListener is supported, if not, the old method addListener is used
const FilterInputs = ({
  minBribe,
  setMinBribe,
  maxBribe,
  setMaxBribe,
  minTvl,
  setMinTvl,
  minIncomePerVote,
  setMinIncomePerVote,
}) => {
  const [isMd, setIsMd] = useState(window.matchMedia('(min-width: 768px)').matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const listener = (e) => setIsMd(e.matches)

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener)
    } else {
      mediaQuery.addListener(listener)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener)
      } else {
        mediaQuery.removeListener(listener)
      }
    }
  }, [])

  return (
    <div
      className={`grid gap-2 items-center mb-8 ${
        // isMd ? 'md:grid-cols-4' : 'grid-cols-[minmax(68px,12%)_1fr_minmax(68px,12%)_1fr]'
        isMd ? 'md:grid-cols-4' : 'grid-cols-2'
      }`}
    >
      {isMd ? (
        <>
          <div className="flex flex-row h-12 items-center rounded-[10px] border border-border bg-table-dark px-4 focus-within:border-pink-primary transition-colors duration-300 gap-2">
            <span className="whitespace-nowrap text-sm text-text-gray">Min Bribe</span>
            <span className="flex flex-row w-full">
              <NumericFormat
                className="w-full text-sm text-right bg-transparent border-0 focus:ring-0 focus:outline-none"
                type="text"
                placeholder="0.0"
                allowNegative={false}
                value={minBribe}
                onValueChange={(values) => {
                  const { value } = values
                  setMinBribe(value)
                }}
                thousandSeparator={true}
                decimalScale={0}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </span>
          </div>
          <div className="flex flex-row h-12 items-center rounded-[10px] border border-border bg-table-dark px-4 focus-within:border-pink-primary transition-colors duration-300 gap-2">
            <span className="whitespace-nowrap text-sm text-text-gray">Max Bribe</span>
            <span className="flex flex-row w-full">
              <NumericFormat
                className="w-full text-sm text-right bg-transparent border-0 focus:ring-0 focus:outline-none"
                type="text"
                placeholder="0.0"
                allowNegative={false}
                value={maxBribe}
                onValueChange={(values) => {
                  const { value } = values
                  setMaxBribe(value)
                }}
                thousandSeparator={true}
                decimalScale={0}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </span>
          </div>
          <div className="flex flex-row h-12 items-center rounded-[10px] border border-border bg-table-dark px-4 focus-within:border-pink-primary transition-colors duration-300 gap-2">
            <span className="whitespace-nowrap text-sm text-text-gray">Min TVL</span>
            <span className="flex flex-row w-full">
              <NumericFormat
                className="w-full text-sm text-right bg-transparent border-0 focus:ring-0 focus:outline-none"
                type="text"
                placeholder="0.0"
                allowNegative={false}
                value={minTvl}
                onValueChange={(values) => {
                  const { value } = values
                  setMinTvl(value)
                }}
                thousandSeparator={true}
                decimalScale={0}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </span>
          </div>
          <div className="flex flex-row h-12 items-center rounded-[10px] border border-border bg-table-dark px-4 focus-within:border-pink-primary transition-colors duration-300 gap-2">
            <span className="whitespace-nowrap text-sm text-text-gray">Min $/Vote</span>
            <span className="flex flex-row w-full">
              <NumericFormat
                className="w-full text-sm text-right bg-transparent border-0 focus:ring-0 focus:outline-none"
                type="text"
                placeholder="0.0"
                allowNegative={false}
                value={minIncomePerVote}
                onValueChange={(values) => {
                  const { value } = values
                  setMinIncomePerVote(value)
                }}
                thousandSeparator={true}
                decimalScale={4}
                fixedDecimalScale={false}
                prefix={'$'}
              />
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row h-12 items-center rounded-[10px] border border-border bg-table-dark px-4 focus-within:border-pink-primary transition-colors duration-300 gap-2">
            <span className="whitespace-nowrap text-sm text-text-gray">Min Bribe</span>
            <span className="flex flex-row w-full">
              <NumericFormat
                className="w-full text-sm text-right bg-transparent border-0 focus:ring-0 focus:outline-none"
                type="text"
                placeholder="0.0"
                allowNegative={false}
                value={minBribe}
                onValueChange={(values) => {
                  const { value } = values
                  setMinBribe(value)
                }}
                thousandSeparator={true}
                decimalScale={0}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </span>
          </div>
          <div className="flex flex-row h-12 items-center rounded-[10px] border border-border bg-table-dark px-4 focus-within:border-pink-primary transition-colors duration-300 gap-2">
            <span className="whitespace-nowrap text-sm text-text-gray">Max Bribe</span>
            <span className="flex flex-row w-full">
              <NumericFormat
                className="w-full text-sm text-right bg-transparent border-0 focus:ring-0 focus:outline-none"
                type="text"
                placeholder="0.0"
                allowNegative={false}
                value={maxBribe}
                onValueChange={(values) => {
                  const { value } = values
                  setMaxBribe(value)
                }}
                thousandSeparator={true}
                decimalScale={0}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </span>
          </div>
          <div className="flex flex-row h-12 items-center rounded-[10px] border border-border bg-table-dark px-4 focus-within:border-pink-primary transition-colors duration-300 gap-2">
            <span className="whitespace-nowrap text-sm text-text-gray">Min TVL</span>
            <span className="flex flex-row w-full">
              <NumericFormat
                className="w-full text-sm text-right bg-transparent border-0 focus:ring-0 focus:outline-none"
                type="text"
                placeholder="0.0"
                allowNegative={false}
                value={minTvl}
                onValueChange={(values) => {
                  const { value } = values
                  setMinTvl(value)
                }}
                thousandSeparator={true}
                decimalScale={0}
                fixedDecimalScale={true}
                prefix={'$'}
              />
            </span>
          </div>
          <div className="flex flex-row h-12 items-center rounded-[10px] border border-border bg-table-dark px-4 focus-within:border-pink-primary transition-colors duration-300 gap-2">
            <span className="whitespace-nowrap text-sm text-text-gray">Min $/Vote</span>
            <span className="flex flex-row w-full">
              <NumericFormat
                className="w-full text-sm text-right bg-transparent border-0 focus:ring-0 focus:outline-none"
                type="text"
                placeholder="0.0"
                allowNegative={false}
                value={minIncomePerVote}
                onValueChange={(values) => {
                  const { value } = values
                  setMinIncomePerVote(value)
                }}
                thousandSeparator={true}
                decimalScale={4}
                fixedDecimalScale={false}
                prefix={'$'}
              />
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default FilterInputs
