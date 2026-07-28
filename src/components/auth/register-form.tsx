'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useTransition } from "react"
import { register } from "@/actions/register"
import toast from "react-hot-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Minimum 6 characters required"),
  name: z.string().min(1, "Name is required"),
})

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error)
          } else {
            toast.success(data.success as string)
            router.push("/auth/login")
          }
        })
    })
  }

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-900">Register</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...form.register("name")}
            type="text"
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="John Doe"
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            {...form.register("password")}
            type="password"
            disabled={isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="******"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Register"}
        </button>
      </form>
      <div className="text-center mt-4">
        <Link href="/auth/login" className="text-sm text-indigo-600 hover:text-indigo-500">
          Already have an account? Login
        </Link>
      </div>
    </div>
  )
}
