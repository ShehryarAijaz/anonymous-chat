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
    className?: string
}

// Flow: The dashboard sends me the message and a calls a function that have a message id as a parameter
const MessageCard = ({ message, onMessageDelete, className }: MessageCardProps) => {

    const [error, setError] = useState<string | null>(null)

    const handleDeleteConfirm = async () => {
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
    <div className="w-full flex justify-center items-center">
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardContent>
          <CardTitle className="text-xl font-bold">{message.content}</CardTitle>
          <p className="mt-2 text-sm text-gray-500">{message.createdAt.toLocaleString().split("T")[0]}</p>
        </CardContent>
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="cursor-pointer">X</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  the message and remove it from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteConfirm()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MessageCard;
