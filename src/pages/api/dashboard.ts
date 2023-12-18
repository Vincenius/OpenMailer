import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db';
import withAuth from '../../../lib/auth';
import { CampaignDAO, Campaign } from '../../../lib/models/campaigns'
import { SubscriberDAO } from '../../../lib/models/subscriber'

type Error = {
  message: string,
}

type SubChartResult = {
  date: string,
  subscribes: number,
}

type Result = {
  subscribers: SubChartResult[],
  campaign: Campaign | null,
  subscriberCount: number,
}

const getDashboardData = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  const subscriberDAO = new SubscriberDAO(req.db);
  const campaignDAO = new CampaignDAO(req.db);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setUTCHours(0,0,0,0);

  const subscribed = await subscriberDAO.getAll({ "createdAt": { $gte: sevenDaysAgo } })
  const unsubscribed = await subscriberDAO.getAll({ "unsubscribedAt": { $gte: sevenDaysAgo } })
  const subscriberCount = await subscriberDAO.getCount({ $and: [
    { "unsubscribedAt": { $exists: false }},
    { "confirmed": true },
  ] })

  const currentDate = new Date();
  const subscribers = [];
  for (let i = 0; i < 7; i++) {
    const date = currentDate.toISOString().substring(0, 10)

    const dateSubs = subscribed
      .filter(s => s.createdAt.toISOString().substring(0, 10) === date)
      .length
    const dateUnsubs = unsubscribed
      .filter(s => !!s.unsubscribedAt)
      .filter(s => (s.unsubscribedAt || new Date()).toISOString().substring(0, 10) === date)
      .length

    currentDate.setDate(currentDate.getDate() - 1);

    subscribers.push({ date, subscribes: dateSubs - dateUnsubs })
  }

  const campaign = await campaignDAO.getLatest()

  res.status(200).json({
    subscribers: subscribers.reverse(),
    campaign,
    subscriberCount,
  })
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result | Error>
) {
  if (req.method === 'GET') {
    await withAuth(req, res, getDashboardData)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler);