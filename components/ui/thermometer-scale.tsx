import React from "react"

const thermometerTranslations = {
  es: {
    level: "Nivel",
    selectLevel: "Selecciona el nivel"
  },
  en: {
    level: "Level",
    selectLevel: "Select the level"
  }
}

interface ThermometerScaleProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  language?: "es" | "en"
}

export const ThermometerScale: React.FC<ThermometerScaleProps> = ({ value, onChange, min = 1, max = 5, disabled, language = "es" }) => {
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const t = thermometerTranslations[language]
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 items-end">
        {range.map((v) => (
          <button
            key={v}
            type="button"
            className={`transition-all duration-200 rounded-full focus:outline-none shadow border ${
              value === v
                ? "bg-yellow-400 border-yellow-400 scale-110"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
            style={{
              width: 28,
              height: 28 + v * 12,
              borderRadius: 14,
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={() => !disabled && onChange(v)}
            disabled={disabled}
            aria-label={`${t.level} ${v}`}
          />
        ))}
      </div>
      <div className="text-sm text-gray-400 mt-1 tracking-wide">
        {value ? `${t.level} ${value}` : t.selectLevel}
      </div>
    </div>
  )
} 