"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award
} from "lucide-react"

// Mock data for admin dashboard
const mockSurveyData = {
  totalSurveys: 1247,
  completionRate: 89.2,
  averageSatisfaction: 4.6,
  responseRate: 78.5,
  period: "Últimos 30 días",
  trends: {
    satisfaction: "+2.3%",
    complaints: "-15.7%",
    recommendations: "+8.9%"
  }
}

const mockCategoryStats = [
  {
    category: "Suite",
    satisfaction: 4.7,
    responses: 1247,
    trend: "+3.2%",
    issues: ["Limpieza irregular", "Temperatura AC"],
    recommendations: ["Implementar checklist digital", "Capacitación adicional"]
  },
  {
    category: "Haab Restaurant",
    satisfaction: 4.5,
    responses: 892,
    trend: "+1.8%",
    issues: ["Tiempo de espera", "Variedad de menú"],
    recommendations: ["Optimizar procesos de cocina", "Rotación de menú"]
  },
  {
    category: "Saffron Restaurant",
    satisfaction: 4.8,
    responses: 756,
    trend: "+4.1%",
    issues: ["Reservaciones", "Ruido ambiente"],
    recommendations: ["Sistema de reservas online", "Aislamiento acústico"]
  },
  {
    category: "Golf",
    satisfaction: 4.4,
    responses: 445,
    trend: "-0.5%",
    issues: ["Mantenimiento del campo", "Equipos"],
    recommendations: ["Programa de mantenimiento preventivo", "Renovación de equipos"]
  },
  {
    category: "General",
    satisfaction: 4.6,
    responses: 1247,
    trend: "+2.1%",
    issues: ["Check-in lento", "WiFi"],
    recommendations: ["Proceso de check-in digital", "Mejora de infraestructura WiFi"]
  }
]

const mockRecentFeedback = [
  {
    id: 1,
    guest: "María González",
    room: "Villa 203",
    category: "Suite",
    rating: 5,
    comment: "Excelente experiencia, la villa superó todas las expectativas. El servicio fue impecable.",
    date: "2024-01-15",
    sentiment: "positive"
  },
  {
    id: 2,
    guest: "Carlos Rodríguez",
    room: "Suite 105",
    category: "Haab",
    rating: 3,
    comment: "La comida estaba buena pero el servicio fue muy lento. Tuvimos que esperar 45 minutos.",
    date: "2024-01-14",
    sentiment: "negative"
  },
  {
    id: 3,
    guest: "Ana Martínez",
    room: "Villa 301",
    category: "Golf",
    rating: 4,
    comment: "El campo está en buenas condiciones. Recomendaría más variedad en el pro shop.",
    date: "2024-01-13",
    sentiment: "neutral"
  },
  {
    id: 4,
    guest: "Luis Pérez",
    room: "Suite 208",
    category: "Saffron",
    rating: 5,
    comment: "Increíble experiencia gastronómica. El chef personalizado fue el punto destacado.",
    date: "2024-01-12",
    sentiment: "positive"
  }
]

const mockActionItems = [
  {
    id: 1,
    priority: "Alta",
    category: "Operaciones",
    title: "Optimizar proceso de check-in",
    description: "Implementar sistema digital para reducir tiempo de espera",
    assignedTo: "Gerencia Front Desk",
    dueDate: "2024-02-15",
    status: "En progreso",
    impact: "Alto"
  },
  {
    id: 2,
    priority: "Media",
    category: "Restaurantes",
    title: "Capacitación en servicio al cliente",
    description: "Programa de entrenamiento para personal de restaurantes",
    assignedTo: "RRHH",
    dueDate: "2024-02-28",
    status: "Pendiente",
    impact: "Medio"
  },
  {
    id: 3,
    priority: "Alta",
    category: "Mantenimiento",
    title: "Renovación equipos de golf",
    description: "Actualizar carritos y equipos del campo de golf",
    assignedTo: "Mantenimiento",
    dueDate: "2024-03-15",
    status: "Pendiente",
    impact: "Alto"
  }
]

export default function DemoAdmin() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-500"
      case "Media": return "bg-yellow-500"
      case "Baja": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado": return "bg-green-100 text-green-800"
      case "En progreso": return "bg-blue-100 text-blue-800"
      case "Pendiente": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600"
      case "negative": return "text-red-600"
      case "neutral": return "text-yellow-600"
      default: return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard de Satisfacción</h1>
            <p className="text-slate-600">Banyan Tree Mayakoba - Panel de Administración</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedPeriod("7d")}>
              7 días
            </Button>
            <Button 
              variant={selectedPeriod === "30d" ? "default" : "outline"}
              onClick={() => setSelectedPeriod("30d")}
            >
              30 días
            </Button>
            <Button variant="outline" onClick={() => setSelectedPeriod("90d")}>
              90 días
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Encuestas Completadas</p>
                  <p className="text-2xl font-bold text-slate-900">{mockSurveyData.totalSurveys}</p>
                  <p className="text-xs text-slate-500">{mockSurveyData.period}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Satisfacción Promedio</p>
                  <p className="text-2xl font-bold text-slate-900">{mockSurveyData.averageSatisfaction}/5.0</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {mockSurveyData.trends.satisfaction}
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tasa de Respuesta</p>
                  <p className="text-2xl font-bold text-slate-900">{mockSurveyData.responseRate}%</p>
                  <p className="text-xs text-slate-500">Meta: 85%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tasa de Finalización</p>
                  <p className="text-2xl font-bold text-slate-900">{mockSurveyData.completionRate}%</p>
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Excelente
                  </div>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Rendimiento por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCategoryStats.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{category.satisfaction}/5.0</span>
                      <Badge 
                        variant={category.trend.startsWith('+') ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {category.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={category.satisfaction * 20} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{category.responses} respuestas</span>
                    <span>Meta: 4.5</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Tendencias Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Satisfacción</p>
                  <p className="text-2xl font-bold text-green-600">{mockSurveyData.trends.satisfaction}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-red-800">Quejas</p>
                  <p className="text-2xl font-bold text-red-600">{mockSurveyData.trends.complaints}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-800">Recomendaciones</p>
                  <p className="text-2xl font-bold text-blue-600">{mockSurveyData.trends.recommendations}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-800">NPS Score</p>
                  <p className="text-2xl font-bold text-purple-600">+72</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items and Recent Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Acciones Prioritarias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockActionItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority)}`} />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Asignado a: {item.assignedTo}</span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Vence: {item.dueDate}</span>
                    <span className="text-slate-500">Impacto: {item.impact}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Feedback Reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentFeedback.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-900">{feedback.guest}</h4>
                      <p className="text-sm text-slate-600">Habitación {feedback.room}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm ${getSentimentColor(feedback.sentiment)}`}>
                    "{feedback.comment}"
                  </p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <Badge variant="outline">{feedback.category}</Badge>
                    <span>{feedback.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recomendaciones por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCategoryStats.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h4 className="font-medium text-slate-900">{category.category}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-red-600">Problemas Identificados:</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {category.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">Recomendaciones:</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {category.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 