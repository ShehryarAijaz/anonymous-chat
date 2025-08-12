import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/resend";

export async function POST(request: Request) {
  await dbConnect();

  // Signup Flow:
  // 1. Check if username exists & verified  --> reject if true
  // 2. Check if email exists & verified     --> reject if true
  // 3. If email exists & not verified       --> update user, send verification email
  // 4. If email does not exist              --> create user, send verification email

  try {
    const { username, email, password } = await request.json();

    // Validate required fields
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Username, email, and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // 1. Username taken & verified? --> reject
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    // 2. Email taken & verified? --> reject || if not verified, update user, send verification email
    const existingUserByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists and is verified",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10);

        const verifyCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpires = expiryDate;
        existingUserByEmail.isVerified = false;

        await existingUserByEmail.save();

        const emailResponse = await sendVerificationEmail(
          email,
          username,
          verifyCode
        );
        
        console.log("Email response (existing user):", emailResponse);
        
        if (emailResponse.success) {
          return Response.json({
            success: true,
            message:
              emailResponse.message ||
              "User registered successfully, please check your email for verification",
            isVerified: false,
            isAcceptingMessages: true,
            messages: [],
          });
        } else {
          console.error("Failed to send verification email (existing user):", emailResponse.message);
          return Response.json(
            {
              success: false,
              message:
                emailResponse.message ||
                "Error sending verification email, please try again",
            },
            {
              status: 500,
            }
          );
        }
      }
    } else {
      // 3. Last case: Email does not exist --> create user, send verification email
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 10);

      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();

      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      
      console.log("Email response:", emailResponse);
      
      if (emailResponse.success) {
        return Response.json({
          success: true,
          message:
            emailResponse.message ||
            "User registered successfully, please check your email for verification",
          isVerified: false,
          isAcceptingMessages: true,
          messages: [],
        });
      } else {
        console.error("Failed to send verification email:", emailResponse.message);
        return Response.json(
          {
            success: false,
            message:
              emailResponse.message ||
              "Error sending verification email, please try again",
          },
          {
            status: 500,
          }
        );
      }
    }
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
