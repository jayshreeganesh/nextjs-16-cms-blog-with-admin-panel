import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        include: { author: true, category: true, tags: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!tag) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12 border-b pb-4">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900">Tag: #{tag.name}</h1>
      </header>

      <div className="grid gap-12">
        {tag.posts.length > 0 ? (
          tag.posts.map((post) => (
            <article key={post.id} className="flex flex-col">
               <Link href={`/posts/${post.slug}`} className="block group">
                 <h2 className="text-2xl font-bold group-hover:text-indigo-600 transition-colors text-gray-900">{post.title}</h2>
               </Link>
               <div className="text-sm text-gray-500 mt-2 flex items-center space-x-4">
                 <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                 <span>•</span>
                 <span>{post.author?.name || "Unknown"}</span>
                 {post.category && (
                   <>
                     <span>•</span>
                     <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">{post.category.name}</span>
                   </>
                 )}
               </div>
               <p className="mt-4 text-gray-700 leading-relaxed">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
               <Link href={`/posts/${post.slug}`} className="mt-4 text-indigo-600 font-medium hover:text-indigo-800 self-start">
                 Read more &rarr;
               </Link>
            </article>
          ))
        ) : (
          <p className="text-gray-500">No posts found for this tag.</p>
        )}
      </div>
    </div>
  )
}
