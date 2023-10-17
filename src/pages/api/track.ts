import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db';
import { CampaignDAO } from '../../../lib/models/campaigns'

type Result = {
  message: string,
}

async function trackOpen(req: CustomRequest, res: NextApiResponse<Result>) {
  try {
    // track
    res.status(200).json({ message: 'success' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'POST') {
    if (req.body.api_key === process.env.TRACKING_API_KEY) {
      const campaingDao = new CampaignDAO(req.db);
      try {
        if (req.body.type === 'open') {
          await campaingDao.trackOpen(req.body.campaignId, req.body.userId)
        } else if (req.body.type === 'click') {
          await campaingDao.trackClick(req.body.campaignId, req.body.userId, req.body.link)
        }
        res.status(200).json({ message: 'success' })
      } catch(err) {
        console.error('Error on tracking:', err)
        res.status(500).json({ message: 'Internal Server Error' })
      }

    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);