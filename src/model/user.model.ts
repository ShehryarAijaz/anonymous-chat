import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true })

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]; 
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        unique: true,
        match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Please enter a valid email"],
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpires: {
        type: Date,
        required: [true, "Verify code expires is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: false
    },
    messages: [messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)

export default UserModel;