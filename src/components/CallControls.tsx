import { CallStatus } from '@/types'
import React, { useState } from 'react'
import { Card } from './ui/card'
import { Toggle } from '@/components/ui/toggle'
import { Mic, MicOff, Video, VideoOff, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './ui/alert-dialog'
import useChatStore from '@/store/core'

type CallControlsProps = {
  status: CallStatus
}

const CallControls: React.FC<CallControlsProps> = () => {
  const { isMicOn, setIsMicOn, isCameraOn, setIsCameraOn, status } = useChatStore()

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
  }

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn)
  }

  const onLeave = () => {
    window.location.reload()
  }

  if (status !== 'Connected') {
    return null
  }

  return (
    <Card className="flex flex-row justify-center w-full gap-2 py-2">
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-1 ml-2">
            <LogOut className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Call?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave the call? You will be disconnected from the session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onLeave}
              className="text-white bg-destructive hover:bg-destructive/90"
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default CallControls
