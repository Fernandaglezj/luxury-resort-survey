"use client"

import { useSurveyConfig } from "@/hooks/use-survey-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ConfigPage() {
  const { config, loading, reload } = useSurveyConfig()

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-800">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-slate-900/70 to-emerald-800/60"></div>
      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <a href="/" className="text-white/60 hover:text-amber-300 transition-colors duration-300">
              ← Volver
            </a>
            <div>
              <h1 className="text-3xl font-light text-white tracking-[0.2em] uppercase">
                Configuración de Encuesta
              </h1>
              <p className="text-white/80 tracking-wide">
                Las preguntas se obtienen automáticamente desde la base de datos.
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-amber-400 mr-2" />
                <span className="text-white/80">Cargando preguntas...</span>
              </div>
            ) : (
              <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white font-light tracking-wide flex items-center gap-2">
                    Preguntas actuales ({config.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {config.length === 0 && <div className="text-white/70">No hay preguntas configuradas en la base de datos.</div>}
                    {config.map((q, i) => (
                      <div key={q.id} className="p-4 bg-white/5 border border-white/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-amber-400 font-medium">Pregunta {i + 1}</span>
                          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">{q.inputType}</span>
                          {q.required && (
                            <span className="text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded">Requerida</span>
                          )}
                        </div>
                        <p className="text-white mb-2">{q.question}</p>
                        {q.options && q.options.length > 0 && (
                          <div className="text-sm text-white/60">
                            <span className="font-medium">Opciones:</span> {q.options.join(', ')}
                          </div>
                        )}
                        {(q.minValue !== undefined || q.maxValue !== undefined) && (
                          <div className="text-sm text-white/60">
                            <span className="font-medium">Rango:</span> {q.minValue || 0} - {q.maxValue || '∞'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 