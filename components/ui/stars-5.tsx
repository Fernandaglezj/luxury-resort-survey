import React from "react"
import { Star } from "lucide-react"

interface Stars5Props {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export const Stars5: React.FC<Stars5Props> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            disabled={disabled}
            className={`transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
              value >= star ? "text-amber-400" : "text-sage-400"
            }`}
            aria-label={`Calificación ${star}`}
          >
            <Star size={44} fill={value >= star ? "#f59e42" : "none"} />
          </button>
        ))}
      </div>
      <div className="text-sm text-white mt-1 tracking-wide">
        {value ? `${value} estrella${value > 1 ? 's' : ''}` : "Selecciona una calificación"}
      </div>
    </div>
  )
} 