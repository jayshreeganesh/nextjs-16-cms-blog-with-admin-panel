'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTransition, useEffect } from "react"
import { createPost, updatePost } from "@/actions/posts"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
})

interface PostFormProps {
  post?: {
    id: string
    title: string
    slug: string
    content: string
    published: boolean
    categoryId: string | null
  }
  categories: { id: string; name: string }[]
}

export const PostForm = ({ post, categories }: PostFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      published: post?.published || false,
      categoryId: post?.categoryId || "",
    },
  })

  // Auto-generate slug from title if creating new post
  const title = form.watch("title")
  useEffect(() => {
    if (!post && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      form.setValue("slug", slug)
    }
  }, [title, post, form])

  const onSubmit = (values: z.infer<typeof PostSchema>) => {
    startTransition(() => {
      const action = post ? updatePost(post.id, values) : createPost(values)
      action.then((data) => {
        if (data?.error) {
          toast.error(data.error)
        } else {
          toast.success(post ? "Post updated!" : "Post created!")
          router.push("/admin/posts")
        }
      })
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          {...form.register("title")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          {...form.register("slug")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {form.formState.errors.slug && (
          <p className="text-red-500 text-xs mt-1">{form.formState.errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          {...form.register("categoryId")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          {...form.register("content")}
          rows={10}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {form.formState.errors.content && (
          <p className="text-red-500 text-xs mt-1">{form.formState.errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...form.register("published")}
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Published</label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Post"}
        </button>
      </div>
    </form>
  )
}
