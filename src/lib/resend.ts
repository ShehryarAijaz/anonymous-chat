import { Resend } from "resend";
import EmailVerification from "../../emails/EmailVerification";
import { ApiResponse } from "@/types/ApiResponse";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Anonymous Chat <onboarding@resend.dev>',
            to: email,
            subject: 'Anonymous Chat - Verify your email',
            react: EmailVerification({username, otp: verifyCode})

        })
        return { success: true, message: "Verification email sent successfully!" }
    } catch (error: any) {
        console.error(error.message || "Error sending verification email")
        return { success: false, message: "Failed to send verification email" }
    }
}