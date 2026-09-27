import { Tag, Clock } from "lucide-react"

export default function CategoriesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center max-w-lg">
        <div className="bg-indigo-50 p-4 rounded-full mb-6">
          <Clock className="w-12 h-12 text-indigo-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Categories Management</h2>
        <p className="text-gray-500 text-lg mb-8">
          This feature is currently under development and will be coming soon in the next update!
        </p>
        <div className="flex items-center space-x-2 text-sm text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-full">
          <Tag className="w-4 h-4" />
          <span>Roadmap: v1.1.0</span>
        </div>
      </div>
    </div>
  )
}
