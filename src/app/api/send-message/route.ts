import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()

    if (!username || !content) {
        return Response.json({
            success: false,
            message: "Username and content are required"
        }, {
            status: 400
        })
    }

    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, {
                status: 400
            })
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Failed to send message", error)

        return Response.json({
            success: false,
            message: "Failed to send message"
        }, {
            status: 500
        })
    }
}