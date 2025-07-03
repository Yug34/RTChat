import { ReactNode } from 'react'
import Droppable from './Droppable'

interface DroppableZonesProps {
  parent: string | null
  draggable: ReactNode
}

interface DroppableZoneConfig {
  id: string
  className: string
}

const droppableZones: DroppableZoneConfig[] = [
  { id: 'video-preview-1', className: 'absolute top-0 left-0 w-[600px] h-[600px]' },
  { id: 'video-preview-2', className: 'absolute bottom-0 left-0 w-[600px] h-[600px]' },
  { id: 'video-preview-3', className: 'absolute top-0 right-0 w-[600px] h-[600px]' },
  { id: 'video-preview-4', className: 'absolute bottom-0 right-0 w-[600px] h-[600px]' },
]

const DroppableZones = ({ parent, draggable }: DroppableZonesProps) => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen pointer-events-none">
      {droppableZones.map(({ id, className }) => (
        <Droppable key={id} id={id} className={className}>
          <div className="flex justify-center items-center w-full h-full border border-red-500 pointer-events-auto">
            {parent === id ? draggable : 'Drop here'}
          </div>
        </Droppable>
      ))}
    </div>
  )
}

export default DroppableZones
