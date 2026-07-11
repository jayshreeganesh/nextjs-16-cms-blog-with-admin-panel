import { signOut } from "@/auth"
import { LogOut, User } from "lucide-react"

export const Header = ({ user }: { user: any }) => {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm">
      <div className="flex items-center">
        <button className="text-gray-500 focus:outline-none md:hidden">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
           <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
             {user?.image ? (
               <img src={user.image} alt={user.name || "User"} className="h-8 w-8 rounded-full" />
             ) : (
               <User className="h-5 w-5 text-gray-500" />
             )}
           </div>
           <span className="text-gray-700 font-medium">{user?.name}</span>
        </div>
        <form action={async () => {
          'use server'
          await signOut({ redirectTo: "/auth/login" })
        }}>
          <button type="submit" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <LogOut className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  )
}
