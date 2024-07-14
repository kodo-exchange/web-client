import { Fragment, useState, useEffect } from 'react'
import { Snackbar, IconButton, Button, Typography, SvgIcon } from '@material-ui/core'

import { colors } from '../../theme/coreTheme'

import { ETHERSCAN_URL } from '../../stores/constants'

import { Transition } from '@headlessui/react'
// import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon, NoSymbolIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

const iconStyle = {
  fontSize: '32px',
  marginRight: '20px',
  verticalAlign: 'middle',
}

function CloseIcon(props) {
  const { color } = props
  return (
    <SvgIcon style={{ fontSize: '22px' }}>
      <path
        fill={color}
        d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      />
    </SvgIcon>
  )
}

function SuccessIcon(props) {
  const { color } = props
  return (
    <SvgIcon style={iconStyle}>
      <path
        fill={color}
        d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0ZM10.75,16.518,6.25,12.2l1.4-1.435L10.724,13.7l6.105-6.218L18.25,8.892Z"
      />
    </SvgIcon>
  )
}

function ErrorIcon(props) {
  const { color } = props
  return (
    <SvgIcon style={iconStyle}>
      <path
        fill={color}
        d="M16.971,0H7.029L0,7.029V16.97L7.029,24H16.97L24,16.971V7.029L16.971,0Zm-1.4,16.945-3.554-3.521L8.5,16.992,7.079,15.574l3.507-3.566L7,8.536,8.418,7.119,12,10.577l3.539-3.583,1.431,1.431-3.535,3.568L17,15.515Z"
      />
    </SvgIcon>
  )
}

function WarningIcon(props) {
  const { color } = props
  return (
    <SvgIcon style={iconStyle}>
      <path
        fill={color}
        d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
      />
    </SvgIcon>
  )
}

function InfoIcon(props) {
  const { color } = props
  return (
    <SvgIcon style={iconStyle}>
      <path
        fill={color}
        d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5"
      />
    </SvgIcon>
  )
}

function MySnackbar({ open, setOpen, type, message }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [open, setOpen])

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  let icon = <SuccessIcon color={colors.blue} />
  let color = colors.blue
  let messageType = ''
  let actions = [
    <IconButton key="close" aria-label="Close" onClick={handleClose}>
      <CloseIcon />
    </IconButton>,
  ]

  switch (type) {
    case 'Error':
      icon = <NoSymbolIcon className={`h-5 w-5 text-red-500`} aria-hidden="true" />
      color = '#f56565'
      messageType = 'Error'
      break
    case 'Success':
      icon = <CheckCircleIcon className={`h-5 w-5 text-green-400`} aria-hidden="true" />
      color = '#68d391'
      messageType = 'Success'
      break
    case 'Warning':
      icon = <WarningIcon color={colors.orange} />
      color = '#ed8936'
      messageType = 'Warning'
      break
    case 'Info':
      icon = <InfoIcon color={colors.blue} />
      color = 'pink-primary'
      messageType = 'Info'
      break
    case 'Hash':
      icon = <CheckCircleIcon className={`h-5 w-5 text-green-400`} aria-hidden="true" />
      color = '#68d391'
      messageType = 'Hash'

      let snackbarMessage = ETHERSCAN_URL + '/tx/' + message
      actions = [
        <Button key={'view'} variant="text" size="small" onClick={() => window.open(snackbarMessage, '_blank')}>
          View
        </Button>,
        <IconButton key="close" aria-label="Close" onClick={this.handleClose}>
          <CloseIcon />
        </IconButton>,
      ]
      break
    default:
      icon = <CheckCircleIcon className={`h-5 w-5 text-green-400`} aria-hidden="true" />
      color = '#68d391'
      messageType = 'Success'
      break
  }

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-end sm:p-6 z-20"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={open}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <div
              className={`relative pointer-events-auto w-full max-w-sm overflow-hidden rounded-[10px] bg-bg-light border border-border shadow-lg ring-1 ring-black ring-opacity-5`}
            >
              <div className="px-4 pt-3 pb-4">
                <div className="flex items-center justify-start gap-2 mb-[11px]">
                  <div className="flex-shrink-0">{icon}</div>
                  <div className={`text-md font-extrabold`} style={{ color }}>
                    {messageType}
                  </div>
                </div>
                <div className="relative h-[1px] border-[0.5px] border-border mb-[11px]">
                  <div
                    className={`absolute top-[-0.8px] right-0 h-[1px] w-20 border`}
                    style={{ borderColor: color }}
                  ></div>
                </div>
                <div className="mt-1 text-sm text-text-gray">{message}</div>
              </div>
              <button className="flex h-7 w-7 items-center justify-center absolute right-3 top-3" onClick={handleClose}>
                <XMarkIcon className="h-6 w-6 fill-text-gray hover:fill-white transition-colors" aria-hidden="true" />
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}

export default MySnackbar
