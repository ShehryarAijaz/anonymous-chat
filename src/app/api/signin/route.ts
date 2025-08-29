import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { signInSchema } from "@/schemas/signin.schema";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findOne({ email }).lean();

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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return Response.json(
        {
          success: true,
          message: "User signed in successfully",
        },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Password is incorrect",
        },
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    console.error("Error signing in", error);
    return Response.json(
      {
        success: false,
        message: "Error signing in",
      },
      {
        status: 500,
      }
    );
  }
}
