import React from 'react'
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

const CallControls: React.FC = () => {
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

  return (
    <Card className="flex flex-row justify-center w-full gap-4 py-2 rounded-none border-none border-t">
      <Toggle
        className="cursor-pointer"
        variant="outline"
        aria-label="Toggle Microphone"
        onClick={toggleMic}
        disabled={status !== 'Connected'}
      >
        {isMicOn ? <Mic /> : <MicOff className="text-red-500" />}
      </Toggle>
      <Toggle
        className="cursor-pointer"
        variant="outline"
        aria-label="Toggle Camera"
        onClick={toggleCamera}
        disabled={status !== 'Connected'}
      >
        {isCameraOn ? <Video /> : <VideoOff className="text-red-500" />}
      </Toggle>
      <span className="w-[1px] h-full bg-gray-500"></span>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center" disabled={status !== 'Connected'}>
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
