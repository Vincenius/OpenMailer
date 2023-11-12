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
  apiVersion: '2010-12-01',
  accessKeyId: process.env.SES_USER,
  secretAccessKey: process.env.SES_PASSWORD,
  region: process.env.SES_REGION,
});

type TemplateProps = {
  userId: string;
  templateId: string;
  list: string;
};

const transporter = process.env.SENDING_TYPE === 'ses'
  ? nodemailer.createTransport({
    SES: new AWS.SES()
  }) : nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // todo
    // var encryptedAES = CryptoJS.AES.encrypt("Message", "My Secret Passphrase");
    // var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, "My Secret Passphrase");
    // dkim: process.env.EMAIL_PRIVATE_KEY {
    //   domainName: "domain",
    //   keySelector: "subdomain",
    //   privateKey: process.env.EMAIL_PRIVATE_KEY,
    // }
  } as nodemailer.TransportOptions);

const mapLinks = (mjml: string, userId: string, campaignId: string, list: string,) => {
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
  const subject = 'WebDev Town | Confirm your email address'
  const mjml = confirmationTemplate(props)
  const htmlOutput = mjml2html(mjml)
  const html = htmlOutput.html

  return sendEmail(to, subject, html) // TODO list?
}

export const sendWelcomeEmail = async (to: string, props: WelcomeProps) => {
  const mjml = welcomeTemplate(props)
  const injectedLinksMjml = mapLinks(mjml, props.userId, welcomeCampaignId, props.list)
  const htmlOutput = mjml2html(injectedLinksMjml)
  const html = htmlOutput.html

  return sendEmail(to, welcomeSubject, html) // TODO list
}

export const sendCampaign = async (to: string, subject: string, html: string, props: TemplateProps) => {
  const injectedLinksHtml = mapLinks(html, props.userId, props.templateId, props.list)
  const trackingPixel = getPixelHtml({ userId: props.userId, emailId: props.templateId, list: props.list })
  const unsubscribeLink = getUnsubscribe({ userId: props.userId, list: props.list })
  const finalHtml = injectedLinksHtml.replace('</body>', `${unsubscribeLink}${trackingPixel}</body>`)

  return sendEmail(to, subject, finalHtml)
}

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const result: SentMessageInfo = await transporter.sendMail({
      from: `WebDev Town <${process.env.EMAIL_USER}>`, // TODO name
      to: `${to} <${to}>`,
      subject,
      html,
    })

    if (process.env.SENDING_TYPE === 'email') {
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