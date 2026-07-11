import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
})

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: "noreply@example.com",
    to,
    subject,
    html,
  })
}
