import mjml2html from 'mjml'
import nodemailer from 'nodemailer'
import confirmationTemplate, { EmailProps as ConfirmProps } from './templates/confirmation'
import welcomeTemplate, {
  EmailProps as WelcomeProps,
  campaignId as welcomeCampaignId,
  subject as welcomeSubject,
} from './templates/welcome'
import { getPixelHtml } from './templates/tracking-pixel'

type TemplateProps = {
  userId: string;
  templateId: string;
};

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  dkim: {
    domainName: "webdev.town",
    keySelector: "2023",
    privateKey: process.env.EMAIL_PRIVATE_KEY,
  }
} as nodemailer.TransportOptions);

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

  return sendEmail(to, subject, html)
}

export const sendWelcomeEmail = async (to: string, props: WelcomeProps) => {
  const mjml = welcomeTemplate(props)
  const injectedLinksMjml = mapLinks(mjml, props.userId, welcomeCampaignId)
  const htmlOutput = mjml2html(injectedLinksMjml)
  const html = htmlOutput.html

  return sendEmail(to, welcomeSubject, html)
}

export const sendCampaign = async (to: string, subject: string, html: string, props: TemplateProps) => {
  const injectedLinksHtml = mapLinks(html, props.userId, props.templateId)
  const trackingPixel = getPixelHtml({ userId: props.userId, emailId: props.templateId })
  const finalHtml = injectedLinksHtml.replace('</body>', `${trackingPixel}</body>`)

  return sendEmail(to, subject, finalHtml)
}

const sendEmail = async (to: string, subject: string, html: string) => {
  const result = await transporter.sendMail({
    from: `WebDev Town <${process.env.EMAIL_USER}>`,
    to: `${to} <${to}>`,
    subject,
    html,
  });

  // TODO proper logging
  if (result.accepted[0]) {
    // console.info('Successfully send email:', subject, result);
    return 'success';
  } else if (result.rejected[0]) {
    console.error('Failed to send email:', subject, result);
    return 'rejected';
  } else {
    console.error('Unexpected error on sending email:', subject, result);
    return 'errored';
  }
}

export default sendEmail