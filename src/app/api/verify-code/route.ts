import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { verifySchema } from "@/schemas/verify.schema";

const verifyCodeSchema = z.object({
  verifyCode: verifySchema.shape.code,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, verifyCode } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    if (!username || !verifyCode) {
      return Response.json(
        {
          success: false,
          message: "Username and verification code are required",
        },
        {
          status: 400,
        }
      );
    }

    // validate with zod
    const result = verifyCodeSchema.safeParse({ verifyCode });

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message:
            result.error.issues[0]?.message || "Invalid verification code",
        },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findOne({ username: decodedUsername });
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

    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeExpired = new Date(user.verifyCodeExpires) < new Date();

    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        {
          status: 400,
        }
      );
    } else if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
