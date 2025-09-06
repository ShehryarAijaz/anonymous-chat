import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { auth } from "@/auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const userSession = await auth();
  const user = userSession?.user as User;

  if (!userSession || !user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);

    if (!user) {
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

    return Response.json(
      {
        success: true,
        message: "Messages fetched successfully",
        data: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to get messages", error);

    return Response.json(
      {
        success: false,
        message: "Failed to get messages",
      },
      {
        status: 500,
      }
    );
  }
}
