import React from "react"

const defaultEmojis = ["😞", "😐", "🙂", "😊", "🤩"]

const emojiTranslations = {
  es: {
    defaultLabels: ["Muy mal", "Regular", "Bien", "Muy bien", "Excelente"],
    selectOption: "Selecciona una opción"
  },
  en: {
    defaultLabels: ["Very bad", "Regular", "Good", "Very good", "Excellent"],
    selectOption: "Select an option"
  }
}

interface EmojiScaleProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  emojis?: string[]
  labels?: string[]
  language?: "es" | "en"
}

export const EmojiScale: React.FC<EmojiScaleProps> = ({ value, onChange, disabled, emojis, labels, language = "es" }) => {
  const emojiList = emojis && emojis.length > 0 ? emojis : defaultEmojis
  const t = emojiTranslations[language]
  const defaultLabels = t.defaultLabels
  const labelList = labels && labels.length === emojiList.length ? labels : defaultLabels.slice(0, emojiList.length)
  
  // If the happy emoji is selected (last emoji), show all happy faces
  const isHappySelected = value === emojiList.length
  const displayEmojis = isHappySelected ? emojiList.map(() => "😊") : emojiList
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {displayEmojis.map((emoji, idx) => (
          <button
            key={idx}
            type="button"
            className={`text-4xl p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
              value >= idx + 1
                ? "bg-amber-400 ring-2 ring-amber-500 scale-110 text-white rounded-full"
                : "hover:bg-sage-100 rounded-full"
            }`}
            onClick={() => !disabled && onChange(idx + 1)}
            disabled={disabled}
            aria-label={labelList[idx]}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="text-sm text-white mt-1 tracking-wide">
        {value ? labelList[value - 1] : t.selectOption}
      </div>
    </div>
  )
} 