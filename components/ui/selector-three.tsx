import React from "react"

interface SelectorThreeProps {
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
  disabled?: boolean
}

export const SelectorThree: React.FC<SelectorThreeProps> = ({ value, onChange, options, disabled }) => {
  return (
    <div className="flex gap-4 justify-center">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => !disabled && onChange(opt.value)}
          disabled={disabled}
          className={`px-6 py-3 rounded-xl text-lg font-medium text-white shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
            value === opt.value ? "bg-amber-400 scale-110 text-amber-900" : "bg-white/10 hover:bg-white/20"
          }`}
          aria-label={opt.label}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
} 