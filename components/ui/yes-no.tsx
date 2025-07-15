import React from "react"

const yesNoTranslations = {
  es: {
    yes: "Sí",
    no: "No",
    maybe: "Tal vez"
  },
  en: {
    yes: "Yes",
    no: "No",
    maybe: "Maybe"
  }
}

interface YesNoProps {
  value: string
  onChange: (value: string) => void
  withMaybe?: boolean
  disabled?: boolean
  language?: "es" | "en"
}

export const YesNo: React.FC<YesNoProps> = ({ value, onChange, withMaybe = false, disabled, language = "es" }) => {
  const t = yesNoTranslations[language]
  
  const options = [
    { label: t.yes, value: "yes", color: "bg-green-500" },
    ...(withMaybe ? [{ label: t.maybe, value: "maybe", color: "bg-amber-400" }] : []),
    { label: t.no, value: "no", color: "bg-red-500" },
  ]
  return (
    <div className="flex gap-4 justify-center">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => !disabled && onChange(opt.value)}
          disabled={disabled}
          className={`px-8 py-4 rounded-xl text-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/60 border border-sage-200
            ${
              value === opt.value
                ? `${opt.color} text-white scale-110`
                : "bg-sage-100 text-sage-700 hover:bg-sage-200"
            }
          `}
          aria-label={opt.label}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
} 