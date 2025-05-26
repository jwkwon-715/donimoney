const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"도니머니" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
