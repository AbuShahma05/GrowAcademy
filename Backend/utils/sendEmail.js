import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send email verification
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const subject = "GrowAcademy - Email Verification";
  const text = `
    Welcome to GrowAcademy!
    
    Please verify your email by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, please ignore this email.
  `;

  await sendEmail(email, subject, text);
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const subject = "GrowAcademy - Password Reset Request";
  const text = `
    You requested a password reset.
    
    Click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 10 minutes.
    
    If you didn't request this, please ignore this email.
  `;

  await sendEmail(email, subject, text);
};
