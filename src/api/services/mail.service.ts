export const sendVerificationEmail = async (
  userId: number,
  email: string,
  token: string
) => {
  const transporter = await import("nodemailer").then((module) =>
    module.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      },
    })
  );

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "TimeRipe - Email Verification",
    html: `
            <h1>TimeRipe - Email Verification</h1>
            <p>Dear User,</p>
            <p>Thank you for signing up with TimeRipe! Please click the link below to verify your email:</p>
            <a href="${process.env.BACKEND_URL}/api/user/verify/${userId}/${token}">Verify Email</a>
            <p>If you did not sign up for TimeRipe, please ignore this email.</p>
            <p>Best regards,</p>
            <p>The TimeRipe Team</p>
        `,
  };
  await transporter.sendMail(mailOptions);
};
