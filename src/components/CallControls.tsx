import { CallStatus } from '@/types'
import { Button } from './ui/button'
import React, { useState } from 'react'
import { Card } from './ui/card'
import { Toggle } from '@/components/ui/toggle'
import { LogOut, Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { toast } from 'sonner'

type CallControlsProps = {
  status: CallStatus
}

const CallControls: React.FC<CallControlsProps> = ({ status }) => {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
  }

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn)
  }

  if (status !== 'Connected') {
    return null
  }

  return (
    <Card className="flex flex-row justify-center w-full py-2">
      <Toggle
        className="cursor-pointer"
        variant="outline"
        aria-label="Toggle Microphone"
        onClick={toggleMic}
      >
        {isMicOn ? <Mic /> : <MicOff className="text-red-500" />}
      </Toggle>
      <Toggle
        className="cursor-pointer"
        variant="outline"
        aria-label="Toggle Camera"
        onClick={toggleCamera}
      >
        {isCameraOn ? <Video /> : <VideoOff className="text-red-500" />}
      </Toggle>
      <Button className="cursor-pointer" variant="destructive" aria-label="Leave Call">
        <LogOut className="text-white" />
      </Button>
    </Card>
  )
}

export default CallControls
