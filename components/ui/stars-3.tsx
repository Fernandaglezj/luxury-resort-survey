import React from "react"
import { Star } from "lucide-react"

interface Stars3Props {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  language?: "es" | "en"
}

const starTranslations = {
  es: {
    rating: "Calificación",
    star: "estrella",
    stars: "estrellas",
    selectRating: "Selecciona una calificación"
  },
  en: {
    rating: "Rating",
    star: "star",
    stars: "stars",
    selectRating: "Select a rating"
  }
}

export const Stars3: React.FC<Stars3Props> = ({ value, onChange, disabled, language = "es" }) => {
  const t = starTranslations[language]
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {[1, 2, 3].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            disabled={disabled}
            className={`transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
              value >= star ? "text-amber-400" : "text-sage-400"
            }`}
            aria-label={`${t.rating} ${star}`}
          >
            <Star size={44} fill={value >= star ? "#f59e42" : "none"} />
          </button>
        ))}
      </div>
      <div className="text-sm text-white mt-1 tracking-wide">
        {value ? `${value} ${value > 1 ? t.stars : t.star}` : t.selectRating}
      </div>
    </div>
  )
} 