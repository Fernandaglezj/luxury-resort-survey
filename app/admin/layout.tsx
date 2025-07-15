import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Banyan Tree Mayakoba",
  description: "Panel de administración para gestionar encuestas de huéspedes",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
