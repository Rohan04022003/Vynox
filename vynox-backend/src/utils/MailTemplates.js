// utils/MailTemplates.js

export const registerTemplate = (user) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
    <h2 style="color:#e63946; text-align:center;">Welcome to Vynox, ${user.fullName}!</h2>
    <p style="font-size:16px; line-height:1.5;">We’re thrilled to have you onboard 🎉</p>
    <p style="font-size:16px; line-height:1.5;">Your account has been successfully created. Start exploring and sharing your favorite videos today.</p>
    <div style="text-align:center; margin: 20px 0;">
      <a href="https://vynox.com" style="background:#e63946;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Go to Vynox</a>
    </div>
    <p style="margin-top:20px; font-size:14px; color:#666; text-align:center;">– The Vynox Team</p>
  </div>
`;

export const loginAlertTemplate = (user) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px;">
    <h3 style="color:#e63946; text-align:center;">New Login Detected</h3>
    <p style="font-size:16px; line-height:1.5;">Hello <b>${user.fullName}</b>,</p>
    <div style="background:#fff; padding:15px; border-radius:8px; border:1px solid #ddd;">
      <p style="margin:5px 0;"><b>Device:</b> ${user.deviceType}</p>
      <p style="margin:5px 0;"><b>OS:</b> ${user.osName}</p>
      <p style="margin:5px 0;"><b>Browser:</b> ${user.browserName}</p>
      <p style="margin:5px 0;"><b>IP:</b> ${user.ip}</p>
    </div>
    <p style="font-size:16px; line-height:1.5; margin-top:15px;">If this wasn't you, please reset your password immediately.</p>
    <div style="text-align:center; margin:20px 0;">
      <a href="https://vynox.com" style="background:#e63946;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
    </div>
    <p style="margin-top:20px; font-size:14px; color:#666; text-align:center;">– The Vynox Security Team</p>
  </div>
`;

export const profileUpdateTemplate = (user) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px;">
    <h3 style="color:#e63946; text-align:center;">Profile Updated Successfully</h3>
    <p style="font-size:16px; line-height:1.5;">Hey <b>${user.fullName}</b>,</p>
    <p style="font-size:16px; line-height:1.5;">Your account details were recently updated. If you didn’t make these changes, please contact our support team immediately.</p>
    <p style="margin-top:20px; font-size:14px; color:#666; text-align:center;">– The Vynox Team</p>
  </div>
`;

export const passwordResetTemplate = (user, resetLink = "") => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color:#333; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px;">
    <h2 style="color:#e63946; text-align:center;">Password Reset Request</h2>
    <p style="font-size:16px; line-height:1.5;">Hello <b>${user.fullName}</b>,</p>
    <p style="font-size:16px; line-height:1.5;">We received a request to reset your password for your Vynox account.</p>
    <div style="text-align:center; margin:20px 0;">
      <a href="${resetLink}" style="background:#e63946;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
    </div>
    <p style="font-size:16px; line-height:1.5;">If you didn’t request this, you can safely ignore this email.</p>
    <p style="margin-top:20px; font-size:14px; color:#666; text-align:center;">– Vynox Support Team</p>
  </div>
`;

export const videoUploadTemplate = (data) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color:#333; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px;">
    <h2 style="color:#e63946; text-align:center;">Video Uploaded Successfully 🎥</h2>
    <p style="font-size:16px; line-height:1.5;">Hey <b>${data.fullName}</b>,</p>
    <p style="font-size:16px; line-height:1.5;">Your video <b>"${data.videoTitle}"</b> has been uploaded successfully on <b>Vynox</b>.</p>
    <div style="text-align:center; margin:20px 0;">
      <a href="https://vynox.com/dashboard" style="background:#e63946;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">View Dashboard</a>
    </div>
    <p style="margin-top:20px; font-size:14px; color:#666; text-align:center;">– Team Vynox</p>
  </div>
`;

export const tweetUploadTemplate = (user) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color:#333; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px;">
    <h3 style="color:#e63946; text-align:center;">Your Tweet is Live 🗨️</h3>
    <p style="font-size:16px; line-height:1.5;">Hey <b>${user.fullName}</b>,</p>
    <p style="font-size:16px; line-height:1.5;">Your latest post is now live on Vynox. Keep sharing your thoughts and stay connected with your followers.</p>
    <div style="text-align:center; margin:20px 0;">
      <a href="https://vynox.com/tweets" style="background:#e63946;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">View Your Tweet</a>
    </div>
    <p style="margin-top:20px; font-size:14px; color:#666; text-align:center;">– The Vynox Team</p>
  </div>
`;
