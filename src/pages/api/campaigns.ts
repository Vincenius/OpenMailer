import type { NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import withMongoDB, { CustomRequest } from '../../../lib/db';
import withAuth from '../../../lib/auth';
import { CampaignDAO, Campaign } from '../../../lib/models/campaigns'
import { validate } from 'jsonschema';
import { sendConfirmationEmail } from '../../../lib/email';

type Error = {
  message: string,
}

async function getCampaigns(req: CustomRequest, res: NextApiResponse<Campaign[] | Error>) {
  try {
    const campaignDao = new CampaignDAO(req.db);
    const campaigns = await campaignDao.getAll();
    res.status(200).json(campaigns)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Campaign[] | Error>
) {
  if (req.method === 'GET') {
    await withAuth(req, res, getCampaigns)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);