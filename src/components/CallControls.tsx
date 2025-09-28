import React from 'react'
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
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock'

type CallControlsProps = {
  onLeave: () => void
}

const CallControls: React.FC<CallControlsProps> = ({ onLeave }) => {
  const { isMicOn, setIsMicOn, isCameraOn, setIsCameraOn, status } = useChatStore()

  const toggleMic = () => setIsMicOn(!isMicOn)
  const toggleCamera = () => setIsCameraOn(!isCameraOn)

  const data = [
    {
      title: 'Microphone',
      icon: (
        <>
          {isMicOn ? (
            <Mic
              onClick={toggleMic}
              className="h-full w-full text-neutral-600 dark:text-neutral-300"
            />
          ) : (
            <MicOff onClick={toggleMic} className="h-full w-full text-red-500" />
          )}
        </>
      ),
      onClick: toggleMic,
      href: '#',
    },
    {
      title: 'Camera',
      icon: (
        <>
          {isCameraOn ? (
            <Video
              onClick={toggleCamera}
              className="h-full w-full text-neutral-600 dark:text-neutral-300"
            />
          ) : (
            <VideoOff onClick={toggleCamera} className="h-full w-full text-red-500" />
          )}
        </>
      ),
      onClick: toggleCamera,
      href: '#',
    },
    // bg-destructive hover:bg-destructive/90
    {
      title: 'Leave',
      icon: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <LogOut className="h-full w-full text-neutral-600 dark:text-neutral-300" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Call?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave the call? This will disconnect you from the session
                and terminate the video call.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onLeave} className="text-white cursor-pointer">
                Leave
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
      href: '#',
    },
  ]

  return (
    <div className="absolute bottom-2 left-1/2 max-w-full -translate-x-1/2">
      <Dock className="items-end pb-3">
        {data.map((item, idx) => (
          <DockItem
            key={idx}
            className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800"
            onClick={item.onClick ?? (() => {})}
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  )
}

export default CallControls
