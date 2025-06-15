import { cn } from '@/lib/utils'
import useChatStore from '@/store/core'

type SelfVideoProps = {
  selfVideoRef: React.RefObject<HTMLVideoElement | null>
}

const SelfVideo: React.FC<SelfVideoProps> = ({ selfVideoRef }) => {
  const { status } = useChatStore()

  return (
    <video
      className={cn({
        'absolute bottom-4 right-4 w-[400px] h-[400px] bg-black': status === 'Connected',
        'absolute bottom-0 right-0 w-full h-full bg-black -z-10 opacity-70': status !== 'Connected',
      })}
      ref={selfVideoRef}
      autoPlay
      playsInline
    />
  )
}

export default SelfVideo
