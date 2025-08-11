import { Message } from "@/model/user.model";

// Base API response type
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
}