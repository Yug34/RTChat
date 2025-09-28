import React, { useState } from 'react'
import { Mic, MicOff, Video, VideoOff, LogOut } from 'lucide-react'
import {
  AlertDialog,
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
import { cn } from '@/lib/utils'

type CallControlsProps = {
  onLeave: () => void
}

const CallControls: React.FC<CallControlsProps> = ({ onLeave }) => {
  const { isMicOn, setIsMicOn, isCameraOn, setIsCameraOn, status } = useChatStore()
  const isConnected = status === 'Connected'
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)

  const toggleMic = () => {
    if (!isConnected) return
    setIsMicOn(!isMicOn)
  }
  const toggleCamera = () => {
    if (!isConnected) return
    setIsCameraOn(!isCameraOn)
  }

  const handleLeaveClick = () => {
    if (!isConnected) return
    setIsLeaveDialogOpen(true)
  }

  const handleLeaveConfirm = () => {
    setIsLeaveDialogOpen(false)
    onLeave()
  }

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
    {
      title: 'Leave',
      icon: <LogOut className="h-full w-full" />,
      onClick: handleLeaveClick,
      href: '#',
      className: 'bg-destructive hover:bg-destructive/90',
    },
  ]

  return (
    <>
      <div className="absolute bottom-2 left-1/2 max-w-full -translate-x-1/2">
        <Dock className="items-end pb-3">
          {data.map((item, idx) => (
            <DockItem
              key={idx}
              className={cn(
                'aspect-square rounded-full',
                item.className ?? 'bg-gray-200 dark:bg-neutral-800',
                status !== 'Connected' && 'opacity-50',
              )}
              onClick={item.onClick ?? (() => {})}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>

      <AlertDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Call?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave the call? This will disconnect you from the session and
              terminate the video call.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveConfirm} className="text-white cursor-pointer">
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CallControls
