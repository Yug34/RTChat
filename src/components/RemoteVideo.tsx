import { cn } from '@/lib/utils'
import useChatStore from '@/store/core'
import { memo } from 'react'

type RemoteVideoProps = {
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
}

const RemoteVideo: React.FC<RemoteVideoProps> = ({ remoteVideoRef }) => {
  const status = useChatStore((s) => s.status)
  const isRemoteStreamActive = useChatStore((s) => s.isRemoteStreamActive)

  return (
    <video
      className={cn({
        'absolute bottom-4 right-4 w-[400px] h-[400px] bg-black': status !== 'Connected',
        'flex-1 bg-black -z-10': status === 'Connected',
        hidden: !isRemoteStreamActive,
      })}
      ref={remoteVideoRef}
      autoPlay
      playsInline
    />
  )
}

export default memo(RemoteVideo)
