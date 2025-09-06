"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { signUpSchema } from "@/schemas/signup.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";

const Page = () => {
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      setIsUsernameAvailable(true);
      setUsernameMessage("");

      try {
        const response = await axios.get(
          `/api/verify-username?username=${username}`
        );

        if (response.status === 200) {
          setIsUsernameAvailable(true);
          setUsernameMessage(response.data.message);
        } else {
          setIsUsernameAvailable(false);
          setUsernameMessage(response.data.message);
        }

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Something went wrong"
        );
        setIsUsernameAvailable(false);

      } finally {
        setIsUsernameAvailable(false);
      }
    };
    if (username.trim().length > 0) {
      checkUsernameAvailability();
    } else {
      setUsernameMessage("")
    }
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/signup", data);

      if (response.data.success) {
        toast.success(response.data?.message);
        router.replace(`/verify-code/${data.username}`);
        setIsSubmitting(false);
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Something went wrong");

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isUsernameAvailable && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {
                      <p
                        className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                      >
                        {" "}
                        {usernameMessage}{" "}
                      </p>
                    }
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <p className="text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-blue-500 hover:text-blue-700 duration-300 transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
