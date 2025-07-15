import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { EmojiScale } from "@/components/ui/emoji-scale"
import { ThermometerScale } from "@/components/ui/thermometer-scale"
import { Stars3 } from "@/components/ui/stars-3"
import { Stars5 } from "@/components/ui/stars-5"
import { YesNo } from "@/components/ui/yes-no"
import { SelectorThree } from "@/components/ui/selector-three"
import { Slider } from "@/components/ui/slider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { BarScale } from "@/components/ui/bar-scale"

// Translations for question instructions
const instructionTranslations = {
  es: {
    dragToRate: "Arrastra el control para calificar",
    selectLevel: "Selecciona el nivel",
    selectOption: "Selecciona una opción",
    selectOptions: "Selecciona una o varias opciones",
    writeAnswer: "Escribe tu respuesta",
    writeAnswerPlaceholder: "Escribe tu respuesta...",
    selectOptionPlaceholder: "Selecciona una opción",
    configError: "⚠️ Error de configuración: Falta rango (min/max) para el slider.",
    configErrorFix: "Corrige la pregunta en la base de datos."
  },
  en: {
    dragToRate: "Drag the control to rate",
    selectLevel: "Select the level",
    selectOption: "Select an option",
    selectOptions: "Select one or more options",
    writeAnswer: "Write your answer",
    writeAnswerPlaceholder: "Write your answer...",
    selectOptionPlaceholder: "Select an option",
    configError: "⚠️ Configuration error: Missing range (min/max) for slider.",
    configErrorFix: "Fix the question in the database."
  }
}

export function QuestionPreview({
  question,
  value,
  setValue,
  disabled = false,
  language = "es",
}: {
  question: any
  value: any
  setValue: (v: any) => void
  disabled?: boolean
  language?: "es" | "en"
}) {
  const type = (question.inputType || question.input_type || question.question_type || "").toLowerCase()
  const inputClass = "w-full max-w-xs mx-auto bg-white border border-amber-200 rounded-xl p-3 shadow focus-within:border-amber-400 transition-all"
  const helpTextClass = "text-xs text-white mt-2 text-center"
  const t = instructionTranslations[language]

  switch (type) {
    case "slider":
      if (question.minValue === undefined || question.maxValue === undefined) {
        return (
          <div className="flex flex-col items-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
            <span>{t.configError}</span>
            <span className="text-xs mt-2">{t.configErrorFix}</span>
          </div>
        )
      }
      return (
        <div className="flex flex-col items-center">
          <Slider
            value={[Number(value) || question.minValue]}
            onValueChange={v => setValue(v[0])}
            min={question.minValue}
            max={question.maxValue}
            step={1}
            className="w-40"
            disabled={disabled}
          />
          <div className="mt-2 text-white font-semibold text-lg">{value || question.minValue} / {question.maxValue}</div>
          <div className={helpTextClass}>{t.dragToRate}</div>
        </div>
      )
    case "stars_3":
    case "stars":
      // Use Stars5 for restaurant questions only, Stars3 for others
      if (question.category === "Restaurantes") {
        return (
          <div className="flex flex-col items-center">
            <Stars5 value={Number(value)} onChange={setValue} language={language} />
          </div>
        )
      }
      return (
        <div className="flex flex-col items-center">
          <Stars3 value={Number(value)} onChange={setValue} language={language} />
        </div>
      )
    case "emoji_scale":
    case "emoji":
      return (
        <div className="flex flex-col items-center">
          <EmojiScale value={Number(value)} onChange={setValue} emojis={question.options} language={language} />
        </div>
      )
    case "thermometer":
      return (
        <div className="flex flex-col items-center">
          <ThermometerScale value={Number(value) || 1} onChange={setValue} min={1} max={5} language={language} />
          <div className={helpTextClass}>{t.selectLevel}</div>
        </div>
      )
    case "bar_scale":
      return (
        <div className="flex flex-col items-center">
          <BarScale 
            value={Number(value) || 1} 
            onChange={setValue} 
            min={1} 
            max={5}
            disabled={disabled}
            language={language}
          />
        </div>
      )
    case "yes_no":
      return (
        <div className="flex flex-col items-center">
          <YesNo value={value} onChange={setValue} language={language} />
          <div className={helpTextClass}>{t.selectOption}</div>
        </div>
      )
    case "yes_no_maybe":
      return (
        <div className="flex flex-col items-center">
          <YesNo value={value} onChange={setValue} withMaybe language={language} />
          <div className={helpTextClass}>{t.selectOption}</div>
        </div>
      )
    case "checkbox":
    case "checkboxes":
      return (
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-2">
            {(question.options || []).map((opt: string) => (
              <label key={opt} className="flex items-center gap-2">
                <Checkbox
                  checked={Array.isArray(value) ? value.includes(opt) : false}
                  onCheckedChange={(checked) => {
                    let arr = Array.isArray(value) ? [...value] : []
                    if (checked) arr.push(opt)
                    else arr = arr.filter((o) => o !== opt)
                    setValue(arr)
                  }}
                  disabled={disabled}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className={helpTextClass}>{t.selectOptions}</div>
        </div>
      )
    case "selector_three":
      return (
        <div className="flex flex-col items-center">
          <SelectorThree value={value} onChange={setValue} options={question.options ? question.options.map((o: string) => ({ label: o, value: o })) : []} />
          <div className={helpTextClass}>{t.selectOption}</div>
        </div>
      )
    case "radio":
      return (
        <div className="flex flex-col items-center">
          <RadioGroup value={value} onValueChange={setValue} className="flex flex-col gap-2 items-center">
            {(question.options || []).map((opt: string) => (
              <div key={opt} className="flex items-center gap-2">
                <RadioGroupItem 
                  value={opt} 
                  id={opt}
                  className="border-red-400 text-red-400 data-[state=checked]:border-red-400 data-[state=checked]:text-red-400"
                />
                <label htmlFor={opt} className="text-white text-sm">{opt}</label>
              </div>
            ))}
          </RadioGroup>
          <div className={helpTextClass}>{t.selectOption}</div>
        </div>
      )
    case "select":
      return (
        <div className="flex flex-col items-center">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t.selectOptionPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {(question.options || []).map((opt: string) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className={helpTextClass}>{t.selectOption}</div>
        </div>
      )
    case "textarea":
    case "text_optional":
      return (
        <div className="flex flex-col items-center">
          <Textarea value={value} onChange={e => setValue(e.target.value)} className={inputClass} placeholder={t.writeAnswerPlaceholder} />
          <div className={helpTextClass}>{t.writeAnswer}</div>
        </div>
      )
    case "text":
    default:
      return (
        <div className="flex flex-col items-center">
          <Input value={value} onChange={e => setValue(e.target.value)} className={inputClass} placeholder={t.writeAnswerPlaceholder} />
          <div className={helpTextClass}>{t.writeAnswer}</div>
        </div>
      )
  }
} 