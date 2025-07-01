import { cn } from '@/lib/utils'
import useChatStore from '@/store/core'
import { useDraggable } from '@dnd-kit/core'
import { GripHorizontal } from 'lucide-react'

type SelfVideoProps = {
  selfVideoRef: React.RefObject<HTMLVideoElement | null>
}

const SelfVideo: React.FC<SelfVideoProps> = ({ selfVideoRef }) => {
  const { status, isCameraOn } = useChatStore()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'self-video',
    disabled: status !== 'Connected',
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn({
        hidden: status !== 'Connected',
        'absolute bottom-10 right-10 bg-transparent w-[400px] h-[416px]': status === 'Connected',
      })}
      {...(status === 'Connected' ? attributes : {})}
      {...(status === 'Connected' ? listeners : {})}
    >
      <div className="flex flex-col w-full h-full bg-black border border-gray-400 rounded-xl">
        {isCameraOn ? (
          <>
            <video
              className="w-full h-[400px] bg-black rounded-t-xl"
              ref={selfVideoRef}
              autoPlay
              playsInline
            />
            <div className="flex flex-row items-center justify-center w-full h-4 bg-black rounded-b-xl mb-2">
              <GripHorizontal className="cursor-grab" />
            </div>
          </>
        ) : (
          <div className="flex w-full h-full justify-center items-center bg-[#202124] rounded-xl">
            <span className="text-white">Camera is off</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SelfVideo
