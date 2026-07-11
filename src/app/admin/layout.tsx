import { Sidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/admin/header"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/login")
  }

  // Optional: Check role if strictly needed, middleware already protects admin routes
  if (session.user.role !== "ADMIN") {
     // You might want to show a "Not Authorized" page or redirect home
     // redirect("/") 
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session?.user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
