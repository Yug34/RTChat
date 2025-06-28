import { cn } from '@/lib/utils'
import useChatStore from '@/store/core'
import { useDraggable } from '@dnd-kit/core'
import { Toggle } from '@/components/ui/toggle'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

type SelfVideoProps = {
  selfVideoRef: React.RefObject<HTMLVideoElement | null>
}

const SelfVideo: React.FC<SelfVideoProps> = ({ selfVideoRef }) => {
  const { status, isMicOn, setIsMicOn, isCameraOn, setIsCameraOn } = useChatStore()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ 
    id: 'self-video',
    disabled: status !== 'Connected'
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
  }

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={'w-[400px] h-[400px] bg-transparent rounded-l-xl rounded-r-none border border-gray-400'}
      {...(status === 'Connected' ? attributes : {})}
      {...(status === 'Connected' ? listeners : {})}
    >
      <video
        className="w-full h-full bg-black rounded-l-xl rounded-r-none"
        ref={selfVideoRef}
        autoPlay
        playsInline
      />
      <div className="relative bottom-[48px] left-0 w-full h-10 rounded-xl z-20">
        <div className="flex items-center justify-center w-full h-full bg-black rounded-xl gap-x-2 py-2">
          <Toggle
            className="cursor-pointer z-30"
            variant="outline"
            aria-label="Toggle Microphone"
            onClick={toggleMic}
          >
            {isMicOn ? <Mic /> : <MicOff className="text-red-500" />}
          </Toggle>
          <Toggle
            className="cursor-pointer z-30"
            variant="outline"
            aria-label="Toggle Camera"
            onClick={toggleCamera}
          >
            {isCameraOn ? <Video /> : <VideoOff className="text-red-500" />}
          </Toggle>
        </div>
      </div>
    </div>
  )
}

export default SelfVideo
