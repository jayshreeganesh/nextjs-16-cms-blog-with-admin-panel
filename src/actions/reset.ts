'use server'

import * as z from "zod"
import { prisma } from "@/lib/prisma"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendEmail } from "@/lib/mail"

const ResetSchema = z.object({
  email: z.string().email(),
})

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid email!" }
  }

  const { email } = validatedFields.data

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (!existingUser) {
    return { error: "Email not found!" }
  }

  const passwordResetToken = await generatePasswordResetToken(email)
  
  const resetLink = `http://localhost:3000/auth/new-password?token=${passwordResetToken.token}`

  await sendEmail(
    email,
    "Reset your password",
    `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  )

  return { success: "Reset email sent!" }
}
