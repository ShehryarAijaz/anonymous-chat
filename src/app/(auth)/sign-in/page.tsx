'use client'
import { signInSchema } from '@/schemas/signin.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

const Page = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        const message = result.error === 'CredentialsSignin'
          ? 'Invalid email or password'
          : result.error
        setError(message)
        toast.error(message)
      } else if (result?.ok) {
        toast.success('Signed in successfully!')
        router.replace("/dashboard")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Something went wrong");
      setError("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Sign In</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <p className="text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-500 hover:text-blue-700 duration-300 transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page;