import React from 'react'
import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type VolumeSliderProps = {
  volume: number
  onVolumeChange: (volume: number) => void
  className?: string
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, onVolumeChange, className }) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    onVolumeChange(newVolume)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Volume2 className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className="w-20 h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
        }}
      />
      <span className="text-xs text-neutral-600 dark:text-neutral-300 w-8">
        {Math.round(volume * 100)}%
      </span>
    </div>
  )
}

export default VolumeSlider
