'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Settings, Users, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Tag },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-md hidden md:block">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors",
                isActive && "bg-gray-100 text-indigo-600 border-r-4 border-indigo-600"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
