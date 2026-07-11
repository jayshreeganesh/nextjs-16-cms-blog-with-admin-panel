import { PostForm } from "@/components/admin/post-form"
import { prisma } from "@/lib/prisma"

export default async function NewPostPage() {
  const categories = await prisma.category.findMany()

  return (
    <div>
      <h3 className="text-gray-700 text-3xl font-medium mb-6">New Post</h3>
      <PostForm categories={categories} />
    </div>
  )
}
