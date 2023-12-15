import mjml2html from 'mjml'
import AWS from 'aws-sdk'
import nodemailer, { SentMessageInfo } from 'nodemailer'
import confirmationTemplate, { EmailProps as ConfirmProps } from './templates/confirmation'
import welcomeTemplate, {
  EmailProps as WelcomeProps,
  campaignId as welcomeCampaignId,
  subject as welcomeSubject,
} from './templates/welcome'
import { getPixelHtml } from './templates/tracking-pixel'
import getUnsubscribe from './templates/unsubscribe'
import { getSettings } from './db'

type TemplateProps = {
  userId: string;
  templateId: string;
  list: string;
};

const getTransporter = (settings: any) => {
  console.log(settings)
  let transporter
  if (settings.ses_key && settings.ses_secret) {
    AWS.config.update({
      apiVersion: '2010-12-01',
      accessKeyId: settings.ses_key,
      secretAccessKey: settings.ses_secret,
      region: settings.ses_region,
    });

    transporter = nodemailer.createTransport({
      SES: new AWS.SES()
    })
  } else {
    transporter = nodemailer.createTransport({
      host: settings.email_host,
      port: 465,
      secure: true,
      auth: {
        user: settings.email,
        pass: settings.email_pass,
      },
    } as nodemailer.TransportOptions);
  }
  return transporter
}


const mapLinks = (mjml: string, userId: string, campaignId: string, list: string) => {
  let updatedMjml = mjml;
  const regex = /href="([^"]+)"/g;
  let match;

  while ((match = regex.exec(mjml)) !== null) {
    const mappedLink = `href="${process.env.BASE_URL}/api/link/${btoa(userId)}/${btoa(campaignId)}/${btoa(match[1])}/${btoa(list)}"`
    updatedMjml = updatedMjml.replace(match[0], mappedLink);
  }

  return updatedMjml;
}

export const sendConfirmationEmail = async (to: string, props: ConfirmProps) => {
  const settings = await getSettings(props.list)
  const subject = `${settings?.name} | Confirm your email address`
  const mjml = confirmationTemplate(props)
  const htmlOutput = mjml2html(mjml)
  const html = htmlOutput.html

  return sendEmail(to, subject, html, settings)
}

export const sendWelcomeEmail = async (to: string, props: WelcomeProps) => {
  const settings = await getSettings(props.list)
  const mjml = welcomeTemplate(props)
  const injectedLinksMjml = mapLinks(mjml, props.userId, welcomeCampaignId, props.list)
  const htmlOutput = mjml2html(injectedLinksMjml)
  const html = htmlOutput.html

  return sendEmail(to, welcomeSubject, html, settings)
}

export const sendCampaign = async (to: string, subject: string, html: string, props: TemplateProps) => {
  const settings = await getSettings(props.list)
  const injectedLinksHtml = mapLinks(html, props.userId, props.templateId, props.list)
  const trackingPixel = getPixelHtml({ userId: props.userId, emailId: props.templateId, list: props.list })
  const unsubscribeLink = getUnsubscribe({ userId: props.userId, list: props.list })
  const finalHtml = injectedLinksHtml.replace('</body>', `${unsubscribeLink}${trackingPixel}</body>`)

  return sendEmail(to, subject, finalHtml, settings)
}

const sendEmail = async (to: string, subject: string, html: string, settings: any) => {
  try {
    const transporter = getTransporter(settings)
    const result: SentMessageInfo = await transporter.sendMail({
      from: `WebDev Town <${settings.email}>`, // TODO name
      to: `${to} <${to}>`,
      subject,
      html,
    })

    if (!settings.ses_key || !settings.ses_secret) {
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

    return 'success'
  } catch (err) {
    console.error('Unexpected error on sending email:', subject, err);
    return 'errored'
  }
}

export default sendEmail