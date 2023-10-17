import mjml2html from 'mjml'
import nodemailer from 'nodemailer'
import confirmationTemplate, { EmailProps as ConfirmProps } from './templates/confirmation'
import welcomeTemplate, {
  EmailProps as WelcomeProps,
  campaignId as welcomeCampaignId,
  subject as welcomeSubject,
} from './templates/welcome'

// https://nodemailer.com/dkim/ TODO SETUP DKIM

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mapLinks = (mjml: string, userId: string, campaignId: string) => {
  let updatedMjml = mjml;
  const regex = /href="([^"]+)"/g;
  let match;

  while ((match = regex.exec(mjml)) !== null) {
    const mappedLink = `href="${process.env.BASE_URL}/api/link/${btoa(userId)}/${btoa(campaignId)}/${btoa(match[1])}"`
    updatedMjml = updatedMjml.replace(match[0], mappedLink);
  }

  return updatedMjml;
}

export const sendConfirmationEmail = async (to: string, props: ConfirmProps) => {
  const subject = 'WebDev Town | Confirm your email address'
  const mjml = confirmationTemplate(props)
  const htmlOutput = mjml2html(mjml)
  const html = htmlOutput.html

  return sendEmail(to, subject, html, 'confirmation')
}

export const sendWelcomeEmail = async (to: string, props: WelcomeProps) => {
  const mjml = welcomeTemplate(props)
  const injectedLinksMjml = mapLinks(mjml, props.userId, welcomeCampaignId)
  const htmlOutput = mjml2html(injectedLinksMjml)
  const html = htmlOutput.html

  return sendEmail(to, welcomeSubject, html, welcomeCampaignId)
}

// todo send template / email

const sendEmail = async (to: string, subject: string, html: string, campaignId: string) => {
  const result = await transporter.sendMail({
    from: `"${process.env.EMAIL_USER}" <${process.env.EMAIL_USER}>`,
    to: `"${to}" <${to}>`,
    subject,
    html,
  });

  // TODO proper logging
  if (result.accepted[0]) {
    console.info('Successfully send email:', subject, result);
  } else if (result.rejected[0]) {
    console.error('Failed to send email:', subject, result);
  } else {
    console.error('Unexpected error on sending email:', subject, result);
  }

  return Promise.resolve()
}

export default sendEmail