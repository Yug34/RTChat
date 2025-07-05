import { useDroppable } from '@dnd-kit/core'

interface DroppableProps {
  id: string
  isActive: boolean
  className?: string
  children: React.ReactNode
}

const Droppable = (props: DroppableProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })
  const style = {
    opacity: isOver || props.isActive ? 1 : 0.5,
  }

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  )
}

export default Droppable
