import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/user.model";
import { messageSchema } from "@/schemas/message.schema";
import { z } from "zod";

const deleteMessageSchema = z.object({
  messageId: messageSchema.shape.messageId,
})

export async function POST(request: Request) {
  await dbConnect();

  const session = await auth()
  const user = session?.user as User

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized"
      },
      {
        status: 401
      }
    );
  }

  const userId = user._id;

  try {
    // Getting the messageId from the URL
    const { searchParams } = new URL(request.url);
    const queryParam = {
      messageId: searchParams.get("message"),
    };

    // Validate the messageId
    const result = deleteMessageSchema.safeParse(queryParam);

    // If the messageId is not valid, return an error
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.issues[0]?.message || "Invalid messageId",
        },
        {
          status: 400,
        }
      );
    }

    // Get the messageId from the result
    const { messageId } = result.data;

    // Find the user by the user ID and pull the message from their messages array
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { messages: { _id: messageId } }
      },
      {
        new: true
      }
    );

    // If the user is not found, return an error

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check if the message was removed
    const messageExists = updatedUser.messages.some(msg => msg._id?.toString() === messageId);
    if (messageExists) {
      return Response.json(
        {
          success: false,
          message: "Message not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to delete message", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete message",
      },
      {
        status: 500,
      }
    );
  }
}
