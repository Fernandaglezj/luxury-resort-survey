"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Leaf, Sparkles, Loader2, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { QuestionPreview } from "@/components/QuestionPreview"
import { BackgroundMusic } from "@/components/BackgroundMusic"

// Mock data para preguntas y huésped
const mockQuestions = [
  {
    id: "1",
    question: "¿Cómo se sintió al llegar por primera vez a nuestro santuario?",
    inputType: "emoji",
    category: "General",
    subcategory: "Estancia General",
    required: true,
    options: ["😞", "😐", "😊"],
  },
  {
    id: "2",
    question: "Eficiencia del proceso de Check-in y entrega de habitación",
    inputType: "slider",
    category: "General",
    subcategory: "Estancia General",
    required: true,
    minValue: 1,
    maxValue: 5,
  },
  {
    id: "3",
    question: "Calidad General del Servicio",
    inputType: "stars",
    category: "General",
    subcategory: "Estancia General",
    required: true,
  },
  {
    id: "4",
    question: "¿Se sintió más relajado?",
    inputType: "bar_scale",
    category: "General",
    subcategory: "Estancia General",
    required: true,
  },
  {
    id: "5",
    question: "¿Se sintió que la suite fue preparada exclusivamente para usted?",
    inputType: "bar_scale",
    category: "Suite",
    subcategory: "Su Suite",
    required: true,
  },
  {
    id: "6",
    question: "Balance Perfecto entre Lujo y Comodidad",
    inputType: "stars",
    category: "Suite",
    subcategory: "Su Suite",
    required: true,
  },
  {
    id: "7",
    question: "¿Qué tan exclusiva se sintió su experiencia en la suite?",
    inputType: "bar_scale",
    category: "Suite",
    subcategory: "Su Suite",
    required: true,
  },
  {
    id: "8",
    question: "Satisfacción General con la Suite",
    inputType: "stars",
    category: "Suite",
    subcategory: "Su Suite",
    required: true,
  },
  {
    id: "9",
    question: "¿Qué te pareció el sabor y la calidad de la comida?",
    inputType: "stars",
    category: "Haab",
    subcategory: "Experiencia Gastronómica",
    required: true,
  },
  {
    id: "10",
    question: "¿Cómo fue la atención y qué tan rápido te atendimos?",
    inputType: "stars",
    category: "Haab",
    subcategory: "Experiencia Gastronómica",
    required: true,
  },
  {
    id: "11",
    question: "¿Cómo te sentiste con el ambiente del lugar?",
    inputType: "stars",
    category: "Haab",
    subcategory: "Experiencia Gastronómica",
    required: true,
  },
  {
    id: "12",
    question: "¿Qué te pareció el sabor y la calidad de la comida?",
    inputType: "stars",
    category: "Saffron",
    subcategory: "Experiencia Gastronómica",
    required: true,
  },
  {
    id: "13",
    question: "¿Cómo fue la atención y qué tan rápido te atendimos?",
    inputType: "stars",
    category: "Saffron",
    subcategory: "Experiencia Gastronómica",
    required: true,
  },
  {
    id: "14",
    question: "¿Cómo te sentiste con el ambiente del lugar?",
    inputType: "stars",
    category: "Saffron",
    subcategory: "Experiencia Gastronómica",
    required: true,
  },
  {
    id: "15",
    question: "¿Cómo calificarías tu experiencia en El Camaleón?",
    inputType: "stars",
    category: "Golf",
    subcategory: "Experiencia Golf",
    required: true,
  },
  {
    id: "16",
    question: "¿Qué tan retador y divertido te pareció el recorrido?",
    inputType: "bar_scale",
    category: "Golf",
    subcategory: "Experiencia Golf",
    required: true,
  },
  {
    id: "17",
    question: "¿Cómo evaluarías la calidad y el mantenimiento de nuestras instalaciones?",
    inputType: "stars",
    category: "Golf",
    subcategory: "Experiencia Golf",
    required: true,
  },
  {
    id: "18",
    question: "¿Qué tan especial sentiste la experiencia comparada con otros campos de golf?",
    inputType: "bar_scale",
    category: "Golf",
    subcategory: "Experiencia Golf",
    required: true,
  },
]

const mockGuest = { name: "Ricardo García" }

