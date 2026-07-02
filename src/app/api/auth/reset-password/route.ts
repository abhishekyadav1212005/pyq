import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    // 1. Create a secure time-limited token
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    const payload = JSON.stringify({ email, expires });
    const token = Buffer.from(payload).toString("base64");

    const resetLink = `http://localhost:3000/auth?mode=reset&token=${token}`;

    // 2. Dispatch Email
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "PhysioPrep <onboarding@resend.dev>",
          to: email,
          subject: "Reset your PhysioPrep Password",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #6366f1;">PhysioPrep Password Reset</h2>
              <p>Hello,</p>
              <p>You requested a password reset for your PhysioPrep account. Please click the link below to set a new password:</p>
              <div style="margin: 24px 0;">
                <a href="${resetLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>
              <p>If you did not make this request, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 11px; color: #888;">This link will expire in 15 minutes. Note: If you are using Resend's test credentials, emails can only be delivered to your registered Resend email address.</p>
            </div>
          `
        })
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error("Resend API Error:", errorData);
        return NextResponse.json({ error: "Failed to dispatch email via Resend API." }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "A secure reset link has been dispatched to your email address." });
    } else {
      // Development Fallback: Log to terminal console
      console.log("\n======================================================================");
      console.log("🔑 [DEV MODE] PASSWORD RESET DISPATCHED");
      console.log(`To: ${email}`);
      console.log(`Reset Link: ${resetLink}`);
      console.log("======================================================================\n");

      return NextResponse.json({
        success: true,
        message: "Development mode: Reset link printed to server logs.",
        devLink: resetLink
      });
    }
  } catch (error: any) {
    console.error("Reset Password API Exception:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}
