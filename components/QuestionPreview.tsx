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

export function QuestionPreview({
  question,
  value,
  setValue,
  disabled = false,
}: {
  question: any
  value: any
  setValue: (v: any) => void
  disabled?: boolean
}) {
  const type = (question.inputType || question.input_type || question.question_type || "").toLowerCase()
  const inputClass = "w-full max-w-xs mx-auto bg-white border border-amber-200 rounded-xl p-3 shadow focus-within:border-amber-400 transition-all"
  const helpTextClass = "text-xs text-white mt-2 text-center"
  switch (type) {
    case "slider":
      if (question.minValue === undefined || question.maxValue === undefined) {
        return (
          <div className="flex flex-col items-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
            <span>⚠️ Error de configuración: Falta rango (min/max) para el slider.</span>
            <span className="text-xs mt-2">Corrige la pregunta en la base de datos.</span>
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
          <div className={helpTextClass}>Arrastra el control para calificar</div>
        </div>
      )
    case "stars_3":
    case "stars":
      // Use Stars5 for restaurant questions only, Stars3 for others
      if (question.category === "Restaurantes") {
        return (
          <div className="flex flex-col items-center">
            <Stars5 value={Number(value)} onChange={setValue} />
          </div>
        )
      }
      return (
        <div className="flex flex-col items-center">
          <Stars3 value={Number(value)} onChange={setValue} />
        </div>
      )
    case "emoji_scale":
    case "emoji":
      return (
        <div className="flex flex-col items-center">
          <EmojiScale value={Number(value)} onChange={setValue} emojis={question.options} />
        </div>
      )
    case "thermometer":
      return (
        <div className="flex flex-col items-center">
          <ThermometerScale value={Number(value) || 1} onChange={setValue} min={1} max={5} />
          <div className={helpTextClass}>Selecciona el nivel</div>
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
          />
        </div>
      )
    case "yes_no":
      return (
        <div className="flex flex-col items-center">
          <YesNo value={value} onChange={setValue} />
          <div className={helpTextClass}>Selecciona una opción</div>
        </div>
      )
    case "yes_no_maybe":
      return (
        <div className="flex flex-col items-center">
          <YesNo value={value} onChange={setValue} withMaybe />
          <div className={helpTextClass}>Selecciona una opción</div>
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
          <div className={helpTextClass}>Selecciona una o varias opciones</div>
        </div>
      )
    case "selector_three":
      return (
        <div className="flex flex-col items-center">
          <SelectorThree value={value} onChange={setValue} options={question.options ? question.options.map((o: string) => ({ label: o, value: o })) : []} />
          <div className={helpTextClass}>Selecciona una opción</div>
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
          <div className={helpTextClass}>Selecciona una opción</div>
        </div>
      )
    case "select":
      return (
        <div className="flex flex-col items-center">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              {(question.options || []).map((opt: string) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className={helpTextClass}>Selecciona una opción</div>
        </div>
      )
    case "textarea":
    case "text_optional":
      return (
        <div className="flex flex-col items-center">
          <Textarea value={value} onChange={e => setValue(e.target.value)} className={inputClass} placeholder="Escribe tu respuesta..." />
          <div className={helpTextClass}>Escribe tu respuesta</div>
        </div>
      )
    case "text":
    default:
      return (
        <div className="flex flex-col items-center">
          <Input value={value} onChange={e => setValue(e.target.value)} className={inputClass} placeholder="Escribe tu respuesta..." />
          <div className={helpTextClass}>Escribe tu respuesta</div>
        </div>
      )
  }
} 