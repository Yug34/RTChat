import { CallStatus } from '@/types'
import React from 'react'

type CallControlsProps = {
  status: CallStatus
}

const CallControls: React.FC<CallControlsProps> = ({ status }) => {
  if (status !== 'Connected') {
    return null
  }

  return <div>CallControls</div>
}

export default CallControls
