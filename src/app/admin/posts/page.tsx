import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Trash } from "lucide-react"
import { deletePost } from "@/actions/posts"

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-700 text-3xl font-medium">Posts</h3>
        <Link href="/admin/posts/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Post
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Author
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{post.title}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{post.author?.name || 'Unknown'}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${post.published ? 'text-green-900' : 'text-red-900'}`}>
                    <span aria-hidden className={`absolute inset-0 ${post.published ? 'bg-green-200' : 'bg-red-200'} opacity-50 rounded-full`}></span>
                    <span className="relative">{post.published ? 'Published' : 'Draft'}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center space-x-4">
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="h-5 w-5" />
                    </Link>
                    <form action={async () => {
                      'use server'
                      await deletePost(post.id)
                    }}>
                      <button type="submit" className="text-red-600 hover:text-red-900">
                        <Trash className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
