const { transporter } = require("./transporter");

async function sendVerificationEmail(to, token) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Email Verification",
    text: "Please verify your account",
    html: `<h1>Click on the link to verify your email</h1>
    <a href="${process.env.FRONTEND_URL}/verify-email/${token}">Verify Email</a>`,
  };
  await transporter.sendMail(mailOptions);
}

async function sendResetPasswordEmail(to, token) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Reset Password",
    text: "Reset Your password",
    html: `<h1>Click on the link to reset your password</h1>
    <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a>`,
  };
  await transporter.sendMail(mailOptions);
}
module.exports = { sendResetPasswordEmail, sendVerificationEmail };