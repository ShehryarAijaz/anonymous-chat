import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user.model"
import { auth } from "@/auth"
import { User } from "next-auth"

export async function POST(request: Request) {
    await dbConnect()

    const session = await auth()
    const user = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false, message: "Unauthorized"
        },
        {
            status: 401
        })
    }

    const userId = user._id
    const { acceptMessage } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    isAcceptingMessages: acceptMessage
                }
            },
            {
                new: true
            }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found",
                data: updatedUser
            },
            {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Message acceptance set to true successfully"
        },
        {
            status: 200
        })
    } catch (error) {
        console.error("Failed to set message acceptance", error)

        return Response.json({
            success: false,
            message: "Failed to set message acceptance"
        },
        {
            status: 500
        })
    }
}

export async function GET() {
    await dbConnect()

    const session = await auth()
    const user = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false, message: "Unauthorized"
        },
        {
            status: 401
        })
    }

    const userId = user._id
    
    try {
        const userData = await UserModel.findById(userId)

        if (!userData) {
            return Response.json({
                success: false,
                message: "User not found"
            },
            {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Message acceptance fetched successfully",
            data: userData.isAcceptingMessages
        },
        {
            status: 200
        })

    } catch (error) {
        console.error("Failed to get message acceptance", error)

        return Response.json({
            success: false,
            message: "Failed to get message acceptance"
        },
        {
            status: 500
        })
    }
}