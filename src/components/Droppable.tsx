import { useDroppable } from '@dnd-kit/core'

const Droppable = (props: { id: string; className?: string; children: React.ReactNode }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })
  const style = {
    opacity: isOver ? 1 : 0.5,
  }

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  )
}

export default Droppable
