import { PostForm } from "@/components/admin/post-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  const categories = await prisma.category.findMany()

  return (
    <div>
      <h3 className="text-gray-700 text-3xl font-medium mb-6">Edit Post</h3>
      <PostForm post={post} categories={categories} />
    </div>
  )
}
