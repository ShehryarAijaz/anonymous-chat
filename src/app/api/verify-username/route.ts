import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { success, z } from "zod";
import { signUpSchema } from "@/schemas/signup.schema";

const verifyUsernameSchema = z.object({
  username: signUpSchema.shape.username,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod
    const result = verifyUsernameSchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.issues[0]?.message || "Invalid username",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
        data: {
          username,
        },
      },
      {
        status: 200,
      }
    );
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
