"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Filter,
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  Eye,
  Search,
  Leaf,
  Sparkles,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  getAllSurveyResponses,
  getSurveyQuestions,
  calculateOverallScore,
  getResponsesByServiceType,
} from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { SupabaseStatus } from "@/components/supabase-status"
import { EmojiScale } from "@/components/ui/emoji-scale"
import { ThermometerScale } from "@/components/ui/thermometer-scale"
import { Stars3 } from "@/components/ui/stars-3"
import { YesNo } from "@/components/ui/yes-no"
import { SelectorThree } from "@/components/ui/selector-three"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"


interface GuestResponse {
  id: string
  guest_id: string
  room_number: string
  submit_date: string
  restaurant_rating?: number
  spa_rating?: number
  activity_rating?: number
  room_service_rating?: string
  housekeeping_rating?: number
  additional_comments?: string
  guests?: {
    name: string
    email?: string
    room_number: string
  }
}

interface SurveyQuestion {
  id: string
  category: string
  subcategory?: string
  question: string
  question_type: string // Permitir cualquier tipo de input
  options?: string[]
  minValue?: number
  maxValue?: number
  input_type?: string // Nuevo campo para especificar el tipo de input
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("responses")
  const [responses, setResponses] = useState<GuestResponse[]>([])
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<GuestResponse | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceFilter, setServiceFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [responsesData, questionsData] = await Promise.all([getAllSurveyResponses(), getSurveyQuestions()])

