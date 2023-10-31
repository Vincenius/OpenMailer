import mjml2html from 'mjml'
import nodemailer, { SentMessageInfo } from 'nodemailer'
import confirmationTemplate, { EmailProps as ConfirmProps } from './templates/confirmation'
import welcomeTemplate, {
  EmailProps as WelcomeProps,
  campaignId as welcomeCampaignId,
  subject as welcomeSubject,
} from './templates/welcome'
import { getPixelHtml } from './templates/tracking-pixel'
import getUnsubscribe from './templates/unsubscribe'
import AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: process.env.SES_USER,
  secretAccessKey: process.env.SES_PASS,
  region: process.env.SES_REGION,
});

type TemplateProps = {
  userId: string;
  templateId: string;
};

let transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2010-12-01'
  })
}); // todo add variants for sending

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
  const unsubscribeLink = getUnsubscribe({ userId: props.userId })
  const finalHtml = injectedLinksHtml.replace('</body>', `${unsubscribeLink}${trackingPixel}</body>`)

  return sendEmail(to, subject, finalHtml)
}

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const result: SentMessageInfo = await transporter.sendMail({
      from: `WebDev Town <${process.env.EMAIL_USER}>`,
      to: `${to} <${to}>`,
      subject,
      html,
    })

    return 'success'
  } catch (err) {
    console.error('Unexpected error on sending email:', subject, err);
    return 'errored'
  }


  // // TODO move to separate function / with email setting
  // if (result.accepted[0]) {
  //   // console.info('Successfully send email:', subject, result);
  //   return 'success';
  // } else if (result.rejected[0]) {
  //   console.error('Failed to send email:', subject, result);
  //   return 'rejected';
  // } else {
  //   console.error('Unexpected error on sending email:', subject, result);
  //   return 'errored';
  // }
}

export default sendEmail