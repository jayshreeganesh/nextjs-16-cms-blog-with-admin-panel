import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, category: true, tags: true },
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-8 block">&larr; Back to Home</Link>
      
      <article>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        <div className="flex items-center space-x-4 text-gray-500 mb-8 border-b pb-8">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
             {post.author.image ? <img src={post.author.image} alt={post.author.name || ""} className="h-full w-full object-cover" /> : <span className="text-xs">User</span>}
          </div>
          <div>
            <p className="font-medium text-gray-900">{post.author.name || "Unknown"}</p>
            <p className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {post.image && (
          <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-8" />
        )}

        <div className="prose lg:prose-xl max-w-none text-gray-800">
          {post.content.split('\n').map((p, i) => (
            p.trim() ? <p key={i} className="mb-4">{p}</p> : <br key={i} />
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link key={tag.id} href={`/tags/${tag.slug}`} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
