// import { Range, getTrackBackground } from 'react-range'
import { useState } from 'react'
import Slider from 'rc-slider'

const SliderTooltip = ({ value, theme = {} }) => {
  const themeTooltip = {
    ...theme,
    color: '#FD009C',
    fontSize: '10px',
    lineHeight: '13px',
    whiteSpace: theme.whiteSpace || 'nowrap',
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
  }

  const percentage = ((value / 100) * 100).toFixed(0) + '%'

  return <div style={themeTooltip}>{percentage}</div>
}

const RangeSlider = ({ slideValues, setSlideValues }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative">
      <div className="absolute top-[45px] left-[2px] text-[10px] leading-[13px] font-normal text-text-gray group-focus-within:text-white hover:cursor-pointer">
        0%
      </div>
      <div className="absolute top-[45px] left-[45%] text-[10px] leading-[13px] font-normal text-text-gray group-focus-within:text-white hover:cursor-pointer">
        50%
      </div>
      <div className="absolute top-[45px] right-[2px] text-[10px] leading-[13px] font-normal text-text-gray group-focus-within:text-white hover:cursor-pointer">
        100%
      </div>
      <span
        dir="ltr"
        data-orientation="horizontal"
        aria-disabled="false"
        className="relative flex items-center select-none min-w-[120px] h-[20px] group"
        aria-label="Vote"
      >
        <div className="absolute top-[12px] right-[2%] text-[4px] text-text-gray group-focus-within:text-white">|</div>
        <div className="absolute top-[12px] right-[25%] text-[4px] text-text-gray group-focus-within:text-white">|</div>
        <div className="absolute top-[12px] right-[50%] text-[6px] text-text-gray group-focus-within:text-white">|</div>
        <div className="absolute top-[12px] right-[75%] text-[4px] text-text-gray group-focus-within:text-white">|</div>
        <div className="absolute top-[12px] right-[98%] text-[4px] text-text-gray group-focus-within:text-white">|</div>
        <div className="absolute top-[-5px] mt-8 mb-2 w-full px-[3px]">
          <Slider
            defaultValue={slideValues[0]}
            value={slideValues[0]}
            onChange={(values) => setSlideValues([values])}
            step={1}
            min={0}
            max={100}
            handleRender={(renderProps) => {
              return (
                <div {...renderProps.props}>
                  <SliderTooltip value={slideValues[0]} />
                </div>
              )
            }}
            styles={{
              track: {
                background: '#FD009C',
                height: 4,
              },
              rail: {
                background: '#724360',
                height: 4,
              },
              handle: {
                background: '#FD009C',
                borderRadius: '50%',
                height: 20,
                width: 20,
                opacity: 1,
                marginTop: -8,
                border: '3px solid white',
              },
            }}
          />
          {/* <Range
            step={1}
            min={0}
            max={100}
            values={slideValues}
            onChange={(values) => setSlideValues(values)}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                className="p-[3px]"
                style={{ ...props.style }}
              >
                <div
                  ref={props.ref}
                  className="h-1 w-full rounded-full self-center"
                  style={{
                    background: getTrackBackground({
                      values: slideValues,
                      colors: ['#FD009C', '#724360'], // blue-500, blue-gray-400
                      min: 0,
                      max: 100,
                    }),
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                className="w-5 h-5 bg-white rounded-full focus:outline-none flex items-center justify-center text-xs text-white group-focus-within:shadow-md group-focus-within:shadow-pink-primary"
                style={{ ...props.style }}
              >
                <div className="w-[14px] h-[14px] rounded-full bg-pink-primary"></div>
                <span className="absolute text-[10px] leading-[13px] font-normal text-pink-primary -top-5">
                  {((slideValues[0] / 100) * 100).toFixed(0) + '%'}
                </span>
              </div>
            )}
          /> */}
        </div>
      </span>
    </div>
  )
}

export default RangeSlider
