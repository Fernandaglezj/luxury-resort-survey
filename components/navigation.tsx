"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-sage-300 text-sage-700 hover:bg-sage-50"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver a Encuesta
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href="/admin">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          <Users size={16} className="mr-2" />
          Admin
        </Button>
      </Link>
    </div>
  )
}
