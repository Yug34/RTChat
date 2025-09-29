import { cn } from '@/lib/utils'
import useChatStore from '@/store/core'
import { useDraggable } from '@dnd-kit/core'
import { GripHorizontal } from 'lucide-react'
import { memo, useEffect } from 'react'

type SelfVideoProps = {
  selfVideoRef: React.RefObject<HTMLVideoElement | null>
}

const SelfVideo: React.FC<SelfVideoProps> = ({ selfVideoRef }) => {
  const status = useChatStore((s) => s.status)
  const isCameraOn = useChatStore((s) => s.isCameraOn)
  const localStream = useChatStore((s) => s.localStream)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'self-video',
    disabled: status !== 'Connected',
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  useEffect(() => {
    if (selfVideoRef.current && localStream) {
      selfVideoRef.current.srcObject = localStream
    }
  }, [localStream, selfVideoRef])

  useEffect(() => {
    if (isCameraOn) {
      selfVideoRef.current!.srcObject = localStream
    }
  }, [isCameraOn])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn({
        hidden: status !== 'Connected',
        'bg-transparent w-[400px] h-[416px] z-40 pointer-events-auto opacity-100 touch-none select-none':
          status === 'Connected',
      })}
      {...(status === 'Connected' ? attributes : {})}
      {...(status === 'Connected' ? listeners : {})}
    >
      <div className="flex flex-col w-full h-full bg-black border border-gray-400 rounded-xl">
        {isCameraOn ? (
          <>
            <video
              className="w-full h-[400px] bg-black rounded-t-xl touch-none"
              ref={selfVideoRef}
              autoPlay
              playsInline
              controls={false}
              draggable={false}
              {...(status === 'Connected' ? listeners : {})}
            />
            <div className="flex flex-row items-center justify-center w-full h-4 bg-black rounded-b-xl mb-2">
              <GripHorizontal
                className={cn({
                  'cursor-grab': !isDragging,
                  'cursor-grabbing': isDragging,
                })}
              />
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

export default memo(SelfVideo)
