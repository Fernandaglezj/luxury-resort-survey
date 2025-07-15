import { supabase, isSupabaseConfigured } from "./supabase"

// Datos mock para el panel de administración
const mockSurveyResponses = [
  {
    id: "1",
    guest_id: "1",
    room_number: "101",
    submit_date: "2024-01-15T10:30:00Z",
    restaurant_rating: 3,
    spa_rating: 75,
    activity_rating: 100,
    room_service_rating: "fast",
    housekeeping_rating: 5,
    additional_comments: "Experiencia excepcional, especialmente el spa y las actividades acuáticas.",
    guests: {
      name: "María González",
      email: "maria.gonzalez@email.com",
      room_number: "101",
    },
  },
  {
    id: "2",
    guest_id: "2",
    room_number: "205",
    submit_date: "2024-01-14T14:20:00Z",
    restaurant_rating: 2,
    spa_rating: 50,
    activity_rating: 75,
    room_service_rating: "slow",
    housekeeping_rating: 4,
    additional_comments: "Muy buena estancia, aunque el room service podría mejorar en tiempos.",
    guests: {
      name: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      room_number: "205",
    },
  },
  {
    id: "3",
    guest_id: "3",
    room_number: "312",
    submit_date: "2024-01-13T16:45:00Z",
    restaurant_rating: 3,
    spa_rating: 100,
    activity_rating: 75,
    room_service_rating: "fast",
    housekeeping_rating: 5,
    additional_comments: "Perfecto en todos los aspectos. El personal es excepcional.",
    guests: {
      name: "Ana Rodríguez",
      email: "ana.rodriguez@email.com",
      room_number: "312",
    },
  },
]

const mockSurveyQuestions = [
  {
    id: "1",
    category: "Restaurantes",
    subcategory: "Experiencia general",
    question: "¿Cómo calificarías tu experiencia gastronómica?",
    input_type: "stars",
    options: ["1 estrella", "2 estrellas", "3 estrellas"],
  },
  {
    id: "2",
    category: "Spa",
    subcategory: "Tratamientos",
    question: "¿Cómo te sentiste después de tu visita al spa?",
    input_type: "slider",
    options: ["Tenso", "Calmado", "Relajado", "Renovado"],
  },
  {
    id: "3",
    category: "Actividades",
    subcategory: "Experiencias",
    question: "¿Qué te parecieron nuestras experiencias y tours?",
    input_type: "slider",
    options: ["Aburrido", "Interesante", "Divertido", "Fascinante"],
  },
  {
    id: "4",
    category: "Room Service",
    subcategory: "Puntualidad",
    question: "¿Cómo fue la puntualidad del servicio a la habitación?",
    input_type: "radio",
    options: ["Rápido y eficiente", "Tardó más de lo esperado", "No llegó el pedido"],
  },
  {
    id: "5",
    category: "Limpieza",
    subcategory: "Housekeeping",
    question: "Califica el servicio de housekeeping",
    input_type: "emoji",
    options: ["😞", "😐", "🙂", "😊", "🤩"],
  },
  {
    id: "6",
    category: "Golf",
    subcategory: "Campo de golf",
    question: "¿Cómo calificarías la condición del campo de golf?",
    input_type: "stars",
    options: ["Excelente", "Muy bueno", "Bueno", "Regular", "Necesita mejora"],
  },
  {
    id: "7",
    category: "Golf",
    subcategory: "Equipo",
    question: "¿Qué te pareció la calidad del equipo de golf disponible?",
    input_type: "slider",
    options: ["Básico", "Adecuado", "Bueno", "Excelente", "Premium"],
  },
  {
    id: "8",
    category: "Golf",
    subcategory: "Instructores",
    question: "¿Cómo fue tu experiencia con los instructores de golf?",
    input_type: "radio",
    options: ["Muy profesional", "Profesional", "Adecuado", "Necesita mejora"],
  },
]

