import type { NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import withMongoDB, { CustomRequest } from '../../../lib/db';
import withAuth from '../../../lib/auth';
import { CampaignDAO, Campaign } from '../../../lib/models/campaigns'
import { validate } from 'jsonschema';
import { sendConfirmationEmail } from '../../../lib/email';

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
  console.log('CALLED', req.body)
  // create campaign
  // trigger another api (recursive / with queue??)
  // return campaign id
  // fetch on frontend to see status of sending
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