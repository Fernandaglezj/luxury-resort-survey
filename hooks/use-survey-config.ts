import { useState, useEffect } from 'react'
import { getSurveyQuestions } from '@/lib/supabase-admin'

export interface QuestionConfig {
  id: string
  question: string
  inputType: string
  options?: string[]
  minValue?: number
  maxValue?: number
  required?: boolean
  order?: number
  category?: string
  subcategory?: string
}

export function useSurveyConfig() {
  const [config, setConfig] = useState<QuestionConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const questions = await getSurveyQuestions()
      // Normalizar campos para el frontend
      setConfig(
        questions.map((q: any, i: number) => ({
          ...q,
          id: q.id,
          question: q.question,
          inputType: q.input_type, // Usa el campo correcto
          options: Array.isArray(q.options) ? q.options : (q.options?.options || q.options?.labels || q.options?.emojis || []),
          minValue: q.minValue,
          maxValue: q.maxValue,
          required: q.required ?? true,
          order: q.display_order ?? i + 1,
          category: q.category,
          subcategory: q.subcategory
        }))
      )
    } catch (error) {
      setConfig([])
      console.error('Error loading survey questions from DB:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    config,
    loading,
    reload: loadConfig
  }
} 