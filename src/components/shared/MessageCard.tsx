"use client"
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Message } from "@/model/user.model";
import { toast } from "sonner"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "../ui/input";

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const [error, setError] = useState<string | null>(null)

    const handleDeleteConfirm = async () => {
        console.log("Delete Confirmed")
        setError(null)

        try {
            const response = await axios.post(`/api/delete-message?message=${message._id}`)
            if (response.data.success) {
                toast.success("Message deleted successfully")
                onMessageDelete(message._id as string)
            } else {
                toast.error(response.data.message)
                setError(response.data.message)
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setError(axiosError.response?.data.message ?? "Something went wrong")
            toast.error(axiosError.response?.data.message ?? "Something went wrong")
            console.error("ERROR IN HANDLEDELETECONFIRM: ", error)
        }

    }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Message</CardTitle>
          <CardContent>
          <Input />
        </CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Send Message</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteConfirm()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MessageCard;
