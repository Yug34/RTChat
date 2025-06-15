import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2Icon } from 'lucide-react'
import { Info, Clipboard, ClipboardCheck } from 'lucide-react'
import { toast } from 'sonner'
import React, { useState } from 'react'
import useChatStore from '@/store/core'

interface CallCreationProps {
  startCall: () => void
  joinCall: () => void
}

const CallControls: React.FC<CallCreationProps> = ({ startCall, joinCall }) => {
  const [recentlyCopied, setRecentlyCopied] = useState(false)

  const { isInitialized, callId, joinId, setJoinId, role, status } = useChatStore()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(callId)
    toast.success('Copied Call ID to clipboard!')
    setRecentlyCopied(true)
    setTimeout(() => setRecentlyCopied(false), 1500)
  }

  if (status === 'Connected') {
    return null
  }

  if (status === 'Waiting') {
    return (
      <Card className="flex flex-col p-6 gap-y-4 w-full max-w-[400px]">
        <div className="flex w-full">
          <Button disabled className="w-full">
            Waiting for guest to join...
            <Loader2Icon className="w-4 h-4 animate-spin" />
          </Button>
        </div>
        <div className="flex items-center gap-x-4">
          <span className="h-[1px] w-[100%] bg-gray-400"></span>
        </div>
        <div className="flex w-full">
          <Button
            className="rounded-r-none cursor-pointer"
            onClick={copyToClipboard}
            variant="outline"
          >
            Copy Call ID
          </Button>
          <Button
            className="flex-1 rounded-none cursor-pointer"
            onClick={copyToClipboard}
            variant="secondary"
          >
            {callId}
          </Button>
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="rounded-l-none cursor-pointer"
          >
            {recentlyCopied ? (
              <ClipboardCheck className="w-4 h-4" />
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col p-6 gap-y-2 w-full max-w-[400px]">
      <div className="flex w-full">
        {status === 'Hosting' ? (
          <Button disabled className="w-full">
            Creating call...
            <Loader2Icon className="w-4 h-4 animate-spin" />
          </Button>
        ) : (
          <>
            <Button
              onClick={startCall}
              disabled={!isInitialized || role === 'answer'}
              className="flex-1 rounded-r-none cursor-pointer"
            >
              Host a call
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="rounded-l-none">
                    <Info className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Host a call and send your friend the Call ID to join your call.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
      <div className="flex items-center gap-x-4">
        <span className="h-[1px] w-[50%] bg-gray-400"></span>
        <span className="text-sm text-gray-500">Or</span>
        <span className="h-[1px] w-[50%] bg-gray-400"></span>
      </div>
      <span className="flex flex-row">
        <Input
          className="px-2 py-1 border rounded-r-none"
          placeholder="Enter Call ID to Join"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          disabled={role === 'offer'}
        />
        {status === 'Joining' ? (
          <Button
            className="rounded-l-none rounded-r-none cursor-pointer"
            onClick={joinCall}
            disabled
          >
            Joining...
            <Loader2Icon className="w-4 h-4 animate-spin" />
          </Button>
        ) : (
          <Button
            className="rounded-l-none rounded-r-none cursor-pointer"
            onClick={joinCall}
            disabled={!isInitialized || !joinId || role === 'offer'}
          >
            Join call
          </Button>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="rounded-l-none">
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Already have a Call ID? Paste it here to join a call!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </Card>
  )
}

export default CallControls
