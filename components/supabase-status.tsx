"use client"

import { isSupabaseConfigured } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, AlertCircle } from "lucide-react"

export function SupabaseStatus() {
  if (isSupabaseConfigured) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <Database className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Conectado a Supabase - Los datos se guardan en la base de datos
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Modo Demo:</strong> Supabase no está configurado. Los datos son simulados.{" "}
        <a
          href="#"
          className="underline hover:text-amber-900"
          onClick={() => window.open("https://supabase.com", "_blank")}
        >
          Configura Supabase
        </a>{" "}
        para usar datos reales.
      </AlertDescription>
    </Alert>
  )
}
