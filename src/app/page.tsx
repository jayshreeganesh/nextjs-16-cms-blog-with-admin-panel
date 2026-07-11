import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true, category: true, tags: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-12 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900">My Blog</h1>
        <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
      </header>

      <div className="grid gap-12">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col">
             <Link href={`/posts/${post.slug}`} className="block group">
               <h2 className="text-2xl font-bold group-hover:text-indigo-600 transition-colors text-gray-900">{post.title}</h2>
             </Link>
             <div className="text-sm text-gray-500 mt-2 flex flex-wrap items-center gap-2">
               <span>{new Date(post.createdAt).toLocaleDateString()}</span>
               <span>•</span>
               <span>{post.author?.name || "Unknown"}</span>
               {post.category && (
                 <>
                   <span>•</span>
                   <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">{post.category.name}</span>
                 </>
               )}
               {post.tags.length > 0 && (
                 <>
                    <span>•</span>
                    {post.tags.map(tag => (
                      <Link key={tag.id} href={`/tags/${tag.slug}`} className="text-indigo-600 hover:text-indigo-800 text-xs">
                        #{tag.name}
                      </Link>
                    ))}
                 </>
               )}
             </div>
             <p className="mt-4 text-gray-700 leading-relaxed">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
             <Link href={`/posts/${post.slug}`} className="mt-4 text-indigo-600 font-medium hover:text-indigo-800 self-start">
               Read more &rarr;
             </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
