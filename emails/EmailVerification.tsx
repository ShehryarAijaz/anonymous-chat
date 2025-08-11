import {
    Html,
    Body,
    Head,
    Heading,
    Container,
    Text,
    Link,
    Preview,
} from "@react-email/components";

// NOTE: This ensures that correct types are passed to the email component
interface EmailVerificationProps {
    username: string;
    otp: string;
}

export default function EmailVerification({ username, otp }: EmailVerificationProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head />
            <Preview>Verify your email to get started</Preview>
            <Body
                style={{
                    backgroundColor: "#18181b",
                    color: "#f4f4f5",
                    fontFamily: "Inter, Arial, sans-serif",
                    margin: 0,
                    padding: 0,
                    minHeight: "100vh",
                }}
            >
                <Container
                    style={{
                        background: "#27272a",
                        borderRadius: "12px",
                        maxWidth: "420px",
                        margin: "40px auto",
                        padding: "32px 28px",
                        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.25)",
                        border: "1px solid #333",
                    }}
                >
                    <Heading
                        style={{
                            color: "#f4f4f5",
                            fontSize: "2rem",
                            fontWeight: 700,
                            marginBottom: "12px",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Verify your email
                    </Heading>
                    <Text
                        style={{
                            color: "#a1a1aa",
                            fontSize: "1rem",
                            marginBottom: "24px",
                        }}
                    >
                        Hi <span style={{ color: "#f4f4f5", fontWeight: 600 }}>{username}</span>,
                        <br />
                        Please use the code below to verify your email address and complete your registration.
                    </Text>
                    <div
                        style={{
                            background: "#18181b",
                            borderRadius: "8px",
                            padding: "18px 0",
                            textAlign: "center",
                            margin: "0 auto 28px auto",
                            letterSpacing: "6px",
                            fontSize: "1.7rem",
                            fontWeight: 700,
                            color: "#fbbf24",
                            border: "1px solid #333",
                            width: "180px",
                        }}
                    >
                        {otp}
                    </div>
                    <Text
                        style={{
                            color: "#71717a",
                            fontSize: "0.95rem",
                            marginBottom: "18px",
                        }}
                    >
                        This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.
                    </Text>
                    <Text
                        style={{
                            color: "#a1a1aa",
                            fontSize: "0.95rem",
                            marginTop: "32px",
                            borderTop: "1px solid #333",
                            paddingTop: "18px",
                        }}
                    >
                        Thanks,<br />
                        <span style={{ color: "#f4f4f5", fontWeight: 600 }}>The Anonymous Chat Team</span>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}