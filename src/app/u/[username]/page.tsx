"use client"
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

const PublicMessagePage = () => {

  const { username } = useParams()
  const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showAIMessages, setShowAIMessages] = useState<boolean>(false)

  const genericMessages = ["What's a hobby you've recently started?", "If you could have dinner with any historical figure, who would it be?", "What's a simple thing that makes you happy?"]

  const fetchAIMessages = async() => {
    setIsLoading(true)
    const response = await fetch('/api/suggest-messages', {
      method: 'POST'
    })

    if (!response.body) return;

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let accumulatedText = ""

    while (true) {

      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.replace("data: ", "").trim()
        if (!data || data === "[DONE]") continue

        try {
          const parsed = JSON.parse(data)

          if (parsed.type === "text-delta" && parsed.delta) {
            accumulatedText += parsed.delta
          }
        } catch(error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast.error(axiosError.response?.data.message ?? "Something went wrong");
        }
      }
    }

    // After the stream is done, split and set the generated messages
    const parts = accumulatedText.split("||").map(q => q.trim()).filter(Boolean);
    setGeneratedMessages(parts);
    setShowAIMessages(true)
    setIsLoading(false)
  };

  const handleSendMessage = async() => {
    setIsLoading(true)
    setIsSubmitting(true)

    try {

      const checkUserAcceptanceStatus = await axios.get<ApiResponse>(`/api/accept-messages`)

      if (!checkUserAcceptanceStatus.data.isAcceptingMessages) {
        toast.error("User is not accepting messages")
        setIsSubmitting(false)
        setIsLoading(false)
        return
      }

      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username: username,
        content: selectedMessage
      })

      if (response.data.success) {
        toast.success(response.data.message ?? "Message sent successfully!")
        setIsSubmitting(false)
        setIsLoading(false)
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Something went wrong");

    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-4 my-8 p-6 md:mx-8 lg:mx-auto rounded w-full max-w-4xl">
      <div className="mt-4 flex justify-center">
        <h1 className="text-4xl font-bold mb-4 font-inter">Send Anonymous Message To Anyone</h1>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="flex flex-col gap-3 space-y-2">
          <Label htmlFor="message">Send anonymous message to @{username}</Label>
          <Textarea
            placeholder="Type your message here..."
            id="message"
            value={selectedMessage}
            onChange={(e) => setSelectedMessage(e.target.value)}
          />
          <div className="flex justify-center items-center">
            <Button
              className="w-30 cursor-pointer"
              onClick={() => handleSendMessage()}
              disabled={isSubmitting}>
                Send
            </Button>
          </div>

            <div className="mt-8 flex flex-col">
              <h1 className="text-xl font-semibold mb-2">Click on any message below to send it</h1>
              <Button 
                className="w-60 cursor-pointer" 
                onClick={fetchAIMessages}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Suggest Messages By AI"}
              </Button>
            </div>
          <div className="mb-4">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-2xl">Messages</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {(showAIMessages ? generatedMessages : genericMessages).map((message, index) => (
                  <Button
                    className="cursor-pointer"
                    key={index}
                    variant="outline"
                    onClick={() => setSelectedMessage(message)}>
                    {message}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 space-y-3">
          <Separator />
          <h1 className="text-xl font-semibold mt-8">Get Your Message Board</h1>
          <Button asChild><Link href="/sign-up">Create a free account</Link></Button>
        </div>
      </div>
    </div>
  )
}

export default PublicMessagePage