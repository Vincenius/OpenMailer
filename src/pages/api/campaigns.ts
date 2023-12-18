import type { NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import withMongoDB, { CustomRequest } from '../../../lib/db';
import withAuth from '../../../lib/auth';
import { CampaignDAO, Campaign } from '../../../lib/models/campaigns'
import { SubscriberDAO } from '../../../lib/models/subscriber'

type Result = {
  message: string,
}

async function getCampaigns(req: CustomRequest, res: NextApiResponse<Campaign[] | Result>) {
  try {
    const campaignDao = new CampaignDAO(req.db);
    const campaigns = await campaignDao.getAll();
    res.status(200).json(campaigns)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function sendCampaign(req: CustomRequest, res: NextApiResponse<Result>) {
  const campaignDao = new CampaignDAO(req.db);
  const subscriberDAO = new SubscriberDAO(req.db);
  const subscribers = await subscriberDAO.getAll({ $and: [
    { "unsubscribedAt": { $exists: false }},
    { "confirmed": true },
  ] });
  const newCampaignId = uuidv4();

  await campaignDao.create({
    id: newCampaignId,
    createdAt: new Date(),
    subject: req.body.subject,
    html: req.body.html,
    users: subscribers.map(s => ({
      id: (s._id || '').toString(),
      status: 'pending',
      opens: 0,
      clicks: [],
    }))
  })

  fetch(`${process.env.BASE_URL}/api/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mailing-list': req.headers['x-mailing-list']?.toString() || ''
    },
    body: JSON.stringify({
      api_key: process.env.API_KEY,
      campaignId: newCampaignId,
    }),
  })

  res.status(200).json({ message:'success' })
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Campaign[] | Result>
) {
  if (req.method === 'GET') {
    await withAuth(req, res, getCampaigns)
  } else if (req.method === 'POST') {
    await withAuth(req, res, sendCampaign)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);