import React from "react"

const defaultEmojis = ["😞", "😐", "🙂", "😊", "🤩"]
const defaultLabels = ["Muy mal", "Regular", "Bien", "Muy bien", "Excelente"]

interface EmojiScaleProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  emojis?: string[]
  labels?: string[]
}

export const EmojiScale: React.FC<EmojiScaleProps> = ({ value, onChange, disabled, emojis, labels }) => {
  const emojiList = emojis && emojis.length > 0 ? emojis : defaultEmojis
  const labelList = labels && labels.length === emojiList.length ? labels : defaultLabels.slice(0, emojiList.length)
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {emojiList.map((emoji, idx) => (
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
        {value ? labelList[value - 1] : "Selecciona una opción"}
      </div>
    </div>
  )
} 