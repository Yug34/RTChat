import { cn } from '@/lib/utils'
import useChatStore from '@/store/core'
import { useDraggable } from '@dnd-kit/core'

type SelfVideoProps = {
  selfVideoRef: React.RefObject<HTMLVideoElement | null>
}

const SelfVideo: React.FC<SelfVideoProps> = ({ selfVideoRef }) => {
  const { status } = useChatStore()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'self-video' })

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
        'absolute bottom-4 right-4 w-[400px] h-[400px] bg-transparent': status === 'Connected',
        'absolute bottom-0 right-0 w-full h-full -z-10 opacity-70 bg-transparent':
          status !== 'Connected',
      })}
      {...attributes}
      {...listeners}
    >
      <video className="w-full h-full bg-black" ref={selfVideoRef} autoPlay playsInline />
    </div>
  )
}

export default SelfVideo
