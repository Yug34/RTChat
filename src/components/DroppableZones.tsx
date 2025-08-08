import { ReactNode } from 'react'
import Droppable from './Droppable'
import { cn } from '@/lib/utils'
import useChatStore from '@/store/core'
import useDragDropStore from '@/store/dragDropStore'

interface DroppableZonesProps {
  draggable: ReactNode
}

interface DroppableZoneConfig {
  id: string
  className: string
}

const ZONE_SIZE = '600px'

const droppableZones: DroppableZoneConfig[] = [
  { id: 'tl', className: `absolute top-0 left-0 w-[${ZONE_SIZE}] h-[${ZONE_SIZE}]` },
  { id: 'bl', className: `absolute bottom-0 left-0 w-[${ZONE_SIZE}] h-[${ZONE_SIZE}]` },
  { id: 'tr', className: `absolute top-0 right-0 w-[${ZONE_SIZE}] h-[${ZONE_SIZE}]` },
  { id: 'br', className: `absolute bottom-0 right-0 w-[${ZONE_SIZE}] h-[${ZONE_SIZE}]` },
]

const DroppableZones = ({ draggable }: DroppableZonesProps) => {
  const { status } = useChatStore()
  const { activeParent } = useDragDropStore()

  if (status !== 'Connected') {
    return draggable
  }

  return (
    <div className="absolute top-0 left-0 w-screen h-screen pointer-events-none">
      {droppableZones.map(({ id, className }) => {
        const isDraggableWithinDropzone = activeParent === id

        return (
          <Droppable key={id} id={id} isActive={isDraggableWithinDropzone} className={className}>
            <div
              className={cn(
                'flex justify-center items-center w-full h-full pointer-events-none',
                isDraggableWithinDropzone && 'z-50 pointer-events-auto',
              )}
            >
              {isDraggableWithinDropzone && draggable}
            </div>
          </Droppable>
        )
      })}
    </div>
  )
}

export default DroppableZones
