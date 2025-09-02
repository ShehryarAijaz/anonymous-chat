"use client";
import MessageCard from "@/components/shared/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message, User } from "@/model/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessage.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);


  console.log("Messages: ", messages)
  // This function gets a messageId and filter out the messages from the array of messages by removing the message whose id matches with the id provided
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session, status } = useSession();
  const user = session?.user as User;

  // Initialize form that only accepts form that gets resolved by acceptMessageSchema
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  // Destructuring register, watch and setValue from form
  const { register, watch, setValue } = form;

  // Watching the state of acceptMessages from form and storing in acceptMessages
  const acceptMessages = watch("acceptMessages");

  // Fetch state of user if they're accepting the messages or not. If they do, set the value of acceptMessages to value from the backend
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Something went wrong");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch all the messages of the user from the backend, and store them in the messages array
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get("/api/get-messages");
        console.log("Messages API Response:", response.data)
        if (response.data.success) {
          setMessages(response.data.data ?? []);
          if (refresh) {
            toast.success(response.data.message);
          }
        } else {
          toast.error(response.data.message ?? "Failed to fetch messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ?? "Something went wrong!"
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // Run this hook that contains core functions whenever the state of session, setValue, fetchAcceptMessage and fetchMessages
  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // Change the state of the acceptMessages in the backend whenever user toggles the switch
  const handleSwitchChange = async () => {
    console.log("Switch Changed!")
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      if (response.data.success) {
        setValue("acceptMessages", !acceptMessages);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Something went wrong");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // Check if session is loading or doesn't exist
  if (status === "loading" || !session || !session.user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );

  // Destructure username from user object after session check
  const { username } = session?.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    console.log("Button Clicked!")
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">Anonymous Chat</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="bg-gray-100 rounded-lg input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 flex gap-6 flex-row">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-2">
            <p className="text-center text-gray-500">No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;