export default function DemoSurvey() {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomError, setRoomError] = useState("");
  const [lastName, setLastName] = useState("");

  const [step, setStep] = useState(0)
  const [responses, setResponses] = useState<{ [id: string]: any }>({})
  const [loading, setLoading] = useState(false)

  // Agrupar preguntas por categoría y subcategoría
  const groupedQuestions = mockQuestions.reduce((acc, q) => {
    const cat = String(q.category || 'Sin categoría')
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(q)
    return acc
  }, {} as Record<string, typeof mockQuestions>)

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

  const handleRoomSubmit = () => {
    if (!roomNumber.trim() || !lastName.trim()) {
      setRoomError("Por favor ingresa el número de habitación y el apellido.");
      return;
    }
    setRoomError("");
    setStep(1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-['Cormorant Garamond'],serif" style={{ backgroundImage: 'url(/images/fondo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900/40 to-emerald-800/40 z-0"></div>
      <div className="relative z-10 w-full max-w-4xl px-4 py-8">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-8 pt-16"
              >
                <div className="space-y-6">
                  <img src="/images/Logo.png" alt="Logo" className="mx-auto w-20 h-20" />
                  <h1 className="text-5xl font-light text-white tracking-[0.3em] uppercase">Banyan Tree Mayakoba</h1>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white font-light tracking-wide">
                        Apellido
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ej: García"
                        className="text-center text-lg border-white/30 focus:border-amber-400 bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm"
                      />
                    </div>
                    <Button
                      onClick={handleRoomSubmit}
                      disabled={!roomNumber.trim() || !lastName.trim()}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl tracking-wider uppercase font-light"
                    >
                      Comenzar encuesta
                    </Button>
                    {roomError && <div className="text-red-400 text-sm mt-2">{roomError}</div>}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 pt-8"
              >
                <div className="text-center mb-8">
                  {subcatStep === 0 && (
                    <h2 className="text-5xl font-light text-yellow-300 mb-4">¡Bienvenido, {mockGuest.name}!</h2>
                  )}
                  {subcatStep > 0 && (
                    <div className="flex flex-col items-center space-y-4">
                      <img src="/images/Logo.png" alt="Logo" className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <div className="mb-10">
                  {/* Leyenda personalizada por categoría */}
                  {(() => {
                    switch ((currentSubcat.category || '').toLowerCase()) {
                      case 'actividades':
                        return <p className="text-white mb-4">¿Cómo le fue en las diversas actividades en las que participó?</p>;
                      case 'spa':
                        return <p className="text-white mb-4">Cuéntenos sobre su experiencia en el spa.</p>;
                      case 'haab':
                        return <p className="text-white text-2xl text-center mb-6 font-light">Cuéntanos sobre tu experiencia en el restaurante Haab</p>;
                      case 'saffron':
                        return <p className="text-white text-2xl text-center mb-6 font-light">Cuéntanos sobre tu experiencia en el restaurante Saffron</p>;
                      case 'golf':
                        return <p className="text-white text-2xl text-center mb-6 font-light">Cuéntanos sobre tu experiencia en nuestro campo de golf El Camaleón</p>;
                      case 'room service':
                        return <p className="text-white mb-4">Cuéntenos sobre el servicio a la habitación.</p>;
                      case 'limpieza':
                        return <p className="text-white mb-4">¿Qué le pareció la limpieza y el orden de su habitación?</p>;
                      case 'suite':
                        return <p className="text-white text-2xl text-center mb-6 font-light"> Cuéntanos sobre tu experiencia en la habitación Deluxe Pool Villa With Living Room .</p>;
                      case 'general':
                        return <p className="text-white mb-4">¡Tu opinión importa! Dinos qué te pareció tu estancia.</p>;
                      default:
                        return <p className="text-white mb-4">Queremos conocer más sobre su experiencia en esta sección.</p>;
                    }
                  })()}
                  
                  {/* Layout especial para la sección Suite */}
                  {(currentSubcat.category || '').toLowerCase() === 'suite' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Columna izquierda - Imágenes */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden">
                          <img 
                            src="/images/cuarto.webp" 
                            alt="Habitación Deluxe Pool Villa" 
                            className="w-full h-64 object-cover"
                          />
                        </div>
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden">
                          <img 
                            src="/images/pool.webp" 
                            alt="Piscina de la Villa" 
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Columna derecha - Preguntas */}
                      <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {currentQuestions.map(q => (
                            <Card key={q.id} className="bg-white/5 border-white/20 shadow-2xl h-64 flex flex-col">
                              <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="text-white text-base mb-4 flex-shrink-0">{q.question}</div>
                                <div className="flex-1 flex items-center justify-center">
                                  <QuestionPreview
                                    question={q}
                                    value={responses[q.id] ?? ""}
                                    setValue={(v) => setResponses((prev) => ({ ...prev, [q.id]: v }))}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (currentSubcat.category || '').toLowerCase() === 'haab' ? (
                    /* Layout especial para la sección Haab */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Columna izquierda - Imágenes */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden h-64">
                          <img 
                            src="/images/haab.webp" 
                            alt="Restaurante Haab" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden h-64">
                          <img 
                            src="/images/haab2.webp" 
                            alt="Restaurante Haab" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Columna derecha - Preguntas en forma vertical */}
                      <div className="lg:col-span-2">
                        <div className="grid grid-rows-3 gap-4 h-full">
                          {currentQuestions.map((q, index) => (
                            <Card key={q.id} className="bg-white/5 border-white/20 shadow-2xl h-40">
                              <CardContent className="p-6 h-full flex flex-col justify-center">
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
                      </div>
                    </div>
                  ) : (currentSubcat.category || '').toLowerCase() === 'saffron' ? (
                    /* Layout especial para la sección Saffron */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Columna izquierda - Imágenes */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden h-64">
                          <img 
                            src="/images/saffron.webp" 
                            alt="Restaurante Saffron" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden h-64">
                          <img 
                            src="/images/saffron1.jpeg" 
                            alt="Restaurante Saffron" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Columna derecha - Preguntas en forma vertical */}
                      <div className="lg:col-span-2">
                        <div className="grid grid-rows-3 gap-4 h-full">
                          {currentQuestions.map((q, index) => (
                            <Card key={q.id} className="bg-white/5 border-white/20 shadow-2xl h-40">
                              <CardContent className="p-6 h-full flex flex-col justify-center">
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
                      </div>
                    </div>
                  ) : (currentSubcat.category || '').toLowerCase() === 'golf' ? (
                    /* Layout especial para la sección Golf */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      {/* Columna izquierda - Imágenes */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden h-64">
                          <img 
                            src="/images/golf.webp" 
                            alt="Campo de Golf El Camaleón" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden h-64">
                          <img 
                            src="/images/golf2.webp" 
                            alt="Campo de Golf El Camaleón" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Columna derecha - Preguntas */}
                      <div className="lg:col-span-2">
                        <div className="grid grid-cols-2 gap-6 h-full">
                          {currentQuestions.map((q, index) => (
                            <Card key={q.id} className="bg-white/5 border-white/20 shadow-2xl h-64 flex flex-col">
                              <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="text-white text-base mb-4 flex-shrink-0">{q.question}</div>
                                <div className="flex-1 flex items-center justify-center">
                                  <QuestionPreview
                                    question={q}
                                    value={responses[q.id] ?? ""}
                                    setValue={(v) => setResponses((prev) => ({ ...prev, [q.id]: v }))}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : subcatStep === 0 ? (
                    /* Layout especial para la sección de bienvenida */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      {/* Columna izquierda - Imágenes */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden h-64">
                          <img 
                            src="/images/front.webp" 
                            alt="Frente del Resort" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="bg-white/5 border-white/20 shadow-2xl rounded-xl overflow-hidden h-64">
                          <img 
                            src="/images/hotel 1.jpeg" 
                            alt="Hotel" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Columna derecha - Preguntas */}
                      <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {currentQuestions.map(q => (
                            <Card key={q.id} className="bg-white/5 border-white/20 shadow-2xl h-64 flex flex-col">
                              <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="text-white text-base mb-4 flex-shrink-0">{q.question}</div>
                                <div className="flex-1 flex items-center justify-center">
                                  <QuestionPreview
                                    question={q}
                                    value={responses[q.id] ?? ""}
                                    setValue={(v) => setResponses((prev) => ({ ...prev, [q.id]: v }))}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Layout normal para otras secciones */
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
                  )}
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
                <div className="flex justify-between mt-8">
                  {/* Botón para regresar */}
                  <Button
                    onClick={() => {
                      if (totalPages > 1 && questionPage > 0) {
                        setQuestionPage(p => p - 1);
                      } else if (subcatStep > 0) {
                        setQuestionPage(0);
                        setSubcatStep(subcatStep - 1);
                      }
                    }}
                    disabled={(totalPages <= 1 || questionPage === 0) && subcatStep === 0}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white tracking-wide"
                  >
                    Anterior
                  </Button>
                  
                  {/* Botón para avanzar */}
                  <Button
                    onClick={() => {
                      if (totalPages > 1 && questionPage < totalPages - 1) {
                        setQuestionPage(p => p + 1);
                      } else {
                        setQuestionPage(0);
                        isLastSubcat ? setStep(2) : setSubcatStep(subcatStep + 1);
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
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 pt-8"
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex justify-center">
                        <img src="/images/Logo.png" alt="Logo" className="w-16 h-16" />
                      </div>
                      <h3 className="text-3xl font-light text-white mb-2 tracking-[0.2em] uppercase">
                        ¡Gracias por contestar la encuesta!
                      </h3>
                      <p className="text-white/80 tracking-wide text-lg mb-4">
                        Tu opinión es muy valiosa para nosotros y nos ayuda a mejorar cada detalle de tu experiencia.
                      </p>
                      <p className="text-amber-300 text-xl font-light tracking-wide">
                        ¡Gracias por tu opinión, {mockGuest.name}! Esperamos verte pronto para que disfrutes aún más.
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
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm tracking-wide"
                        disabled={loading}
                      >
                        Volver
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 tracking-wider uppercase font-light"
                      >
                        Finalizar
                        <ChevronRight size={20} className="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 pt-16"
              >
                <div className="space-y-6">
                  <div className="mx-auto flex justify-center">
                    <img src="/images/Logo.png" alt="Logo" className="w-20 h-20" />
                  </div>
                  <h2 className="text-4xl font-light text-white tracking-[0.2em] uppercase">¡Gracias por tu tiempo!</h2>
                  <p className="text-white/90 max-w-md mx-auto leading-relaxed tracking-wide">
                    Tu opinión es muy valiosa para nosotros. Nos ayuda a crear experiencias aún más memorables.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Background Music Player */}
      <BackgroundMusic 
        audioSrc="/audio/music.mp3"
        autoPlay={false}
        loop={true}
      />
    </div>
  )
}
