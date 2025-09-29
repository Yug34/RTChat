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

const droppableZones: DroppableZoneConfig[] = [
  { id: 'tl', className: 'top-0 left-0 w-[50vw] h-[50vw] lg:w-[600px] lg:h-[600px]' },
  { id: 'bl', className: 'items-end bottom-0 left-0 w-[50vw] h-[50vw] lg:w-[600px] lg:h-[600px]' },
  { id: 'tr', className: 'justify-end top-0 right-0 w-[50vw] h-[50vw] lg:w-[600px] lg:h-[600px]' },
  {
    id: 'br',
    className: 'items-end justify-end bottom-0 right-0 w-[50vw] h-[50vw] lg:w-[600px] lg:h-[600px]',
  },
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
          <Droppable
            key={id}
            id={id}
            isActive={isDraggableWithinDropzone}
            className={`absolute flex ${className}`}
          >
            <div
              className={cn(
                'flex justify-center items-start w-fit h-fit p-4 pointer-events-none',
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