// Funciones para el panel de administración
export async function getAllSurveyResponses() {
  if (!isSupabaseConfigured) {
    // Usar datos mock
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simular delay de red
    return mockSurveyResponses
  }

  try {
    const { data, error } = await supabase!
      .from("survey_responses")
      .select(`
        *,
        guests (
          name,
          email,
          room_number
        )
      `)
      .order("submit_date", { ascending: false })

    if (error) {
      console.error("Error fetching survey responses:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error in getAllSurveyResponses:", error)
    return []
  }
}

export async function getSurveyResponsesByDateRange(startDate: string, endDate: string) {
  if (!isSupabaseConfigured) {
    // Filtrar datos mock por fecha
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockSurveyResponses.filter((response) => {
      const responseDate = response.submit_date.split("T")[0]
      return responseDate >= startDate && responseDate <= endDate
    })
  }

  try {
    const { data, error } = await supabase!
      .from("survey_responses")
      .select(`
        *,
        guests (
          name,
          email,
          room_number
        )
      `)
      .gte("submit_date", startDate)
      .lte("submit_date", endDate)
      .order("submit_date", { ascending: false })

    if (error) {
      console.error("Error fetching survey responses by date:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error in getSurveyResponsesByDateRange:", error)
    return []
  }
}

export async function getSurveyQuestions() {
  if (!isSupabaseConfigured) {
    // Usar datos mock
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockSurveyQuestions
  }

  try {
    const { data, error } = await supabase!
      .from("survey_questions")
      .select("*")
      .order("category", { ascending: true })

    if (error) {
      console.error("Error fetching survey questions:", error)
      return []
    }

    // Procesar options para que siempre sea un array plano y extraer min/max
    const processed = data.map((q) => {
      let options = []
      let minValue, maxValue
      if (Array.isArray(q.options)) {
        options = q.options
      } else if (q.options && typeof q.options === "object") {
        // Si es un objeto, toma el primer array que encuentre
        const firstArray = Object.values(q.options).find((v) => Array.isArray(v))
        if (firstArray) options = firstArray
        // Extraer min y max si existen
        if (typeof q.options.min === "number") minValue = q.options.min
        if (typeof q.options.max === "number") maxValue = q.options.max
      }
      return { ...q, options, minValue, maxValue }
    })

    return processed
  } catch (error) {
    console.error("Error in getSurveyQuestions:", error)
    return []
  }
}

export async function getResponsesByServiceType(serviceType: string) {
  if (!isSupabaseConfigured) {
    // Filtrar datos mock por tipo de servicio
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockSurveyResponses.filter((response) => {
      switch (serviceType) {
        case "restaurants":
          return response.restaurant_rating !== null
        case "spa":
          return response.spa_rating !== null
        case "activities":
          return response.activity_rating !== null
        case "roomService":
          return response.room_service_rating !== null
        case "housekeeping":
          return response.housekeeping_rating !== null
        default:
          return true
      }
    })
  }

  let column = ""
  switch (serviceType) {
    case "restaurants":
      column = "restaurant_rating"
      break
    case "spa":
      column = "spa_rating"
      break
    case "activities":
      column = "activity_rating"
      break
    case "roomService":
      column = "room_service_rating"
      break
    case "housekeeping":
      column = "housekeeping_rating"
      break
    default:
      return []
  }

  try {
    const { data, error } = await supabase!
      .from("survey_responses")
      .select(`
        *,
        guests (
          name,
          email,
          room_number
        )
      `)
      .not(column, "is", null)
      .order("submit_date", { ascending: false })

    if (error) {
      console.error(`Error fetching responses for ${serviceType}:`, error)
      return []
    }

    return data
  } catch (error) {
    console.error(`Error in getResponsesByServiceType for ${serviceType}:`, error)
    return []
  }
}

// Función para calcular puntuación general
export function calculateOverallScore(response: any) {
  const scores = []

  if (response.restaurant_rating) {
    scores.push((response.restaurant_rating / 3) * 5) // Convertir de 1-3 a 1-5
  }

  if (response.spa_rating !== null && response.spa_rating !== undefined) {
    scores.push((response.spa_rating / 100) * 5) // Convertir de 0-100 a 1-5
  }

  if (response.activity_rating !== null && response.activity_rating !== undefined) {
    scores.push((response.activity_rating / 100) * 5) // Convertir de 0-100 a 1-5
  }

  if (response.room_service_rating) {
    const serviceScores = { fast: 5, slow: 3, "no-show": 1 }
    scores.push(serviceScores[response.room_service_rating as keyof typeof serviceScores] || 3)
  }

  if (response.housekeeping_rating) {
    scores.push(response.housekeeping_rating) // Ya está en escala 1-5
  }

  return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
}
