import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import React from 'react'

interface CallControlsProps {
  isInitialized: boolean
  role: 'offer' | 'answer' | null
  startCall: () => void
  joinCall: () => void
  joinId: string
  setJoinId: (id: string) => void
}

const CallControls: React.FC<CallControlsProps> = ({
  isInitialized,
  role,
  startCall,
  joinCall,
  joinId,
  setJoinId,
}) => {
  return (
    <Card className="flex flex-col p-6 gap-y-2 w-full max-w-[400px]">
      <CardTitle>RTChat</CardTitle>
      <div className="flex w-full">
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
        <Button
          className="rounded-l-none rounded-r-none cursor-pointer"
          onClick={joinCall}
          disabled={!isInitialized || !joinId || role === 'offer'}
        >
          Join call
        </Button>
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
