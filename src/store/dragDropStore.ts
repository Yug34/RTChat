import { create } from 'zustand'
import { DEFAULT_ACTIVE_PARENT } from '@/constants'

export type DragDropStoreState = {
  activeParent: string
  setActiveParent: (activeParent: string) => void
}

const useDragDropStore = create<DragDropStoreState>((set) => ({
  activeParent: DEFAULT_ACTIVE_PARENT,
  setActiveParent: (activeParent: string) => set({ activeParent }),
}))

export default useDragDropStore
