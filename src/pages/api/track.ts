import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db';
import { CampaignDAO } from '../../../lib/models/campaigns'
import { SubscriberDAO } from '../../../lib/models/subscriber'
import { ObjectId } from 'mongodb';

type Result = {
  message: string,
}

const handleTrack = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  const campaingDao = new CampaignDAO(req.db);
  const subscriberDAO = new SubscriberDAO(req.db);
  try {
    if (req.body.type === 'open') {
      const updatedCampaign = await campaingDao.trackOpen(req.body.campaignId, req.body.userId)
      const updatedUser = updatedCampaign?.users.find(u => u.id === req.body.userId)
      if (updatedUser?.opens === 1) {
        await subscriberDAO.increaseTrack({ _id: new ObjectId(req.body.userId) }, 'opened')
      }
    } else if (req.body.type === 'click') {
      const updatedCampaign = await campaingDao.trackClick(req.body.campaignId, req.body.userId, req.body.link)
      const updatedUser = updatedCampaign?.users.find(u => u.id === req.body.userId)
      if (updatedUser?.clicks.length === 1) {
        await subscriberDAO.increaseTrack({ _id: new ObjectId(req.body.userId) }, 'clicked')
      }
      if (updatedUser?.opens === 0) { // tacking pixel apparently didn't work - so track open here
        await subscriberDAO.increaseTrack({ _id: new ObjectId(req.body.userId) }, 'opened')
      }
    }
    res.status(200).json({ message: 'success' })
  } catch(err) {
    console.error('Error on tracking:', err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'POST') {
    if (req.body.api_key === process.env.API_KEY) {
      const { list } = req.body
      await withMongoDB(handleTrack, list)(req, res)
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler;