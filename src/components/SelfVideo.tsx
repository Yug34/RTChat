import { cn } from '@/lib/utils'
import useChatStore from '@/store/core'
import { useDraggable } from '@dnd-kit/core'

type SelfVideoProps = {
  selfVideoRef: React.RefObject<HTMLVideoElement | null>
}

const SelfVideo: React.FC<SelfVideoProps> = ({ selfVideoRef }) => {
  const { status } = useChatStore()
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
      className={cn(
        {
          'hidden': status !== 'Connected',
          'absolute bottom-10 right-10 bg-transparent w-[400px] h-[400px] border border-gray-400': status === 'Connected',
        },
      )}
      {...(status === 'Connected' ? attributes : {})}
      {...(status === 'Connected' ? listeners : {})}
    >
      <video
        className="w-full h-full bg-black"
        ref={selfVideoRef}
        autoPlay
        playsInline
      />
    </div>
  )
}

export default SelfVideo
