import { ObjectId } from 'mongodb';
import type { NextApiResponse } from 'next'
import withAuth from '../../../lib/auth';
import withMongoDB, { CustomRequest } from '../../../lib/db';
import { sendCampaign } from '../../../lib/email';

type Result = {
  message: string,
}

async function handleTestSend(req: CustomRequest, res: NextApiResponse<Result>) {
  const result = await sendCampaign(req.body.testEmail, req.body.subject, req.body.html, { userId: 'test-user', templateId: 'test-campaign' })

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