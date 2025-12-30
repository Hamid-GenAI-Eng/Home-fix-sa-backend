const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to SMTP for production
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password if 2FA is on
  },
});

const sendLoginEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Security Alert: New Login to Your Account',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3>Hello ${name},</h3>
        <p>We noticed a new login to your account.</p>
        <p>If this was you, you can safely ignore this email.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Login email sent to ${email}`);
  } catch (error) {
    console.error('Email send failed:', error);
  }
};

module.exports = { sendLoginEmail };