import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { DndContext } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <DndContext modifiers={[restrictToWindowEdges]}>
      <App />
    </DndContext>
  </StrictMode>,
)
