import { prisma } from "@/lib/prisma"
import { FileText, Tag, Users } from "lucide-react"

export default async function AdminDashboard() {
  const postsCount = await prisma.post.count()
  const usersCount = await prisma.user.count()
  const categoriesCount = await prisma.category.count()

  const stats = [
    { label: "Total Posts", value: postsCount, icon: FileText, color: "bg-blue-500" },
    { label: "Total Users", value: usersCount, icon: Users, color: "bg-green-500" },
    { label: "Categories", value: categoriesCount, icon: Tag, color: "bg-yellow-500" },
  ]

  return (
    <div>
      <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
      
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.label}</dt>
                      <dd className="text-lg font-medium text-gray-900">{item.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
