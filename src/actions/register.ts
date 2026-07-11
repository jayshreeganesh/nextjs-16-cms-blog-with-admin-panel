'use server'

import * as z from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Minimum 6 characters required"),
  name: z.string().min(1, "Name is required"),
})

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, name } = validatedFields.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return { success: "User created!" }
}
