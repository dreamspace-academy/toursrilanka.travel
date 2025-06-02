"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Tag,
  Map,
  LogOut,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminHeader } from "@/components/admin/header"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <AdminSidebar className="border-0" />
          </SheetContent>
        </Sheet>
      </AdminHeader>
      <div className="flex flex-1">
        <AdminSidebar className="hidden lg:block" />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Experiences",
      icon: Map,
      href: "/admin/experiences",
      active: pathname === "/admin/experiences" || pathname?.startsWith("/admin/experiences/"),
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users" || pathname?.startsWith("/admin/users/"),
    },
    {
      label: "Bookings",
      icon: Calendar,
      href: "/admin/bookings",
      active: pathname === "/admin/bookings" || pathname?.startsWith("/admin/bookings/"),
    },
    {
      label: "Reviews",
      icon: MessageSquare,
      href: "/admin/reviews",
      active: pathname === "/admin/reviews" || pathname?.startsWith("/admin/reviews/"),
    },
    {
      label: "Categories",
      icon: Tag,
      href: "/admin/categories",
      active: pathname === "/admin/categories" || pathname?.startsWith("/admin/categories/"),
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      active: pathname === "/admin/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className={cn("flex h-full w-72 flex-col border-r bg-gray-100/40", className)}>
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-rose-500"
          >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
            <path d="M3 9h4" />
            <path d="M17 9h4" />
            <path d="M13 13v4" />
            <path d="M13 13h4" />
            <path d="M13 17h4" />
          </svg>
          <span>Admin Panel</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="flex flex-col gap-1 py-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={cn("justify-start", route.active ? "bg-secondary/20" : "")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50">
          <LogOut className="mr-2 h-5 w-5" />
          Log out
        </Button>
      </div>
    </div>
  )
}
