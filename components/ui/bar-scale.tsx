import { useState } from "react"

interface BarScaleProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  language?: "es" | "en"
}

const barScaleTranslations = {
  es: {
    level: "Nivel",
    selectLevel: "Selecciona el nivel"
  },
  en: {
    level: "Level",
    selectLevel: "Select the level"
  }
}

export function BarScale({ 
  value = 1, 
  onChange, 
  min = 1, 
  max = 5, 
  disabled = false,
  language = "es"
}: BarScaleProps) {
  const levels = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const t = barScaleTranslations[language]

  // Color gradient from yellow to green
  const getBarColor = (level: number, isSelected: boolean) => {
    // If this level is selected or any level below is selected, fill with color
    if (level <= value) {
      const colors = [
        'bg-yellow-400', // Level 1 - Yellow
        'bg-yellow-500', // Level 2 - Darker yellow
        'bg-green-400',  // Level 3 - Light green
        'bg-green-500',  // Level 4 - Medium green
        'bg-green-600'   // Level 5 - Dark green
      ]
      return colors[level - 1] || 'bg-yellow-400'
    }
    
    // If not selected, show white with hover effect
    return 'bg-white hover:bg-yellow-200'
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-end gap-2 h-16">
        {levels.map((level) => {
          // Height calculation: more subtle progression like in the image
          // Level 1: 70%, Level 2: 78%, Level 3: 86%, Level 4: 94%, Level 5: 100%
          const heightPercentages = [70, 78, 86, 94, 100]
          const height = heightPercentages[level - 1] || 70
          const barColor = getBarColor(level, false)
          
          return (
            <button
              key={level}
              onClick={() => !disabled && onChange(level)}
              disabled={disabled}
              className={`
                w-8 rounded-full transition-all duration-200 ease-in-out shadow-lg
                ${barColor}
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              style={{ height: `${height}%` }}
              aria-label={`${t.level} ${level}`}
            />
          )
        })}
      </div>
      
      <div className="text-center">
        <div className="text-gray-400 text-sm font-medium">
          {t.level} {value}
        </div>
        <div className="text-gray-300 text-xs">
          {t.selectLevel}
        </div>
      </div>
    </div>
  )
} 