'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import * as z from "zod"

export const deletePost = async (id: string) => {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await prisma.post.delete({ where: { id } })
  revalidatePath("/admin/posts")
}

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
})

export const createPost = async (values: z.infer<typeof PostSchema>) => {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

  const validatedFields = PostSchema.safeParse(values)
  if (!validatedFields.success) return { error: "Invalid fields" }

  const { title, slug, content, published, categoryId } = validatedFields.data

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published: published || false,
        authorId: session.user.id,
        categoryId: categoryId || null,
      },
    })
    revalidatePath("/admin/posts")
    return { success: "Post created" }
  } catch (e) {
    return { error: "Failed to create post" }
  }
}

export const updatePost = async (id: string, values: z.infer<typeof PostSchema>) => {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

  const validatedFields = PostSchema.safeParse(values)
  if (!validatedFields.success) return { error: "Invalid fields" }

  const { title, slug, content, published, categoryId } = validatedFields.data

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        published: published || false,
        categoryId: categoryId || null,
      },
    })
    revalidatePath("/admin/posts")
    return { success: "Post updated" }
  } catch (e) {
    return { error: "Failed to update post" }
  }
}
