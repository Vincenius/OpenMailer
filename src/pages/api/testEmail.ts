import type { NextApiResponse } from 'next'
import withAuth from '../../../lib/auth';
import withMongoDB, { CustomRequest } from '../../../lib/db';
import { sendCampaign } from '../../../lib/email';

type Result = {
  message: string,
}

async function handleTestSend(req: CustomRequest, res: NextApiResponse<Result>) {
  const list = req.headers['x-mailing-list']?.toString() || ''

  const link = `${process.env.BASE_URL}/api/confirm?id=test-confirm&list=${list}`
  const regex = new RegExp('{{CONFIRMATION_LINK}}', 'g');
  const html = (req.body.html || '').replace(regex, link)
  const result = await sendCampaign(req.body.testEmail, req.body.subject, html, { userId: 'test-user', templateId: 'test-campaign', list })

  res.status(200).json({ message: result })
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'POST') {
    await withAuth(req, res, handleTestSend)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);