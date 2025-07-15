"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { EmojiScale } from "@/components/ui/emoji-scale"
import { ThermometerScale } from "@/components/ui/thermometer-scale"
import { Stars3 } from "@/components/ui/stars-3"
import { YesNo } from "@/components/ui/yes-no"
import { SelectorThree } from "@/components/ui/selector-three"
import { Leaf, Sparkles, Loader2, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSurveyConfig } from "@/hooks/use-survey-config"
import { useToast } from "@/hooks/use-toast"
import { SupabaseStatus } from "@/components/supabase-status"
import { QuestionPreview } from "@/components/QuestionPreview"
import { getGuestByRoomNumber } from "@/lib/supabase"

// Eliminar RenderSurveyInput y renderInput

export default function DynamicSurvey() {
  const [step, setStep] = useState(0)
  const [roomNumber, setRoomNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<{ [id: string]: any }>({})
  const [guest, setGuest] = useState<any>(null)
  const [roomError, setRoomError] = useState<string>("")
  const { config: questions, loading: configLoading } = useSurveyConfig()
  const { toast } = useToast()

  const currentQuestion = questions[step - 1]
  const totalSteps = questions.length + 3 // 1: room, N: preguntas, 1: agradecimiento, 1: reserva

  const handleNext = () => {
    if (step < questions.length + 1) setStep(step + 1)
  }
  const handlePrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleResponse = (value: any) => {
    if (!currentQuestion) return
    setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleRoomSubmit = async () => {
    setLoading(true)
    setRoomError("")
    const foundGuest = await getGuestByRoomNumber(roomNumber.trim())
    if (!foundGuest) {
      setRoomError("No se encontró un huésped con ese número de habitación.")
      setLoading(false)
      return
    }
    setGuest(foundGuest)
    setStep(1)
    setLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Aquí puedes enviar las respuestas a Supabase o tu backend
      // Incluye el número de habitación y el objeto responses
      // await submitSurveyResponse({ room_number: roomNumber, responses })
      toast({
        title: "¡Encuesta enviada!",
        description: "Gracias por compartir tu experiencia.",
      })
      setStep(questions.length + 3)
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "No se pudo enviar la encuesta. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Agrupar preguntas por categoría y subcategoría
  const groupedQuestions = questions.reduce((acc, q) => {
    const cat = String(q.category || 'Sin categoría')
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(q)
    return acc
  }, {} as Record<string, typeof questions>)

  // Obtener todas las subcategorías en orden
  const allSubcats: { category: string, subcategory: string }[] = []
  Object.entries(groupedQuestions).forEach(([category, qs]) => {
    const subcatSet = new Set<string>()
    qs.forEach(q => {
      const subcat = q.subcategory || 'Sin subcategoría'
      if (!subcatSet.has(subcat)) {
        allSubcats.push({ category, subcategory: subcat })
        subcatSet.add(subcat)
      }
    })
  })
  const [subcatStep, setSubcatStep] = useState(0)
  const currentSubcat = allSubcats[subcatStep]
  const isLastSubcat = subcatStep === allSubcats.length - 1

  // Paginación de preguntas por subcategoría
  const QUESTIONS_PER_PAGE = 4;
  const [questionPage, setQuestionPage] = useState(0);
  const currentQuestions = groupedQuestions[currentSubcat?.category || '']
    ?.filter(q => (q.subcategory || 'Sin subcategoría') === currentSubcat?.subcategory)
    ?.slice(questionPage * QUESTIONS_PER_PAGE, (questionPage + 1) * QUESTIONS_PER_PAGE) || [];
  const totalQuestions = groupedQuestions[currentSubcat?.category || '']
    ?.filter(q => (q.subcategory || 'Sin subcategoría') === currentSubcat?.subcategory)?.length || 0;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

  const [reservaLlegada, setReservaLlegada] = useState("")
  const [reservaSalida, setReservaSalida] = useState("")
  const [reservaEnviada, setReservaEnviada] = useState(false)
  const handleReservaSubmit = () => {
    setReservaEnviada(true)
    // Aquí podrías enviar la info a Supabase o a un endpoint
  }

  // Render principal
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-['Cormorant Garamond'],serif" style={{ backgroundImage: 'url(/images/fondo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900/40 to-emerald-800/40 z-0"></div>
      <div className="relative z-10 w-full max-w-4xl px-4 py-8">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="fixed top-20 left-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
                <div>Step: {step}</div>
                <div>Questions: {questions.length}</div>
                <div>Subcat: {subcatStep + 1}/{allSubcats.length}</div>
                <div>IsLast: {isLastSubcat ? 'Yes' : 'No'}</div>
                <div>Current: {currentSubcat?.category} - {currentSubcat?.subcategory}</div>
              </div>
            )}
            
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-8 pt-16"
              >
                <div className="space-y-6">
                  <Leaf className="mx-auto text-amber-300" size={48} />
                  <h1 className="text-5xl font-light text-white tracking-[0.3em] uppercase">Banyan Tree Mayakoba</h1>
                  {/* <div className="flex justify-center gap-4">
                    <a
                      href="/admin"
                      className="text-xs text-white/60 hover:text-amber-300 transition-colors duration-300 underline decoration-dotted tracking-wider"
                    >
                      PANEL DE ADMINISTRACIÓN
                    </a>
                    <a
                      href="/config"
                      className="text-xs text-white/60 hover:text-amber-300 transition-colors duration-300 underline decoration-dotted tracking-wider"
                    >
                      CONFIGURAR ENCUESTA
                    </a>
                  </div> */}
                  <p className="text-lg text-white/90 leading-relaxed max-w-md mx-auto tracking-wide">
                    Queremos conocer tu experiencia para seguir mejorando cada detalle
                  </p>
                </div>
                <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="room" className="text-white font-light tracking-wide">
                        Número de habitación
                      </Label>
                      <Input
                        id="room"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="Ej: 101"
                        className="text-center text-lg border-white/30 focus:border-amber-400 bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm"
                        disabled={loading}
                      />
                    </div>
                    <Button
                      onClick={handleRoomSubmit}
                      disabled={!roomNumber.trim() || loading}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl tracking-wider uppercase font-light"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        "Comenzar encuesta"
                      )}
                    </Button>
                    {roomError && <div className="text-red-400 text-sm mt-2">{roomError}</div>}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {step === 1 && guest && currentSubcat && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 pt-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-5xl font-light text-yellow-300 mb-4">¡Bienvenida, {guest.name}!</h2>
                  <p className="text-white/80 text-lg">Gracias por ayudarnos a mejorar tu experiencia.</p>
                </div>
                <div className="mb-10">
                  <h2 className="text-2xl font-semibold text-white mb-4">{currentSubcat.category}</h2>
                  {/* Leyenda personalizada por categoría */}
                  {(() => {
                    switch ((currentSubcat.category || '').toLowerCase()) {
                      case 'actividades':
                        return <p className="text-emerald-200 mb-4">¿Cómo le fue en las diversas actividades en las que participó?</p>;
                      case 'spa':
                        return <p className="text-emerald-200 mb-4">Cuéntenos sobre su experiencia en el spa.</p>;
                      case 'restaurantes':
                        return <p className="text-emerald-200 mb-4">Queremos saber cómo fue su experiencia gastronómica.</p>;
                      case 'room service':
                        return <p className="text-emerald-200 mb-4">Cuéntenos sobre el servicio a la habitación.</p>;
                      case 'limpieza':
                        return <p className="text-emerald-200 mb-4">¿Qué le pareció la limpieza y el orden de su habitación?</p>;
                      case 'golf':
                        return <p className="text-emerald-200 mb-4">Cuéntenos sobre su experiencia en el campo de golf.</p>;
                      default:
                        return <p className="text-emerald-200 mb-4">Queremos conocer más sobre su experiencia en esta sección.</p>;
                    }
                  })()}
                  <h3 className="text-lg font-semibold text-amber-300 mb-6">{currentSubcat.subcategory}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {currentQuestions.map(q => (
                      <Card key={q.id} className="bg-white/5 border-white/20 shadow-2xl mb-6">
                        <CardContent className="p-8">
                          <div className="text-white text-lg mb-4">{q.question}</div>
                          <QuestionPreview
                            question={q}
                            value={responses[q.id] ?? ""}
                            setValue={(v) => setResponses((prev) => ({ ...prev, [q.id]: v }))}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {/* Navegación de páginas de preguntas */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-6">
                      <Button
                        variant="outline"
                        className="text-white border-white/30 bg-transparent hover:bg-white/10"
                        disabled={questionPage === 0}
                        onClick={() => setQuestionPage(p => Math.max(0, p - 1))}
                      >
                        Anterior
                      </Button>
                      <span className="text-white/80 self-center">Página {questionPage + 1} de {totalPages}</span>
                      <Button
                        variant="outline"
                        className="text-white border-white/30 bg-transparent hover:bg-white/10"
                        disabled={questionPage === totalPages - 1}
                        onClick={() => setQuestionPage(p => Math.min(totalPages - 1, p + 1))}
                      >
                        Siguiente
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-8">
                  {/* Solo permitir avanzar de sección si está en la última página de preguntas */}
                  <Button
                    onClick={() => {
                      
                      if (totalPages > 1 && questionPage < totalPages - 1) {
                        setQuestionPage(p => p + 1);
                      } else {
                        setQuestionPage(0);
                        if (isLastSubcat) {
                          setStep(questions.length + 1);
                        } else {
                          setSubcatStep(subcatStep + 1);
                        }
                      }
                    }}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white tracking-wide"
                  >
                    {totalPages > 1 && questionPage < totalPages - 1
                      ? "Siguiente"
                      : isLastSubcat
                        ? "Finalizar encuesta"
                        : "Siguiente sección"}
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </motion.div>
            )}
            {step === questions.length + 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 pt-8"
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="text-white" size={24} />
                      </div>
                      <h3 className="text-3xl font-light text-white mb-2 tracking-[0.2em] uppercase">
                        ¡Gracias por contestar la encuesta!
                      </h3>
                      <p className="text-white/80 tracking-wide text-lg mb-4">
                        Tu opinión es muy valiosa para nosotros y nos ayuda a mejorar cada detalle de tu experiencia.
                      </p>
                      <p className="text-amber-300 text-xl font-light tracking-wide">
                        ¡Gracias por tu opinión, {guest?.name}! Esperamos verte pronto para que disfrutes aún más.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="text-xl font-light text-amber-300 mb-2 tracking-wide">
                          ¿Te gustaría compartir algún comentario adicional?
                        </h4>
                        <p className="text-white/70 text-sm">
                          Cualquier sugerencia o comentario que nos ayude a mejorar la experiencia es bienvenido.
                        </p>
                      </div>
                      <Textarea
                        value={responses["improvement_comments"] ?? ""}
                        onChange={(e) => setResponses((prev) => ({ ...prev, improvement_comments: e.target.value }))}
                        placeholder="Escribe aquí tus comentarios, sugerencias o cualquier detalle que consideres importante para mejorar la experiencia..."
                        className="min-h-32 border-white/30 focus:border-amber-400 resize-none bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setStep(questions.length)}
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm tracking-wide"
                        disabled={loading}
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={() => setStep(questions.length + 2)}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 tracking-wider uppercase font-light"
                      >
                        Continuar
                        <ChevronRight size={20} className="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {step === questions.length + 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 pt-8"
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-light text-white mb-2 tracking-[0.2em] uppercase">
                        Comentarios adicionales
                      </h3>
                      <p className="text-white/80 tracking-wide">¿Algo más que te gustaría compartir?</p>
                    </div>
                    <Textarea
                      value={responses["additional_comments"] ?? ""}
                      onChange={(e) => setResponses((prev) => ({ ...prev, additional_comments: e.target.value }))}
                      placeholder="Comparte cualquier detalle que consideres importante..."
                      className="min-h-32 border-white/30 focus:border-amber-400 resize-none bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm"
                      disabled={loading}
                    />
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setStep(questions.length + 1)}
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm tracking-wide"
                        disabled={loading}
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 tracking-wider uppercase font-light"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} className="mr-2" />
                            Enviar opinión
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {step === questions.length + 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 pt-16"
              >
                <div className="space-y-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white" size={32} />
                  </div>
                  <h2 className="text-4xl font-light text-white tracking-[0.2em] uppercase">¡Gracias por tu tiempo!</h2>
                  <p className="text-white/90 max-w-md mx-auto leading-relaxed tracking-wide">
                    Tu opinión es muy valiosa para nosotros. Nos ayuda a crear experiencias aún más memorables.
                  </p>
                </div>
                <Card className="bg-white/5 border-white/20 shadow-2xl max-w-lg mx-auto">
                  <CardContent className="p-8 space-y-6">
                    <h3 className="text-2xl font-light text-amber-400 mb-2 tracking-[0.2em] uppercase">
                      ¿Te gustaría volver a visitarnos?
                    </h3>
                    <p className="text-white/80 mb-4">Déjanos las fechas que te interesarían para una próxima reserva:</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                      <div className="flex flex-col items-start w-full">
                        <Label htmlFor="fecha-llegada" className="text-white mb-1">Fecha de llegada</Label>
                        <Input id="fecha-llegada" type="date" value={reservaLlegada} onChange={e => setReservaLlegada(e.target.value)} className="bg-white/10 text-white" />
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <Label htmlFor="fecha-salida" className="text-white mb-1">Fecha de salida</Label>
                        <Input id="fecha-salida" type="date" value={reservaSalida} onChange={e => setReservaSalida(e.target.value)} className="bg-white/10 text-white" />
                      </div>
                    </div>
                    <Button
                      onClick={handleReservaSubmit}
                      disabled={!reservaLlegada || !reservaSalida || reservaEnviada}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl tracking-wider uppercase font-light mt-4"
                    >
                      {reservaEnviada ? "¡Solicitud enviada!" : "Enviar solicitud de reserva"}
                    </Button>
                    {reservaEnviada && (
                      <div className="text-green-400 text-sm mt-2">¡Gracias! Nuestro equipo se pondrá en contacto contigo pronto.</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
