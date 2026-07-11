'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useTransition } from "react"
import { reset } from "@/actions/reset"
import toast from "react-hot-toast"
import Link from "next/link"

const ResetSchema = z.object({
  email: z.string().email(),
})

export const ResetForm = () => {
  const [isPending, startTransition] = useTransition()
  
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    startTransition(() => {
      reset(values)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error)
          } else {
            toast.success(data?.success)
          }
        })
    })
  }

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...form.register("email")}
            type="email"
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="john@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isPending ? "Sending email..." : "Send Reset Email"}
        </button>
      </form>
      <div className="text-center mt-4">
        <Link href="/auth/login" className="text-sm text-indigo-600 hover:text-indigo-500">
          Back to Login
        </Link>
      </div>
    </div>
  )
}
