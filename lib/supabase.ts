import { createClient } from "@supabase/supabase-js"

// Verificar si las variables de entorno están disponibles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Crear cliente solo si las variables están disponibles
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Flag para verificar si Supabase está configurado
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Tipos para TypeScript
export interface Guest {
  id: string
  name: string
  email?: string
  room_number: string
  check_in_date: string
  check_out_date: string
  created_at: string
}

export interface GuestService {
  id: string
  guest_id: string
  service_type: "restaurants" | "spa" | "activities" | "room_service" | "housekeeping"
  used_date: string
}

export interface SurveyResponse {
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
}

// Datos mock para cuando Supabase no está configurado
const mockGuests: Guest[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    room_number: "101",
    check_in_date: "2024-01-10",
    check_out_date: "2024-01-20",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    room_number: "205",
    check_in_date: "2024-01-12",
    check_out_date: "2024-01-18",
    created_at: "2024-01-12T00:00:00Z",
  },
  {
    id: "3",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@email.com",
    room_number: "312",
    check_in_date: "2024-01-08",
    check_out_date: "2024-01-15",
    created_at: "2024-01-08T00:00:00Z",
  },
]

const mockGuestServices: GuestService[] = [
  { id: "1", guest_id: "1", service_type: "restaurants", used_date: "2024-01-11" },
  { id: "2", guest_id: "1", service_type: "spa", used_date: "2024-01-12" },
  { id: "3", guest_id: "1", service_type: "activities", used_date: "2024-01-13" },
  { id: "4", guest_id: "1", service_type: "room_service", used_date: "2024-01-11" },
  { id: "5", guest_id: "1", service_type: "housekeeping", used_date: "2024-01-10" },
  { id: "6", guest_id: "2", service_type: "restaurants", used_date: "2024-01-13" },
  { id: "7", guest_id: "2", service_type: "spa", used_date: "2024-01-14" },
  { id: "8", guest_id: "2", service_type: "activities", used_date: "2024-01-15" },
  { id: "9", guest_id: "2", service_type: "room_service", used_date: "2024-01-13" },
  { id: "10", guest_id: "2", service_type: "housekeeping", used_date: "2024-01-12" },
  { id: "11", guest_id: "3", service_type: "restaurants", used_date: "2024-01-09" },
  { id: "12", guest_id: "3", service_type: "spa", used_date: "2024-01-10" },
  { id: "13", guest_id: "3", service_type: "activities", used_date: "2024-01-11" },
  { id: "14", guest_id: "3", service_type: "room_service", used_date: "2024-01-09" },
  { id: "15", guest_id: "3", service_type: "housekeeping", used_date: "2024-01-08" },
]

// Funciones para la encuesta
export async function getGuestByRoomNumber(roomNumber: string): Promise<Guest | null> {
  console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("Room number buscado:", roomNumber.trim())
  if (!isSupabaseConfigured) {
    // Usar datos mock
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simular delay de red
    return mockGuests.find((guest) => guest.room_number.trim() === roomNumber.trim()) || null
  }

  try {
    const { data, error } = await supabase!
      .from("guests")
      .select("*")
      .ilike("room_number", roomNumber.trim())
      .single()

    if (error) {
      console.error("Error fetching guest:", error, "roomNumber:", roomNumber)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getGuestByRoomNumber:", error, "roomNumber:", roomNumber)
    return null
  }
}

export async function getGuestServices(guestId: string): Promise<string[]> {
  if (!isSupabaseConfigured) {
    // Usar datos mock
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simular delay de red
    return mockGuestServices.filter((service) => service.guest_id === guestId).map((service) => service.service_type)
  }

  try {
    const { data, error } = await supabase!.from("guest_services").select("service_type").eq("guest_id", guestId)

    if (error) {
      console.error("Error fetching guest services:", error)
      return []
    }

    return data.map((service) => service.service_type)
  } catch (error) {
    console.error("Error in getGuestServices:", error)
    return []
  }
}

export async function submitSurveyResponse(surveyData: Omit<SurveyResponse, "id" | "submit_date">): Promise<any> {
  if (!isSupabaseConfigured) {
    // Simular envío exitoso
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular delay de red
    console.log("Mock survey submission:", surveyData)
    return { id: Date.now().toString(), ...surveyData, submit_date: new Date().toISOString() }
  }

  try {
    const { data, error } = await supabase!
      .from("survey_responses")
      .insert([
        {
          ...surveyData,
          submit_date: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error submitting survey:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error in submitSurveyResponse:", error)
    throw error
  }
}