      setResponses(responsesData)
      setQuestions(questionsData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudieron cargar los datos. Verifica tu conexión a Supabase.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleServiceFilter = async (serviceType: string) => {
    setServiceFilter(serviceType)
    if (serviceType === "all") {
      loadData()
    } else {
      setLoading(true)
      try {
        const filteredData = await getResponsesByServiceType(serviceType)
        setResponses(filteredData)
      } catch (error) {
        console.error("Error filtering by service:", error)
        toast({
          title: "Error al filtrar",
          description: "No se pudieron filtrar las respuestas.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredResponses = responses.filter((response) => {
    const guestName = response.guests?.name || ""
    const matchesSearch =
      guestName.toLowerCase().includes(searchTerm.toLowerCase()) || response.room_number.includes(searchTerm)
    return matchesSearch
  })

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-emerald-600"
    if (score >= 4.0) return "text-amber-600"
    return "text-orange-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 4.5) return "bg-emerald-100 text-emerald-700 border-emerald-200"
    if (score >= 4.0) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-orange-100 text-orange-700 border-orange-200"
  }

  const renderResponseValue = (key: string, value: any) => {
    switch (key) {
      case "restaurant_rating":
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= value ? "fill-amber-400 text-amber-400" : "text-sage-300"}
              />
            ))}
            <span className="ml-2 text-sm text-sage-600">{value}/3 estrellas</span>
          </div>
        )
      case "spa_rating":
      case "activity_rating":
        const labels =
          key === "spa_rating"
            ? ["Tenso", "Calmado", "Relajado", "Renovado"]
            : ["Aburrido", "Interesante", "Divertido", "Fascinante"]
        const index = Math.floor(value / 25)
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-sage-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300"
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-sm text-sage-600">{labels[index]}</span>
          </div>
        )
      case "room_service_rating":
        const serviceLabels = {
          fast: "Rápido y eficiente",
          slow: "Tardó más de lo esperado",
          "no-show": "No llegó el pedido",
        }
        return (
          <Badge variant="outline" className="border-sage-300 text-sage-700">
            {serviceLabels[value as keyof typeof serviceLabels]}
          </Badge>
        )
      case "housekeeping_rating":
        const emojis = ["😞", "😐", "🙂", "😊", "🤩"]
        return (
          <div className="flex items-center gap-2">
            <span className="text-xl">{emojis[value - 1]}</span>
            <span className="text-sm text-sage-600">{value}/5</span>
          </div>
        )
      default:
        return <span className="text-sage-700">{value}</span>
    }
  }

  const groupedQuestions = questions.reduce(
    (acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = {}
      }
      const subcat = question.subcategory || "Sin subcategoría"
      if (!acc[question.category][subcat]) {
        acc[question.category][subcat] = []
      }
      acc[question.category][subcat].push(question)
      return acc
    },
    {} as Record<string, Record<string, SurveyQuestion[]>>,
  )

  // Mini preview component for admin
  function QuestionPreview({ question }: { question: SurveyQuestion }) {
    const [value, setValue] = useState<any>("")
    // Usar input_type y aplanar options igual que en el hook de la encuesta
    const type = (question.input_type || question.question_type || "").toLowerCase()
    // Aplanar options si es un objeto
    const optionsObj = typeof question.options === 'object' && !Array.isArray(question.options) && question.options !== null ? question.options : {}
    const options = Array.isArray(question.options) ? question.options : (optionsObj.options || optionsObj.labels || optionsObj.emojis || [])
    const minValue = optionsObj.min ?? question.minValue
    const maxValue = optionsObj.max ?? question.maxValue
    const inputClass = "w-full max-w-xs mx-auto bg-white border border-amber-200 rounded-xl p-3 shadow focus-within:border-amber-400 transition-all"
    const helpTextClass = "text-xs text-sage-500 mt-2 text-center"
    switch (type) {
      case "slider":
        if (minValue === undefined || maxValue === undefined) {
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
              value={[Number(value) || minValue]}
              onValueChange={v => setValue(v[0])}
              min={minValue}
              max={maxValue}
              step={1}
              className="w-40"
            />
            <div className="mt-2 text-amber-700 font-semibold text-lg">{value || minValue} / {maxValue}</div>
            <div className={helpTextClass}>Arrastra el control para calificar</div>
          </div>
        )
      case "stars_3":
      case "stars":
        return (
          <div className="flex flex-col items-center">
            <Stars3 value={Number(value)} onChange={setValue} />
            <div className={helpTextClass}>Haz clic en las estrellas</div>
          </div>
        )
      case "emoji_scale":
      case "emoji":
        return (
          <div className="flex flex-col items-center">
            <EmojiScale value={Number(value)} onChange={setValue} />
            <div className={helpTextClass}>Selecciona un emoji</div>
          </div>
        )
      case "thermometer":
        return (
          <div className="flex flex-col items-center">
            <ThermometerScale value={Number(value) || 1} onChange={setValue} min={1} max={5} />
            <div className={helpTextClass}>Selecciona el nivel</div>
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
      case "checkboxes":
        return (
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-2">
              {(options || []).map((opt: string) => (
                <label key={opt} className="flex items-center gap-2">
                  <Checkbox
                    checked={Array.isArray(value) ? value.includes(opt) : false}
                    onCheckedChange={(checked) => {
                      let arr = Array.isArray(value) ? [...value] : []
                      if (checked) arr.push(opt)
                      else arr = arr.filter((o) => o !== opt)
                      setValue(arr)
                    }}
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
            <SelectorThree value={value} onChange={setValue} options={options ? options.map((o: string) => ({ label: o, value: o })) : []} />
            <div className={helpTextClass}>Selecciona una opción</div>
          </div>
        )
      case "radio":
        return (
          <div className="flex flex-col items-center">
            <RadioGroup value={value} onValueChange={setValue} className="flex flex-col gap-2">
              {(options || []).map((opt: string) => (
                <RadioGroupItem key={opt} value={opt} id={opt} />
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
                {(options || []).map((opt: string) => (
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
      default:
        return (
          <div className="flex flex-col items-center">
            <Input value={value} onChange={e => setValue(e.target.value)} className={inputClass} placeholder="Escribe tu respuesta..." />
            <div className={helpTextClass}>Escribe tu respuesta</div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-sage-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-600" />
          <p className="text-sage-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-sage-100">
      {/* Header con navegación */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="text-sage-600" size={24} />
            <div>
              <h1 className="font-light text-lg text-amber-900">Banyan Tree Mayakoba</h1>
              <p className="text-xs text-sage-600">Panel de Administración</p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm text-sage-600 hover:text-amber-600 transition-colors duration-300 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Volver a Encuesta
          </a>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-sage-200 min-h-screen">
          <nav className="p-4 space-y-2 pt-6">
            <button
              onClick={() => setActiveTab("responses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "responses"
                  ? "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 shadow-sm"
                  : "text-sage-600 hover:bg-sage-50"
              }`}
            >
              <Users size={20} />
              <span>Respuestas por huésped</span>
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "questions"
                  ? "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 shadow-sm"
                  : "text-sage-600 hover:bg-sage-50"
              }`}
            >
              <MessageSquare size={20} />
              <span>Preguntas de la encuesta</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {activeTab === "responses" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-light text-amber-900">Respuestas de huéspedes</h2>
                    <p className="text-sage-600">Gestiona y revisa las opiniones de nuestros huéspedes</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400" size={16} />
                      <Input
                        placeholder="Buscar huésped o habitación..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-sage-300 focus:border-amber-400 bg-white/80"
                      />
                    </div>
                    <Select value={serviceFilter} onValueChange={handleServiceFilter}>
                      <SelectTrigger className="w-48 border-sage-300 focus:border-amber-400 bg-white/80">
                        <Filter size={16} className="mr-2" />
                        <SelectValue placeholder="Filtrar por servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los servicios</SelectItem>
                        <SelectItem value="restaurants">Restaurantes</SelectItem>
                        <SelectItem value="spa">Spa</SelectItem>
                        <SelectItem value="activities">Actividades</SelectItem>
                        <SelectItem value="roomService">Room Service</SelectItem>
                        <SelectItem value="housekeeping">Limpieza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Card className="backdrop-blur-sm bg-white/90 border-sage-200 shadow-xl">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-sage-200">
                          <tr className="bg-sage-50/50">
                            <th className="text-left p-4 font-medium text-sage-700">Huésped</th>
                            <th className="text-left p-4 font-medium text-sage-700">Habitación</th>
                            <th className="text-left p-4 font-medium text-sage-700">Fecha</th>
                            <th className="text-left p-4 font-medium text-sage-700">Puntuación</th>
                            <th className="text-left p-4 font-medium text-sage-700">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResponses.map((response, index) => {
                            const overallScore = calculateOverallScore(response)
                            return (
                              <motion.tr
                                key={response.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-sage-100 hover:bg-sage-50/30 transition-colors"
                              >
                                <td className="p-4">
                                  <div className="font-medium text-sage-800">
                                    {response.guests?.name || "Huésped anónimo"}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant="outline" className="border-sage-300 text-sage-700">
                                    {response.room_number}
                                  </Badge>
                                </td>
                                <td className="p-4 text-sage-600">
                                  {new Date(response.submit_date).toLocaleDateString("es-ES")}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <TrendingUp size={16} className={getScoreColor(overallScore)} />
                                    <Badge className={getScoreBadge(overallScore)}>{overallScore.toFixed(1)}</Badge>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Sheet>
                                    <SheetTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                                        onClick={() => setSelectedResponse(response)}
                                      >
                                        <Eye size={16} className="mr-2" />
                                        Ver detalles
                                      </Button>
                                    </SheetTrigger>
                                    <SheetContent className="w-full sm:max-w-lg bg-white/95 backdrop-blur-sm">
                                      <SheetHeader>
                                        <SheetTitle className="text-amber-900 font-light text-xl">
                                          Respuesta detallada
                                        </SheetTitle>
                                        <div className="flex items-center gap-4 text-sm text-sage-600">
                                          <span>{response.guests?.name || "Huésped anónimo"}</span>
                                          <Separator orientation="vertical" className="h-4" />
                                          <span>Habitación {response.room_number}</span>
                                          <Separator orientation="vertical" className="h-4" />
                                          <span>{new Date(response.submit_date).toLocaleDateString("es-ES")}</span>
                                        </div>
                                      </SheetHeader>
                                      <div className="mt-6 space-y-6">
                                        {Object.entries(response).map(([key, value]) => {
                                          if (
                                            key === "additional_comments" ||
                                            key === "id" ||
                                            key === "guest_id" ||
                                            key === "room_number" ||
                                            key === "submit_date" ||
                                            key === "guests" ||
                                            value === null ||
                                            value === undefined
                                          )
                                            return null
                                          const categoryNames = {
                                            restaurant_rating: "Restaurantes",
                                            spa_rating: "Spa",
                                            activity_rating: "Actividades",
                                            room_service_rating: "Room Service",
                                            housekeeping_rating: "Limpieza",
                                          }
                                          return (
                                            <Card key={key} className="border-sage-200">
                                              <CardContent className="p-4">
                                                <h4 className="font-medium text-sage-800 mb-3">
                                                  {categoryNames[key as keyof typeof categoryNames]}
                                                </h4>
                                                {renderResponseValue(key, value)}
                                              </CardContent>
                                            </Card>
                                          )
                                        })}
                                        {response.additional_comments && (
                                          <Card className="border-sage-200">
                                            <CardContent className="p-4">
                                              <h4 className="font-medium text-sage-800 mb-3">
                                                Comentarios adicionales
                                              </h4>
                                              <p className="text-sage-700 leading-relaxed italic">
                                                "{response.additional_comments}"
                                              </p>
                                            </CardContent>
                                          </Card>
                                        )}
                                      </div>
                                    </SheetContent>
                                  </Sheet>
                                </td>
                              </motion.tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {activeTab === "questions" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-light text-amber-900">Preguntas de la encuesta</h2>
                <p className="text-sage-600">Revisa y gestiona las preguntas organizadas por categoría y subcategoría</p>
                <div className="space-y-4">
                  {Object.entries(groupedQuestions).map(([category, subcats]) => (
                    <Card key={category} className="backdrop-blur-sm bg-white/90 border-sage-200 shadow-lg">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={category} className="border-none">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
                              <span className="text-lg font-light text-amber-900">{category}</span>
                              <Badge variant="outline" className="border-sage-300 text-sage-600">
                                {Object.values(subcats).reduce((acc, arr) => acc + arr.length, 0)} pregunta{Object.values(subcats).reduce((acc, arr) => acc + arr.length, 0) !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="space-y-6">
                              {Object.entries(subcats).map(([subcat, questionsArr]) => (
                                <div key={subcat} className="mb-4">
                                  <div className="mb-2 flex items-center gap-2">
                                    <span className="font-medium text-amber-700">{subcat}</span>
                                    <Badge variant="outline" className="border-sage-200 text-sage-500">
                                      {questionsArr.length} pregunta{questionsArr.length !== 1 ? "s" : ""}
                                    </Badge>
                                  </div>
                                  <div className="space-y-4">
                                    {questionsArr.map((question, index) => (
                                      <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 bg-sage-50/50 rounded-lg border border-sage-200"
                                      >
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="flex-1">
                                            <p className="text-sage-800 font-medium mb-2">{question.question}</p>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="outline"
                                                className="border-amber-300 text-amber-700 bg-amber-50"
                                              >
                                                {question.question_type}
                                              </Badge>
                                              {question.options && (
                                                <span className="text-sm text-sage-600">
                                                  {question.options.length} opciones
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex-shrink-0">
                                            <QuestionPreview question={question} />
                                          </div>
                                          <Sparkles className="text-amber-500 flex-shrink-0" size={20} />
                                        </div>
                                        {question.options && (
                                          <div className="mt-3 flex flex-wrap gap-2">
                                            {question.options.map((option, optIndex) => (
                                              <Badge
                                                key={optIndex}
                                                variant="outline"
                                                className="border-sage-300 text-sage-600 text-xs"
                                              >
                                                {option}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
